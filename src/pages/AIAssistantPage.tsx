import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ChevronDown, ChevronUp, HelpCircle, BookOpen, Brain } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { aiExplain } from '../data/api/ai';

export const AIAssistantPage: React.FC = () => {
  const { chatHistory, addChatMessage } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    addChatMessage({ sender: 'user', content: userMessage });
    setInputValue('');
    setIsLoading(true);

    const result = await aiExplain(userMessage);
    addChatMessage({
      sender: 'ai',
      content: result.explanation,
      metadata: {
        deepExplanation: result.deepExplanation,
        relatedTopics: result.relatedTopics,
      },
    });

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    '为什么0不能做除数？',
    '什么是乘法分配律？',
    '为什么三角形内角和是180度？',
    '小数和分数有什么关系？',
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Header title="AI助手" showBack />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl text-text mb-1">嗨，我是你的AI老师！</h2>
              <p className="text-textLight">有什么问题随时问我，我会用最简单的方式给你讲解。</p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">常见问题</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(question);
                }}
                className="p-3 bg-gray-50 hover:bg-primary/10 rounded-xl text-left transition-all text-sm"
              >
                <span className="text-textLight mr-2">Q.</span>
                <span className="text-text">{question}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-text">学习小贴士</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: BookOpen, text: '遇到不懂的问题可以随时问我，我会耐心解答！' },
              { icon: Sparkles, text: '每天学习一点新知识，积少成多！' },
            ].map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-text text-sm">{tip.text}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-white shadow-card">
          <div className="h-80 overflow-y-auto space-y-4 mb-4 pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-lg text-text mb-2">开始提问吧！</h3>
                <p className="text-textLight">输入你想了解的数学问题，AI老师来帮你解答。</p>
              </div>
            ) : (
              chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gradient-to-br from-primary to-accent text-white'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <span className="text-sm font-bold">{message.content[0]}</span>
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-gray-100 text-text rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.sender === 'ai' && message.metadata && (
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setExpandedId(expandedId === message.id ? null : message.id)
                          }
                          className="flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors"
                        >
                          {expandedId === message.id ? (
                            <>
                              <span>收起深入理解</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>查看深入理解</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                        {expandedId === message.id && (
                          <div className="mt-2 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-text mb-3">
                              <span className="font-semibold text-blue-700">深入理解：</span>
                              {message.metadata.deepExplanation}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs text-blue-600">相关知识：</span>
                              {message.metadata.relatedTopics.map((topic: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none h-16 text-text"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-button'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
};