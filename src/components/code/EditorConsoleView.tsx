import React, { useState } from 'react';
import {
  FileCode,
  Play,
  RotateCcw,
  Save,
  Terminal,
  Eye,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  FolderOpen,
  Cpu,
  Clock,
  Layers,
} from 'lucide-react';
import { executeJavaScript, generateInteractiveHtmlPreview } from '../../lib/codeRunner';
import { CodeSkillLevel, ExecutionResult, SavedScript } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditorConsoleViewProps {
  skillLevel: CodeSkillLevel;
  code: string;
  onChangeCode: (newCode: string) => void;
  language: 'javascript' | 'python' | 'shorthand' | 'html';
  onChangeLanguage: (lang: 'javascript' | 'python' | 'shorthand' | 'html') => void;
  onOpenSavedModal: () => void;
  onOpenTranslator: () => void;
}

export const EditorConsoleView: React.FC<EditorConsoleViewProps> = ({
  skillLevel,
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  onOpenSavedModal,
  onOpenTranslator,
}) => {
  const { showToast, saveScript } = useApp();
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'preview'>('console');
  const [isSavingPromptOpen, setIsSavingPromptOpen] = useState(false);
  const [scriptTitleInput, setScriptTitleInput] = useState('');
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    showToast('Executing in phone sandbox...');

    let codeToRun = code;
    // If HTML, generate preview
    if (language === 'html' || code.includes('<button') || code.includes('<!DOCTYPE')) {
      const previewHtml = generateInteractiveHtmlPreview(code);
      setOutput({
        output: '// Interactive HTML sandbox rendered',
        renderHtml: previewHtml,
        executionTimeMs: 2,
        memoryEstimateKb: 18,
        timestamp: new Date().toLocaleTimeString(),
      });
      setActiveTab('preview');
      setIsRunning(false);
      return;
    }

    const result = await executeJavaScript(codeToRun);
    setOutput(result);
    setIsRunning(false);
    setActiveTab('console');
  };

  const handleSaveCurrentScript = () => {
    if (!scriptTitleInput.trim()) {
      showToast('Please enter a script title');
      return;
    }
    saveScript({
      title: scriptTitleInput.trim(),
      code,
      language,
      skillLevel,
      description: `Saved from ${skillLevel.toUpperCase()} mode in AXON Code`,
    });
    setIsSavingPromptOpen(false);
    setScriptTitleInput('');
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output.output);
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
      showToast('Output copied to clipboard');
    }
  };

  return (
    <div id="editor-console-view" className="flex-1 flex flex-col space-y-3">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-900/90 p-2.5 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-neutral-400" />
          <select
            value={language}
            onChange={(e) =>
              onChangeLanguage(e.target.value as 'javascript' | 'python' | 'shorthand' | 'html')
            }
            className="bg-neutral-800 border border-neutral-700 text-xs text-white rounded-lg px-2 py-1 font-mono focus:outline-none"
          >
            <option value="javascript">JavaScript (.js)</option>
            <option value="html">HTML / UI (.html)</option>
            <option value="python">Python (.py)</option>
            <option value="shorthand">Shorthand (.axon)</option>
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSavedModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
            title="Open Saved Scripts"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSavingPromptOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
            title="Save Script"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            id="editor-run-btn"
            type="button"
            onClick={handleRunCode}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* Assisted Mode Explanatory Hint Banner */}
      {skillLevel === 'assisted' && (
        <div className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>
              Assisted Mode active: need a command translated into code?
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenTranslator}
            className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-[11px]"
          >
            Translator
          </button>
        </div>
      )}

      {/* Expert Mode Memory & Performance Budget Banner */}
      {skillLevel === 'expert' && (
        <div className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-neutral-400" />
            <span>Target: 4GB RAM Mobile Sandbox</span>
          </span>
          <span>Max Heap: 128MB • Loop Guard: Active</span>
        </div>
      )}

      {/* Save Script Modal Dialog */}
      {isSavingPromptOpen && (
        <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-2 animate-in fade-in duration-150">
          <span className="text-xs font-semibold text-white">Save Current Code</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={scriptTitleInput}
              onChange={(e) => setScriptTitleInput(e.target.value)}
              placeholder="e.g. My Color Button Script"
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
            <button
              type="button"
              onClick={handleSaveCurrentScript}
              className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setIsSavingPromptOpen(false)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Code Textarea Editor */}
      <div className="flex-1 min-h-[220px] rounded-2xl bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs text-neutral-100 relative focus-within:border-neutral-600 transition-colors">
        <textarea
          id="editor-code-textarea"
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-xs sm:text-sm leading-relaxed text-neutral-100 placeholder-neutral-600"
          placeholder="// Write or paste your code here..."
          spellCheck={false}
        />
      </div>

      {/* Execution Console & Live Preview Pane */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs space-y-2">
        {/* Output Console Toolbar */}
        <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-1.5 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors ${
                activeTab === 'console'
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Console</span>
            </button>

            {output?.renderHtml && (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-neutral-500 hover:text-emerald-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>UI Preview</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-neutral-500">
            {output && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{output.executionTimeMs}ms</span>
              </span>
            )}
            {output && (
              <button
                type="button"
                onClick={handleCopyOutput}
                className="hover:text-white transition-colors"
                title="Copy output"
              >
                {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            )}
            {output && (
              <button
                type="button"
                onClick={() => setOutput(null)}
                className="hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Terminal Console Logs */}
        {activeTab === 'console' && (
          <div className="min-h-[90px] max-h-[160px] overflow-y-auto">
            <pre className="text-emerald-400 text-[11px] sm:text-xs whitespace-pre-wrap leading-relaxed">
              {output?.output || '// Tap "Run" to execute this script in the mobile sandbox.'}
            </pre>

            {output?.error && (
              <div className="mt-2 p-2 rounded-xl bg-red-950/40 border border-red-900/40 text-red-300 text-xs">
                Runtime Error: {output.error}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: HTML UI Live Preview */}
        {activeTab === 'preview' && output?.renderHtml && (
          <div className="h-44 w-full rounded-xl overflow-hidden border border-neutral-850 bg-black">
            <iframe
              title="Interactive UI Output"
              srcDoc={output.renderHtml}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
};
