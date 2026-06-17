import type { Mistake } from '../../types';
import { STORAGE_KEYS, getStorage, setStorage } from '../../utils/storage';
import { generateId } from '../../utils/helpers';

export const getMistakes = async (userId: string): Promise<{ mistakes: Mistake[] }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const mistakes = getStorage<Mistake[]>(STORAGE_KEYS.MISTAKES, []);
  return { mistakes: mistakes.filter(m => m.userId === userId) };
};

export const addMistake = async (mistake: Omit<Mistake, 'id' | 'createdAt' | 'reviewCount' | 'mastered'>): Promise<{ success: boolean; mistake: Mistake }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const mistakes = getStorage<Mistake[]>(STORAGE_KEYS.MISTAKES, []);
  const newMistake: Mistake = {
    ...mistake,
    id: generateId(),
    createdAt: new Date().toISOString(),
    reviewCount: 0,
    mastered: false,
  };
  mistakes.push(newMistake);
  setStorage(STORAGE_KEYS.MISTAKES, mistakes);
  return { success: true, mistake: newMistake };
};

export const updateMistake = async (
  id: string,
  updates: Partial<Pick<Mistake, 'reviewCount' | 'mastered'>>
): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const mistakes = getStorage<Mistake[]>(STORAGE_KEYS.MISTAKES, []);
  const index = mistakes.findIndex(m => m.id === id);
  if (index !== -1) {
    mistakes[index] = { ...mistakes[index], ...updates };
    setStorage(STORAGE_KEYS.MISTAKES, mistakes);
    return { success: true };
  }
  return { success: false };
};

export const deleteMistake = async (id: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const mistakes = getStorage<Mistake[]>(STORAGE_KEYS.MISTAKES, []);
  const filtered = mistakes.filter(m => m.id !== id);
  setStorage(STORAGE_KEYS.MISTAKES, filtered);
  return { success: true };
};
