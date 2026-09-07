import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ChatPane } from './ChatPane';
import { WorkspacePane } from './WorkspacePane';
import { GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export const DualPaneContainer: React.FC = () => {
  const {
    paneViewState,
    setPaneViewState,
    splitRatio,
    setSplitRatio,
  } = useApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle pointer/touch dragging
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const percentage = (relativeX / rect.width) * 100;
      setSplitRatio(percentage);
    },
    [setSplitRatio]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      handlePointerMove(e.clientX);
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      handlePointerMove(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handlePointerMove]);

  // Handle touch swipe on mobile across panes
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Only detect predominantly horizontal swipes
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < -50) {
        // Swiped left -> move rightwards (Chat -> Split -> Workspace)
        if (paneViewState === 'chat-only') {
          setPaneViewState('split');
        } else if (paneViewState === 'split') {
          setPaneViewState('workspace-only');
        }
      } else if (diffX > 50) {
        // Swiped right -> move leftwards (Workspace -> Split -> Chat)
        if (paneViewState === 'workspace-only') {
          setPaneViewState('split');
        } else if (paneViewState === 'split') {
          setPaneViewState('chat-only');
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Determine width styles based on splitRatio
  const chatWidthStyle =
    splitRatio >= 98
      ? '100%'
      : splitRatio <= 2
      ? '0%'
      : `${splitRatio}%`;

  const workspaceWidthStyle =
    splitRatio <= 2
      ? '100%'
      : splitRatio >= 98
      ? '0%'
      : `${100 - splitRatio}%`;

  return (
    <div
      ref={containerRef}
      id="dual-pane-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative flex-1 w-full flex overflow-hidden select-none ${
        isDragging ? 'cursor-col-resize' : ''
      }`}
    >
      {/* Left Pane: Chat */}
      <div
        id="dual-pane-left"
        style={{ width: chatWidthStyle }}
        className={`h-full overflow-hidden transition-[width] ${
          isDragging ? 'duration-0' : 'duration-200 ease-out'
        } ${splitRatio <= 2 ? 'hidden pointer-events-none' : 'flex flex-col'}`}
      >
        <ChatPane />
      </div>

      {/* Draggable Divider Bar */}
      <div
        id="dual-pane-divider"
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
        className={`relative z-30 flex items-center justify-center cursor-col-resize select-none shrink-0 ${
          splitRatio <= 2 || splitRatio >= 98
            ? 'w-4 hover:w-6 bg-neutral-900/80 hover:bg-neutral-800'
            : 'w-2 sm:w-3 bg-neutral-900 hover:bg-neutral-800 border-x border-neutral-800'
        } transition-colors group`}
        title="Drag horizontally to resize panes, or drag to extreme edges"
      >
        {/* Visual Pill Handle */}
        <div
          className={`h-12 w-1.5 rounded-full transition-all ${
            isDragging
              ? 'bg-white shadow-lg'
              : 'bg-neutral-600 group-hover:bg-neutral-300'
          }`}
        />

        {/* Quick edge chevron arrows when at extreme ends */}
        {splitRatio >= 98 && (
          <button
            type="button"
            onClick={() => setPaneViewState('split')}
            className="absolute left-0 p-1 text-neutral-400 hover:text-white"
            title="Open Workspace"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
        {splitRatio <= 2 && (
          <button
            type="button"
            onClick={() => setPaneViewState('split')}
            className="absolute right-0 p-1 text-neutral-400 hover:text-white"
            title="Open Chat"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Pane: Workspace / Build view */}
      <div
        id="dual-pane-right"
        style={{ width: workspaceWidthStyle }}
        className={`h-full overflow-hidden transition-[width] ${
          isDragging ? 'duration-0' : 'duration-200 ease-out'
        } ${splitRatio >= 98 ? 'hidden pointer-events-none' : 'flex flex-col'}`}
      >
        <WorkspacePane />
      </div>
    </div>
  );
};
