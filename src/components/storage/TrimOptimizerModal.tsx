import React, { useState, useMemo } from 'react';
import {
  Scissors,
  X,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { simulateTrimPlan, formatBytes } from '../../lib/storageManifest';
import { AssetManifestItem } from '../../types';

interface TrimOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrimOptimizerModal: React.FC<TrimOptimizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    assetManifest,
    storageBudget,
    storageBreakdown,
    trimStorageWithPlan,
    requestConfirmation,
    closeConfirmation,
  } = useApp();

  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Calculate trim candidates using user's configured priority
  const targetBytesToFree = Math.max(
    250 * 1024 * 1024,
    storageBreakdown.totalStoredBytes - Math.round(storageBudget.budgetBytes * 0.8)
  );

  const rawTrimPlan = useMemo(() => {
    return simulateTrimPlan(
      assetManifest,
      targetBytesToFree,
      storageBudget.trimPriority
    );
  }, [assetManifest, targetBytesToFree, storageBudget.trimPriority]);

  // Initialize selected item IDs whenever modal opens or plan changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedItemIds(new Set(rawTrimPlan.itemsToPrune.map((p) => p.item.id)));
    }
  }, [isOpen, rawTrimPlan]);

  if (!isOpen) return null;

  const totalCalculatedSavings = rawTrimPlan.itemsToPrune
    .filter((p) => selectedItemIds.has(p.item.id))
    .reduce((sum, p) => sum + p.estimatedSavingsBytes, 0);

  const toggleItem = (id: string) => {
    const next = new Set(selectedItemIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedItemIds(next);
  };

  const selectAll = () => {
    setSelectedItemIds(new Set(rawTrimPlan.itemsToPrune.map((p) => p.item.id)));
  };

  const deselectAll = () => {
    setSelectedItemIds(new Set());
  };

  const handleExecuteTrim = () => {
    if (selectedItemIds.size === 0) return;

    requestConfirmation({
      title: 'Confirm Storage Trim',
      message: `Are you sure you want to prune ${selectedItemIds.size} asset(s) and free ${formatBytes(totalCalculatedSavings)} of storage according to your priority rules?`,
      confirmLabel: 'Prune Selected Assets',
      danger: true,
      onConfirm: () => {
        // Execute trim
        trimStorageWithPlan(storageBudget.trimPriority, totalCalculatedSavings);
        closeConfirmation();
        onClose();
      },
    });
  };

  return (
    <div
      id="trim-optimizer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Storage Optimizer & Trim</h3>
              <p className="text-[11px] text-neutral-400">
                Prune candidates prioritized by your configured rules
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

        {/* Plan Summary Banner */}
        <div className="p-4 bg-neutral-850 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-semibold text-neutral-400">
              Estimated Space to Free
            </div>
            <div className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{formatBytes(totalCalculatedSavings)}</span>
              <span className="text-xs font-normal text-neutral-400">
                ({selectedItemIds.size} of {rawTrimPlan.itemsToPrune.length} items selected)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={selectAll}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={deselectAll}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Candidate List */}
        <div className="p-4 overflow-y-auto space-y-2 text-xs flex-1">
          {rawTrimPlan.itemsToPrune.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Storage is fully optimized</p>
              <p className="text-[11px] text-neutral-400">
                No pruning candidates detected under your current priority criteria.
              </p>
            </div>
          ) : (
            rawTrimPlan.itemsToPrune.map(({ item, reason, estimatedSavingsBytes }) => {
              const isChecked = selectedItemIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-neutral-800/80 border-neutral-600 text-white'
                      : 'bg-neutral-900 border-neutral-800/70 text-neutral-400 opacity-60'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 rounded accent-white cursor-pointer"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-white truncate">
                        {item.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-white shrink-0">
                        -{formatBytes(estimatedSavingsBytes)}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 truncate font-mono mt-0.5">
                      {item.storageLocation}
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate">
                        {reason}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-neutral-400">
            Priority: {storageBudget.trimPriority.slice(0, 3).join(' > ')}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-execute-trim-btn"
              type="button"
              disabled={selectedItemIds.size === 0}
              onClick={handleExecuteTrim}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Prune Selected ({formatBytes(totalCalculatedSavings)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
