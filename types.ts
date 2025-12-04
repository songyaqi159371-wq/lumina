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
  element?: string; // Fire, Water, Air, Earth
}

export interface UserProgress {
  learnedCards: number[]; // IDs of cards marked as learned
  dailyDraw: {
    date: string; // YYYY-MM-DD
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
}

export interface DailyDrawRecord {
  date: string;
  cardId: number;
  isReversed: boolean;
  note: string;
}

// New Interface for Case Studies
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