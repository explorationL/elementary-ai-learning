import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ChevronRight, Home, RotateCcw } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { getChapterById } from '../data/mock/math';
import { getRandomQuestions } from '../data/mock/questions';
import type { Question } from '../types';
import { useApp } from '../context/AppContext';
import { getDifficultyLabel, getDifficultyColor, getQuestionTypeLabel } from '../utils/helpers';

type PracticeMode = 'select' | 'doing' | 'result';

export const PracticePage: React.FC = () => {
  const { subject, chapter } = useParams<{ subject: string; chapter: string }>();
  const navigate = useNavigate();
  const { addMistake, addEnergy } = useApp();
  
  const chapterData = getChapterById(subject || 'math', chapter || '');
  const [mode, setMode] = useState<PracticeMode>('select');
  const [difficulty, setDifficulty] = useState<'basic' | 'advanced' | 'challenge'>('basic');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (mode === 'doing') {
      const selectedQuestions = getRandomQuestions(chapter || '', 10, difficulty);
      setQuestions(selectedQuestions);
      setUserAnswers({});
      setCurrentIndex(0);
      setShowResult(false);
      setCorrectCount(0);
    }
  }, [mode, difficulty, chapter]);

  const currentQuestion = questions[currentIndex];

  const handleStart = () => {
    setMode('doing');
  };

  const handleSelectAnswer = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleSubmit = () => {
    setShowResult(true);
    const answer = userAnswers[currentQuestion.id] || '';
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
    if (!isCorrect) {
      addMistake({
        userId: 'user-1',
        questionId: currentQuestion.id,
        question: currentQuestion.content,
        userAnswer: answer,
        correctAnswer: currentQuestion.answer,
        errorType: 'concept',
        analysis: '答题错误，需要复习相关知识点',
        relatedKnowledge: currentQuestion.explanation,
      });
    } else {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowResult(false);
      } else {
        setMode('result');
        const score = Math.round((correctCount + (isCorrect ? 1 : 0)) / questions.length * 100);
        addEnergy(score);
      }
    }, 2000);
  };

  const handleRestart = () => {
    setMode('select');
  };

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="练习" showBack />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <div className="text-center py-12">
              <p className="text-textLight">章节数据加载失败</p>
              <button onClick={() => navigate(-1)} className="mt-4 btn-primary">返回</button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="练习" showBack />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                  {chapterData.textbook}
                </span>
                <h2 className="font-display text-xl text-text mt-2">{chapterData.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-textLight">共 {questions.length} 道题</p>
              </div>
            </div>
          </Card>

          <Card title="选择难度">
            <div className="grid grid-cols-3 gap-4">
              {([{ value: 'basic', label: '基础', desc: '巩固知识', color: 'bg-green-100 text-green-600' },
                { value: 'advanced', label: '提高', desc: '提升能力', color: 'bg-yellow-100 text-yellow-600' },
                { value: 'challenge', label: '挑战', desc: '培养思维', color: 'bg-red-100 text-red-600' }] as const).map(d => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`p-6 rounded-xl text-center transition-all ${
                    difficulty === d.value
                      ? `${d.color} border-2 border-current`
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-display text-2xl mb-2">{d.label}</p>
                  <p className="text-xs">{d.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card title="题型说明">
            <div className="space-y-3">
              {(['选择题', '判断题', '填空题', '计算题', '应用题'] as const).map(type => (
                <div key={type} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{type[0]}</span>
                  </div>
                  <span className="text-text">{type}</span>
                </div>
              ))}
            </div>
          </Card>

          <button onClick={handleStart} className="w-full btn-primary flex items-center justify-center gap-2 mt-6">
            开始练习
            <ChevronRight className="w-5 h-5" />
          </button>
        </main>
      </div>
    );
  }

  if (mode === 'result') {
    const score = Math.round((correctCount) / questions.length * 100);
    return (
      <div className="min-h-screen bg-background pb-24">
        <Header title="练习结果" showBack />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#E8F5F3" strokeWidth="12" />
                <circle 
                  cx="64" cy="64" r="56" fill="none" 
                  stroke={score >= 80 ? '#4ECDC4' : score >= 60 ? '#FFD93D' : '#FF6B6B'} 
                  strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${score * 3.52} 352`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display" style={{ color: score >= 80 ? '#4ECDC4' : score >= 60 ? '#FFD93D' : '#FF6B6B' }}>
                  {score}
                </span>
                <span className="text-sm text-textLight">分</span>
              </div>
            </div>
            <h2 className="font-display text-xl text-text mb-2">
              {score >= 90 ? '太棒了！🎉' : score >= 80 ? '做得很好！👍' : score >= 60 ? '继续加油！💪' : '需要复习哦 📚'}
            </h2>
            <p className="text-textLight">
              答对 <span className="text-primary font-semibold">{correctCount}</span> 题，共 <span className="text-text font-semibold">{questions.length}</span> 题
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm">
                正确 {correctCount}
              </span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm">
                错误 {questions.length - correctCount}
              </span>
            </div>
          </Card>

          <Card title="答题详情">
            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = userAnswers[q.id] || '';
                const isCorrect = userAnswer.toLowerCase().trim() === q.answer.toLowerCase().trim();
                return (
                  <div key={q.id} className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-text">第{index + 1}题</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(q.difficulty)}`}>
                            {getDifficultyLabel(q.difficulty)}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {getQuestionTypeLabel(q.type)}
                          </span>
                        </div>
                        <p className="text-text text-sm mb-2">{q.content}</p>
                        {!isCorrect && (
                          <div className="space-y-1 text-sm">
                            <p className="text-red-600">你的答案：{userAnswer || '未作答'}</p>
                            <p className="text-green-600">正确答案：{q.answer}</p>
                            <p className="text-textLight mt-2">解析：{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-4 mt-6">
            <button onClick={handleRestart} className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              再练一次
            </button>
            <button onClick={() => navigate('/')} className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              返回首页
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="练习" showBack />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
                {chapterData.name}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
                {getDifficultyLabel(difficulty)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-textLight">
                {currentIndex + 1}/{questions.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              {currentIndex + 1}
            </div>
            <div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>
            </div>
          </div>
          <p className="text-lg text-text mb-6">{currentQuestion.content}</p>

          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const optionLabel = String.fromCharCode(65 + index);
                const selected = userAnswers[currentQuestion.id] === optionLabel;
                const isCorrectOption = currentQuestion.answer === optionLabel;
                
                return (
                  <button
                    key={optionLabel}
                    onClick={() => !showResult && handleSelectAnswer(optionLabel)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      showResult
                        ? isCorrectOption
                          ? 'bg-green-100 border-2 border-green-500 text-green-700'
                          : selected
                            ? 'bg-red-100 border-2 border-red-500 text-red-700'
                            : 'bg-gray-50 text-gray-600'
                        : selected
                          ? 'bg-primary/10 border-2 border-primary text-primary'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        showResult
                          ? isCorrectOption
                            ? 'bg-green-500 text-white'
                            : selected
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          : selected
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {optionLabel}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrectOption && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && selected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'judge' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '正确', value: '正确', color: 'bg-green-500' },
                { label: '错误', value: '错误', color: 'bg-red-500' },
              ].map(opt => {
                const selected = userAnswers[currentQuestion.id] === opt.value;
                const isCorrect = currentQuestion.answer === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => !showResult && handleSelectAnswer(opt.value)}
                    disabled={showResult}
                    className={`p-6 rounded-xl text-center transition-all ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : selected
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-50'
                        : selected
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-display text-xl">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'fill' || currentQuestion.type === 'calculate' || currentQuestion.type === 'application' || currentQuestion.type === 'comprehensive' ? (
            <div className="space-y-4">
              <textarea
                value={userAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                disabled={showResult}
                placeholder="请输入你的答案..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none h-32 text-text"
              />
              {showResult && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-green-700 font-semibold mb-2">正确答案：{currentQuestion.answer}</p>
                  <p className="text-textLight text-sm">解析：{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          ) : null}
        </Card>

        {!showResult ? (
          <button 
            onClick={handleSubmit}
            disabled={!userAnswers[currentQuestion.id]}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              userAnswers[currentQuestion.id]
                ? 'bg-gradient-to-r from-primary to-accent text-white hover:scale-[1.02] shadow-button'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            提交答案
          </button>
        ) : (
          <div className={`p-4 rounded-xl text-center font-semibold ${
            userAnswers[currentQuestion.id]?.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim()
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {userAnswers[currentQuestion.id]?.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim()
              ? '🎉 回答正确！太棒了！'
              : '😅 回答错误，继续加油！'}
          </div>
        )}
      </main>
    </div>
  );
};
