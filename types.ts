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
  generalMeaning: string;
  imageUrl?: string;
  details: {
    cardId: number;
    cardName: string;
    interpretation: string;
    imageUrl?: string;
  }[];
  integrationAdvice: string;
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
  Kimi = 'kimi',
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
