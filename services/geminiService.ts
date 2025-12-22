
import { GoogleGenAI, Type } from "@google/genai";
import { TarotCard, Spread, CaseStudy } from '../types';

export const interpretReading = async (
  question: string,
  spread: Spread,
  cards: { card: TarotCard; isReversed: boolean; positionName: string }[]
): Promise<string> => {
  
  // Assume process.env.API_KEY is pre-configured and accessible
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
      // Use gemini-3-pro-preview for complex reasoning and interpretation tasks
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "无法生成解读，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 解读服务暂时不可用。";
  }
};

export const generateAICaseStudy = async (): Promise<CaseStudy | null> => {
  // Assume process.env.API_KEY is pre-configured and accessible
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a unique and realistic Tarot practice case study for a beginner student.
    
    Requirements:
    1. Create a specific user context/background story (Love, Career, General, or Growth).
    2. Define a specific question the user asks.
    3. Choose ONE specific Tarot card (0-77) that answers this question interestingly.
    4. Provide the interpretation of why this card fits the situation.
    
    ID Mapping Rules (Strictly follow this):
    - 0-21: Major Arcana
    - 22-35: Wands (Ace to King)
    - 36-49: Cups (Ace to King)
    - 50-63: Swords (Ace to King)
    - 64-77: Pentacles (Ace to King)
    
    Output JSON format only.
  `;

  try {
    const response = await ai.models.generateContent({
      // Use gemini-3-pro-preview for complex generation tasks involving specific rules and reasoning
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: ['Love', 'Career', 'General', 'Growth'] },
            question: { type: Type.STRING },
            context: { type: Type.STRING },
            cardId: { type: Type.INTEGER, description: "ID between 0 and 77" },
            isReversed: { type: Type.BOOLEAN },
            interpretation: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['category', 'question', 'context', 'cardId', 'isReversed', 'interpretation', 'keyPoints']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure cardId is within valid range to prevent crashes
      if (data.cardId < 0) data.cardId = 0;
      if (data.cardId > 77) data.cardId = 77;
      
      return {
        id: `ai-${Date.now()}`,
        ...data
      } as CaseStudy;
    }
    return null;
  } catch (error) {
    console.error("Gemini Case Gen Error:", error);
    return null;
  }
};
