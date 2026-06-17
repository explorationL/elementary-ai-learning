import React from 'react';
import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
        isUser ? 'bg-primary' : 'bg-accent'
      } flex items-center justify-center`}>
        {isUser ? (
          <span className="text-white text-xs font-bold">我</span>
        ) : (
          <span className="text-white text-xs font-bold">AI</span>
        )}
      </div>
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-primary to-accent text-white rounded-br-md'
            : 'bg-white text-text rounded-bl-md shadow-card'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-textLight mt-1 px-1">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
