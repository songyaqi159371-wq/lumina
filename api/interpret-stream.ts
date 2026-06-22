import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit, runInterpretStream } from './_llm.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试。' });
  }

  const { model, prompt, systemInstruction } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  // SSE headers — flush immediately so the client starts receiving deltas right away.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const modelUsed = await runInterpretStream(
      model ?? 'gemini',
      prompt,
      systemInstruction ?? '',
      (delta) => send('delta', { text: delta })
    );
    send('done', { modelUsed });
  } catch (err: any) {
    console.error('interpret-stream error:', err);
    send('error', { error: err?.message ?? 'Internal error' });
  } finally {
    res.end();
  }
}
