export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}小时${mins}分钟`;
  }
  return `${mins}分钟`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const getWeekDay = (date: Date): string => {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
};

export const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    basic: '基础',
    advanced: '提高',
    challenge: '挑战',
  };
  return labels[difficulty] || difficulty;
};

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    basic: 'bg-success/20 text-success',
    advanced: 'bg-warning/20 text-warning',
    challenge: 'bg-error/20 text-error',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-600';
};

export const getQuestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    choice: '选择题',
    judge: '判断题',
    fill: '填空题',
    calculate: '计算题',
    application: '应用题',
    comprehensive: '综合题',
  };
  return labels[type] || type;
};

export const getErrorTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    careless: '粗心错误',
    concept: '概念错误',
    method: '方法错误',
    reading: '审题错误',
  };
  return labels[type] || type;
};

export const getErrorTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    careless: 'bg-warning/20 text-warning',
    concept: 'bg-error/20 text-error',
    method: 'bg-accent/20 text-accent',
    reading: 'bg-primary/20 text-primary',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateScore = (correct: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};
