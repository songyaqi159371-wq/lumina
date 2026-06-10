import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;

function checkRateLimit(ip: string): boolean {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试。' });
  }

  const { history, newMessage, systemInstruction } = req.body ?? {};
  if (!newMessage) return res.status(400).json({ error: 'Missing newMessage' });

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: history ?? [],
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 2000 },
      },
    });
    const response = await chat.sendMessage({ message: newMessage });
    res.status(200).json({ text: response.text ?? '' });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
