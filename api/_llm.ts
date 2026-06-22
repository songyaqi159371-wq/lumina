import type { VercelRequest } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// ── In-memory rate limiter: IP -> { count, resetAt } ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per minute per IP

export function checkRateLimit(req: VercelRequest): boolean {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export type ChatMsg = { role: 'user' | 'model'; parts: { text: string }[] };
type OpenAIMsg = { role: string; content: string };

// ── Gemini ──
async function geminiInterpret(prompt: string, systemInstruction: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const r = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 6000 } },
  });
  return r.text ?? '';
}

async function geminiStream(
  prompt: string,
  systemInstruction: string,
  onDelta: (text: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 6000 } },
  });
  for await (const chunk of stream) {
    const t = chunk.text;
    if (t) onDelta(t);
  }
}

async function geminiChat(history: ChatMsg[], newMessage: string, systemInstruction: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history: history ?? [],
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 2000 } },
  });
  const r = await chat.sendMessage({ message: newMessage });
  return r.text ?? '';
}

async function geminiChatStream(
  history: ChatMsg[],
  newMessage: string,
  systemInstruction: string,
  onDelta: (text: string) => void
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const chat = ai.chats.create({
    model: 'gemini-2.0-flash',
    history: history ?? [],
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 2000 } },
  });
  const stream = await chat.sendMessageStream({ message: newMessage });
  for await (const chunk of stream) {
    const t = chunk.text;
    if (t) onDelta(t);
  }
}

// ── OpenAI-compatible models (DeepSeek / Kimi / Qwen / Doubao / OpenAI) ──
interface OpenAICompatConfig {
  baseURL: string;
  model: string;
  apiKey: string | undefined;
}

const OPENAI_COMPAT: Record<string, OpenAICompatConfig> = {
  deepseek: { baseURL: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', apiKey: process.env.DEEPSEEK_API_KEY },
  kimi: { baseURL: 'https://api.moonshot.cn/v1/chat/completions', model: process.env.KIMI_MODEL ?? 'moonshot-v1-32k', apiKey: process.env.KIMI_API_KEY },
  qwen: { baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: process.env.QWEN_MODEL ?? 'qwen-plus', apiKey: process.env.QWEN_API_KEY },
  doubao: { baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions', model: process.env.DOUBAO_MODEL ?? 'doubao-pro-32k', apiKey: process.env.DOUBAO_API_KEY },
  openai: {
    baseURL: `${(process.env.OPENAI_BASE_URL ?? 'https://api.openai.com').replace(/\/+$/, '')}/v1/chat/completions`,
    model: process.env.OPENAI_MODEL ?? 'gpt-5.5',
    apiKey: process.env.OPENAI_API_KEY,
  },
};

async function openaiCompatChat(cfg: OpenAICompatConfig, messages: OpenAIMsg[]): Promise<string> {
  const res = await fetch(cfg.baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({ model: cfg.model, messages }),
  });
  if (!res.ok) throw new Error(`${cfg.model} API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// Parse an SSE byte stream line-by-line, invoking onEvent for each `data:` payload.
async function consumeSSE(
  body: ReadableStream<Uint8Array> | null,
  onEvent: (payload: string) => void
): Promise<void> {
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    // SSE events are separated by newlines; process complete lines, keep the remainder.
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (line.startsWith('data:')) onEvent(line.slice(5).trim());
    }
  }
  const tail = buffer.trim();
  if (tail.startsWith('data:')) onEvent(tail.slice(5).trim());
}

async function openaiCompatStream(
  cfg: OpenAICompatConfig,
  messages: OpenAIMsg[],
  onDelta: (text: string) => void
): Promise<void> {
  const res = await fetch(cfg.baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({ model: cfg.model, messages, stream: true }),
  });
  if (!res.ok) throw new Error(`${cfg.model} API ${res.status}: ${await res.text()}`);
  await consumeSSE(res.body, (payload) => {
    if (payload === '[DONE]') return;
    try {
      const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
      if (delta) onDelta(delta);
    } catch {
      /* ignore keep-alive / partial fragments */
    }
  });
}

// ── Claude (Anthropic format) ──
async function claudeChat(systemInstruction: string, messages: OpenAIMsg[]): Promise<string> {
  const baseUrl = (process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '');
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemInstruction,
      messages: messages.filter(m => m.role !== 'system'),
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

async function claudeStream(
  systemInstruction: string,
  messages: OpenAIMsg[],
  onDelta: (text: string) => void
): Promise<void> {
  const baseUrl = (process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '');
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemInstruction,
      messages: messages.filter(m => m.role !== 'system'),
      stream: true,
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  await consumeSSE(res.body, (payload) => {
    try {
      const evt = JSON.parse(payload);
      // Anthropic streams content_block_delta events carrying { delta: { text } }
      if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
        onDelta(evt.delta.text ?? '');
      }
    } catch {
      /* ignore non-JSON event lines */
    }
  });
}

// Convert Gemini-style history to OpenAI messages
function toOpenAIMessages(systemInstruction: string, history: ChatMsg[], newMessage: string): OpenAIMsg[] {
  const msgs: OpenAIMsg[] = [{ role: 'system', content: systemInstruction }];
  for (const h of history ?? []) {
    msgs.push({ role: h.role === 'model' ? 'assistant' : 'user', content: h.parts[0]?.text ?? '' });
  }
  msgs.push({ role: 'user', content: newMessage });
  return msgs;
}

// ── Unified entry points (routed by model) ──
export interface LLMResult { text: string; modelUsed: string; }

export async function runInterpret(model: string, prompt: string, systemInstruction: string): Promise<LLMResult> {
  if (model === 'claude') {
    const modelUsed = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';
    if (process.env.CLAUDE_USE_OPENAI_FORMAT === 'true') {
      const cfg: OpenAICompatConfig = {
        baseURL: process.env.CLAUDE_BASE_URL ?? `${(process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/chat/completions`,
        model: modelUsed,
        apiKey: process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY,
      };
      const text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ]);
      return { text, modelUsed };
    }
    const text = await claudeChat(systemInstruction, [{ role: 'user', content: prompt }]);
    return { text, modelUsed };
  }
  if (OPENAI_COMPAT[model]) {
    const cfg = OPENAI_COMPAT[model];
    const text = await openaiCompatChat(cfg, [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ]);
    return { text, modelUsed: cfg.model };
  }
  const text = await geminiInterpret(prompt, systemInstruction);
  return { text, modelUsed: 'gemini-2.0-flash' };
}

// Streaming variant: invokes onDelta for each incremental chunk, returns the model id used.
export async function runInterpretStream(
  model: string,
  prompt: string,
  systemInstruction: string,
  onDelta: (text: string) => void
): Promise<string> {
  if (model === 'claude') {
    const modelUsed = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';
    if (process.env.CLAUDE_USE_OPENAI_FORMAT === 'true') {
      const cfg: OpenAICompatConfig = {
        baseURL: process.env.CLAUDE_BASE_URL ?? `${(process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/chat/completions`,
        model: modelUsed,
        apiKey: process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY,
      };
      await openaiCompatStream(cfg, [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt },
      ], onDelta);
      return modelUsed;
    }
    await claudeStream(systemInstruction, [{ role: 'user', content: prompt }], onDelta);
    return modelUsed;
  }
  if (OPENAI_COMPAT[model]) {
    const cfg = OPENAI_COMPAT[model];
    await openaiCompatStream(cfg, [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ], onDelta);
    return cfg.model;
  }
  await geminiStream(prompt, systemInstruction, onDelta);
  return 'gemini-2.0-flash';
}

export async function runChat(
  model: string,
  history: ChatMsg[],
  newMessage: string,
  systemInstruction: string
): Promise<LLMResult> {
  if (model === 'claude') {
    const modelUsed = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';
    if (process.env.CLAUDE_USE_OPENAI_FORMAT === 'true') {
      const cfg: OpenAICompatConfig = {
        baseURL: process.env.CLAUDE_BASE_URL ?? `${(process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/chat/completions`,
        model: modelUsed,
        apiKey: process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY,
      };
      const text = await openaiCompatChat(cfg, toOpenAIMessages(systemInstruction, history, newMessage));
      return { text, modelUsed };
    }
    const text = await claudeChat(systemInstruction, toOpenAIMessages(systemInstruction, history, newMessage));
    return { text, modelUsed };
  }
  if (OPENAI_COMPAT[model]) {
    const cfg = OPENAI_COMPAT[model];
    const text = await openaiCompatChat(cfg, toOpenAIMessages(systemInstruction, history, newMessage));
    return { text, modelUsed: cfg.model };
  }
  const text = await geminiChat(history, newMessage, systemInstruction);
  return { text, modelUsed: 'gemini-2.0-flash' };
}

// Streaming variant of runChat: invokes onDelta per chunk, returns the model id used.
export async function runChatStream(
  model: string,
  history: ChatMsg[],
  newMessage: string,
  systemInstruction: string,
  onDelta: (text: string) => void
): Promise<string> {
  if (model === 'claude') {
    const modelUsed = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';
    if (process.env.CLAUDE_USE_OPENAI_FORMAT === 'true') {
      const cfg: OpenAICompatConfig = {
        baseURL: process.env.CLAUDE_BASE_URL ?? `${(process.env.ANTHROPIC_BASE_URL ?? 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/chat/completions`,
        model: modelUsed,
        apiKey: process.env.ANTHROPIC_AUTH_TOKEN ?? process.env.CLAUDE_API_KEY,
      };
      await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction, history, newMessage), onDelta);
      return modelUsed;
    }
    await claudeStream(systemInstruction, toOpenAIMessages(systemInstruction, history, newMessage), onDelta);
    return modelUsed;
  }
  if (OPENAI_COMPAT[model]) {
    const cfg = OPENAI_COMPAT[model];
    await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction, history, newMessage), onDelta);
    return cfg.model;
  }
  await geminiChatStream(history, newMessage, systemInstruction, onDelta);
  return 'gemini-2.0-flash';
}
