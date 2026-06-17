import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, BookOpen, Globe, BookX, MessageCircle, Zap, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { useApp } from '../context/AppContext';
import { formatTime, getTodayString, getWeekDay } from '../utils/helpers';
import { aiGeneratePlan } from '../data/api/ai';
import { mathSubject } from '../data/mock/math';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, mistakes, dailyPlan, setDailyPlan, completeTask, energy, addEnergy } = useApp();
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showEnergyGain, setShowEnergyGain] = useState(false);

  useEffect(() => {
    const today = getTodayString();
    if (!dailyPlan || dailyPlan.date !== today) {
      generateDailyPlan();
    }
  }, []);

  const generateDailyPlan = async () => {
    setLoadingPlan(true);
    const result = await aiGeneratePlan(['math'], 60);
    const plan = {
      id: 'plan-' + Date.now(),
      userId: user.id,
      date: getTodayString(),
      tasks: result.plan.map((t, index) => ({
        id: `task-${index}`,
        ...t,
        completed: false,
      })),
    };
    setDailyPlan(plan);
    setLoadingPlan(false);
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
    addEnergy(10);
    setShowEnergyGain(true);
    setTimeout(() => setShowEnergyGain(false), 2000);
  };

  const today = new Date();
  const completedTasks = dailyPlan?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = dailyPlan?.tasks.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const subjectCards = [
    {
      id: 'math',
      name: '数学',
      icon: Calculator,
      color: '#4ECDC4',
      description: '四年级上下册',
      chapters: mathSubject.chapters.length,
      path: '/knowledge-map/math',
    },
    {
      id: 'chinese',
      name: '语文',
      icon: BookOpen,
      color: '#FF6B6B',
      description: '生字词、古诗文',
      chapters: 8,
      path: '/knowledge-map/chinese',
      disabled: true,
    },
    {
      id: 'english',
      name: '英语',
      icon: Globe,
      color: '#A29BFE',
      description: '单词、句型',
      chapters: 6,
      path: '/knowledge-map/english',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="AI 智能学习助手" />
      
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl text-text mb-2">
                    你好，{user.name}！👋
                  </h2>
                  <p className="text-textLight">
                    {getWeekDay(today)}，{today.getMonth() + 1}月{today.getDate()}日
                  </p>
                  <p className="text-textLight mt-2">
                    已连续学习 <span className="text-primary font-semibold">{user.streakDays}</span> 天
                  </p>
                </div>
                <div className="relative">
                  <ProgressRing progress={progress} size={140} strokeWidth={10}>
                    <span className="text-3xl font-display text-primary">{progress}%</span>
                    <span className="text-xs text-textLight">今日进度</span>
                  </ProgressRing>
                  {showEnergyGain && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                      +10 能量
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textLight">知识能量</p>
                  <p className="text-2xl font-display text-yellow-600">{energy}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-textLight">累计学习</p>
                  <p className="text-xl font-display text-blue-600">{formatTime(user.studyTime)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card title="今日学习计划">
          {loadingPlan ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : dailyPlan?.tasks.length ? (
            <div className="space-y-3">
              {dailyPlan.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    task.completed
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:border-primary'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'text-green-600 line-through' : 'text-text'}`}>
                      {task.subject} - {task.chapter}
                    </p>
                    <p className="text-xs text-textLight">
                      {task.type === 'learn' ? '学习' : task.type === 'practice' ? '练习' : '复习'} · {task.duration}分钟
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.priority === 'high' ? '重要' : task.priority === 'medium' ? '中等' : '一般'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-textLight">暂无学习计划</p>
              <button
                onClick={generateDailyPlan}
                className="mt-4 btn-primary"
              >
                生成今日计划
              </button>
            </div>
          )}
        </Card>

        <Card title="学科学习">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {subjectCards.map((subject) => {
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  onClick={() => !subject.disabled && navigate(subject.path)}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    subject.disabled
                      ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                      : 'bg-white shadow-card hover:shadow-button hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      subject.disabled ? 'bg-gray-300' : 'bg-opacity-20'
                    }`} style={{ backgroundColor: `${subject.color}20` }}>
                      <Icon className="w-6 h-6" style={{ color: subject.color }} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg" style={{ color: subject.disabled ? '#9CA3AF' : subject.color }}>
                        {subject.name}
                      </h3>
                      <p className="text-xs text-textLight">{subject.chapters}个章节</p>
                    </div>
                  </div>
                  <p className="text-sm text-textLight">{subject.description}</p>
                  {subject.disabled && (
                    <div className="mt-3 text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full inline-block">
                      即将上线
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="快捷入口">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: '知识地图', path: '/knowledge-map/math', color: '#4ECDC4' },
              { icon: Calculator, label: '开始练习', path: '/practice/math/math-4b-1', color: '#FF6B6B' },
              { icon: BookX, label: '错题本', path: '/mistakes', color: '#A29BFE', count: mistakes.length },
              { icon: MessageCircle, label: 'AI助手', path: '/ai-assistant', color: '#00B894' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all"
                >
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                      <Icon className="w-7 h-7" style={{ color: item.color }} />
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};
