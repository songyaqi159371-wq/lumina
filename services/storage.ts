import { UserProgress, DivinationResult } from '../types';

const KEYS = {
  PROGRESS: 'lumina_progress',
  HISTORY: 'lumina_history',
  NOTES: 'lumina_notes',
  SETTINGS: 'lumina_settings'
};

const INITIAL_PROGRESS: UserProgress = {
  learnedCards: [],
  dailyDraw: { date: '', cardId: null, isReversed: false, note: '' },
  streak: 0,
  lastLogin: ''
};

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : INITIAL_PROGRESS;
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};

export const getHistory = (): DivinationResult[] => {
  const stored = localStorage.getItem(KEYS.HISTORY);
  return stored ? JSON.parse(stored) : [];
};

export const saveHistory = (record: DivinationResult) => {
  const history = getHistory();
  // Add to beginning
  history.unshift(record);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
};

export const getNote = (cardId: number): string => {
  const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
  return notes[cardId] || '';
};

export const saveNote = (cardId: number, content: string) => {
  const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
  notes[cardId] = content;
  localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
};
