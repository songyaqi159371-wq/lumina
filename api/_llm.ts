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
    baseURL: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL ?? 'gpt-4o',
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

// ── Claude (Anthropic format) ──
async function claudeChat(systemInstruction: string, messages: OpenAIMsg[]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY ?? '',
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
        baseURL: process.env.CLAUDE_BASE_URL ?? 'https://api.anthropic.com/v1/chat/completions',
        model: modelUsed,
        apiKey: process.env.CLAUDE_API_KEY,
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
        baseURL: process.env.CLAUDE_BASE_URL ?? 'https://api.anthropic.com/v1/chat/completions',
        model: modelUsed,
        apiKey: process.env.CLAUDE_API_KEY,
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
