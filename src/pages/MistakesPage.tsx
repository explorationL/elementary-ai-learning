import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { getErrorTypeLabel, getErrorTypeColor } from '../utils/helpers';
import { aiAnalyzeMistake } from '../data/api/ai';

export const MistakesPage: React.FC = () => {
  const navigate = useNavigate();
  const { mistakes, deleteMistake, updateMistake } = useApp();
  const [filter, setFilter] = useState<'all' | 'careless' | 'concept' | 'method' | 'reading'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Record<string, {
    errorType: string;
    analysis: string;
    relatedKnowledge: string;
  }>>({});

  const filteredMistakes = filter === 'all' 
    ? mistakes 
    : mistakes.filter(m => m.errorType === filter);

  const handleDelete = (id: string) => {
    deleteMistake(id);
  };

  const handleReview = (id: string) => {
    updateMistake(id, { reviewCount: (mistakes.find(m => m.id === id)?.reviewCount || 0) + 1 });
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMaster = (id: string) => {
    updateMistake(id, { mastered: true });
  };

  const handleAnalyze = async (mistake: typeof mistakes[0]) => {
    setAnalyzingId(mistake.id);
    const result = await aiAnalyzeMistake(
      mistake.question,
      mistake.userAnswer,
      mistake.correctAnswer
    );
    setAnalysisResult(prev => ({
      ...prev,
      [mistake.id]: {
        errorType: result.errorType,
        analysis: result.analysis,
        relatedKnowledge: result.relatedKnowledge,
      },
    }));
    setAnalyzingId(null);
    setExpandedId(mistake.id);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="错题本" showBack />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-red-100 to-orange-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-text mb-1">我的错题本</h2>
              <p className="text-textLight">
                共 <span className="text-red-600 font-semibold">{filteredMistakes.length}</span> 道错题
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm">
                已掌握 {mistakes.filter(m => m.mastered).length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {(['careless', 'concept', 'method', 'reading'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === type
                    ? getErrorTypeColor(type).replace('/20', '') + ' text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getErrorTypeLabel(type)}
              </button>
            ))}
          </div>
        </Card>

        {filteredMistakes.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="font-display text-xl text-text mb-2">太棒了！</h2>
              <p className="text-textLight">你还没有错题，继续保持！</p>
              <button onClick={() => navigate('/practice/math/math-4b-1')} className="mt-4 btn-primary">
                开始练习
              </button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((mistake, index) => (
              <Card key={mistake.id} className={mistake.mastered ? 'opacity-60' : ''}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      mistake.mastered
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getErrorTypeColor(mistake.errorType)}`}>
                        {getErrorTypeLabel(mistake.errorType)}
                      </span>
                      {mistake.mastered && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full ml-2">
                          已掌握
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-textLight">
                      复习次数: {mistake.reviewCount}
                    </span>
                    <button
                      onClick={() => handleDelete(mistake.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-text mb-4">{mistake.question}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-3 rounded-xl">
                    <p className="text-xs text-red-600 mb-1">你的答案</p>
                    <p className="text-text font-medium">{mistake.userAnswer || '未作答'}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <p className="text-xs text-green-600 mb-1">正确答案</p>
                    <p className="text-text font-medium">{mistake.correctAnswer}</p>
                  </div>
                </div>

                {expandedId === mistake.id && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-700 mb-2">📝 AI分析</h4>
                      {analyzingId === mistake.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-textLight">分析中...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-text">{analysisResult[mistake.id]?.analysis || mistake.analysis}</p>
                          <p className="text-textLight text-sm mt-2">
                            相关知识：{analysisResult[mistake.id]?.relatedKnowledge || mistake.relatedKnowledge}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAnalyze(mistake)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5" />
                    AI分析
                  </button>
                  <button
                    onClick={() => handleReview(mistake.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    再练一次
                  </button>
                  {!mistake.mastered && (
                    <button
                      onClick={() => handleMaster(mistake.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl font-medium hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      已掌握
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
