import { TarotCard, Spread, ReadingStyle } from '../types';
import { AIProvider, ChatMessage } from './aiProvider';
import { getStylePrompt, buildInterpretPrompt } from './promptBuilder';

/**
 * 通用代理 Provider：所有模型共用同一套前端逻辑。
 * 请求带 model 字段，由 Vercel 代理层 (/api/*) 按 model 路由到对应 AI 服务。
 * 前端不持有任何 API Key。
 */
export class ProxyProvider implements AIProvider {
  constructor(private readonly model: string) {}

  async interpretReading(
    question: string,
    spread: Spread,
    cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
    style: ReadingStyle = ReadingStyle.Natural
  ): Promise<string> {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: buildInterpretPrompt(question, spread, cards),
          systemInstruction: getStylePrompt(style),
        }),
      });
      if (res.status === 429) return '请求过于频繁，请稍后再试。';
      const data = await res.json();
      return data.text || '无法生成解读，请稍后再试。';
    } catch (err) {
      console.error('interpret error:', err);
      return 'AI 解读服务暂时不可用，请稍后重试或检查网络连接。';
    }
  }

  /**
   * 流式解读：通过 SSE 逐块接收，onDelta 实时回调，返回累计全文。
   * 任何阶段失败都自动回退到非流式 interpretReading，保证不影响可用性。
   */
  async interpretReadingStream(
    question: string,
    spread: Spread,
    cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
    style: ReadingStyle = ReadingStyle.Natural,
    onDelta: (chunk: string) => void
  ): Promise<string> {
    const { full, ok } = await this.consumeStream('/api/interpret-stream', {
      model: this.model,
      prompt: buildInterpretPrompt(question, spread, cards),
      systemInstruction: getStylePrompt(style),
    }, onDelta);
    if (ok && full) return full;
    if (full) return full; // 部分内容也保留
    // 完全失败时回退非流式
    return this.interpretReading(question, spread, cards, style);
  }

  /**
   * 共享 SSE 读取逻辑：POST body 到 endpoint，解析 event-stream，
   * 对每个 delta 调用 onDelta 并累计。返回 { full, ok }，由调用方决定回退策略。
   * 抛错仅在拿不到任何内容且无法判定时；正常情况下用 ok 标志反馈。
   */
  private async consumeStream(
    endpoint: string,
    body: unknown,
    onDelta: (chunk: string) => void
  ): Promise<{ full: string; ok: boolean }> {
    let full = '';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 429) {
        const msg = '请求过于频繁，请稍后再试。';
        onDelta(msg);
        return { full: msg, ok: true };
      }
      if (!res.ok || !res.body) throw new Error(`stream HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamError: string | null = null;

      // SSE frames are separated by a blank line; each frame has `event:` and `data:` lines.
      const handleFrame = (frame: string) => {
        let event = 'message';
        let data = '';
        for (const line of frame.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          else if (line.startsWith('data:')) data += line.slice(5).trim();
        }
        if (!data) return;
        try {
          const parsed = JSON.parse(data);
          if (event === 'delta' && parsed.text) {
            full += parsed.text;
            onDelta(parsed.text);
          } else if (event === 'error') {
            streamError = parsed.error ?? 'stream error';
          }
        } catch {
          /* ignore unparsable frame */
        }
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sep: number;
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
          handleFrame(buffer.slice(0, sep));
          buffer = buffer.slice(sep + 2);
        }
      }
      if (buffer.trim()) handleFrame(buffer);

      if (streamError && !full) throw new Error(streamError);
      return { full, ok: full.length > 0 };
    } catch (err) {
      console.error(`stream error (${endpoint}), falling back:`, err);
      return { full, ok: false };
    }
  }

  async continueReading(
    history: ChatMessage[],
    style: ReadingStyle = ReadingStyle.Natural
  ): Promise<string> {
    if (history.length === 0) return '抱歉，历史记录缺失，无法继续。';

    const lastMsg = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          history: previousHistory,
          newMessage: lastMsg.parts[0].text,
          systemInstruction: `${getStylePrompt(style)} 你正在与用户讨论刚才的占卜结果。请保持你特有的风格，结合之前的牌阵给出建议。`,
        }),
      });
      if (res.status === 429) return '请求过于频繁，请稍后再试。';
      const data = await res.json();
      return data.text || '抱歉，我未能感应到进一步的启示。';
    } catch (err) {
      console.error('chat error:', err);
      return '对话连接中断，请重试。';
    }
  }

  /**
   * 流式追问：SSE 逐块返回，失败自动回退到非流式 continueReading。
   */
  async continueReadingStream(
    history: ChatMessage[],
    style: ReadingStyle = ReadingStyle.Natural,
    onDelta: (chunk: string) => void
  ): Promise<string> {
    if (history.length === 0) return '抱歉，历史记录缺失，无法继续。';

    const lastMsg = history[history.length - 1];
    const previousHistory = history.slice(0, -1);

    const { full, ok } = await this.consumeStream('/api/chat-stream', {
      model: this.model,
      history: previousHistory,
      newMessage: lastMsg.parts[0].text,
      systemInstruction: `${getStylePrompt(style)} 你正在与用户讨论刚才的占卜结果。请保持你特有的风格，结合之前的牌阵给出建议。`,
    }, onDelta);
    if (ok && full) return full;
    if (full) return full;
    return this.continueReading(history, style);
  }
}
