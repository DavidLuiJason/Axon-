import React, { useState, useEffect } from 'react';
import {
  X,
  Code2,
  Check,
  Play,
  FileCode,
  Terminal,
  Sparkles,
  ChevronDown,
  Info,
  Clock,
} from 'lucide-react';
import { RunCodeEntry, RunCodeHookPoint } from '../../types';
import { executeRunCodeScript } from '../../lib/automationEngine';
import { useApp } from '../../context/AppContext';

interface RunCodeEditorModalProps {
  isOpen: boolean;
  initialEntry?: RunCodeEntry | null;
  onClose: () => void;
  onSave: (entry: Omit<RunCodeEntry, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'> & { id?: string }) => void;
}

const TEMPLATES = [
  {
    name: 'Custom Slash Command (/status)',
    hookPoint: 'custom_command' as RunCodeHookPoint,
    keyword: '/status',
    code: `// Custom Slash Command: /status
// Invoked whenever the user types /status in chat
const rules = context.activeRulesCount || 0;
const runCode = context.activeRunCodeCount || 0;
const model = context.userModel || 'AXON Core';

return [
  '⚡ [AXON SYSTEM TELEMETRY]',
  '• Status: Online & Responsive',
  '• Active Model: ' + model,
  '• Active Automation Rules: ' + rules,
  '• Active Run Code Extensions: ' + runCode,
  '• Device RAM Profile: 4GB Mobile Target',
  '• Time: ' + new Date().toLocaleTimeString()
].join('\\n');`,
  },
  {
    name: 'Word Counter & Timestamp Footnote',
    hookPoint: 'post_response' as RunCodeHookPoint,
    keyword: '',
    code: `// Post-Response Modifier: Word Counter & Footnote
// Intercepts the generated AI response and appends a minimal metadata tag
if (!input) return input;
const words = input.trim().split(/\\s+/).filter(Boolean).length;
const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

return input + '\\n\\n— [AXON Verified • ' + words + ' words • ' + stamp + ']';`,
  },
  {
    name: 'Mobile 4GB RAM Length Guard',
    hookPoint: 'pre_prompt' as RunCodeHookPoint,
    keyword: '',
    code: `// Pre-Prompt Guard: Mobile Memory Optimizer
// Appends instruction for mobile-friendly response density
if (!input) return input;

// Guard against oversized single prompts on mobile
if (input.length > 2500) {
  input = input.substring(0, 2500) + '... [truncated for memory safety]';
}

return input + '\\n\\n(Please prioritize high-density conciseness suitable for a phone screen)';`,
  },
  {
    name: 'API Key & Token Redactor',
    hookPoint: 'pre_prompt' as RunCodeHookPoint,
    keyword: '',
    code: `// Pre-Prompt Guard: Scrub inadvertent API keys or secrets
if (!input) return input;
let safe = input.replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[REDACTED_API_KEY]');
safe = safe.replace(/AIzaSy[a-zA-Z0-9_-]{33}/g, '[REDACTED_GEMINI_KEY]');
return safe;`,
  },
];

export const RunCodeEditorModal: React.FC<RunCodeEditorModalProps> = ({
  isOpen,
  initialEntry,
  onClose,
  onSave,
}) => {
  const { automationRules, runCodeEntries, activeModel } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hookPoint, setHookPoint] = useState<RunCodeHookPoint>('post_response');
  const [commandKeyword, setCommandKeyword] = useState('');
  const [code, setCode] = useState('');
  const [enabled, setEnabled] = useState(true);

  // In-modal Test Runner State
  const [testInput, setTestInput] = useState('');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    output: string;
    executionTimeMs: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title);
      setDescription(initialEntry.description);
      setHookPoint(initialEntry.hookPoint);
      setCommandKeyword(initialEntry.commandKeyword || '');
      setCode(initialEntry.code);
      setEnabled(initialEntry.enabled);
      setTestInput(
        initialEntry.hookPoint === 'custom_command'
          ? `${initialEntry.commandKeyword || '/cmd'} info`
          : initialEntry.hookPoint === 'post_response'
          ? 'Here is an explanation of functional programming principles.'
          : 'Can you show me a sample sorting function in TypeScript?'
      );
      setTestResult(null);
    } else {
      setTitle('');
      setDescription('');
      setHookPoint('post_response');
      setCommandKeyword('');
      setCode(TEMPLATES[1].code);
      setEnabled(true);
      setTestInput('Here is an explanation of functional programming principles.');
      setTestResult(null);
    }
  }, [initialEntry, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.name);
    setHookPoint(tmpl.hookPoint);
    setCommandKeyword(tmpl.keyword);
    setCode(tmpl.code);
    setDescription(`User-created extension implementing ${tmpl.name.toLowerCase()}`);
    setTestInput(
      tmpl.hookPoint === 'custom_command'
        ? `${tmpl.keyword} test`
        : 'Sample input data to verify script behavior.'
    );
    setTestResult(null);
  };

  const handleTestRun = async () => {
    setIsRunningTest(true);
    setTestResult(null);

    const syntheticEntry: RunCodeEntry = {
      id: initialEntry?.id || 'test-temp',
      title: title || 'Test Run',
      description: description || '',
      hookPoint,
      commandKeyword: hookPoint === 'custom_command' ? commandKeyword : undefined,
      code,
      enabled: true,
      executionCount: 0,
      createdAt: '',
      updatedAt: '',
    };

    const res = await executeRunCodeScript(syntheticEntry, testInput, {
      activeRulesCount: automationRules.filter((r) => r.enabled).length,
      activeRunCodeCount: runCodeEntries.filter((e) => e.enabled).length,
      userModel: activeModel?.name,
    });

    setTestResult(res);
    setIsRunningTest(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Custom Extension';
    const finalDesc = description.trim() || 'User-defined script extension';

    onSave({
      id: initialEntry?.id,
      title: finalTitle,
      description: finalDesc,
      hookPoint,
      commandKeyword: hookPoint === 'custom_command' ? commandKeyword.trim() || '/cmd' : undefined,
      code,
      enabled,
    });
    onClose();
  };

  return (
    <div
      id="runcode-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="runcode-editor-modal"
        className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                {initialEntry ? 'Edit Run Code Extension' : 'New Run Code Extension'}
              </h3>
              <p className="text-xs text-neutral-400">
                Live behavioral extension layer (runs without rebuilding the app)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Starter Templates Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" />
                Load Starter Template
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-[11px] transition-all"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Hook Point */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Extension Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Word Counter & Footnote"
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white text-xs"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Hook Point (Where AXON Executes This)
              </label>
              <select
                value={hookPoint}
                onChange={(e) => setHookPoint(e.target.value as RunCodeHookPoint)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white text-xs cursor-pointer"
              >
                <option value="post_response">Post-Response (Modifies AI Output)</option>
                <option value="pre_prompt">Pre-Prompt (Filters User Input)</option>
                <option value="custom_command">Custom Slash Command (/command)</option>
                <option value="standalone">Standalone Offline Utility</option>
              </select>
            </div>
          </div>

          {/* Command keyword field if custom_command */}
          {hookPoint === 'custom_command' && (
            <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <label className="block text-neutral-300 font-semibold mb-1">
                Trigger Command Keyword
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-neutral-500">Command:</span>
                <input
                  type="text"
                  value={commandKeyword}
                  onChange={(e) => setCommandKeyword(e.target.value)}
                  placeholder="/status"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white font-mono text-xs focus:outline-none focus:border-white"
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                When entered in chat, AXON will execute this script directly instead of querying the model.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Description / Behavioral Intent
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this code modifies or extends AXON's behavior..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white text-xs"
            />
          </div>

          {/* Script Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-neutral-300 font-semibold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                Script Source Code (JavaScript / Node API sandbox)
              </label>
              <span className="text-[10px] text-neutral-500 font-mono">
                Parameters: input, context
              </span>
            </div>
            <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden font-mono text-xs">
              <textarea
                rows={9}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// JavaScript script body... return modified result"
                className="w-full p-3 bg-neutral-950 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white resize-y font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>
                Available variables: <code className="text-neutral-300">input</code> (text string),{' '}
                <code className="text-neutral-300">context</code> (model info, rules, timestamps).
                Return string or object.
              </span>
            </div>
          </div>

          {/* In-Modal Test Sandbox */}
          <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Live Test Sandbox
              </span>
              <button
                type="button"
                onClick={handleTestRun}
                disabled={isRunningTest}
                className="px-3 py-1 rounded-lg bg-white text-black text-[11px] font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                <span>{isRunningTest ? 'Running...' : 'Run Test'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-mono">Test Input Value:</span>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Sample text passed into input..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-white"
              />
            </div>

            {/* Test Result Output Box */}
            {testResult && (
              <div
                className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 transition-all ${
                  testResult.success
                    ? 'bg-neutral-950 border-neutral-700 text-neutral-200'
                    : 'bg-red-950/40 border-red-900 text-red-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-neutral-800/80 pb-1">
                  <span>Result: {testResult.success ? 'Success (200 OK)' : 'Error Encountered'}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {testResult.executionTimeMs.toFixed(1)}ms
                  </span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto pt-1">
                  {testResult.success ? testResult.output : testResult.error}
                </div>
              </div>
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
            <div>
              <div className="font-semibold text-white">Enable Extension</div>
              <div className="text-[11px] text-neutral-400">
                Active extensions are applied live across chat dispatches and tools.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                enabled ? 'bg-white' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  enabled ? 'bg-black translate-x-5' : 'bg-neutral-500 translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{initialEntry ? 'Save Extension' : 'Add to Library'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
