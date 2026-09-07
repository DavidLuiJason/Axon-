import React from 'react';
import {
  Cpu,
  BookOpen,
  FileCode,
  MessageSquare,
  Zap,
  Terminal,
  Layers,
  ArrowDownRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetCategory } from '../../types';
import { formatBytes } from '../../lib/storageManifest';

interface StorageCategoryBreakdownProps {
  selectedCategory: AssetCategory | 'all';
  onSelectCategory: (cat: AssetCategory | 'all') => void;
}

export const StorageCategoryBreakdown: React.FC<StorageCategoryBreakdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { storageBreakdown } = useApp();

  const categories: Array<{
    id: AssetCategory;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'model',
      title: 'AI Models & Weights',
      desc: 'Neural checkpoints & tokenizers',
      icon: Cpu,
    },
    {
      id: 'knowledge_pack',
      title: 'Knowledge Packs',
      desc: 'Offline reference & lesson bases',
      icon: BookOpen,
    },
    {
      id: 'cache',
      title: 'Cache & Embeddings',
      desc: 'Vector indices & sandbox ASTs',
      icon: Zap,
    },
    {
      id: 'user_file',
      title: 'User Files & Media',
      desc: 'Projects, scripts & assets',
      icon: FileCode,
    },
    {
      id: 'chat_history',
      title: 'Chat History',
      desc: 'Transcripts & session records',
      icon: MessageSquare,
    },
    {
      id: 'system',
      title: 'System & Telemetry',
      desc: 'Execution traces & indices',
      icon: Terminal,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Space Breakdown by Category
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`text-[11px] px-2 py-0.5 rounded-lg transition-colors font-medium ${
            selectedCategory === 'all'
              ? 'bg-white text-black font-semibold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
        >
          View All ({storageBreakdown.totalStoredBytes ? formatBytes(storageBreakdown.totalStoredBytes) : '0 B'})
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((cat) => {
          const stats = storageBreakdown.categoryBreakdown[cat.id] || {
            count: 0,
            storedBytes: 0,
            originalBytes: 0,
            percentOfTotal: 0,
          };
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          const savedBytes = Math.max(0, stats.originalBytes - stats.storedBytes);

          return (
            <button
              key={cat.id}
              id={`storage-cat-card-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-neutral-800/90 border-white text-white shadow-lg'
                  : 'bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800/80 text-neutral-300'
              }`}
            >
              {/* Category Icon & Count */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-black/40 text-neutral-400">
                  {stats.count} {stats.count === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Title & Size */}
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {cat.title}
                </div>
                <div className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {formatBytes(stats.storedBytes)}
                </div>
              </div>

              {/* Compression indicator or percent */}
              <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
                <span>{stats.percentOfTotal.toFixed(1)}% of used</span>
                {savedBytes > 0 && (
                  <span className="flex items-center gap-0.5 text-emerald-400 font-medium font-mono">
                    <ArrowDownRight className="w-3 h-3" />
                    -{formatBytes(savedBytes)}
                  </span>
                )}
              </div>

              {/* Small active indicator bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
