import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, BookOpen, PenTool, BookX, MessageCircle, Rocket } from 'lucide-react';

interface NavigationProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/knowledge-map/math', label: '知识地图', icon: Map },
  { path: '/learn/math/math-4b-1', label: '学习', icon: BookOpen },
  { path: '/practice/math/math-4b-1', label: '练习', icon: PenTool },
  { path: '/mistakes', label: '错题本', icon: BookX },
  { path: '/ai-assistant', label: 'AI助手', icon: MessageCircle },
  { path: '/growth', label: '成长中心', icon: Rocket },
];

export const Navigation: React.FC<NavigationProps> = ({ isMobile = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white w-full rounded-t-3xl p-6 animate-slideIn">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-button'
                      : 'text-text hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold text-lg">{item.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 bg-gray-100 rounded-xl font-semibold text-text"
          >
            关闭菜单
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:relative md:border-none md:shadow-none md:bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-around items-center md:flex-col md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-3 md:px-6 md:py-4 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary md:bg-primary md:text-white'
                    : 'text-gray-500 md:hover:text-primary md:hover:bg-primary/10'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
