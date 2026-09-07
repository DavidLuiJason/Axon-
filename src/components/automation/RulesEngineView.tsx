import React, { useState, useMemo } from 'react';
import {
  Zap,
  Plus,
  Search,
  Play,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCode,
  Bell,
  Clock,
  Activity,
  Sparkles,
} from 'lucide-react';
import { AutomationRule } from '../../types';
import { useApp } from '../../context/AppContext';
import { RuleEditorModal } from './RuleEditorModal';

interface RulesEngineViewProps {
  onOpenNewRuleModal: () => void;
}

export const RulesEngineView: React.FC<RulesEngineViewProps> = () => {
  const {
    automationRules,
    saveRule,
    deleteRule,
    toggleRule,
    testRule,
    requestConfirmation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'active' | 'connection' | 'code' | 'alerts'>('all');
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResultFeedback, setTestResultFeedback] = useState<{ id: string; msg: string } | null>(null);

  // Filtered rules
  const filteredRules = useMemo(() => {
    return automationRules.filter((rule) => {
      // Category filter
      if (filterCategory === 'active' && !rule.enabled) return false;
      if (filterCategory === 'connection' && rule.triggerType !== 'connection_error') return false;
      if (filterCategory === 'code' && rule.actionType !== 'auto_format_code') return false;
      if (filterCategory === 'alerts' && rule.actionType !== 'notify_user' && rule.triggerType !== 'rate_limit') return false;

      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        rule.title.toLowerCase().includes(q) ||
        rule.description.toLowerCase().includes(q) ||
        rule.triggerLabel.toLowerCase().includes(q) ||
        rule.actionLabel.toLowerCase().includes(q)
      );
    });
  }, [automationRules, filterCategory, searchQuery]);

  const handleDeleteWithConfirmation = (rule: AutomationRule) => {
    requestConfirmation({
      title: `Delete Automation Rule`,
      message: `Are you sure you want to delete "${rule.title}"? This cannot be undone.`,
      confirmLabel: 'Delete Rule',
      danger: true,
      onConfirm: () => {
        deleteRule(rule.id);
      },
    });
  };

  const handleTestRule = (id: string) => {
    const res = testRule(id);
    setTestResultFeedback({ id, msg: res.log });
    setTimeout(() => {
      setTestResultFeedback((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'connection_error':
        return RefreshCw;
      case 'rate_limit':
        return AlertCircle;
      case 'keyword_match':
        return FileCode;
      case 'code_execution_error':
        return Play;
      default:
        return Zap;
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
            <h2 className="text-base font-bold tracking-tight">Conditional Rules Engine</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Define simple triggers ("if this happens, do this") like auto-retrying failed logins or connection drops. AXON saves these rules and applies them continuously.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingRule(null);
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Rule</span>
        </button>
      </div>

      {/* Controls Bar: Search & Category Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules by trigger, action, or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-all"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All (${automationRules.length})` },
            { id: 'active', label: `Active (${automationRules.filter((r) => r.enabled).length})` },
            { id: 'connection', label: 'Connection & Retries' },
            { id: 'code', label: 'Code & Syntax' },
            { id: 'alerts', label: 'Alerts & Limits' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterCategory(chip.id as any)}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] whitespace-nowrap transition-all ${
                filterCategory === chip.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {filteredRules.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-300">No automation rules found</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {searchQuery
                  ? 'Try a different keyword or clear your filter.'
                  : 'Add your first conditional rule in plain language or guided form.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingRule(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Rule</span>
            </button>
          </div>
        ) : (
          filteredRules.map((rule) => {
            const TriggerIcon = getTriggerIcon(rule.triggerType);
            const isFeedback = testResultFeedback?.id === rule.id;

            return (
              <div
                key={rule.id}
                id={`rule-card-${rule.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  rule.enabled
                    ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                    : 'bg-neutral-950/60 border-neutral-900 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        rule.enabled
                          ? 'bg-white text-black shadow-sm'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <TriggerIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-bold text-white truncate">
                          {rule.title}
                        </h3>
                        {rule.creationMode === 'plain_language' && (
                          <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                            <Sparkles className="w-2.5 h-2.5" />
                            Plain Language
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rule.enabled
                              ? 'bg-neutral-800 text-white border border-neutral-700'
                              : 'bg-neutral-900 text-neutral-500'
                          }`}
                        >
                          {rule.enabled ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {rule.description}
                      </p>

                      {/* Visual IF -> THEN Chain */}
                      <div className="flex items-center gap-2 text-[11px] pt-1 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800/80">
                          <span className="font-bold text-[10px] text-neutral-400">IF:</span>
                          <span className="text-white font-medium truncate max-w-[180px]">
                            {rule.triggerLabel}
                          </span>
                        </div>
                        <span className="text-neutral-500 font-bold">→</span>
                        <div className="flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-lg border border-neutral-800/80">
                          <span className="font-bold text-[10px] text-neutral-400">THEN:</span>
                          <span className="text-white font-medium truncate max-w-[180px]">
                            {rule.actionLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Toggle Switch */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRule(rule.id)}
                      aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                        rule.enabled ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform ${
                          rule.enabled ? 'bg-black translate-x-5' : 'bg-neutral-500 translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Test Feedback Notice */}
                {isFeedback && (
                  <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs flex items-center gap-2 text-neutral-200 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="font-mono text-[11px]">{testResultFeedback.msg}</span>
                  </div>
                )}

                {/* Footer Telemetry & Actions */}
                <div className="mt-3 pt-3 border-t border-neutral-800/70 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Activity className="w-3 h-3 text-neutral-500" />
                      {rule.triggerCount} runs
                    </span>
                    {rule.lastTriggered && (
                      <span className="flex items-center gap-1 font-mono text-neutral-500">
                        <Clock className="w-3 h-3" />
                        {new Date(rule.lastTriggered).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTestRule(rule.id)}
                      title="Simulate / test trigger"
                      className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRule(rule);
                        setIsModalOpen(true);
                      }}
                      title="Edit rule"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWithConfirmation(rule)}
                      title="Delete rule"
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

      {/* Rule Editor Modal */}
      <RuleEditorModal
        isOpen={isModalOpen}
        initialRule={editingRule}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        onSave={(ruleData) => {
          saveRule(ruleData);
          setIsModalOpen(false);
          setEditingRule(null);
        }}
      />
    </div>
  );
};
