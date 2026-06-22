// Cloudflare Pages Function for /api/interpret
import { GoogleGenAI } from '@google/genai';

type ChatMsg = { role: 'user' | 'model'; parts: { text: string }[] };
type OpenAIMsg = { role: string; content: string };

interface OpenAICompatConfig {
  baseURL: string;
  model: string;
  apiKey: string | undefined;
}

// ── Gemini ──
async function geminiInterpret(apiKey: string, prompt: string, systemInstruction: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const r = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 6000 } },
  });
  return r.text ?? '';
}

// ── OpenAI-compatible models ──
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

// ── Claude ──
async function claudeChat(baseUrl: string, apiKey: string, model: string, systemInstruction: string, messages: OpenAIMsg[]): Promise<string> {
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
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}

// ── Main handler ──
export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { model, prompt, systemInstruction } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let text: string;
    let modelUsed: string;

    // Route to appropriate model
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
        text = await openaiCompatChat(cfg, [
          { role: 'system', content: systemInstruction || '' },
          { role: 'user', content: prompt },
        ]);
      } else {
        const baseUrl = (env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
        text = await claudeChat(
          baseUrl,
          env.ANTHROPIC_AUTH_TOKEN || env.CLAUDE_API_KEY,
          modelUsed,
          systemInstruction || '',
          [{ role: 'user', content: prompt }]
        );
      }
    } else if (model === 'deepseek') {
      const cfg: OpenAICompatConfig = {
        baseURL: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        apiKey: env.DEEPSEEK_API_KEY,
      };
      text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: prompt },
      ]);
      modelUsed = 'deepseek-chat';
    } else if (model === 'kimi') {
      const cfg: OpenAICompatConfig = {
        baseURL: 'https://api.moonshot.cn/v1/chat/completions',
        model: env.KIMI_MODEL || 'moonshot-v1-32k',
        apiKey: env.KIMI_API_KEY,
      };
      text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: prompt },
      ]);
      modelUsed = cfg.model;
    } else if (model === 'qwen') {
      const cfg: OpenAICompatConfig = {
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: env.QWEN_MODEL || 'qwen-plus',
        apiKey: env.QWEN_API_KEY,
      };
      text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: prompt },
      ]);
      modelUsed = cfg.model;
    } else if (model === 'doubao') {
      const cfg: OpenAICompatConfig = {
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        model: env.DOUBAO_MODEL || 'doubao-pro-32k',
        apiKey: env.DOUBAO_API_KEY,
      };
      text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: prompt },
      ]);
      modelUsed = cfg.model;
    } else if (model === 'openai') {
      const baseURL = `${(env.OPENAI_BASE_URL || 'https://api.openai.com').replace(/\/+$/, '')}/v1/chat/completions`;
      const cfg: OpenAICompatConfig = {
        baseURL,
        model: env.OPENAI_MODEL || 'gpt-4',
        apiKey: env.OPENAI_API_KEY,
      };
      text = await openaiCompatChat(cfg, [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: prompt },
      ]);
      modelUsed = cfg.model;
    } else {
      // Default to Gemini
      text = await geminiInterpret(env.GEMINI_API_KEY, prompt, systemInstruction || '');
      modelUsed = 'gemini-2.0-flash';
    }

    return new Response(JSON.stringify({ text, modelUsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('interpret error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
