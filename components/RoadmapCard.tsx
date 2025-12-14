import React from 'react';
import { RoadmapItem } from '../types';

const RoadmapCard: React.FC<{ item: RoadmapItem }> = ({ item }) => {
  const priorityColors = {
    High: 'bg-red-500/10 text-red-400 border-red-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const categoryIcons: Record<string, string> = {
    'Code Quality': '⚡',
    'Documentation': '📄',
    'Testing': '🧪',
    'DevOps': '🚀',
    'Structure': '📂',
  };

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <span className="text-2xl">{categoryIcons[item.category] || '🔹'}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-white">{item.title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[item.priority]}`}>
            {item.priority}
          </span>
        </div>
        <p className="text-sm text-slate-400">{item.description}</p>
      </div>
    </div>
  );
};

export default RoadmapCard;
