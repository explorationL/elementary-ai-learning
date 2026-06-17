import React, { type ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl shadow-card p-6 transition-all duration-300 ${
        hover ? 'cursor-pointer hover:shadow-button hover:scale-[1.02]' : ''
      } ${className}`}
    >
      {title && (
        <h3 className="font-display text-lg text-text mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};
