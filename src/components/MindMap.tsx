import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Circle } from 'lucide-react';
import type { KnowledgePoint } from '../types';

interface MindMapProps {
  title: string;
  items: KnowledgePoint[];
  onSelect?: (item: KnowledgePoint) => void;
  selectedId?: string;
}

interface TreeNodeProps {
  item: KnowledgePoint;
  _level: number;
  onSelect?: (item: KnowledgePoint) => void;
  selectedId?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, onSelect, selectedId }) => {
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedId === item.id;

  return (
    <div className="ml-4">
      <div
        onClick={() => {
          setExpanded(!expanded);
          onSelect?.(item);
        }}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${
          isSelected
            ? 'bg-primary/20 text-primary'
            : 'hover:bg-gray-100 text-text'
        }`}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
        <Circle className="w-3 h-3 flex-shrink-0" fill="currentColor" />
        <span className="font-medium text-sm">{item.name}</span>
      </div>
      {expanded && (
        <div className="ml-6 mt-2 space-y-1">
          <div className="text-xs text-textLight bg-gray-50 p-2 rounded-lg">
            <span className="font-semibold text-primary">定义：</span>{item.definition}
          </div>
        </div>
      )}
    </div>
  );
};

export const MindMap: React.FC<MindMapProps> = ({ title, items, onSelect, selectedId }) => {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6">
      <h3 className="font-display text-lg text-text mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeWidth={1.5} />
          <path d="M8 12l2 2 4-4" strokeWidth={1.5} />
        </svg>
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <TreeNode
            key={item.id}
            item={item}
            _level={1}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  );
};
