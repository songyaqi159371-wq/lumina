
import { UserProgress, DivinationResult, AppSettings, ReadingStyle } from '../types';

const KEYS = {
  PROGRESS: 'lumina_progress',
  HISTORY: 'lumina_history',
  NOTES: 'lumina_notes',
  SETTINGS: 'lumina_settings',
  ACTIVE_SESSION: 'lumina_active_session'
};

const INITIAL_PROGRESS: UserProgress = {
  learnedCards: [],
  dailyDraw: { date: '', cardId: null, isReversed: false, note: '' },
  streak: 0,
  lastLogin: ''
};

const DEFAULT_SETTINGS: AppSettings = {
  readingStyle: ReadingStyle.Natural,
  showCardMeanings: true
};

// Request browser persistence
export const initStorage = async () => {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        await navigator.storage.persist();
      }
    } catch (e) {
      console.warn("Storage persistence request failed", e);
    }
  }
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(KEYS.PROGRESS);
    return stored ? JSON.parse(stored) : INITIAL_PROGRESS;
  } catch (e) {
    return INITIAL_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
};

export const getHistory = (): DivinationResult[] => {
  try {
    const stored = localStorage.getItem(KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveHistory = (record: DivinationResult) => {
  const history = getHistory();
  // Check if it already exists (to avoid duplicates if saved multiple times)
  const existingIndex = history.findIndex(item => item.id === record.id);
  if (existingIndex !== -1) {
    history[existingIndex] = record;
  } else {
    history.unshift(record);
  }
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
};

export const updateHistoryItem = (id: string, updatedRecord: Partial<DivinationResult>) => {
  const history = getHistory();
  const index = history.findIndex(item => item.id === id);
  if (index !== -1) {
    history[index] = { ...history[index], ...updatedRecord };
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    return true;
  }
  return false;
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
};

// --- Active Session Management ---

export const saveActiveSession = (data: any) => {
  localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(data));
};

export const getActiveSession = (): any | null => {
  try {
    const stored = localStorage.getItem(KEYS.ACTIVE_SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const clearActiveSession = () => {
  localStorage.removeItem(KEYS.ACTIVE_SESSION);
};

export const getNote = (cardId: number): string => {
  try {
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
    return notes[cardId] || '';
  } catch (e) {
    return '';
  }
};

export const saveNote = (cardId: number, content: string) => {
  try {
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
    notes[cardId] = content;
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error("Failed to save note", e);
  }
};

export const getSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// --- Quick Sync (Base64) ---

const getAllData = () => ({
    progress: getProgress(),
    history: getHistory(),
    notes: JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}'),
    timestamp: new Date().toISOString()
});

const restoreAllData = (data: any) => {
    if (data.progress) localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data.progress));
    if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
    if (data.notes) localStorage.setItem(KEYS.NOTES, JSON.stringify(data.notes));
};

export const getBackupString = (): string => {
    const data = getAllData();
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
};

export const restoreFromBackupString = (base64Str: string): boolean => {
    try {
        const jsonStr = decodeURIComponent(escape(atob(base64Str)));
        const data = JSON.parse(jsonStr);
        restoreAllData(data);
        return true;
    } catch (e) {
        return false;
    }
};

export const exportData = () => {
    const data = getAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_tarot_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                restoreAllData(JSON.parse(content));
                resolve(true);
            } catch (error) {
                reject(false);
            }
        };
        reader.readAsText(file);
    });
};
