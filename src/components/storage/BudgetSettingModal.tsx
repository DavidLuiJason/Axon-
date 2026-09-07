import React, { useState, useEffect } from 'react';
import {
  Sliders,
  X,
  Check,
  HardDrive,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Info,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TrimCategoryPriority, StorageBudgetConfig } from '../../types';
import { formatBytes } from '../../lib/storageManifest';

interface BudgetSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_LABELS: Record<
  TrimCategoryPriority,
  { label: string; desc: string; safe: boolean }
> = {
  cache: {
    label: 'Cache & Vector Embeddings',
    desc: 'Temporary sandbox caches, vector indexes, and syntax ASTs',
    safe: true,
  },
  stale_knowledge: {
    label: 'Stale Knowledge Packs',
    desc: 'Documentation and lessons whose upstream references have changed',
    safe: true,
  },
  downsampled_user_files: {
    label: 'Downsampled User Files',
    desc: 'Files already running in Space-Saver mode with approximation',
    safe: false,
  },
  chat_history: {
    label: 'Historical Chat Transcripts',
    desc: 'Old conversation logs and prompt archives beyond 30 days',
    safe: false,
  },
  knowledge_packs: {
    label: 'Active Knowledge Packs',
    desc: 'Offline reference material and language cheat-sheets',
    safe: false,
  },
  models: {
    label: 'AI Model Checkpoints',
    desc: 'Local neural network weights and tokenizers (heaviest assets)',
    safe: false,
  },
};

export const BudgetSettingModal: React.FC<BudgetSettingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { storageBudget, updateStorageBudget, showToast } = useApp();

  const [budgetGb, setBudgetGb] = useState<number>(() => {
    return Math.round((storageBudget.budgetBytes / (1024 * 1024 * 1024)) * 10) / 10;
  });
  const [warningThreshold, setWarningThreshold] = useState<number>(
    storageBudget.warningThresholdPercent
  );
  const [trimPriority, setTrimPriority] = useState<TrimCategoryPriority[]>(
    storageBudget.trimPriority
  );
  const [detectedStorage, setDetectedStorage] = useState<{
    quotaBytes: number;
    usageBytes: number;
    availableBytes: number;
  } | null>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBudgetGb(Math.round((storageBudget.budgetBytes / (1024 * 1024 * 1024)) * 10) / 10);
      setWarningThreshold(storageBudget.warningThresholdPercent);
      setTrimPriority(storageBudget.trimPriority);

      // Detect storage estimate if available
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        navigator.storage
          .estimate()
          .then((estimate) => {
            if (estimate.quota && estimate.usage !== undefined) {
              const free = Math.max(0, estimate.quota - estimate.usage);
              setDetectedStorage({
                quotaBytes: estimate.quota,
                usageBytes: estimate.usage,
                availableBytes: free,
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, storageBudget]);

  if (!isOpen) return null;

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= trimPriority.length) return;
    const next = [...trimPriority];
    const temp = next[index];
    next[index] = next[newIndex];
    next[newIndex] = temp;
    setTrimPriority(next);
  };

  const handleSave = () => {
    const targetBytes = Math.max(500 * 1024 * 1024, Math.round(budgetGb * 1024 * 1024 * 1024));
    updateStorageBudget({
      budgetBytes: targetBytes,
      warningThresholdPercent: warningThreshold,
      trimPriority,
      budgetMode: budgetGb === 15 ? 'preset_15gb' : 'custom_limit',
    });
    showToast(`Storage budget set to ${budgetGb} GB with updated trim priorities`);
    onClose();
  };

  return (
    <div
      id="budget-setting-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Storage Budget & Trim Rules</h3>
              <p className="text-[11px] text-neutral-400">
                Configure maximum disk allowance and automatic trim hierarchy
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

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Default Planning Assumption Banner */}
          <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-750 space-y-1">
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-neutral-300" />
              <span>Realistic 15GB Target Allocation</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Target devices realistically have ~15GB available to comfortably allocate for AXON's models, offline knowledge packs, and project assets. This provides abundant headroom without aggressive near-zero caps.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Quick Budget Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { gb: 5, label: '5 GB', desc: 'Minimal' },
                { gb: 15, label: '15 GB', desc: 'Suggested Default', highlight: true },
                { gb: 25, label: '25 GB', desc: 'Extended' },
                { gb: 50, label: '50 GB', desc: 'Heavy' },
              ].map((preset) => {
                const isActive = budgetGb === preset.gb;
                return (
                  <button
                    key={preset.gb}
                    id={`budget-preset-btn-${preset.gb}`}
                    type="button"
                    onClick={() => setBudgetGb(preset.gb)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow'
                        : preset.highlight
                        ? 'bg-neutral-800/90 border-neutral-600 text-white hover:bg-neutral-800'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.label}</div>
                    <div
                      className={`text-[9px] mt-0.5 truncate ${
                        isActive ? 'text-black/80' : 'text-neutral-400'
                      }`}
                    >
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Budget Slider & Input */}
          <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Custom Allocation</span>
              <div className="flex items-center gap-1">
                <input
                  id="budget-gb-input"
                  type="number"
                  min="1"
                  max="128"
                  step="0.5"
                  value={budgetGb}
                  onChange={(e) => setBudgetGb(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-16 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs text-right focus:outline-none focus:border-white"
                />
                <span className="text-xs text-neutral-400 font-mono">GB</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="64"
              step="0.5"
              value={budgetGb}
              onChange={(e) => setBudgetGb(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>1 GB</span>
              <span>15 GB (Default)</span>
              <span>32 GB</span>
              <span>64 GB</span>
            </div>
          </div>

          {/* Real Detected Storage Option */}
          {detectedStorage && (
            <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-750 flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-white">
                  Detected Device Free Space
                </div>
                <div className="text-[11px] text-neutral-400">
                  {formatBytes(detectedStorage.availableBytes)} available from browser disk quota
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const safeGb = Math.max(
                    2,
                    Math.round(
                      ((detectedStorage.availableBytes * 0.8) / (1024 * 1024 * 1024)) * 10
                    ) / 10
                  );
                  setBudgetGb(safeGb);
                }}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium transition-colors"
              >
                Use 80% Detected
              </button>
            </div>
          )}

          {/* Warning Threshold Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                Warning Threshold
              </label>
              <span className="text-xs font-mono font-bold text-white">
                {warningThreshold}% of budget
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-white"
            />
            <p className="text-[10px] text-neutral-400">
              When storage reaches this percent, AXON alerts you and highlights trim recommendations.
            </p>
          </div>

          {/* Trim Priority Re-orderer */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div>
              <label className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Trim Priority Order
              </label>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Top categories will be pruned or downsampled first when nearing your storage cap.
              </p>
            </div>

            <div className="space-y-1.5">
              {trimPriority.map((prioKey, index) => {
                const info = PRIORITY_LABELS[prioKey] || {
                  label: prioKey,
                  desc: '',
                  safe: false,
                };
                const isFirst = index === 0;
                const isLast = index === trimPriority.length - 1;

                return (
                  <div
                    key={prioKey}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{info.label}</span>
                          {info.safe && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
                              Safe Cache
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {info.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => movePriority(index, 'up')}
                        className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition-colors"
                        title="Prioritize earlier for trimming"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => movePriority(index, 'down')}
                        className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition-colors"
                        title="Protect longer before trimming"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-storage-budget-btn"
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Budget Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
