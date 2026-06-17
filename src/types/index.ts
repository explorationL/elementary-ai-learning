export interface User {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  studyTime: number;
  energy: number;
  streakDays: number;
  createdAt: string;
}

export interface KnowledgePoint {
  id: string;
  chapterId: string;
  name: string;
  definition: string;
  explanation: string;
  whyLearn: string;
  examFocus: string;
  commonMistakes: string;
  realWorldApplication: string;
}

export interface LearningLogic {
  whyLearn: string;
  coreExams: string[];
  skills: string[];
  prerequisites: string[];
  futureApplications: string[];
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  textbook: string;
  order: number;
  knowledgePoints: KnowledgePoint[];
  learningLogic: LearningLogic;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export type QuestionType = 'choice' | 'judge' | 'fill' | 'calculate' | 'application' | 'comprehensive';
export type Difficulty = 'basic' | 'advanced' | 'challenge';

export interface Question {
  id: string;
  chapterId: string;
  type: QuestionType;
  difficulty: Difficulty;
  content: string;
  options?: string[];
  answer: string;
  explanation: string;
  knowledgePointId: string;
}

export type ErrorType = 'careless' | 'concept' | 'method' | 'reading';

export interface Mistake {
  id: string;
  userId: string;
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  errorType: ErrorType;
  analysis: string;
  relatedKnowledge: string;
  createdAt: string;
  reviewCount: number;
  mastered: boolean;
}

export interface StudyProgress {
  id: string;
  userId: string;
  subjectId: string;
  chapterId: string;
  completed: boolean;
  score: number;
  knowledgePoints: {
    knowledgePointId: string;
    mastered: boolean;
    score: number;
  }[];
  updatedAt: string;
}

export interface DailyPlanTask {
  id: string;
  subject: string;
  chapter: string;
  type: 'learn' | 'practice' | 'review';
  duration: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  tasks: DailyPlanTask[];
}

export interface AIResponse {
  explanation: string;
  deepExplanation: string;
  relatedTopics: string[];
}

export interface GrowthAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: {
    deepExplanation: string;
    relatedTopics: string[];
  };
}
