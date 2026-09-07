import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Terminal,
  Play,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Check,
  Copy,
  Info,
} from 'lucide-react';
import { translateUserCommand } from '../../lib/commandTranslator';
import { TranslatedCommand } from '../../types';

interface CommandTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCode: (code: string, language: string) => void;
  onLearnMore: (lessonId?: string) => void;
}

export const CommandTranslatorModal: React.FC<CommandTranslatorModalProps> = ({
  isOpen,
  onClose,
  onRunCode,
  onLearnMore,
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TranslatedCommand | null>(() =>
    translateUserCommand('make a button that changes color when tapped')
  );
  const [copied, setCopied] = useState(false);
  const [isDeepExplanationOpen, setIsDeepExplanationOpen] = useState(false);

  if (!isOpen) return null;

  const samplePrompts = [
    'make a button that changes color when tapped',
    'install Python',
    'roll a dice',
    'count words in a sentence',
    'make a countdown timer',
  ];

  const handleTranslate = (text: string) => {
    if (!text.trim()) return;
    const res = translateUserCommand(text.trim());
    setResult(res);
    setIsDeepExplanationOpen(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    if (result) {
      onRunCode(result.commandOrCode, result.language);
      onClose();
    }
  };

  const handleLearn = () => {
    if (result) {
      onLearnMore(result.relatedLessonId);
      onClose();
    }
  };

  return (
    <div
      id="command-translator-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AXON Command Translator</h3>
              <p className="text-[11px] text-neutral-400">
                Describe in plain language — AXON outputs real underlying code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Input field */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium">
              What do you want to accomplish?
            </label>
            <div className="flex gap-2">
              <input
                id="translator-input-field"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTranslate(query)}
                placeholder="e.g. 'install Python' or 'make a button that changes color'"
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="button"
                onClick={() => handleTranslate(query)}
                className="px-3 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 active:scale-95 transition-all"
              >
                Translate
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  handleTranslate(prompt);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Translation Result Card */}
          {result && (
            <div className="space-y-3 pt-2 border-t border-neutral-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Real Underlying Code / Command</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                  {result.language}
                </span>
              </div>

              {/* Code snippet block */}
              <div className="rounded-xl bg-black border border-neutral-800 p-3 font-mono text-xs text-neutral-200 relative group">
                <button
                  type="button"
                  onClick={() => handleCopy(result.commandOrCode)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <pre className="overflow-x-auto whitespace-pre-wrap pr-8 text-[11px] leading-relaxed text-emerald-300">
                  {result.commandOrCode}
                </pre>
              </div>

              {/* Explanation & Why it works */}
              <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-800/80 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">What this does:</p>
                    <p className="text-neutral-300 mt-0.5 leading-relaxed">{result.explanation}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/60">
                  <p className="font-semibold text-neutral-300">Why it works:</p>
                  <p className="text-neutral-400 mt-0.5 leading-relaxed">{result.why}</p>
                </div>

                {isDeepExplanationOpen && (
                  <div className="pt-2 border-t border-neutral-800/60 text-neutral-300 space-y-1.5 animate-in fade-in duration-150">
                    <p className="font-semibold text-white">Deep Line-by-Line Breakdown:</p>
                    <p className="text-[11px] text-neutral-400">
                      When software executes this, the phone runtime parses tokens, allocates required variables in memory, registers lifecycle listeners, and runs instructions sequentially without blocking your mobile UI thread.
                    </p>
                  </div>
                )}
              </div>

              {/* 3 Explicit Required Options: Run it, Explain it further, Learn more about it */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* 1. Run it */}
                <button
                  id="translator-run-btn"
                  type="button"
                  onClick={handleRun}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Run it</span>
                </button>

                {/* 2. Explain it further */}
                <button
                  id="translator-explain-btn"
                  type="button"
                  onClick={() => setIsDeepExplanationOpen(!isDeepExplanationOpen)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                    isDeepExplanationOpen
                      ? 'bg-neutral-800 border-neutral-600 text-white'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isDeepExplanationOpen ? 'Hide Details' : 'Explain further'}</span>
                </button>

                {/* 3. Learn more about it */}
                <button
                  id="translator-learn-btn"
                  type="button"
                  onClick={handleLearn}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-850 text-xs font-medium transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Learn more</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
