
import { GoogleGenAI, Type } from "@google/genai";
import { CaseStudy } from '../types';

// generateAICaseStudy 仍直接调用 SDK（仅内部工具，不对用户暴露，不走代理层）
export const generateAICaseStudy = async (): Promise<CaseStudy | null> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const prompt = `
    Generate a unique and realistic Tarot practice case study for a beginner student.
    ... (保持原逻辑)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
      return { id: `ai-${Date.now()}`, ...data } as CaseStudy;
    }
    return null;
  } catch (error) {
    console.error("Gemini Case Gen Error:", error);
    return null;
  }
};
