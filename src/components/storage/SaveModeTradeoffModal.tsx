import React from 'react';
import { AlertCircle, Archive, Zap, ArrowRight, X, ShieldAlert, Check } from 'lucide-react';
import { AssetManifestItem, SaveMode } from '../../types';
import { formatBytes } from '../../lib/storageManifest';

interface SaveModeTradeoffModalProps {
  isOpen: boolean;
  asset: AssetManifestItem | null;
  targetMode: SaveMode;
  onClose: () => void;
  onConfirm: () => void;
}

export const SaveModeTradeoffModal: React.FC<SaveModeTradeoffModalProps> = ({
  isOpen,
  asset,
  targetMode,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !asset) return null;

  const isSwitchingToSpaceSaver = targetMode === 'space_saver';
  const estimatedSavings = isSwitchingToSpaceSaver
    ? Math.max(0, asset.storedSizeBytes - Math.round(asset.originalSizeBytes * 0.28))
    : 0;

  return (
    <div
      id="save-mode-tradeoff-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                isSwitchingToSpaceSaver
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-white'
              }`}
            >
              {isSwitchingToSpaceSaver ? (
                <Zap className="w-4 h-4" />
              ) : (
                <Archive className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isSwitchingToSpaceSaver
                  ? 'Enable Space-Saver Mode'
                  : 'Switch to Archive Mode'}
              </h3>
              <p className="text-[11px] text-neutral-400 truncate max-w-[240px]">
                {asset.name}
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

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs text-neutral-300">
          {isSwitchingToSpaceSaver ? (
            <>
              {/* Critical Tradeoff Warning Box */}
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Important Tradeoff: True Original Discarded</span>
                </div>
                <p className="text-amber-200/90 leading-relaxed text-[11px]">
                  Space-Saver mode aggressively compresses or downsamples this file and{' '}
                  <strong className="text-white underline">
                    permanently discards the true original
                  </strong>{' '}
                  to preserve device storage.
                </p>
                <div className="pt-1 text-[11px] text-amber-300/80 border-t border-amber-800/50">
                  <strong>Revert Tradeoff:</strong> Any future revert or enhance command will be{' '}
                  <span className="text-white font-medium">an AI/algorithmic approximation</span>,
                  not a bit-exact restoration.
                </div>
              </div>

              {/* Compression Metric Preview */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-neutral-800">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Current Size
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {formatBytes(asset.storedSizeBytes)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                    Space-Saver Target
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                    <span>{formatBytes(Math.round(asset.originalSizeBytes * 0.28))}</span>
                    <span className="text-[10px] text-emerald-300">
                      (~72% saved)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-neutral-400 text-[11px]">
                Recommended for low-spec mobile devices or non-critical preview assets where preserving raw bits is less important than staying under your 15GB budget.
              </p>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/80 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Archive className="w-4 h-4 text-neutral-200 shrink-0" />
                  <span>Archive Mode (Lossless Fidelity)</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  Archive mode preserves the full bit-exact original file using lossless compression. You will always be able to perfectly restore 100% of the original content without approximation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 text-[11px] text-neutral-300">
                Target stored size will adjust to approx.{' '}
                <strong className="text-white">
                  {formatBytes(Math.round(asset.originalSizeBytes * 0.82))}
                </strong>{' '}
                (Lossless container).
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-save-mode-switch-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSwitchingToSpaceSaver
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>
              {isSwitchingToSpaceSaver
                ? 'Accept Tradeoff & Enable Space-Saver'
                : 'Switch to Archive Mode'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
