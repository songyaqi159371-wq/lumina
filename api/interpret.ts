import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit, runInterpret } from './_llm.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试。' });
  }

  const { model, prompt, systemInstruction } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const result = await runInterpret(model ?? 'gemini', prompt, systemInstruction ?? '');
    res.status(200).json({ text: result.text, modelUsed: result.modelUsed });
  } catch (err: any) {
    console.error('interpret error:', err);
    res.status(500).json({ error: err.message ?? 'Internal error' });
  }
}
