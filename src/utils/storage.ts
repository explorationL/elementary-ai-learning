export const STORAGE_KEYS = {
  USER: 'ai_learning_user',
  PROGRESS: 'ai_learning_progress',
  MISTAKES: 'ai_learning_mistakes',
  DAILY_PLAN: 'ai_learning_daily_plan',
  CHAT_HISTORY: 'ai_learning_chat_history',
  ENERGY: 'ai_learning_energy',
};

export const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to set storage:', key);
  }
};

export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error('Failed to remove storage:', key);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch {
    console.error('Failed to clear storage');
  }
};
