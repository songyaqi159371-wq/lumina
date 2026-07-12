import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit, runChatStream } from './_llm.js';
import { applyCors } from './_cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).end();

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试。' });
  }

  const { model, history, newMessage, systemInstruction } = req.body ?? {};
  if (!newMessage) return res.status(400).json({ error: 'Missing newMessage' });

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
    const modelUsed = await runChatStream(
      model ?? 'gemini',
      history ?? [],
      newMessage,
      systemInstruction ?? '',
      (delta) => send('delta', { text: delta })
    );
    send('done', { modelUsed });
  } catch (err: any) {
    console.error('chat-stream error:', err);
    send('error', { error: err?.message ?? 'Internal error' });
  } finally {
    res.end();
  }
}
