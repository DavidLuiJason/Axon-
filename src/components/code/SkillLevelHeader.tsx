import React from 'react';
import { Compass, Sparkles, Terminal, Code2, ShieldAlert } from 'lucide-react';
import { CodeSkillLevel } from '../../types';

interface SkillLevelHeaderProps {
  currentLevel: CodeSkillLevel;
  onSelectLevel: (level: CodeSkillLevel) => void;
}

export const SkillLevelHeader: React.FC<SkillLevelHeaderProps> = ({
  currentLevel,
  onSelectLevel,
}) => {
  const levels: Array<{
    id: CodeSkillLevel;
    label: string;
    badge: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'guided',
      label: 'Guided',
      badge: 'Beginner',
      description: 'Step-by-step guidance, shorthand syntax & motivational coaching',
      icon: Compass,
    },
    {
      id: 'assisted',
      label: 'Assisted',
      badge: 'Intermediate',
      description: 'More autonomy with inline explanations and syntax tips',
      icon: Sparkles,
    },
    {
      id: 'developer',
      label: 'Developer',
      badge: 'Advanced',
      description: 'Direct code editor, console diagnostics and script saving',
      icon: Code2,
    },
    {
      id: 'expert',
      label: 'Expert',
      badge: 'Pro Engine',
      description: 'Full sandbox access, performance profiling & raw execution',
      icon: Terminal,
    },
  ];

  return (
    <div
      id="skill-level-switcher"
      className="p-2 bg-neutral-950 border-b border-neutral-800/80 select-none"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Coding Skill Mode
        </span>
        <span className="text-[11px] text-neutral-400 font-mono">
          {levels.find((l) => l.id === currentLevel)?.badge}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
        {levels.map((lvl) => {
          const isActive = currentLevel === lvl.id;
          const Icon = lvl.icon;

          return (
            <button
              key={lvl.id}
              id={`skill-mode-btn-${lvl.id}`}
              type="button"
              onClick={() => onSelectLevel(lvl.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-center transition-all ${
                isActive
                  ? 'bg-white text-black shadow-md font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
              title={lvl.description}
            >
              <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
              <span className="text-xs truncate w-full">{lvl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
