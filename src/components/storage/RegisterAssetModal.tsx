import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FilePlus,
  X,
  Check,
  Archive,
  Zap,
  FolderOpen,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AssetCategory, SaveMode } from '../../types';
import { formatBytes } from '../../lib/storageManifest';

interface RegisterAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterAssetModal: React.FC<RegisterAssetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerAssetInManifest, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('user_file');
  const [storagePath, setStoragePath] = useState('/workspace/projects/');
  const [sizeBytes, setSizeBytes] = useState<number>(1048576); // 1 MB default
  const [saveMode, setSaveMode] = useState<SaveMode>('archive');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setName(file.name);
    setSizeBytes(file.size);

    // Auto-detect category based on extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'bin' || ext === 'onnx' || ext === 'gguf') {
      setCategory('model');
      setStoragePath(`/local/models/${file.name}`);
    } else if (ext === 'md' || ext === 'json') {
      setCategory('knowledge_pack');
      setStoragePath(`/local/knowledge/${file.name}`);
    } else {
      setCategory('user_file');
      setStoragePath(`/workspace/files/${file.name}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please provide an asset name');
      return;
    }

    const path = storagePath.trim() || `/local/assets/${name.trim()}`;
    registerAssetInManifest({
      name: name.trim(),
      category,
      storageLocation: path,
      originalSizeBytes: sizeBytes,
      saveMode,
      description: description.trim() || undefined,
    });

    onClose();
  };

  return (
    <div
      id="register-asset-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white">
              <FilePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Register Asset in Manifest</h3>
              <p className="text-[11px] text-neutral-400">
                Track file with exact byte storage metrics & save mode
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

        {/* Body */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5 text-xs text-neutral-300">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-white bg-neutral-800/80'
                : 'border-neutral-750 hover:border-neutral-600 bg-black/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-white">
              Drop any file to auto-detect size & path
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              or click to browse local files
            </p>
          </div>

          {/* Asset Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Asset Name
            </label>
            <input
              id="register-asset-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., custom-syntax-parser.ts"
              className="w-full bg-neutral-850 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Category
            </label>
            <select
              id="register-asset-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as AssetCategory)}
              className="w-full bg-neutral-850 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
            >
              <option value="model">AI Models & Weights (neural weights/tokenizers)</option>
              <option value="knowledge_pack">Knowledge Packs (offline reference bases)</option>
              <option value="user_file">User Files & Media (code, scripts, assets)</option>
              <option value="cache">Cache & Embeddings (ASTs, vector indices)</option>
              <option value="chat_history">Chat History (transcripts, logs)</option>
              <option value="system">System & Telemetry (traces, states)</option>
            </select>
          </div>

          {/* Storage Path */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Storage Location
            </label>
            <input
              id="register-asset-path-input"
              type="text"
              value={storagePath}
              onChange={(e) => setStoragePath(e.target.value)}
              placeholder="e.g., /workspace/models/custom.bin"
              className="w-full bg-neutral-850 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-white"
              required
            />
          </div>

          {/* Size */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                Raw Size (Bytes)
              </label>
              <span className="font-mono text-neutral-400 text-[11px]">
                {formatBytes(sizeBytes)}
              </span>
            </div>
            <input
              id="register-asset-size-input"
              type="number"
              min="1"
              value={sizeBytes}
              onChange={(e) => setSizeBytes(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-neutral-850 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
              required
            />
          </div>

          {/* Save Mode Choice */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Save Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSaveMode('archive')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  saveMode === 'archive'
                    ? 'bg-neutral-800 border-white text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Mode</span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Default lossless compression. Original preserved.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSaveMode('space_saver')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  saveMode === 'space_saver'
                    ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Space-Saver</span>
                </div>
                <p className="text-[10px] text-amber-400/80 mt-1">
                  Aggressive ~72% save. Discards true original.
                </p>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., AST grammar index for syntax checker"
              className="w-full bg-neutral-850 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-register-asset-btn"
              type="submit"
              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Register In Manifest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
