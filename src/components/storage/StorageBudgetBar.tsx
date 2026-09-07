import React from 'react';
import { HardDrive, AlertTriangle, Sliders, Scissors, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatBytes } from '../../lib/storageManifest';

interface StorageBudgetBarProps {
  onOpenBudgetModal: () => void;
  onOpenTrimModal: () => void;
}

export const StorageBudgetBar: React.FC<StorageBudgetBarProps> = ({
  onOpenBudgetModal,
  onOpenTrimModal,
}) => {
  const { storageBudget, storageBreakdown } = useApp();

  const totalUsedBytes = storageBreakdown.totalStoredBytes;
  const budgetBytes = storageBudget.budgetBytes;
  const percentUsed = Math.min(100, Math.max(0, (totalUsedBytes / budgetBytes) * 100));
  const availableBytes = Math.max(0, budgetBytes - totalUsedBytes);

  const isNearBudget = percentUsed >= storageBudget.warningThresholdPercent;
  const isOverBudget = totalUsedBytes > budgetBytes;

  return (
    <div
      id="storage-budget-card"
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isOverBudget
          ? 'bg-red-950/20 border-red-800/80'
          : isNearBudget
          ? 'bg-amber-950/20 border-amber-800/70'
          : 'bg-neutral-900/90 border-neutral-800'
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isOverBudget
                ? 'bg-red-900/40 border-red-700 text-red-300'
                : isNearBudget
                ? 'bg-amber-900/40 border-amber-700 text-amber-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Device Storage Budget</h2>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isOverBudget
                    ? 'bg-red-900/60 text-red-200 border border-red-700'
                    : isNearBudget
                    ? 'bg-amber-900/60 text-amber-200 border border-amber-700'
                    : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                }`}
              >
                {isOverBudget ? 'Over Budget' : isNearBudget ? 'Budget Warning' : 'Within Budget'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Suggested 15GB device allocation &bull; Accurate manifest tracking
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            id="storage-trim-btn"
            type="button"
            onClick={onOpenTrimModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 text-xs font-medium text-white transition-colors"
            title="Prune or compress assets based on priority rules"
          >
            <Scissors className="w-3.5 h-3.5 text-neutral-300" />
            <span className="hidden sm:inline">Trim Storage</span>
          </button>

          <button
            id="storage-budget-settings-btn"
            type="button"
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/80 text-xs font-medium text-white transition-colors"
            title="Configure maximum storage budget and priority rules"
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-300" />
            <span className="hidden sm:inline">Configure Budget</span>
          </button>
        </div>
      </div>

      {/* Numerical Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Storage Used
          </div>
          <div className="text-base font-bold text-white tracking-tight">
            {formatBytes(totalUsedBytes)}
          </div>
          <div className="text-[10px] text-neutral-400">
            {percentUsed.toFixed(1)}% of budget
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Free Space in Budget
          </div>
          <div className="text-base font-bold text-emerald-400 tracking-tight">
            {formatBytes(availableBytes)}
          </div>
          <div className="text-[10px] text-neutral-400">
            Ready for models & assets
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Current Cap
          </div>
          <div className="text-base font-bold text-neutral-200 tracking-tight">
            {formatBytes(budgetBytes)}
          </div>
          <div className="text-[10px] text-neutral-400">
            {storageBudget.budgetMode === 'preset_15gb' ? '15GB Suggested Default' : 'Custom Configured'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-black/40 border border-neutral-800/80">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Space-Saver Savings
          </div>
          <div className="text-base font-bold text-white tracking-tight">
            {formatBytes(storageBreakdown.totalBytesSaved)}
          </div>
          <div className="text-[10px] text-neutral-400">
            {Math.round((1 - storageBreakdown.overallCompressionRatio) * 100)}% overall reduction
          </div>
        </div>
      </div>

      {/* Progress Bar with markers */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden relative p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget
                ? 'bg-red-500'
                : isNearBudget
                ? 'bg-amber-400'
                : 'bg-white'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 font-mono">
          <span>0 GB</span>
          <span>Warning Threshold: {storageBudget.warningThresholdPercent}%</span>
          <span>Target Cap: {formatBytes(budgetBytes, 0)}</span>
        </div>
      </div>

      {/* Near-budget recommendation callout */}
      {isNearBudget && (
        <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-100">
                Approaching Device Storage Limit ({percentUsed.toFixed(1)}% used)
              </p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Trim priority order is active: Cache &bull; Stale Knowledge &bull; Downsampled Files &bull; Chat History.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenTrimModal}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[11px] transition-colors"
          >
            Review Trim Plan
          </button>
        </div>
      )}
    </div>
  );
};
