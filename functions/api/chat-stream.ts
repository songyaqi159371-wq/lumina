// Cloudflare Pages Function for /api/chat-stream (SSE streaming)
import { GoogleGenAI } from '@google/genai';

type ChatMsg = { role: 'user' | 'model'; parts: { text: string }[] };
type OpenAIMsg = { role: string; content: string };

interface OpenAICompatConfig {
  baseURL: string;
  model: string;
  apiKey: string | undefined;
}

// ── SSE helper ──
function createSSEStream(onStart: (send: (text: string) => void, end: () => void) => Promise<void>) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const send = (text: string) => {
    writer.write(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
  };

  const end = () => {
    writer.write(encoder.encode('data: [DONE]\n\n'));
    writer.close();
  };

  onStart(send, end).catch((err) => {
    writer.write(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
    writer.close();
  });

  return readable;
}

// ── Gemini streaming ──
async function geminiChatStream(apiKey: string, history: ChatMsg[], newMessage: string, systemInstruction: string, onDelta: (text: string) => void): Promise<void> {
  const ai = new GoogleGenAI({ apiKey });
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

// ── OpenAI-compatible streaming ──
async function consumeSSE(body: ReadableStream<Uint8Array> | null, onEvent: (payload: string) => void): Promise<void> {
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (line.startsWith('data:')) onEvent(line.slice(5).trim());
    }
  }
  const tail = buffer.trim();
  if (tail.startsWith('data:')) onEvent(tail.slice(5).trim());
}

async function openaiCompatStream(cfg: OpenAICompatConfig, messages: OpenAIMsg[], onDelta: (text: string) => void): Promise<void> {
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
      /* ignore */
    }
  });
}

// ── Claude streaming ──
async function claudeStream(baseUrl: string, apiKey: string, model: string, systemInstruction: string, messages: OpenAIMsg[], onDelta: (text: string) => void): Promise<void> {
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
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
      if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
        onDelta(evt.delta.text ?? '');
      }
    } catch {
      /* ignore */
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

// ── Main handler ──
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { model, history, newMessage, systemInstruction } = body;

    if (!newMessage) {
      return new Response(JSON.stringify({ error: 'Missing newMessage' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stream = createSSEStream(async (send, end) => {
      let modelUsed: string;

      if (model === 'claude') {
        modelUsed = env.CLAUDE_MODEL || 'claude-sonnet-4-6';
        const useOpenAIFormat = env.CLAUDE_USE_OPENAI_FORMAT === 'true';

        if (useOpenAIFormat) {
          const baseUrl = env.CLAUDE_BASE_URL || `${(env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/chat/completions`;
          const cfg: OpenAICompatConfig = {
            baseURL: baseUrl,
            model: modelUsed,
            apiKey: env.ANTHROPIC_AUTH_TOKEN || env.CLAUDE_API_KEY,
          };
          await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        } else {
          const baseUrl = (env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
          await claudeStream(
            baseUrl,
            env.ANTHROPIC_AUTH_TOKEN || env.CLAUDE_API_KEY,
            modelUsed,
            systemInstruction || '',
            toOpenAIMessages(systemInstruction || '', history || [], newMessage),
            send
          );
        }
      } else if (model === 'deepseek') {
        const cfg: OpenAICompatConfig = {
          baseURL: 'https://api.deepseek.com/chat/completions',
          model: 'deepseek-chat',
          apiKey: env.DEEPSEEK_API_KEY,
        };
        await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        modelUsed = 'deepseek-chat';
      } else if (model === 'kimi') {
        const cfg: OpenAICompatConfig = {
          baseURL: 'https://api.moonshot.cn/v1/chat/completions',
          model: env.KIMI_MODEL || 'moonshot-v1-32k',
          apiKey: env.KIMI_API_KEY,
        };
        await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        modelUsed = cfg.model;
      } else if (model === 'qwen') {
        const cfg: OpenAICompatConfig = {
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
          model: env.QWEN_MODEL || 'qwen-plus',
          apiKey: env.QWEN_API_KEY,
        };
        await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        modelUsed = cfg.model;
      } else if (model === 'doubao') {
        const cfg: OpenAICompatConfig = {
          baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
          model: env.DOUBAO_MODEL || 'doubao-pro-32k',
          apiKey: env.DOUBAO_API_KEY,
        };
        await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        modelUsed = cfg.model;
      } else if (model === 'openai') {
        const baseURL = `${(env.OPENAI_BASE_URL || 'https://api.openai.com').replace(/\/+$/, '')}/v1/chat/completions`;
        const cfg: OpenAICompatConfig = {
          baseURL,
          model: env.OPENAI_MODEL || 'gpt-5.5',
          apiKey: env.OPENAI_API_KEY,
        };
        await openaiCompatStream(cfg, toOpenAIMessages(systemInstruction || '', history || [], newMessage), send);
        modelUsed = cfg.model;
      } else {
        // Default to Gemini
        await geminiChatStream(env.GEMINI_API_KEY, history || [], newMessage, systemInstruction || '', send);
        modelUsed = 'gemini-2.0-flash';
      }

      end();
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('chat-stream error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
