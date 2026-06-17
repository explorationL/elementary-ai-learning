import type { Chapter, KnowledgePoint, LearningLogic } from '../../types';
import { getChaptersBySubject, getChapterById, getKnowledgePointsByChapter, getLearningLogicByChapter } from '../mock/math';

export const getKnowledgeBySubject = async (subjectId: string): Promise<{ chapters: Chapter[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const chapters = getChaptersBySubject(subjectId);
  return { chapters };
};

export const getKnowledgeByChapter = async (
  subjectId: string,
  chapterId: string
): Promise<{ chapter: Chapter | undefined }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const chapter = getChapterById(subjectId, chapterId);
  return { chapter };
};

export const getKnowledgePoints = async (
  subjectId: string,
  chapterId: string
): Promise<{ knowledgePoints: KnowledgePoint[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const knowledgePoints = getKnowledgePointsByChapter(subjectId, chapterId);
  return { knowledgePoints };
};

export const getLearningLogic = async (
  subjectId: string,
  chapterId: string
): Promise<{ learningLogic: LearningLogic | undefined }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const learningLogic = getLearningLogicByChapter(subjectId, chapterId);
  return { learningLogic };
};
