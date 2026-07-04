import { CARD_SYMBOL_MAP } from '../data/symbolIndex';
import { tarotSymbols } from '../data/tarotSymbols';

/**
 * 每个象征在注入 prompt 时保留的最大 token 估算量（约4字/token）
 * 控制整体 RAG 上下文大小
 */
const MAX_CHARS_PER_SYMBOL = 600;
const MAX_TOTAL_SYMBOLS = 5;

/**
 * 根据当前牌阵的 cardId 列表，检索相关象征的精简摘要。
 * 返回格式化的 Markdown 字符串，可直接注入 prompt。
 *
 * 策略：
 * 1. 通过 CARD_SYMBOL_MAP 找到所有相关 symbolId（去重）
 * 2. 按出现频率（被多张牌共享的象征更重要）降序排列
 * 3. 为每个象征提取：名称 + coreSymbolism + 对应当前牌的 detail
 * 4. 限制总量在合理 token 范围内
 */
export function getRelevantSymbols(cardIds: number[]): string {
  if (cardIds.length === 0) return '';

  // 统计每个 symbolId 被几张当前牌共享（频率越高，越相关）
  const symbolCount: Record<string, number> = {};
  for (const cardId of cardIds) {
    const symbols = CARD_SYMBOL_MAP[cardId] || [];
    for (const sid of symbols) {
      symbolCount[sid] = (symbolCount[sid] || 0) + 1;
    }
  }

  if (Object.keys(symbolCount).length === 0) return '';

  // 按频率降序，取前 N 个
  const topSymbolIds = Object.entries(symbolCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TOTAL_SYMBOLS)
    .map(([id]) => id);

  const sections: string[] = [];

  for (const sid of topSymbolIds) {
    const symbol = tarotSymbols.find(s => s.id === sid);
    if (!symbol) continue;

    // 找出当前牌阵中包含该象征的牌的具体解析
    const relevantDetails = (symbol.details || []).filter(d =>
      cardIds.includes(d.cardId)
    );

    // 构建该象征的摘要块
    let block = `### ${symbol.nameCn}（${symbol.nameEn}）\n`;

    // 核心象征意义（最多2条）
    if (symbol.coreSymbolism && symbol.coreSymbolism.length > 0) {
      block += `**核心意义：**\n`;
      symbol.coreSymbolism.slice(0, 2).forEach(c => {
        block += `- ${c}\n`;
      });
    }

    // 当前牌的具体解析（最多2张）
    if (relevantDetails.length > 0) {
      block += `**在当前牌中的表现：**\n`;
      relevantDetails.slice(0, 2).forEach(d => {
        // 截断过长的解析
        const interp = d.interpretation.length > 300
          ? d.interpretation.slice(0, 300) + '……'
          : d.interpretation;
        block += `- 【${d.cardName}】${interp}\n`;
      });
    }

    // 如果块太长则截断
    if (block.length > MAX_CHARS_PER_SYMBOL) {
      block = block.slice(0, MAX_CHARS_PER_SYMBOL) + '……\n';
    }

    sections.push(block);
  }

  if (sections.length === 0) return '';

  return [
    '---',
    '## 象征学参考（来自RWS知识库）',
    '*以下内容请自然融入解读，勿生硬引用*',
    '',
    ...sections,
    '---',
  ].join('\n');
}
