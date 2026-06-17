import React, { useState } from 'react';
import { Trophy, Star, Flame, Award, Clock, BookOpen, Target, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/helpers';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  target: number;
  color: string;
}

export const GrowthPage: React.FC = () => {
  const { user, mistakes, energy } = useApp();
  const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');

  const achievements: Achievement[] = [
    {
      id: 'first-study',
      name: '初次学习',
      description: '完成第一次学习任务',
      icon: BookOpen,
      unlocked: true,
      progress: 1,
      target: 1,
      color: '#4ECDC4',
    },
    {
      id: 'streak-7',
      name: '坚持一周',
      description: '连续学习7天',
      icon: Flame,
      unlocked: user.streakDays >= 7,
      progress: Math.min(user.streakDays, 7),
      target: 7,
      color: '#FF6B6B',
    },
    {
      id: 'streak-30',
      name: '月度冠军',
      description: '连续学习30天',
      icon: Trophy,
      unlocked: user.streakDays >= 30,
      progress: Math.min(user.streakDays, 30),
      target: 30,
      color: '#FFD93D',
    },
    {
      id: 'master-10',
      name: '知识达人',
      description: '掌握10个知识点',
      icon: Target,
      unlocked: energy >= 500,
      progress: Math.min(Math.floor(energy / 50), 10),
      target: 10,
      color: '#A29BFE',
    },
    {
      id: 'no-mistakes',
      name: '完美主义',
      description: '连续10道题全对',
      icon: Star,
      unlocked: false,
      progress: 0,
      target: 10,
      color: '#00B894',
    },
    {
      id: 'study-100',
      name: '学习标兵',
      description: '累计学习100小时',
      icon: Clock,
      unlocked: user.studyTime >= 6000,
      progress: Math.min(user.studyTime, 6000),
      target: 6000,
      color: '#FD79A8',
    },
  ];

  const weeklyData = [
    { day: '周一', studyTime: 45, questions: 15 },
    { day: '周二', studyTime: 60, questions: 20 },
    { day: '周三', studyTime: 30, questions: 10 },
    { day: '周四', studyTime: 90, questions: 25 },
    { day: '周五', studyTime: 45, questions: 12 },
    { day: '周六', studyTime: 120, questions: 30 },
    { day: '周日', studyTime: 60, questions: 18 },
  ];

  const stats = [
    { label: '累计学习时间', value: formatTime(user.studyTime), icon: Clock, color: '#4ECDC4' },
    { label: '知识能量', value: `${energy}`, icon: Sparkles, color: '#FFD93D' },
    { label: '连续学习天数', value: `${user.streakDays}天`, icon: Flame, color: '#FF6B6B' },
    { label: '错题数量', value: `${mistakes.length}道`, icon: Award, color: '#A29BFE' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="成长中心" showBack />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-text mb-1">你好，{user.name}！</h2>
              <p className="text-textLight">继续努力，你正在一步步成长！</p>
            </div>
            <div className="relative">
              <ProgressRing progress={Math.min(Math.floor(energy / 10), 100)} size={100} strokeWidth={8}>
                <span className="text-xl font-display text-primary">{energy}</span>
                <span className="text-xs text-textLight">能量</span>
              </ProgressRing>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'achievements'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            <Trophy className="w-5 h-5 inline-block mr-2" />
            成就徽章
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            <Target className="w-5 h-5 inline-block mr-2" />
            学习统计
          </button>
        </div>

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercent = Math.round((achievement.progress / achievement.target) * 100);
              
              return (
                <Card
                  key={achievement.id}
                  className={achievement.unlocked ? 'bg-gradient-to-br from-primary/5 to-accent/5' : ''}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        achievement.unlocked
                          ? 'bg-opacity-20'
                          : 'bg-gray-100'
                      }`}
                      style={{ backgroundColor: achievement.unlocked ? `${achievement.color}20` : undefined }}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          achievement.unlocked ? '' : 'text-gray-400'
                        }`}
                        style={{ color: achievement.unlocked ? achievement.color : undefined }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-display text-lg mb-1 ${achievement.unlocked ? '' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-textLight">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  {!achievement.unlocked && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-textLight mb-1">
                        <span>进度</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: achievement.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="text-center">
                    <div
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: stat.color }} />
                    </div>
                    <p className="text-2xl font-display" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-textLight">{stat.label}</p>
                  </Card>
                );
              })}
            </div>

            <Card title="本周学习情况">
              <div className="flex items-end justify-between h-48 gap-4">
                {weeklyData.map((item) => {
                  const maxTime = Math.max(...weeklyData.map(d => d.studyTime));
                  const height = (item.studyTime / maxTime) * 100;
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full bg-primary/20 rounded-t-xl transition-all duration-500" style={{ height: `${height}%`, minHeight: '20px' }}>
                          <div className="w-full h-full bg-gradient-to-t from-primary to-accent rounded-t-xl" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-text mt-2">{item.studyTime}分钟</p>
                      <p className="text-xs text-textLight">{item.day}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="学习建议">
              <div className="space-y-4">
                {[
                  {
                    title: '继续保持学习节奏',
                    content: '你已经连续学习了7天，非常棒！继续保持这个节奏，知识会越积越多。',
                    color: 'bg-green-50 border-green-200',
                  },
                  {
                    title: '注意复习错题',
                    content: `你目前有${mistakes.length}道错题，建议定期复习错题本，巩固薄弱知识点。`,
                    color: 'bg-yellow-50 border-yellow-200',
                  },
                  {
                    title: '挑战更高难度',
                    content: '基础知识掌握得不错，可以尝试挑战更高难度的题目，提升思维能力。',
                    color: 'bg-blue-50 border-blue-200',
                  },
                ].map((suggestion, index) => (
                  <div key={index} className={`p-4 rounded-xl ${suggestion.color}`}>
                    <h4 className="font-semibold text-text mb-2">{suggestion.title}</h4>
                    <p className="text-sm text-textLight">{suggestion.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};