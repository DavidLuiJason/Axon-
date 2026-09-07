import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Archive,
  Zap,
  Sparkles,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileQuestion,
  ChevronDown,
  Info,
  Clock,
  FolderOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetManifestItem, AssetCategory, SaveMode } from '../../types';
import { formatBytes } from '../../lib/storageManifest';
import { SaveModeTradeoffModal } from './SaveModeTradeoffModal';

interface AssetManifestTableProps {
  categoryFilter: AssetCategory | 'all';
  onSelectCategory: (cat: AssetCategory | 'all') => void;
  onOpenRegisterModal: () => void;
}

export const AssetManifestTable: React.FC<AssetManifestTableProps> = ({
  categoryFilter,
  onSelectCategory,
  onOpenRegisterModal,
}) => {
  const {
    assetManifest,
    setAssetSaveMode,
    revertOrEnhanceAssetItem,
    deleteAssetFromManifest,
    refreshStaleKnowledgeAsset,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [saveModeFilter, setSaveModeFilter] = useState<'all' | 'archive' | 'space_saver'>('all');
  const [healthFilter, setHealthFilter] = useState<'all' | 'stale' | 'current'>('all');
  const [selectedAssetForTradeoff, setSelectedAssetForTradeoff] = useState<{
    asset: AssetManifestItem;
    targetMode: SaveMode;
  } | null>(null);

  // Filtered assets based on search, category, save mode, and health
  const filteredAssets = useMemo(() => {
    return assetManifest.filter((asset) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(query);
        const matchesPath = asset.storageLocation.toLowerCase().includes(query);
        const matchesDesc = asset.description?.toLowerCase().includes(query);
        const matchesCategory = asset.category.toLowerCase().includes(query);
        if (!matchesName && !matchesPath && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && asset.category !== categoryFilter) {
        return false;
      }

      // Save Mode filter
      if (saveModeFilter !== 'all' && asset.saveMode !== saveModeFilter) {
        return false;
      }

      // Health filter
      if (healthFilter === 'stale' && asset.knowledgeStatus !== 'stale') {
        return false;
      }
      if (healthFilter === 'current' && asset.knowledgeStatus !== 'current') {
        return false;
      }

      return true;
    });
  }, [assetManifest, searchQuery, categoryFilter, saveModeFilter, healthFilter]);

  const handleTriggerSaveModeChange = (asset: AssetManifestItem, targetMode: SaveMode) => {
    if (asset.saveMode === targetMode) return;
    // Always open tradeoff modal when switching to space-saver, or confirming switch to archive
    setSelectedAssetForTradeoff({ asset, targetMode });
  };

  const handleConfirmSaveModeChange = () => {
    if (selectedAssetForTradeoff) {
      setAssetSaveMode(selectedAssetForTradeoff.asset.id, selectedAssetForTradeoff.targetMode);
      setSelectedAssetForTradeoff(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="storage-manifest-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracked assets, paths, models..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {/* Save Mode Filter */}
          <div className="flex rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setSaveModeFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                saveModeFilter === 'all'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Modes
            </button>
            <button
              type="button"
              onClick={() => setSaveModeFilter('archive')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                saveModeFilter === 'archive'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Archive className="w-3 h-3" />
              <span>Archive</span>
            </button>
            <button
              type="button"
              onClick={() => setSaveModeFilter('space_saver')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                saveModeFilter === 'space_saver'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Space-Saver</span>
            </button>
          </div>

          {/* Stale Knowledge Filter */}
          <button
            type="button"
            onClick={() => setHealthFilter(healthFilter === 'stale' ? 'all' : 'stale')}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
              healthFilter === 'stale'
                ? 'bg-amber-950/60 border-amber-700 text-amber-200'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Stale Knowledge</span>
          </button>

          {/* Register Asset Button */}
          <button
            id="register-new-asset-btn"
            type="button"
            onClick={onOpenRegisterModal}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1"
          >
            + Register Asset
          </button>
        </div>
      </div>

      {/* Manifest Items List */}
      <div className="space-y-2">
        {filteredAssets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-xs text-neutral-300 font-medium">
              No registered assets match your current filters.
            </p>
            <p className="text-[11px] text-neutral-500">
              Try clearing search terms or resetting category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setSaveModeFilter('all');
                setHealthFilter('all');
              }}
              className="mt-2 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isArchive = asset.saveMode === 'archive';
            const isStale = asset.knowledgeStatus === 'stale';
            const isCurrent = asset.knowledgeStatus === 'current';
            const isApproximation = asset.qualityState === 'enhanced_approximation';
            const isOriginal = asset.qualityState === 'original';
            const percentSaved =
              asset.originalSizeBytes > 0
                ? Math.round(
                    ((asset.originalSizeBytes - asset.storedSizeBytes) /
                      asset.originalSizeBytes) *
                      100
                  )
                : 0;

            return (
              <div
                key={asset.id}
                id={`asset-manifest-card-${asset.id}`}
                className="p-3.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-850/90 border border-neutral-800/90 transition-all space-y-3"
              >
                {/* Header: Name, Category, Path */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white truncate">
                        {asset.name}
                      </span>

                      {/* Mode Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border ${
                          isArchive
                            ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                            : 'bg-amber-950/50 border-amber-800/80 text-amber-300'
                        }`}
                      >
                        {isArchive ? (
                          <>
                            <Archive className="w-2.5 h-2.5 text-neutral-400" />
                            <span>Archive Mode (Lossless)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-2.5 h-2.5 text-amber-400" />
                            <span>Space-Saver Mode</span>
                          </>
                        )}
                      </span>

                      {/* Quality State Pill */}
                      {isApproximation ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/50 border border-purple-800/80 text-purple-300 font-medium flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                          <span>Enhanced Approximation (Original Discarded)</span>
                        </span>
                      ) : isOriginal ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/70 text-emerald-300 font-medium">
                          100% Bit-Exact Original
                        </span>
                      ) : null}

                      {/* Knowledge Health Status */}
                      {isStale && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 font-medium flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                          <span>Stale Cache</span>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-neutral-300" />
                          <span>Up to date</span>
                        </span>
                      )}
                    </div>

                    {/* Exact Storage Location & Metadata */}
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-400 font-mono truncate">
                      <span className="truncate flex items-center gap-1">
                        <FolderOpen className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate">{asset.storageLocation}</span>
                      </span>
                      <span className="shrink-0 text-neutral-600">&bull;</span>
                      <span className="shrink-0 capitalize">{asset.category.replace('_', ' ')}</span>
                    </div>

                    {asset.description && (
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {asset.description}
                      </p>
                    )}

                    {/* Stale Knowledge Reason alert if present */}
                    {isStale && asset.staleReason && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-between gap-2 text-[11px] text-amber-200">
                        <div className="flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{asset.staleReason}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => refreshStaleKnowledgeAsset(asset.id)}
                          className="shrink-0 px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>Refresh Cache</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Size Display (Per-item accuracy from manifest) */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-white font-mono">
                      {formatBytes(asset.storedSizeBytes)}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      orig: {formatBytes(asset.originalSizeBytes)}
                    </div>
                    {percentSaved > 0 && (
                      <div className="text-[10px] text-emerald-400 font-mono font-medium">
                        -{percentSaved}% saved
                      </div>
                    )}
                  </div>
                </div>

                {/* Per-Item Action Controls */}
                <div className="pt-2 border-t border-neutral-800/70 flex items-center justify-between gap-2 flex-wrap text-xs">
                  {/* Mode Switcher */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-semibold mr-1">
                      Mode:
                    </span>
                    <button
                      id={`asset-mode-archive-btn-${asset.id}`}
                      type="button"
                      onClick={() => handleTriggerSaveModeChange(asset, 'archive')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        isArchive
                          ? 'bg-white text-black font-semibold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Archive
                    </button>
                    <button
                      id={`asset-mode-spacesaver-btn-${asset.id}`}
                      type="button"
                      onClick={() => handleTriggerSaveModeChange(asset, 'space_saver')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        !isArchive
                          ? 'bg-amber-500 text-black font-semibold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Space-Saver
                    </button>
                  </div>

                  {/* Operational Controls: Enhance / Revert & Delete */}
                  <div className="flex items-center gap-1.5">
                    {/* Enhance / Revert toward original control */}
                    <button
                      id={`asset-revert-enhance-btn-${asset.id}`}
                      type="button"
                      onClick={() => revertOrEnhanceAssetItem(asset.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition-colors border ${
                        isArchive
                          ? isOriginal
                            ? 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                            : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white'
                          : 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-800/80 text-purple-200'
                      }`}
                      title={
                        isArchive
                          ? 'Restores bit-exact original file (100% lossless fidelity)'
                          : 'Enhances file quality. Note: True original was discarded in Space-Saver mode; this is an algorithmic approximation.'
                      }
                    >
                      {isArchive ? (
                        <>
                          <RotateCcw className="w-3 h-3 text-neutral-400" />
                          <span>{isOriginal ? 'Original Intact' : 'Revert to Exact Original'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>
                            {isApproximation
                              ? 'Re-Enhance Approx'
                              : 'Enhance Approximation'}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Delete button (Strict Part 1: delete with confirmation) */}
                    <button
                      id={`asset-delete-btn-${asset.id}`}
                      type="button"
                      onClick={() => deleteAssetFromManifest(asset.id)}
                      className="p-1.5 rounded-xl bg-neutral-800 hover:bg-red-950/60 hover:text-red-300 text-neutral-400 border border-neutral-800 hover:border-red-800/60 transition-colors"
                      title="Delete asset from manifest and free storage"
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

      {/* Tradeoff modal whenever switching mode */}
      <SaveModeTradeoffModal
        isOpen={Boolean(selectedAssetForTradeoff)}
        asset={selectedAssetForTradeoff?.asset || null}
        targetMode={selectedAssetForTradeoff?.targetMode || 'space_saver'}
        onClose={() => setSelectedAssetForTradeoff(null)}
        onConfirm={handleConfirmSaveModeChange}
      />
    </div>
  );
};
