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

// New: Delete a specific history item
export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
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

// --- Data Export/Import ---

export const exportData = () => {
    const data = {
        progress: getProgress(),
        history: getHistory(),
        notes: JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}'),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_tarot_backup_${new Date().toISOString().slice(0,10)}.json`;
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
                const data = JSON.parse(content);
                
                if (data.progress) localStorage.setItem(KEYS.PROGRESS, JSON.stringify(data.progress));
                if (data.history) localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
                if (data.notes) localStorage.setItem(KEYS.NOTES, JSON.stringify(data.notes));
                
                resolve(true);
            } catch (error) {
                console.error("Import failed:", error);
                reject(false);
            }
        };
        reader.readAsText(file);
    });
};