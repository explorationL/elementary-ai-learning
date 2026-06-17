import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, BookOpen, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/helpers';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigate = useNavigate();
  const { user, energy } = useApp();

  return (
    <header className="bg-gradient-to-r from-primary to-accent text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="font-display text-xl md:text-2xl">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">{energy}</span>
            <span className="text-sm opacity-80">能量</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
            <span className="text-sm opacity-80">学习</span>
            <span className="font-semibold">{formatTime(user.studyTime)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white/50"
            />
            <span className="hidden md:block font-semibold">{user.name}</span>
          </div>
          
          <button className="md:hidden p-2 rounded-full hover:bg-white/20 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
