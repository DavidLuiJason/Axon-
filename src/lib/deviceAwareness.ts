// AXON Device Awareness & Adaptive Processing Engine
// Detects hardware profile and adapts heavy workloads for smooth execution on mobile & low-spec devices

export interface DeviceProfile {
  ramGb: number;
  cpuCores: number;
  storageEstimateMb: {
    quotaMb: number;
    usageMb: number;
    availableMb: number;
  };
  tier: 'low' | 'standard' | 'high';
  isLowEnd: boolean;
  recommendedChunkSize: number;
  pulseDelayMs: number;
}

export async function detectDeviceProfile(): Promise<DeviceProfile> {
  // 1. RAM Detection (via navigator.deviceMemory where supported)
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const ramGb: number = nav.deviceMemory || 4;

  // 2. CPU Concurrency
  const cpuCores: number = nav.hardwareConcurrency || 4;

  // 3. Storage Estimate
  let quotaMb = 15360; // 15 GB default budget
  let usageMb = 240;
  let availableMb = 15120;

  if (nav.storage && typeof nav.storage.estimate === 'function') {
    try {
      const estimate = await nav.storage.estimate();
      if (estimate.quota) {
        quotaMb = Math.round(estimate.quota / (1024 * 1024));
      }
      if (estimate.usage) {
        usageMb = Math.round(estimate.usage / (1024 * 1024));
      }
      availableMb = Math.max(0, quotaMb - usageMb);
    } catch {
      // Use fallback
    }
  }

  // 4. Determine Hardware Tier
  let tier: 'low' | 'standard' | 'high' = 'standard';
  if (ramGb < 4 || cpuCores <= 2) {
    tier = 'low';
  } else if (ramGb >= 8 && cpuCores >= 6) {
    tier = 'high';
  }

  const isLowEnd = tier === 'low';
  const recommendedChunkSize = isLowEnd ? 256 * 1024 : 1024 * 1024; // 256KB on low, 1MB on standard
  const pulseDelayMs = isLowEnd ? 20 : 5;

  return {
    ramGb,
    cpuCores,
    storageEstimateMb: {
      quotaMb,
      usageMb,
      availableMb,
    },
    tier,
    isLowEnd,
    recommendedChunkSize,
    pulseDelayMs,
  };
}

/**
 * Pulse / Bit-by-bit chunked processing runner
 * Executes items in small batches yielding to the event loop so UI does not freeze on mobile/low-spec devices
 */
export async function runPulseTask<T, R>(
  items: T[],
  processItem: (item: T, index: number) => Promise<R> | R,
  onProgress?: (completed: number, total: number, percentage: number) => void,
  pulseDelayMs: number = 10,
  batchSize: number = 1
): Promise<R[]> {
  const results: R[] = [];
  const total = items.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item, idx) => processItem(item, i + idx))
    );
    results.push(...batchResults);

    const completed = Math.min(i + batchSize, total);
    if (onProgress) {
      const pct = Math.round((completed / total) * 100);
      onProgress(completed, total, pct);
    }

    // Yield control to the browser event loop
    await new Promise((resolve) => setTimeout(resolve, pulseDelayMs));
  }

  return results;
}
