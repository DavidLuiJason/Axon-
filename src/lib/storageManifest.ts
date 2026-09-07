import {
  AssetManifestItem,
  AssetCategory,
  SaveMode,
  QualityState,
  KnowledgeStatus,
  StorageBudgetConfig,
  TrimCategoryPriority,
} from '../types';

export const DEFAULT_STORAGE_BUDGET_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB suggested default

export const DEFAULT_STORAGE_BUDGET_CONFIG: StorageBudgetConfig = {
  budgetBytes: DEFAULT_STORAGE_BUDGET_BYTES,
  budgetMode: 'preset_15gb',
  trimPriority: [
    'cache',
    'stale_knowledge',
    'downsampled_user_files',
    'chat_history',
    'knowledge_packs',
    'models',
  ],
  warningThresholdPercent: 85,
  autoTrimOnBudgetNear: true,
};

export const DEFAULT_ASSET_MANIFEST: AssetManifestItem[] = [
  {
    id: 'asset-model-gemini-distill',
    name: 'gemini-1.5-flash-distill.bin',
    category: 'model',
    storageLocation: '/local/models/gemini-1.5-flash-distill.bin',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 2450000000, // ~2.45 GB
    storedSizeBytes: 1837500000,   // ~1.84 GB (lossless archive)
    saveMode: 'archive',
    isOriginalPreserved: true,
    qualityState: 'lossless',
    knowledgeStatus: 'current',
    description: 'Distilled on-device neural model weights for offline inference and quick syntax validation.',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    lastAccessedAt: '2026-09-06T18:30:00Z',
  },
  {
    id: 'asset-model-claude-tokenizer',
    name: 'claude-haiku-tokenizer.bin',
    category: 'model',
    storageLocation: '/local/models/tokenizers/claude-haiku.bin',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 420000000,  // 420 MB
    storedSizeBytes: 110000000,    // 110 MB (space-saver downsampled)
    saveMode: 'space_saver',
    isOriginalPreserved: false,
    qualityState: 'downsampled',
    knowledgeStatus: 'current',
    description: 'Byte-pair encoding vocabulary matrix and subword dictionary.',
    createdAt: '2026-08-22T14:15:00Z',
    updatedAt: '2026-08-22T14:15:00Z',
    lastAccessedAt: '2026-09-06T19:40:00Z',
  },
  {
    id: 'asset-pack-core-lessons',
    name: 'axon-base-core.pack',
    category: 'knowledge_pack',
    storageLocation: '/local/packs/axon-base-core.pack',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 185000000,  // 185 MB
    storedSizeBytes: 148000000,    // 148 MB (lossless archive)
    saveMode: 'archive',
    isOriginalPreserved: true,
    qualityState: 'lossless',
    knowledgeStatus: 'current',
    description: 'Core developer knowledge pack with JavaScript, Python, and shell command references.',
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-25T08:00:00Z',
    lastAccessedAt: '2026-09-06T20:10:00Z',
  },
  {
    id: 'asset-pack-legacy-dom',
    name: 'legacy-dom-apis-2023.pack',
    category: 'knowledge_pack',
    storageLocation: '/local/packs/legacy-dom-apis-2023.pack',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 240000000,  // 240 MB
    storedSizeBytes: 192000000,    // 192 MB
    saveMode: 'archive',
    isOriginalPreserved: true,
    qualityState: 'lossless',
    knowledgeStatus: 'stale',
    staleReason: 'Upstream Web Standards update available. Contains deprecated vendor prefixes and outdated Fetch polyfills.',
    description: 'DOM Level 3 and legacy browser cross-compilation reference.',
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
    lastAccessedAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'asset-cache-vector-embeddings',
    name: 'semantic-vector-embeddings.cache',
    category: 'cache',
    storageLocation: '/indexeddb/cache/semantic-vectors.db',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 310000000,  // 310 MB
    storedSizeBytes: 86800000,     // 86.8 MB (space-saver quantized)
    saveMode: 'space_saver',
    isOriginalPreserved: false,
    qualityState: 'downsampled',
    knowledgeStatus: 'stale',
    staleReason: 'Index out of date: 6 project notes and 2 code snippets were updated since last vector indexing.',
    description: 'Quantized vector embeddings for semantic project note search and code symbol lookup.',
    createdAt: '2026-08-28T16:20:00Z',
    updatedAt: '2026-08-28T16:20:00Z',
    lastAccessedAt: '2026-09-06T21:15:00Z',
  },
  {
    id: 'asset-cache-sandbox-runtime',
    name: 'code-sandbox-runtime.cache',
    category: 'cache',
    storageLocation: '/indexeddb/cache/code-sandbox.cache',
    mimeType: 'application/octet-stream',
    originalSizeBytes: 95000000,   // 95 MB
    storedSizeBytes: 76000000,     // 76 MB
    saveMode: 'archive',
    isOriginalPreserved: true,
    qualityState: 'lossless',
    knowledgeStatus: 'current',
    description: 'Cached AST parser trees and transpiled WebAssembly runtime binaries for instant code testing.',
    createdAt: '2026-09-01T11:00:00Z',
    updatedAt: '2026-09-05T14:20:00Z',
    lastAccessedAt: '2026-09-06T22:45:00Z',
  },
  {
    id: 'asset-chat-archive-2026',
    name: 'chat-transcripts-archive-2026.json',
    category: 'chat_history',
    storageLocation: '/workspace/exports/chat-archive-2026.json',
    mimeType: 'application/json',
    originalSizeBytes: 54000000,   // 54 MB
    storedSizeBytes: 14500000,     // 14.5 MB (space-saver text compressed)
    saveMode: 'space_saver',
    isOriginalPreserved: false,
    qualityState: 'downsampled',
    knowledgeStatus: 'not_applicable',
    description: 'Compressed previous session conversation histories and multi-turn debug transcripts.',
    createdAt: '2026-09-02T19:00:00Z',
    updatedAt: '2026-09-02T19:00:00Z',
    lastAccessedAt: '2026-09-06T15:10:00Z',
  },
  {
    id: 'asset-user-blueprint',
    name: 'project-architecture-blueprint.png',
    category: 'user_file',
    storageLocation: '/workspace/projects/proj-general/blueprint.png',
    mimeType: 'image/png',
    originalSizeBytes: 45000000,   // 45 MB
    storedSizeBytes: 45000000,     // 45 MB (archive lossless original)
    saveMode: 'archive',
    isOriginalPreserved: true,
    qualityState: 'original',
    knowledgeStatus: 'not_applicable',
    projectId: 'proj-general',
    description: 'High-resolution system architecture schema and workflow diagram.',
    createdAt: '2026-09-03T10:30:00Z',
    updatedAt: '2026-09-03T10:30:00Z',
    lastAccessedAt: '2026-09-06T23:00:00Z',
  },
  {
    id: 'asset-user-audio-synth',
    name: 'audio-synth-sample-48khz.wav',
    category: 'user_file',
    storageLocation: '/workspace/audio/synth-sample.wav',
    mimeType: 'audio/wav',
    originalSizeBytes: 88000000,   // 88 MB
    storedSizeBytes: 22000000,     // 22 MB (space-saver downsampled to 22kHz)
    saveMode: 'space_saver',
    isOriginalPreserved: false,
    qualityState: 'downsampled',
    knowledgeStatus: 'not_applicable',
    description: 'Audio waveform asset downsampled to 22kHz to conserve device flash storage.',
    createdAt: '2026-09-04T12:00:00Z',
    updatedAt: '2026-09-04T12:00:00Z',
    lastAccessedAt: '2026-09-06T12:20:00Z',
  },
  {
    id: 'asset-system-telemetry',
    name: 'axon-system-telemetry.log',
    category: 'system',
    storageLocation: '/local/system/telemetry.log',
    mimeType: 'text/plain',
    originalSizeBytes: 18000000,   // 18 MB
    storedSizeBytes: 4500000,      // 4.5 MB (space-saver truncated)
    saveMode: 'space_saver',
    isOriginalPreserved: false,
    qualityState: 'downsampled',
    knowledgeStatus: 'not_applicable',
    description: 'Performance traces and execution profiler logs from rule engine passes.',
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-09-06T21:00:00Z',
    lastAccessedAt: '2026-09-06T23:55:00Z',
  },
];

/**
 * Formats a raw byte count into human-readable representation (e.g. 1.84 GB, 45.0 MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface StorageBreakdown {
  totalStoredBytes: number;
  totalOriginalBytes: number;
  totalBytesSaved: number;
  overallCompressionRatio: number; // e.g. 0.72 = 72% of original size
  categoryBreakdown: Record<
    AssetCategory,
    {
      count: number;
      storedBytes: number;
      originalBytes: number;
      percentOfTotal: number;
    }
  >;
  saveModeBreakdown: {
    archive: { count: number; storedBytes: number; originalBytes: number };
    spaceSaver: { count: number; storedBytes: number; originalBytes: number };
  };
  knowledgeHealth: {
    currentCount: number;
    staleCount: number;
    staleBytes: number;
    staleItems: AssetManifestItem[];
  };
}

/**
 * Calculates per-item accurate storage metrics strictly derived from the Asset Manifest.
 */
export function calculateStorageBreakdown(
  manifest: AssetManifestItem[]
): StorageBreakdown {
  let totalStoredBytes = 0;
  let totalOriginalBytes = 0;

  const initialCat = (): {
    count: number;
    storedBytes: number;
    originalBytes: number;
    percentOfTotal: number;
  } => ({
    count: 0,
    storedBytes: 0,
    originalBytes: 0,
    percentOfTotal: 0,
  });

  const categoryBreakdown: Record<AssetCategory, ReturnType<typeof initialCat>> = {
    model: initialCat(),
    knowledge_pack: initialCat(),
    user_file: initialCat(),
    chat_history: initialCat(),
    cache: initialCat(),
    system: initialCat(),
  };

  const saveModeBreakdown = {
    archive: { count: 0, storedBytes: 0, originalBytes: 0 },
    spaceSaver: { count: 0, storedBytes: 0, originalBytes: 0 },
  };

  const knowledgeHealth = {
    currentCount: 0,
    staleCount: 0,
    staleBytes: 0,
    staleItems: [] as AssetManifestItem[],
  };

  for (const item of manifest) {
    totalStoredBytes += item.storedSizeBytes;
    totalOriginalBytes += item.originalSizeBytes;

    // Category
    const cat = categoryBreakdown[item.category] || categoryBreakdown.system;
    cat.count += 1;
    cat.storedBytes += item.storedSizeBytes;
    cat.originalBytes += item.originalSizeBytes;

    // Save mode
    if (item.saveMode === 'archive') {
      saveModeBreakdown.archive.count += 1;
      saveModeBreakdown.archive.storedBytes += item.storedSizeBytes;
      saveModeBreakdown.archive.originalBytes += item.originalSizeBytes;
    } else {
      saveModeBreakdown.spaceSaver.count += 1;
      saveModeBreakdown.spaceSaver.storedBytes += item.storedSizeBytes;
      saveModeBreakdown.spaceSaver.originalBytes += item.originalSizeBytes;
    }

    // Knowledge Health
    if (item.knowledgeStatus === 'current') {
      knowledgeHealth.currentCount += 1;
    } else if (item.knowledgeStatus === 'stale') {
      knowledgeHealth.staleCount += 1;
      knowledgeHealth.staleBytes += item.storedSizeBytes;
      knowledgeHealth.staleItems.push(item);
    }
  }

  // Calculate percentages
  for (const key of Object.keys(categoryBreakdown) as AssetCategory[]) {
    categoryBreakdown[key].percentOfTotal =
      totalStoredBytes > 0
        ? (categoryBreakdown[key].storedBytes / totalStoredBytes) * 100
        : 0;
  }

  const totalBytesSaved = Math.max(0, totalOriginalBytes - totalStoredBytes);
  const overallCompressionRatio =
    totalOriginalBytes > 0 ? totalStoredBytes / totalOriginalBytes : 1;

  return {
    totalStoredBytes,
    totalOriginalBytes,
    totalBytesSaved,
    overallCompressionRatio,
    categoryBreakdown,
    saveModeBreakdown,
    knowledgeHealth,
  };
}

/**
 * Handles the "Enhance / Revert Toward Original" operation:
 * - In ARCHIVE MODE: The true original was losslessly preserved. Restores bit-exact original (100% fidelity).
 * - In SPACE-SAVER MODE: The true original was discarded to save space. Revert is an algorithmic/AI
 *   approximation via enhancement, clearly labeled as an approximation.
 */
export function performEnhanceOrRevert(
  item: AssetManifestItem
): {
  updatedItem: AssetManifestItem;
  resultType: 'exact_lossless_restored' | 'approximation_enhanced' | 'already_peak';
  message: string;
} {
  const now = new Date().toISOString();
  const history = item.revertHistory ? [...item.revertHistory] : [];

  if (item.saveMode === 'archive') {
    // Archive Mode: Lossless true original is preserved
    if (item.qualityState === 'original' && item.storedSizeBytes === item.originalSizeBytes) {
      return {
        updatedItem: item,
        resultType: 'already_peak',
        message: `"${item.name}" is already at bit-exact peak original fidelity.`,
      };
    }

    const updated: AssetManifestItem = {
      ...item,
      storedSizeBytes: item.originalSizeBytes,
      qualityState: 'original',
      isOriginalPreserved: true,
      updatedAt: now,
      revertHistory: [
        ...history,
        {
          timestamp: now,
          action: 'reverted_lossless',
          note: 'Restored bit-exact original file with 100% lossless fidelity.',
        },
      ],
    };

    return {
      updatedItem: updated,
      resultType: 'exact_lossless_restored',
      message: `Bit-exact original restored for "${item.name}" (100% lossless restore).`,
    };
  } else {
    // Space-Saver Mode: True original was discarded!
    // Approximation via enhancement.
    // If it's already an enhanced approximation, further sharpen/enhance or maintain label
    const enhancedSize = Math.min(
      item.originalSizeBytes,
      Math.round(item.storedSizeBytes * 1.85) // Reconstructed enhancement approximation
    );

    const updated: AssetManifestItem = {
      ...item,
      storedSizeBytes: enhancedSize,
      qualityState: 'enhanced_approximation',
      isOriginalPreserved: false, // True original remains discarded
      updatedAt: now,
      revertHistory: [
        ...history,
        {
          timestamp: now,
          action: 'enhanced',
          note: 'Applied algorithmic/neural reconstruction. Note: True original was discarded in Space-Saver mode; this is an approximation.',
        },
      ],
    };

    return {
      updatedItem: updated,
      resultType: 'approximation_enhanced',
      message: `Enhanced approximation generated for "${item.name}". Note: True original was discarded in Space-Saver mode; this is an algorithmic approximation.`,
    };
  }
}

/**
 * Switches an asset between Archive Mode and Space-Saver Mode.
 * Ensures the tradeoff (discarding true original in space-saver) is tracked.
 */
export function changeAssetSaveMode(
  item: AssetManifestItem,
  targetMode: SaveMode
): AssetManifestItem {
  const now = new Date().toISOString();
  const history = item.revertHistory ? [...item.revertHistory] : [];

  if (targetMode === 'space_saver') {
    // Compresses aggressively / downsamples; discards true original
    const compressedSize = Math.round(item.originalSizeBytes * 0.28);
    return {
      ...item,
      saveMode: 'space_saver',
      isOriginalPreserved: false, // Tradeoff: true original is discarded!
      qualityState: 'downsampled',
      storedSizeBytes: compressedSize,
      updatedAt: now,
      revertHistory: [
        ...history,
        {
          timestamp: now,
          action: 'switched_mode',
          note: 'Switched to Space-Saver mode. True original discarded; future reverts will be approximations.',
        },
      ],
    };
  } else {
    // Archive mode: lossless compression with original preservation
    const archiveSize = Math.round(item.originalSizeBytes * 0.82);
    return {
      ...item,
      saveMode: 'archive',
      isOriginalPreserved: true,
      qualityState: 'lossless',
      storedSizeBytes: archiveSize,
      updatedAt: now,
      revertHistory: [
        ...history,
        {
          timestamp: now,
          action: 'switched_mode',
          note: 'Switched to Archive mode. Lossless compression enabled with bit-exact original preservation.',
        },
      ],
    };
  }
}

/**
 * Calculates a trim simulation based on the user's priority order:
 * Categories trimmed in order until targetBytesToFree is reached or candidates exhausted.
 */
export function simulateTrimPlan(
  manifest: AssetManifestItem[],
  targetBytesToFree: number,
  priorityOrder: TrimCategoryPriority[]
): {
  itemsToPrune: Array<{ item: AssetManifestItem; action: string; bytesSaved: number }>;
  totalSimulatedSavingsBytes: number;
} {
  const pruned: Array<{ item: AssetManifestItem; action: string; bytesSaved: number }> = [];
  let currentSavings = 0;
  const processedIds = new Set<string>();

  for (const step of priorityOrder) {
    if (currentSavings >= targetBytesToFree) break;

    for (const item of manifest) {
      if (processedIds.has(item.id)) continue;
      if (currentSavings >= targetBytesToFree) break;

      let matched = false;
      let actionDesc = '';
      let saved = 0;

      if (step === 'cache' && item.category === 'cache') {
        matched = true;
        actionDesc = 'Purge temporary cache entry';
        saved = item.storedSizeBytes;
      } else if (
        step === 'stale_knowledge' &&
        item.category === 'knowledge_pack' &&
        item.knowledgeStatus === 'stale'
      ) {
        matched = true;
        actionDesc = 'Remove outdated/stale knowledge pack';
        saved = item.storedSizeBytes;
      } else if (
        step === 'downsampled_user_files' &&
        item.category === 'user_file' &&
        item.saveMode === 'space_saver'
      ) {
        matched = true;
        actionDesc = 'Prune downsampled user scratch file';
        saved = item.storedSizeBytes;
      } else if (step === 'chat_history' && item.category === 'chat_history') {
        matched = true;
        actionDesc = 'Prune archived chat history log';
        saved = item.storedSizeBytes;
      } else if (
        step === 'knowledge_packs' &&
        item.category === 'knowledge_pack' &&
        item.id !== 'asset-pack-core-lessons' // protect base pack
      ) {
        matched = true;
        actionDesc = 'Prune optional knowledge pack';
        saved = item.storedSizeBytes;
      }

      if (matched && saved > 0) {
        processedIds.add(item.id);
        pruned.push({ item, action: actionDesc, bytesSaved: saved });
        currentSavings += saved;
      }
    }
  }

  return {
    itemsToPrune: pruned,
    totalSimulatedSavingsBytes: currentSavings,
  };
}
