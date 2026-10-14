import { getStoredApplications, saveStoredApplications } from './db';

export interface StorageHealth {
  usedBytes: number;
  usedKB: number;
  estimatedPercent: number; // Based on 5MB max
  isNearLimit: boolean;
}

export class StorageQuotaManager {
  private static MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  /**
   * Check current localStorage consumption.
   */
  static getStorageHealth(): StorageHealth {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const val = localStorage.getItem(key) || '';
        totalBytes += (key.length + val.length) * 2; // UTF-16 estimation
      }
    }

    const usedKB = Math.round(totalBytes / 1024);
    const estimatedPercent = Math.min(100, Math.round((totalBytes / this.MAX_BYTES) * 100));

    return {
      usedBytes: totalBytes,
      usedKB,
      estimatedPercent,
      isNearLimit: estimatedPercent > 80
    };
  }

  /**
   * Auto-prune unapproved applications older than 30 days to free up space.
   */
  static pruneOldDrafts(): { freedBytes: number; prunedCount: number } {
    const before = this.getStorageHealth().usedBytes;
    const apps = getStoredApplications();

    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
    const isoThreshold = date30DaysAgo.toISOString().substring(0, 10);

    const keptApps = apps.filter(app => {
      // Keep approved or active apps
      if (app.isBatchApproved || app.currentStage >= 7 || app.status === 'Enviada') {
        return true;
      }
      // Prune unapproved drafts older than 30 days
      return app.createdDate >= isoThreshold;
    });

    const prunedCount = apps.length - keptApps.length;
    if (prunedCount > 0) {
      saveStoredApplications(keptApps);
    }

    const after = this.getStorageHealth().usedBytes;
    return {
      freedBytes: Math.max(0, before - after),
      prunedCount
    };
  }
}
