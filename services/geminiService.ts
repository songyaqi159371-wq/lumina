import { GoogleGenAI } from "@google/genai";
import { TarotCard, Spread } from '../types';

export const interpretReading = async (
  question: string,
  spread: Spread,
  cards: { card: TarotCard; isReversed: boolean; positionName: string }[]
): Promise<string> => {
  
  if (!process.env.API_KEY) {
    return "请配置 API Key 以使用 AI 解读功能。";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const cardDescriptions = cards.map(c => 
    `- 位置【${c.positionName}】: ${c.card.nameCn} (${c.isReversed ? '逆位' : '正位'}) - 关键词: ${c.card.keywords.join(', ')}`
  ).join('\n');

  const prompt = `
    你是一位资深的塔罗牌占卜师。请根据以下牌阵和问题进行解读。
    
    用户问题: "${question}"
    使用牌阵: "${spread.name}"
    
    抽牌结果:
    ${cardDescriptions}
    
    请提供一个富有洞察力、语气温和且神秘的解读。包括每个位置的简要分析和最后的综合建议。
    请使用Markdown格式输出。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成解读，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 解读服务暂时不可用。";
  }
};