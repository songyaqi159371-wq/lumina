import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit, runChat } from './_llm.js';
import { applyCors } from './_cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试。' });
  }

  const { model, history, newMessage, systemInstruction } = req.body ?? {};
  if (!newMessage) return res.status(400).json({ error: 'Missing newMessage' });

  try {
    const result = await runChat(model ?? 'gemini', history ?? [], newMessage, systemInstruction ?? '');
    res.status(200).json({ text: result.text, modelUsed: result.modelUsed });
  } catch (err: any) {
    console.error('chat error:', err);
    res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
