import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  Sparkles,
  ArrowLeft,
  Play,
  Terminal,
  Lightbulb,
  Check,
  Copy,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import { BASE_CODING_KNOWLEDGE_PACK } from '../../lib/knowledgePacks';
import { KnowledgePackLesson } from '../../types';

interface KnowledgePackViewProps {
  onBack?: () => void;
  onTryCode: (code: string, language: string) => void;
  initialLessonId?: string;
}

export const KnowledgePackView: React.FC<KnowledgePackViewProps> = ({
  onBack,
  onTryCode,
  initialLessonId,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<KnowledgePackLesson | null>(() => {
    if (initialLessonId) {
      return (
        BASE_CODING_KNOWLEDGE_PACK.lessons.find((l) => l.id === initialLessonId) ||
        BASE_CODING_KNOWLEDGE_PACK.lessons[0]
      );
    }
    return null;
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunLessonCode = (lesson: KnowledgePackLesson) => {
    onTryCode(lesson.realCode, lesson.language);
  };

  return (
    <div id="knowledge-pack-view" className="space-y-4 select-none pb-8">
      {/* Base Pack Header Card */}
      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-black font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {BASE_CODING_KNOWLEDGE_PACK.title}
                </h3>
                {/* Permanent Base Pack Badge: CANNOT be deleted */}
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 font-mono">
                  <Lock className="w-2.5 h-2.5 text-neutral-400" />
                  <span>Base Pack (Permanent)</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {BASE_CODING_KNOWLEDGE_PACK.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
          <span>{BASE_CODING_KNOWLEDGE_PACK.lessons.length} Fundamental Lessons</span>
          <span className="font-mono text-neutral-400">v{BASE_CODING_KNOWLEDGE_PACK.version} • Offline</span>
        </div>
      </div>

      {/* If a lesson is currently open */}
      {selectedLesson ? (
        <div className="space-y-3 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={() => setSelectedLesson(null)}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Lessons</span>
          </button>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                {selectedLesson.category}
              </span>
              <h4 className="text-base font-bold text-white mt-1.5">{selectedLesson.title}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{selectedLesson.description}</p>
            </div>

            {/* Explanation */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-850 text-xs leading-relaxed text-neutral-300">
              <p className="font-semibold text-white mb-1">Concept Overview:</p>
              <p>{selectedLesson.explanation}</p>
            </div>

            {/* Shorthand vs Real Code */}
            {selectedLesson.shorthandCode && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-neutral-400">Shorthand Format:</span>
                <pre className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-200 whitespace-pre-wrap">
                  {selectedLesson.shorthandCode}
                </pre>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  <span>Real Code ({selectedLesson.language}):</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedLesson.realCode)}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <pre className="p-2.5 rounded-xl bg-black border border-neutral-900 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {selectedLesson.realCode}
              </pre>
            </div>

            {/* Practical Tip */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-2 text-xs text-neutral-300">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Rule of Thumb:</p>
                <p className="text-neutral-400 mt-0.5">{selectedLesson.practicalTip}</p>
              </div>
            </div>

            {/* Try it in AXON Code Runner Button */}
            <button
              type="button"
              onClick={() => handleRunLessonCode(selectedLesson)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all shadow-md mt-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Try this in AXON Code Runner</span>
            </button>
          </div>
        </div>
      ) : (
        /* Lessons Checklist */
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
            Fundamental Lessons
          </span>
          <div className="space-y-1.5">
            {BASE_CODING_KNOWLEDGE_PACK.lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedLesson(lesson)}
                className="w-full p-3 rounded-xl bg-neutral-900/70 hover:bg-neutral-850 border border-neutral-800 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-neutral-800 text-neutral-400 group-hover:text-white flex items-center justify-center text-xs font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white group-hover:text-neutral-100 truncate">
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {lesson.category} • {lesson.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors ml-2" />
              </button>
            ))}
          </div>

          {/* Downloadable Packs System Placeholder */}
          <div className="pt-4 border-t border-neutral-900">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-850 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-neutral-400" />
                <span>Specialized Knowledge Packs (Downloadable packs coming in a later part)</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400">
                Modular Ready
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
