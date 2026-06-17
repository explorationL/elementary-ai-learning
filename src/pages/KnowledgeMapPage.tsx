import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, BookOpen, Target, Lightbulb, ArrowRight, Play } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { MindMap } from '../components/MindMap';
import type { KnowledgePoint } from '../types';
import { getChaptersBySubject } from '../data/mock/math';

export const KnowledgeMapPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [chapters] = useState(getChaptersBySubject(subject || 'math'));
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedKnowledgePoint, setSelectedKnowledgePoint] = useState<KnowledgePoint | null>(null);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId);

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedKnowledgePoint(null);
  };

  const handleKnowledgePointSelect = (kp: KnowledgePoint) => {
    setSelectedKnowledgePoint(kp);
  };

  const handleStartLearning = () => {
    if (selectedChapterId) {
      navigate(`/learn/${subject}/${selectedChapterId}`);
    }
  };

  const handleStartPractice = () => {
    if (selectedChapterId) {
      navigate(`/practice/${subject}/${selectedChapterId}`);
    }
  };

  const getTextbookLabel = (textbook: string): string => {
    if (textbook.includes('上册')) return '上册';
    if (textbook.includes('下册')) return '下册';
    return textbook;
  };

  const getTextbookColor = (textbook: string): string => {
    if (textbook.includes('上册')) return 'bg-blue-100 text-blue-600';
    if (textbook.includes('下册')) return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="知识地图" showBack />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card title="章节列表">
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      selectedChapterId === chapter.id
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      selectedChapterId === chapter.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {chapter.order}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        selectedChapterId === chapter.id ? 'text-primary' : 'text-text'
                      }`}>
                        {chapter.name}
                      </p>
                      <p className="text-xs text-textLight">{chapter.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTextbookColor(chapter.textbook)}`}>
                      {getTextbookLabel(chapter.textbook)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedChapter ? (
              <>
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getTextbookColor(selectedChapter.textbook)}`}>
                          {selectedChapter.textbook}
                        </span>
                        <h2 className="font-display text-xl text-text">{selectedChapter.name}</h2>
                      </div>
                      <p className="text-textLight">{selectedChapter.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleStartLearning}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        开始学习
                      </button>
                      <button
                        onClick={handleStartPractice}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        开始练习
                      </button>
                    </div>
                  </div>
                </Card>

                <Card title="学习逻辑">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">为什么学习这一章？</h4>
                        <p className="text-sm text-textLight mt-1">{selectedChapter.learningLogic.whyLearn}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">核心考点</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedChapter.learningLogic.coreExams.map((exam, i) => (
                            <span key={i} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth={1.5} />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">考察能力</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedChapter.learningLogic.skills.map((skill, i) => (
                            <span key={i} className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <MindMap
                  title="知识点思维导图"
                  items={selectedChapter.knowledgePoints}
                  onSelect={handleKnowledgePointSelect}
                  selectedId={selectedKnowledgePoint?.id || undefined}
                />

                {selectedKnowledgePoint && (
                  <Card title={selectedKnowledgePoint.name}>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-blue-700 mb-2">📚 知识是什么</h4>
                        <p className="text-sm text-text">{selectedKnowledgePoint.definition}</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-green-700 mb-2">💡 为什么这样计算</h4>
                        <p className="text-sm text-text">{selectedKnowledgePoint.explanation}</p>
                      </div>

                      <div className="bg-red-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-red-700 mb-2">📝 考试怎么考</h4>
                        <p className="text-sm text-text">{selectedKnowledgePoint.examFocus}</p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-orange-700 mb-2">⚠️ 容易错在哪里</h4>
                        <p className="text-sm text-text">{selectedKnowledgePoint.commonMistakes}</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-purple-700 mb-2">🌍 现实生活中的应用</h4>
                        <p className="text-sm text-text">{selectedKnowledgePoint.realWorldApplication}</p>
                      </div>

                      <button
                        onClick={() => navigate(`/learn/${subject}/${selectedChapterId}?kp=${selectedKnowledgePoint.id}`)}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        深入学习这个知识点
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-display text-xl text-text mb-2">选择一个章节开始学习</h2>
                  <p className="text-textLight">点击左侧章节列表，查看详细的知识体系和学习逻辑</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
