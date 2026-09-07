import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Check,
  Copy,
  Terminal,
  Eye,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';
import {
  BEGINNER_PRESETS,
  convertShorthandToRealCode,
  ShorthandConversionResult,
  ShorthandPreset,
} from '../../lib/shorthandConverter';
import { executeJavaScript } from '../../lib/codeRunner';
import { ExecutionResult } from '../../types';

interface GuidedModeViewProps {
  onOpenTranslator: () => void;
  onOpenKnowledgePack: () => void;
}

export const GuidedModeView: React.FC<GuidedModeViewProps> = ({
  onOpenTranslator,
  onOpenKnowledgePack,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ShorthandPreset>(BEGINNER_PRESETS[0]);
  const [shorthandInput, setShorthandInput] = useState<string>(BEGINNER_PRESETS[0].shorthandCode);
  const [conversionResult, setConversionResult] = useState<ShorthandConversionResult | null>(() =>
    convertShorthandToRealCode(BEGINNER_PRESETS[0].shorthandCode)
  );
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [viewTab, setViewTab] = useState<'comparison' | 'console' | 'preview'>('comparison');
  const [copiedRealCode, setCopiedRealCode] = useState(false);

  const handleSelectPreset = (preset: ShorthandPreset) => {
    setSelectedPreset(preset);
    setShorthandInput(preset.shorthandCode);
    const converted = convertShorthandToRealCode(preset.shorthandCode);
    setConversionResult(converted);
    setExecutionResult(null);
    setViewTab('comparison');
  };

  const handleConvertAndRun = async () => {
    setIsRunning(true);
    const converted = convertShorthandToRealCode(shorthandInput);
    setConversionResult(converted);

    // Execute in phone-optimized lightweight runner
    const res = await executeJavaScript(converted.realJavaScript);
    setExecutionResult(res);
    setIsRunning(false);

    if (converted.hasInteractiveUI) {
      setViewTab('preview');
    } else {
      setViewTab('comparison');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedRealCode(true);
    setTimeout(() => setCopiedRealCode(false), 2000);
  };

  return (
    <div id="axon-code-guided-view" className="space-y-4 select-none pb-8">
      {/* Proactive Welcome Card (Crucial Guided Mode Requirement) */}
      <div
        id="guided-proactive-welcome"
        className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
            A
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Hi! What would you like to build or code today?
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              In Guided Mode, you don't need complex syntax. Write in simple shorthand, and AXON
              will turn it into real, working code while showing you how it works side-by-side!
            </p>
          </div>
        </div>

        {/* Proactive Starter Action Cards */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
            Choose an idea to start with:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BEGINNER_PRESETS.map((p) => {
              const isSelected = selectedPreset.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-neutral-800 border-white text-white shadow-md'
                      : 'bg-neutral-950/80 border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <p className="text-xs font-semibold truncate text-white">{p.title}</p>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{p.category}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simplified Shorthand Input Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neutral-300" />
            <span className="text-xs font-semibold text-white">Your Shorthand Instructions</span>
          </div>
          <button
            type="button"
            onClick={onOpenTranslator}
            className="text-[11px] text-neutral-400 hover:text-white underline transition-colors"
          >
            Translate Plain English
          </button>
        </div>

        <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-3 space-y-2 focus-within:border-neutral-600 transition-colors">
          <textarea
            id="shorthand-input-area"
            value={shorthandInput}
            onChange={(e) => setShorthandInput(e.target.value)}
            rows={3}
            className="w-full bg-transparent resize-none focus:outline-none font-mono text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 leading-relaxed"
            placeholder="Type simplified shorthand, e.g. show 'Hello AXON' or button 'Click Me' -> show 'Tapped!'"
            spellCheck={false}
          />

          <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
            <span className="text-[11px] text-neutral-500 font-mono">
              Simple format • Auto-converts to JavaScript
            </span>

            <button
              id="convert-and-run-btn"
              type="button"
              onClick={handleConvertAndRun}
              disabled={isRunning || !shorthandInput.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{isRunning ? 'Running...' : 'Convert & Run'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Motivational & Encouragement Banner */}
      {conversionResult && (
        <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2 text-xs text-neutral-300">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{conversionResult.encouragingComment}</span>
        </div>
      )}

      {/* Results View Tabs (Comparison vs Console vs Preview) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewTab('comparison')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'comparison'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Code Comparison
            </button>

            <button
              type="button"
              onClick={() => setViewTab('console')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewTab === 'console'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Output Console
            </button>

            {conversionResult?.hasInteractiveUI && (
              <button
                type="button"
                onClick={() => setViewTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewTab === 'preview'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Live Interactive UI</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenKnowledgePack}
            className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Base Pack</span>
          </button>
        </div>

        {/* TAB 1: Side-by-side / Dual Comparison View (Crucial Requirement) */}
        {viewTab === 'comparison' && conversionResult && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Real Code Result */}
            <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Real Code Produced (JavaScript)</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(conversionResult.realJavaScript)}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Copy real code"
                >
                  {copiedRealCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <pre className="p-2.5 rounded-xl bg-black border border-neutral-900 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {conversionResult.realJavaScript}
              </pre>
            </div>

            {/* Line-by-Line Learning Comparisons */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                What changed & why:
              </span>
              <div className="space-y-2">
                {conversionResult.comparisons.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono text-[11px]">
                      <span className="text-neutral-400">
                        Input: <span className="text-white font-medium">"{item.shorthandLine}"</span>
                      </span>
                      <span className="text-emerald-400">
                        =&gt; {item.realCodeLine}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed pt-1 border-t border-neutral-800/80">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Output Console */}
        {viewTab === 'console' && (
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-1 border-b border-neutral-900">
              <span>Runner Output</span>
              {executionResult && (
                <span>
                  {executionResult.executionTimeMs}ms • {executionResult.memoryEstimateKb}KB
                </span>
              )}
            </div>

            <pre className="text-emerald-400 text-xs whitespace-pre-wrap min-h-[80px]">
              {executionResult?.output ||
                '// Tap "Convert & Run" above to execute this code in the phone runner.'}
            </pre>

            {executionResult?.error && (
              <div className="p-2 rounded bg-red-950/40 border border-red-900/40 text-red-300 text-xs font-mono">
                Error: {executionResult.error}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Interactive UI Live Preview */}
        {viewTab === 'preview' && conversionResult?.interactiveHtml && (
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 pb-1 border-b border-neutral-900">
              <span>Interactive Live Preview (Tap elements to interact)</span>
            </div>
            <div className="h-44 w-full rounded-xl overflow-hidden border border-neutral-850 bg-black">
              <iframe
                title="Interactive UI Sandbox"
                srcDoc={conversionResult.interactiveHtml}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
