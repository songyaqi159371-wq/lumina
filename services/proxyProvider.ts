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
}
