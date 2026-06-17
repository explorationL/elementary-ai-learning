import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, CheckCircle, BookOpen, Lightbulb, AlertCircle, Globe } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { getChapterById } from '../data/mock/math';
import { useApp } from '../context/AppContext';

export const LearnPage: React.FC = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>();
  const navigate = useNavigate();
  const { addEnergy } = useApp();
  
  const chapterData = getChapterById(subject || 'math', chapter || '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedPoints, setCompletedPoints] = useState<Set<string>>(new Set());
  
  if (!chapterData) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="学习" showBack />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-textLight">章节数据加载失败</p>
              <button onClick={() => navigate(-1)} className="mt-4 btn-primary">返回</button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const knowledgePoints = chapterData.knowledgePoints;
  const currentPoint = knowledgePoints[currentIndex];
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < knowledgePoints.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleComplete = () => {
    setCompletedPoints(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(currentPoint.id)) {
        newSet.add(currentPoint.id);
        addEnergy(5);
      }
      return newSet;
    });
    
    if (currentIndex < knowledgePoints.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleStartPractice = () => {
    navigate(`/practice/${subject}/${chapter}`);
  };

  const isCompleted = completedPoints.has(currentPoint.id);
  const progress = Math.round((completedPoints.size / knowledgePoints.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="学习" showBack />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                {chapterData.textbook}
              </span>
              <h2 className="font-display text-xl text-text mt-2">{chapterData.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-textLight">学习进度</p>
              <p className="text-2xl font-display text-primary">{progress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {knowledgePoints.map((kp, index) => (
            <button
              key={kp.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentIndex === index
                  ? 'bg-primary text-white'
                  : completedPoints.has(kp.id)
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}. {kp.name.slice(0, 8)}{kp.name.length > 8 ? '...' : ''}
            </button>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-text">{currentPoint.name}</h3>
            {isCompleted && (
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                已完成
              </span>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-text">📚 知识是什么</h4>
              </div>
              <p className="text-text leading-relaxed ml-13">{currentPoint.definition}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-text">💡 为什么这样计算</h4>
              </div>
              <p className="text-text leading-relaxed">{currentPoint.explanation}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={1.5} />
                  </svg>
                </div>
                <h4 className="font-semibold text-text">📝 考试怎么考</h4>
              </div>
              <p className="text-text leading-relaxed">{currentPoint.examFocus}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-text">⚠️ 容易错在哪里</h4>
              </div>
              <p className="text-text leading-relaxed">{currentPoint.commonMistakes}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-text">🌍 现实生活中的应用</h4>
              </div>
              <p className="text-text leading-relaxed">{currentPoint.realWorldApplication}</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary hover:bg-primary/10 shadow-card'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            上一个
          </button>

          {currentIndex === knowledgePoints.length - 1 ? (
            <button
              onClick={handleStartPractice}
              className="btn-primary flex items-center gap-2"
            >
              开始练习
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gradient-to-r from-primary to-accent text-white hover:scale-105 shadow-button'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {isCompleted ? '已完成，下一个' : '标记完成'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentIndex === knowledgePoints.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              currentIndex === knowledgePoints.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-primary hover:bg-primary/10 shadow-card'
            }`}
          >
            下一个
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};
