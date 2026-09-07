import React from 'react';
import { X, FileCode, Trash2, Play, FolderOpen, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavedScript } from '../../types';

interface SavedScriptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScript: (script: SavedScript) => void;
}

export const SavedScriptsModal: React.FC<SavedScriptsModalProps> = ({
  isOpen,
  onClose,
  onLoadScript,
}) => {
  const { savedScripts, deleteScript, requestConfirmation } = useApp();

  if (!isOpen) return null;

  const handleDeleteWithConfirmation = (script: SavedScript) => {
    requestConfirmation({
      title: 'Delete Script',
      message: `Are you sure you want to delete "${script.title}"? This cannot be undone.`,
      confirmLabel: 'Delete Script',
      danger: true,
      onConfirm: () => {
        deleteScript(script.id);
      },
    });
  };

  return (
    <div
      id="saved-scripts-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-white" />
            <h3 className="text-sm font-semibold text-white">Saved Scripts & Creations</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Saved Scripts */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {savedScripts.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No saved scripts yet. Save your code snippets from the editor.
            </div>
          ) : (
            savedScripts.map((script) => (
              <div
                key={script.id}
                id={`saved-script-${script.id}`}
                className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-3 group hover:border-neutral-700 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <h4 className="text-xs font-semibold text-white truncate">{script.title}</h4>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                      {script.language}
                    </span>
                  </div>
                  {script.description && (
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {script.description}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(script.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadScript(script);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all shadow-sm flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>Load</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteWithConfirmation(script)}
                    className="p-1.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Delete script with confirmation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
