import React, { useState, useMemo } from 'react';
import {
  Code2,
  Plus,
  Search,
  Play,
  Edit3,
  Trash2,
  Terminal,
  CheckCircle2,
  Clock,
  Activity,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RunCodeEntry, RunCodeHookPoint } from '../../types';
import { useApp } from '../../context/AppContext';
import { RunCodeEditorModal } from './RunCodeEditorModal';

export const RunCodeLayerView: React.FC = () => {
  const {
    runCodeEntries,
    saveRunCodeEntry,
    deleteRunCodeEntry,
    toggleRunCodeEntry,
    testRunCodeEntry,
    requestConfirmation,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterHook, setFilterHook] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<RunCodeEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Card-level interactive states
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { output: string; time: number; error?: string }>>({});
  const [testingIds, setTestingIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return runCodeEntries.filter((entry) => {
      if (filterHook === 'active' && !entry.enabled) return false;
      if (filterHook === 'post_response' && entry.hookPoint !== 'post_response') return false;
      if (filterHook === 'pre_prompt' && entry.hookPoint !== 'pre_prompt') return false;
      if (filterHook === 'custom_command' && entry.hookPoint !== 'custom_command') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.commandKeyword && entry.commandKeyword.toLowerCase().includes(q)) ||
        entry.code.toLowerCase().includes(q)
      );
    });
  }, [runCodeEntries, filterHook, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast('Script code copied to clipboard');
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleDeleteWithConfirmation = (entry: RunCodeEntry) => {
    requestConfirmation({
      title: 'Delete Run Code Extension',
      message: `Are you sure you want to delete "${entry.title}"? This cannot be undone.`,
      confirmLabel: 'Delete Extension',
      danger: true,
      onConfirm: () => {
        deleteRunCodeEntry(entry.id);
      },
    });
  };

  const handleRunTest = async (entry: RunCodeEntry) => {
    setTestingIds((prev) => ({ ...prev, [entry.id]: true }));
    const start = performance.now();
    const res = await testRunCodeEntry(entry.id);
    const duration = performance.now() - start;

    setTestResults((prev) => ({
      ...prev,
      [entry.id]: {
        output: res.success ? res.output : (res.error || 'Execution failed'),
        time: duration,
        error: res.error,
      },
    }));
    setTestingIds((prev) => ({ ...prev, [entry.id]: false }));
  };

  const getHookBadge = (hook: RunCodeHookPoint) => {
    switch (hook) {
      case 'post_response':
        return { label: 'Post-Response Modifier', color: 'bg-neutral-800 text-white' };
      case 'pre_prompt':
        return { label: 'Pre-Prompt Filter', color: 'bg-neutral-800 text-neutral-200' };
      case 'custom_command':
        return { label: 'Slash Command', color: 'bg-white text-black font-bold' };
      default:
        return { label: 'Standalone Script', color: 'bg-neutral-800 text-neutral-400' };
    }
  };

  return (
    <div className="space-y-4 text-white">
      {/* Header Info Banner */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white text-black font-bold text-[10px] tracking-wider uppercase">
              Part 5
            </span>
            <h2 className="text-base font-bold tracking-tight">Run Code Layer</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
            A separate, user-editable script layer that AXON reads and executes live. Paste or write custom scripts to change and extend AXON's behavior without modifying or recompiling the underlying application.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Extension</span>
        </button>
      </div>

      {/* Controls: Search & Category Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extensions by title, keyword (/cmd), or code..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All (${runCodeEntries.length})` },
            { id: 'active', label: `Active (${runCodeEntries.filter((e) => e.enabled).length})` },
            { id: 'post_response', label: 'Post-Response Modifiers' },
            { id: 'pre_prompt', label: 'Pre-Prompt Filters' },
            { id: 'custom_command', label: 'Slash Commands' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterHook(chip.id)}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] whitespace-nowrap transition-all ${
                filterHook === chip.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extensions Library Grid / List */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-300">No Run Code extensions found</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {searchQuery
                  ? 'Try a different search query or clear the filter.'
                  : 'Add a new live behavioral script to customize AXON.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Extension</span>
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const badge = getHookBadge(entry.hookPoint);
            const isExpanded = expandedCodes[entry.id];
            const testResult = testResults[entry.id];
            const isTesting = testingIds[entry.id];

            return (
              <div
                key={entry.id}
                id={`runcode-card-${entry.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  entry.enabled
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                    : 'bg-neutral-950/60 border-neutral-900 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        entry.enabled ? 'bg-white text-black shadow-sm' : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <Code2 className="w-4 h-4" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-white truncate">
                          {entry.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${badge.color}`}>
                          {badge.label}
                        </span>
                        {entry.commandKeyword && (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-white font-mono text-[10px] border border-neutral-700">
                            {entry.commandKeyword}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            entry.enabled
                              ? 'bg-neutral-800 text-white border border-neutral-700'
                              : 'bg-neutral-900 text-neutral-500'
                          }`}
                        >
                          {entry.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Toggle Switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRunCodeEntry(entry.id)}
                      aria-label={entry.enabled ? 'Disable extension' : 'Enable extension'}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        entry.enabled ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform ${
                          entry.enabled ? 'bg-black translate-x-5' : 'bg-neutral-500 translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Source Code Drawer */}
                <div className="mt-3 pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(entry.id)}
                      className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? 'Hide Source Code' : 'View Source Code'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(entry.id, entry.code)}
                        className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-neutral-800"
                        title="Copy script code"
                      >
                        {copiedId === entry.id ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === entry.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800/90 font-mono text-[11px] text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed animate-in fade-in duration-100">
                      {entry.code}
                    </div>
                  )}
                </div>

                {/* Interactive Test Runner Output */}
                {testResult && (
                  <div
                    className={`mt-3 p-3 rounded-xl border text-xs font-mono space-y-1 transition-all ${
                      !testResult.error
                        ? 'bg-neutral-950 border-neutral-700 text-neutral-200'
                        : 'bg-red-950/40 border-red-900 text-red-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 border-b border-neutral-800/80 pb-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                        Execution Verified ({testResult.time.toFixed(1)}ms)
                      </span>
                      <span>Output Result</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto pt-1 text-[11px]">
                      {testResult.output}
                    </div>
                  </div>
                )}

                {/* Footer Telemetry & Action Buttons */}
                <div className="mt-3 pt-3 border-t border-neutral-800/70 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Activity className="w-3 h-3 text-neutral-500" />
                      {entry.executionCount} executions
                    </span>
                    {entry.lastExecuted && (
                      <span className="flex items-center gap-1 font-mono text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.lastExecuted).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleRunTest(entry)}
                      disabled={isTesting}
                      title="Run & test extension in sandbox"
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Play className="w-3 h-3" />
                      <span>{isTesting ? 'Running...' : 'Test Run'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEntry(entry);
                        setIsModalOpen(true);
                      }}
                      title="Edit extension"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWithConfirmation(entry)}
                      title="Delete extension"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Extension Editor Modal */}
      <RunCodeEditorModal
        isOpen={isModalOpen}
        initialEntry={editingEntry}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={(entryData) => {
          saveRunCodeEntry(entryData);
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
      />
    </div>
  );
};
