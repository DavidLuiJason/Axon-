import React, { useState } from 'react';
import {
  MessageSquare,
  Wrench,
  Code2,
  Zap,
  Video,
  FileText,
  Settings,
  X,
  Sliders,
  ChevronRight,
  Shield,
  Sparkles,
  Folder,
  HardDrive,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AxonLogo } from './AxonLogo';
import { ScreenId } from '../types';
import { ProjectSwitcherModal } from './ProjectSwitcherModal';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { currentScreen, navigateTo, icons, notes, activeProject, projects, switchProject } = useApp();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  // Touch tracking for swipe-to-close
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Swiped left by more than 50px horizontally -> close drawer
    if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY) * 1.2) {
      onClose();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen) return null;

  const navItems: Array<{
    id: ScreenId;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: 'axon',
      label: 'AXON Workspace',
      description: 'Dual-pane AI conversation & build view',
      icon: MessageSquare,
    },
    {
      id: 'tools',
      label: 'Tools Menu',
      description: 'Upload, plugins & smart extensions',
      icon: Wrench,
    },
    {
      id: 'code',
      label: 'AXON Code',
      description: 'Coding workspace & runtime preview',
      icon: Code2,
    },
    {
      id: 'automation',
      label: 'Automation & Run Code',
      description: 'Conditional triggers & live script layer',
      icon: Zap,
    },
    {
      id: 'notes',
      label: 'Library',
      description: 'Context notes, chat extracts, analysis & docs',
      icon: FileText,
      badge: notes.length > 0 ? String(notes.length) : undefined,
    },
    {
      id: 'video_editor',
      label: 'Video Editor',
      description: 'Timeline editor & waveform synthesizer',
      icon: Video,
    },
    {
      id: 'storage',
      label: 'Storage & Manifest',
      description: '15GB budget, manifest tracking & compression',
      icon: HardDrive,
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Theme, icon, avatar & workspace data',
      icon: Settings,
    },
  ];

  const handleSelect = (id: ScreenId) => {
    navigateTo(id);
    onClose();
  };

  return (
    <div
      id="hamburger-overlay"
      className="fixed inset-0 z-50 flex bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="hamburger-drawer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-80 max-w-[85vw] h-full bg-neutral-950 border-r border-neutral-800/80 flex flex-col shadow-2xl text-white select-none animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Branding and active App Icon */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AxonLogo
              size={36}
              preset={icons.appIconType === 'preset' ? icons.appIconPreset : undefined}
              customUrl={icons.appIconType === 'custom' ? icons.appIconCustomUrl : undefined}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-base text-white">AXON</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Mobile Hub
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Swipe left to close</p>
            </div>
          </div>
          <button
            id="hamburger-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Projects Drawer Section */}
        <div className="px-3 pt-3 pb-1 border-b border-neutral-900">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Projects Drawer ({projects.length})
            </span>
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="text-[10px] text-neutral-400 hover:text-white font-medium"
            >
              + New / Manage
            </button>
          </div>

          {/* Active project card */}
          <button
            id="hamburger-project-selector-btn"
            type="button"
            onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
            className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-all group text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: activeProject.color || '#ffffff' }}
              />
              <div className="min-w-0">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Active Project
                </div>
                <div className="text-xs font-semibold text-white truncate group-hover:text-neutral-200">
                  {activeProject.name}
                </div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700 transition-colors shrink-0">
              {isProjectsExpanded ? 'Hide' : 'Expand'}
            </span>
          </button>

          {/* Expanded Projects List */}
          {isProjectsExpanded && (
            <div className="mt-2 space-y-1 max-h-36 overflow-y-auto p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    switchProject(proj.id);
                    setIsProjectsExpanded(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    proj.id === activeProject.id
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color || '#ffffff' }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </div>
                  {proj.id === activeProject.id && (
                    <span className="text-[10px] text-emerald-400 font-mono">Current</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`hamburger-nav-${item.id}`}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-neutral-800/90 text-white font-medium shadow-sm border border-neutral-700'
                    : 'text-neutral-300 hover:bg-neutral-900/80 hover:text-white'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-none flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-1">{item.description}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'
                  }`}
                />
              </button>
            );
          })}

          {/* Reserved Placeholder Slot as strictly required by prompt */}
          <div className="pt-3 pb-1 px-3">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Future Extensions
            </div>
          </div>

          <div
            id="hamburger-reserved-slot"
            className="mx-2 p-3 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 text-neutral-400 space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-medium text-neutral-300">Reserved Feature Slot</span>
              </div>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                Future Toggle
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-snug">
              Reserved space for the upcoming toggle feature. Ready for next prompt integration.
            </p>
          </div>
        </div>

        {/* Footer info & device target note */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/80">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>Target: 4GB / 64GB Mobile</span>
            </span>
            <span className="font-mono text-[10px] text-neutral-400">v0.1</span>
          </div>
        </div>
      </div>

      {/* Project Switcher Modal */}
      <ProjectSwitcherModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
};
