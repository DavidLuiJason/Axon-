import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Video,
  Music,
  Sliders,
  Sparkles,
  Scissors,
  Layers,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoEditorScreen: React.FC = () => {
  const { showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => (prev >= 40 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  return (
    <div
      id="video-editor-screen"
      className="flex-1 overflow-y-auto bg-black text-white p-3 flex flex-col select-none"
    >
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col space-y-3">
        {/* Video Canvas / Preview */}
        <div className="relative aspect-video w-full rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center group shadow-xl">
          {/* Animated or stylish visual placeholder matching mockup */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-black/40 flex flex-col justify-between p-3 pointer-events-none">
            <span className="text-[11px] font-mono bg-black/60 px-2 py-0.5 rounded border border-white/10 self-start">
              1080p • 30fps
            </span>
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span className="font-mono">{formatTime(currentTime)} / 00:40</span>
              <span className="text-[10px] text-neutral-400">Track 1 Active</span>
            </div>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mx-auto mb-2 text-white">
              <Video className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium text-neutral-300">Video Canvas Viewport</p>
            <p className="text-[10px] text-neutral-500">Multitrack rendering shell</p>
          </div>
        </div>

        {/* Transport Controls Bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg active:scale-95"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 active:scale-95 shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentTime((t) => Math.min(40, t + 5))}
            className="p-2 text-neutral-400 hover:text-white rounded-lg active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => showToast('Fullscreen preview')}
            className="p-2 text-neutral-400 hover:text-white rounded-lg active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Multitrack Timeline & Waveform Area (Phone 4 in Mockup) */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-3 space-y-2">
          {/* Time ruler */}
          <div className="flex justify-between text-[10px] font-mono text-neutral-500 px-1 border-b border-neutral-800 pb-1">
            <span>00:00</span>
            <span>00:10</span>
            <span>00:20</span>
            <span>00:40</span>
          </div>

          {/* Track 1: Video frames strip */}
          <div className="h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center px-2 relative overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_8px_white]"
              style={{ left: `${(currentTime / 40) * 100}%` }}
            />
            <div className="flex items-center gap-1.5 w-full opacity-70">
              <span className="text-[10px] text-neutral-400 font-medium shrink-0">V1</span>
              <div className="flex-1 h-6 rounded bg-neutral-800/80 border border-neutral-700/50 flex items-center px-2 text-[10px] text-neutral-300">
                Clip_01_neural.mp4
              </div>
            </div>
          </div>

          {/* Track 2: Audio Waveform sequence */}
          <div className="h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center px-2 relative overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_8px_white]"
              style={{ left: `${(currentTime / 40) * 100}%` }}
            />
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-[10px] text-neutral-400 font-medium shrink-0">A1</span>
              {/* Synthetic audio wave visualizer */}
              <div className="flex-1 h-8 rounded bg-neutral-800/60 border border-neutral-700/50 flex items-center justify-around px-2">
                {[14, 28, 18, 32, 22, 10, 26, 30, 16, 24, 8, 20, 32, 18, 24, 12, 28, 16, 22].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/70 rounded-full"
                      style={{ height: `${h}px` }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom editing quick actions */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {[
            { label: 'Split', icon: Scissors, action: () => showToast('Split clip at cursor') },
            { label: 'Audio', icon: Music, action: () => showToast('Audio waveform tools') },
            { label: 'Filter', icon: Sparkles, action: () => showToast('Neural color grading') },
            { label: 'Adjust', icon: Sliders, action: () => showToast('Exposure & contrast') },
            { label: 'Layers', icon: Layers, action: () => showToast('Multitrack layer manager') },
          ].map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={btn.action}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 active:scale-95 transition-all text-neutral-300 hover:text-white"
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-medium">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
