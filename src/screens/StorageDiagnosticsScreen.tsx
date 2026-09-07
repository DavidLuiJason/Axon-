import React, { useState } from 'react';
import {
  ArrowLeft,
  HardDrive,
  Sliders,
  Scissors,
  FilePlus,
  AlertCircle,
  RefreshCw,
  Archive,
  Zap,
  Layers,
  Database,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AssetCategory } from '../types';
import { StorageBudgetBar } from '../components/storage/StorageBudgetBar';
import { StorageCategoryBreakdown } from '../components/storage/StorageCategoryBreakdown';
import { AssetManifestTable } from '../components/storage/AssetManifestTable';
import { BudgetSettingModal } from '../components/storage/BudgetSettingModal';
import { TrimOptimizerModal } from '../components/storage/TrimOptimizerModal';
import { RegisterAssetModal } from '../components/storage/RegisterAssetModal';
import { formatBytes } from '../lib/storageManifest';

export const StorageDiagnosticsScreen: React.FC = () => {
  const {
    goBack,
    storageBreakdown,
    assetManifest,
    refreshStaleKnowledgeAsset,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isTrimModalOpen, setIsTrimModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const staleItems = assetManifest.filter((a) => a.knowledgeStatus === 'stale');

  const handleRefreshAllStale = () => {
    staleItems.forEach((item) => refreshStaleKnowledgeAsset(item.id));
    showToast(`Refreshed ${staleItems.length} stale knowledge pack(s)`);
  };

  return (
    <div id="storage-diagnostics-screen" className="flex-1 overflow-y-auto bg-black text-white p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Header with Back Button (Global rule from Part 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            id="storage-back-btn"
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Storage, Compression & Asset Manifest
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                Part 7
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Accurate per-item manifest tracking &bull; 15GB device budgeting &bull; Lossless archive vs space-saver
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            id="header-register-asset-btn"
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-medium text-white transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5 text-neutral-300" />
            <span>Register Asset</span>
          </button>

          <button
            id="header-trim-btn"
            type="button"
            onClick={() => setIsTrimModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-medium text-white transition-colors"
          >
            <Scissors className="w-3.5 h-3.5 text-neutral-300" />
            <span>Trim Storage</span>
          </button>

          <button
            id="header-budget-btn"
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Budget Settings</span>
          </button>
        </div>
      </div>

      {/* Storage Budget & Usage Progress Bar */}
      <StorageBudgetBar
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onOpenTrimModal={() => setIsTrimModalOpen(true)}
      />

      {/* Stale Knowledge Banner (if any outdated cached knowledge exists) */}
      {staleItems.length > 0 && (
        <div
          id="stale-knowledge-banner"
          className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-start gap-2.5 text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-100">
                {staleItems.length} Cached Knowledge Base(s) Stale
              </p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Upstream language references or syntax documentation have updated since these items were cached.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefreshAllStale}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh All Stale</span>
            </button>
          </div>
        </div>
      )}

      {/* Storage Category Breakdown Cards */}
      <StorageCategoryBreakdown
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Asset Manifest Table & Filterable List */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-neutral-400" />
            <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
              Asset Manifest Directory
            </h2>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            {assetManifest.length} tracked items &bull; {formatBytes(storageBreakdown.totalStoredBytes)} on disk
          </span>
        </div>

        <AssetManifestTable
          categoryFilter={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <BudgetSettingModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <TrimOptimizerModal
        isOpen={isTrimModalOpen}
        onClose={() => setIsTrimModalOpen(false)}
      />

      <RegisterAssetModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
