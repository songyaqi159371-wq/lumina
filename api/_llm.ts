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

// ── DeepSeek (OpenAI-compatible) ──
async function deepseekChat(messages: { role: string; content: string }[]): Promise<string> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model: 'deepseek-chat', messages }),
  });
  if (!res.ok) throw new Error(`DeepSeek API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// Convert Gemini-style history to OpenAI messages
function toOpenAIMessages(systemInstruction: string, history: ChatMsg[], newMessage: string) {
  const msgs: { role: string; content: string }[] = [{ role: 'system', content: systemInstruction }];
  for (const h of history ?? []) {
    msgs.push({ role: h.role === 'model' ? 'assistant' : 'user', content: h.parts[0]?.text ?? '' });
  }
  msgs.push({ role: 'user', content: newMessage });
  return msgs;
}

// ── Unified entry points (routed by model) ──
export async function runInterpret(model: string, prompt: string, systemInstruction: string): Promise<string> {
  if (model === 'deepseek') {
    return deepseekChat([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ]);
  }
  return geminiInterpret(prompt, systemInstruction);
}

export async function runChat(
  model: string,
  history: ChatMsg[],
  newMessage: string,
  systemInstruction: string
): Promise<string> {
  if (model === 'deepseek') {
    return deepseekChat(toOpenAIMessages(systemInstruction, history, newMessage));
  }
  return geminiChat(history, newMessage, systemInstruction);
}
