
import { GoogleGenAI, Type } from "@google/genai";
import { TarotCard, Spread, CaseStudy } from '../types';

export const interpretReading = async (
  question: string,
  spread: Spread,
  cards: { card: TarotCard; isReversed: boolean; positionName: string }[]
): Promise<string> => {
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text || "无法生成解读，请稍后再试。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const errorMsg = error.message || "";
    if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("API_KEY")) {
        return "AI 解读服务暂时无法访问。请确保应用环境已正确配置 API 密钥。";
    }
    return "AI 解读服务暂时不可用，请稍后重试或检查网络连接。";
  }
};

/**
 * 支持追问的对话服务
 */
export const continueReading = async (
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "你是一位资深的塔罗占卜师，正在与用户讨论刚才的占卜结果。请保持专业、神秘且充满同理心的语气，结合之前的牌阵给出建议。",
        history: history,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "抱歉，我未能感应到进一步的启示。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "对话连接中断，请重试。";
  }
};

export const generateAICaseStudy = async (): Promise<CaseStudy | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Generate a unique and realistic Tarot practice case study for a beginner student.
    ... (保持原逻辑)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
