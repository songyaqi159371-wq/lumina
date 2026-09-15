export enum Suit {
  Major = 'Major',
  Wands = 'Wands',
  Cups = 'Cups',
  Swords = 'Swords',
  Pentacles = 'Pentacles'
}

export interface TarotCard {
  id: number;
  nameCn: string;
  nameEn: string;
  number: number;
  suit: Suit;
  keywords: string[];
  meaningUp: string;
  meaningDown: string;
  description: string;
  element?: string;
  symbols?: string[]; // IDs of symbols found in this card
}

export interface TarotSymbol {
  id: string;
  nameCn: string;
  nameEn: string;
  category: 'Nature' | 'Artifact' | 'Divine';

  // 书中章节的开篇介绍
  bookIntro?: string;

  // 包含此象征的所有牌（从书中统计）
  cardsContainingSymbol?: number[];

  // 核心象征意义（通常是3个要点）
  coreSymbolism?: string[];

  // 词源学背景
  etymology?: string;

  // 象征的变体类型（如不同类型的王冠、柱子等）
  variations?: {
    name: string;
    description: string;
  }[];

  // RWS牌组中此象征的具体形式列表
  formsInRWS?: string[];

  // 通用含义（保留原有字段）
  generalMeaning: string;

  // 文化背景（神话、炼金术、共济会、卡巴拉等）
  culturalContext?: string;

  imageUrl?: string;

  // 书中的具体案例解析（保留书中原案例）
  details?: {
    cardId: number;
    cardName: string;
    interpretation: string;
    imageUrl?: string;
  }[];

  // 整合建议（占卜应用）
  integrationAdvice?: string;
}

export interface UserProgress {
  learnedCards: number[];
  dailyDraw: {
    date: string;
    cardId: number | null;
    isReversed: boolean;
    note: string;
  };
  streak: number;
  lastLogin: string;
}

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  positions: SpreadPosition[];
}

export interface DivinationResult {
  id: string;
  date: string;
  question: string;
  spreadId: string;
  cards: {
    positionId: number;
    cardId: number;
    isReversed: boolean;
  }[];
  notes?: string;
  aiInterpretation?: string;
  chatHistory?: {
    role: 'user' | 'model';
    parts: { text: string }[];
  }[];
  readingStyle?: ReadingStyle;
}

export interface CaseStudy {
  id: string;
  category: 'Love' | 'Career' | 'General' | 'Growth';
  question: string;
  context: string;
  cardId: number;
  isReversed: boolean;
  interpretation: string;
  keyPoints: string[];
}

export enum ReadingStyle {
  Mystic = 'Mystic',
  Psychological = 'Psychological',
  Direct = 'Direct',
  Poetic = 'Poetic',
  Cyberpunk = 'Cyberpunk',
  Natural = 'Natural'
}

export enum AIModel {
  Gemini = 'gemini',
  DeepSeek = 'deepseek',
  Qwen = 'qwen',
  Doubao = 'doubao',
  Claude = 'claude',
  OpenAI = 'openai',
}

export interface AppSettings {
  readingStyle: ReadingStyle;
  showCardMeanings: boolean;
  aiModel: AIModel;
}
