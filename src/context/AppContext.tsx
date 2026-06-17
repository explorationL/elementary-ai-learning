import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Mistake, ChatMessage, DailyPlan } from '../types';
import { STORAGE_KEYS, getStorage, setStorage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface AppContextType {
  user: User;
  mistakes: Mistake[];
  chatHistory: ChatMessage[];
  dailyPlan: DailyPlan | null;
  energy: number;
  updateUser: (updates: Partial<User>) => void;
  addMistake: (mistake: Omit<Mistake, 'id' | 'createdAt' | 'reviewCount' | 'mastered'>) => void;
  updateMistake: (id: string, updates: Partial<Pick<Mistake, 'reviewCount' | 'mastered'>>) => void;
  deleteMistake: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setDailyPlan: (plan: DailyPlan) => void;
  completeTask: (taskId: string) => void;
  addEnergy: (amount: number) => void;
  consumeEnergy: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: User = {
  id: 'user-1',
  name: '小明同学',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  grade: '四年级',
  studyTime: 120,
  energy: 500,
  streakDays: 7,
  createdAt: new Date().toISOString(),
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => getStorage<User>(STORAGE_KEYS.USER, defaultUser));
  const [mistakes, setMistakes] = useState<Mistake[]>(() => getStorage<Mistake[]>(STORAGE_KEYS.MISTAKES, []));
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => getStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, []));
  const [dailyPlan, setDailyPlanState] = useState<DailyPlan | null>(() => getStorage<DailyPlan | null>(STORAGE_KEYS.DAILY_PLAN, null));
  const [energy, setEnergy] = useState<number>(() => getStorage<number>(STORAGE_KEYS.ENERGY, 500));

  useEffect(() => {
    setStorage(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.MISTAKES, mistakes);
  }, [mistakes]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.CHAT_HISTORY, chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    if (dailyPlan) {
      setStorage(STORAGE_KEYS.DAILY_PLAN, dailyPlan);
    }
  }, [dailyPlan]);

  useEffect(() => {
    setStorage(STORAGE_KEYS.ENERGY, energy);
  }, [energy]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addMistake = (mistakeData: Omit<Mistake, 'id' | 'createdAt' | 'reviewCount' | 'mastered'>) => {
    const newMistake: Mistake = {
      ...mistakeData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      mastered: false,
    };
    setMistakes(prev => [...prev, newMistake]);
  };

  const updateMistake = (id: string, updates: Partial<Pick<Mistake, 'reviewCount' | 'mastered'>>) => {
    setMistakes(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMistake = (id: string) => {
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const addChatMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  const setDailyPlan = (plan: DailyPlan) => {
    setDailyPlanState(plan);
  };

  const completeTask = (taskId: string) => {
    if (dailyPlan) {
      const updatedPlan: DailyPlan = {
        ...dailyPlan,
        tasks: dailyPlan.tasks.map(t => (t.id === taskId ? { ...t, completed: true } : t)),
      };
      setDailyPlanState(updatedPlan);
    }
  };

  const addEnergy = (amount: number) => {
    setEnergy(prev => prev + amount);
  };

  const consumeEnergy = (amount: number) => {
    setEnergy(prev => Math.max(0, prev - amount));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        mistakes,
        chatHistory,
        dailyPlan,
        energy,
        updateUser,
        addMistake,
        updateMistake,
        deleteMistake,
        addChatMessage,
        setDailyPlan,
        completeTask,
        addEnergy,
        consumeEnergy,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
