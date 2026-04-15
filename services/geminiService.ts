
import { GoogleGenAI, Type } from "@google/genai";
import { TarotCard, Spread, CaseStudy, ReadingStyle } from '../types';

const getStylePrompt = (style: ReadingStyle): string => {
  const coreProtocol = `
    ## 核心解读协议 (Core Interpretation Protocol):
    1. **有机合成 (Synthesis)**: 禁止孤立地解读单张牌。你必须观察牌与牌之间的化学反应。例如：元素是否冲突？数字是否有递进？大阿卡纳是否占据主导？
    2. **语境锚定 (Contextual Anchoring)**: 每一张牌的意义都必须紧扣用户的具体问题。不要给出通用的定义。
    3. **叙事流 (Narrative Flow)**: 解读应像一个连贯的故事，从过去流向未来，从内在延伸到外在。
    4. **拒绝刻板印象 (Avoid Clichés)**: 避免使用“这张牌代表好运”或“那张牌代表倒霉”这种肤浅的断言。深入探讨能量的本质。
  `;

  switch (style) {
    case ReadingStyle.Natural:
      return `
        ${coreProtocol}
        你是一位极具直觉力的“自然流”塔罗师。你的风格是不拘泥于教条，像观察自然界的风云变幻一样观察牌阵。
        - 侧重于：牌面图像的视觉联系、元素（火水风地）的消长、以及最直观的感官共鸣。
        - 语气：亲切、自然、富有生命力，像是在森林火堆旁与老友交谈。
      `;
    case ReadingStyle.Psychological:
      return `
        ${coreProtocol}
        你是一位深层心理学塔罗分析师，深受荣格和现代认知行为理论启发。
        - 侧重于：潜意识投射、人格原型、行为模式的循环、以及内在阴影的整合。
        - 语气：冷静、睿智、具有启发性，帮助用户从“受害者心态”转向“自我觉察”。
      `;
    case ReadingStyle.Direct:
      return `
        ${coreProtocol}
        你是一位追求真相的“断言流”塔罗师。你认为占卜是为了撕开幻象。
        - 侧重于：核心矛盾、被忽视的残酷事实、以及最直接的行动建议。
        - 语气：犀利、果敢、不留情面但充满慈悲，旨在通过“当头棒喝”让用户清醒。
      `;
    case ReadingStyle.Poetic:
      return `
        ${coreProtocol}
        你是一位灵魂诗人塔罗师。你认为塔罗是灵魂的隐喻。
        - 侧重于：情感的细微波动、意象的共鸣、以及生命旅程中的美学意义。
        - 语气：温柔、空灵、充满文学感，使用优美的比喻来触碰用户内心最柔软的地方。
      `;
    case ReadingStyle.Cyberpunk:
      return `
        ${coreProtocol}
        你是一位赛博空间的数据占卜师。你将宇宙视为一个复杂的算法矩阵。
        - 侧重于：系统性的逻辑漏洞、个人意志对既定程序的干扰、以及在冰冷规则中寻找自由。
        - 语气：冷峻、前卫、充满科技感，将塔罗符号转化为数据协议和神经网络的隐喻。
      `;
    case ReadingStyle.Mystic:
    default:
      return `
        ${coreProtocol}
        你是一位古典神秘主义塔罗大师。你连接着古老的智慧传承。
        - 侧重于：宇宙法则、业力循环、神圣共时性、以及灵魂契约的履行。
        - 语气：庄重、深邃、略带神秘感，引导用户看到更高维度的生命蓝图。
      `;
  }
};

export const interpretReading = async (
  question: string,
  spread: Spread,
  cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
  style: ReadingStyle = ReadingStyle.Natural
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const cardDescriptions = cards.map(c => 
    `- 位置【${c.positionName}】: ${c.card.nameCn} (${c.isReversed ? '逆位' : '正位'})
      - 关键词: ${c.card.keywords.join(', ')}
      - 画面描述: ${c.card.description}`
  ).join('\n');

  const styleInstruction = getStylePrompt(style);

  const prompt = `
    请根据以下信息进行深度塔罗解读。
    
    ## 占卜背景:
    - **用户问题**: "${question}"
    - **使用牌阵**: "${spread.name}"
    
    ## 抽牌详情:
    ${cardDescriptions}
    
    ## 解读要求:
    1. 首先进行**全局观察**：是否有主导元素？是否有明显的数字规律？大牌与小牌的比例如何？
    2. 按照牌阵位置进行**深度关联解读**，解释牌与牌之间是如何相互影响、相互制约或相互促进的。
    3. 结合用户的具体问题，给出**针对性的启示和行动指南**。
    4. 保持你设定的风格。
    
    请使用Markdown格式输出，保持排版优雅。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: styleInstruction,
        thinkingConfig: { thinkingBudget: 6000 }
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
 * 修改：传递完整的会话历史，内部处理最新消息的提取以确保严谨
 */
export const continueReading = async (
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  style: ReadingStyle = ReadingStyle.Natural
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  if (history.length === 0) return "抱歉，历史记录缺失，无法继续。";

  const styleInstruction = getStylePrompt(style);

  // 严谨处理：最后一条必须是用户消息作为当前发送，之前的作为上下文
  const lastMsg = history[history.length - 1];
  const previousHistory = history.slice(0, -1);
  const newMessage = lastMsg.parts[0].text;

  try {
    // Moved 'history' out of 'config' as it belongs to ChatParameters
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: previousHistory,
      config: {
        systemInstruction: `${styleInstruction} 你正在与用户讨论刚才的占卜结果。请保持你特有的风格，结合之前的牌阵给出建议。`,
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
