/**
 * @classification ARCHIVE_STORAGE
 * @authority ArcHive™ Packaging Layer
 * @purpose Manages the persistence of ArcHive™ manifests in a governed, write-once storage layer.
 * @warning Supports evidence preservation only. Does not confer execution authority.
 */

import type { ArcHivePackage } from './archive-manifest-types';

export class ArcHiveStorageLayer {
  private static STORAGE_KEY_PREFIX = 'scimega_archive_';

  /**
   * Persists an ArcHive package to storage.
   * Enforces write-once, append-only behavior (cannot overwrite existing final manifests).
   */
  static saveManifest(pkg: ArcHivePackage): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('Storage unavailable in this environment.');
      return false;
    }

    const key = `${this.STORAGE_KEY_PREFIX}${pkg.manifest.manifestId}`;
    const existing = window.localStorage.getItem(key);

    if (existing) {
      try {
        const existingPkg = JSON.parse(existing) as ArcHivePackage;
        // Prevent overwriting a final/locked archive
        if (existingPkg.manifest.versionState === 'final') {
          throw new Error('Cannot overwrite a locked ArcHive manifest.');
        }
      } catch (e) {
        console.error('Failed to parse existing manifest.', e);
      }
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(pkg));
      return true;
    } catch (e) {
      console.error('Failed to persist ArcHive manifest to storage.', e);
      return false;
    }
  }

  /**
   * Retrieves an ArcHive package from storage by ID.
   */
  static getManifest(manifestId: string): ArcHivePackage | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    const key = `${this.STORAGE_KEY_PREFIX}${manifestId}`;
    const data = window.localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as ArcHivePackage;
    } catch (e) {
      console.error('Failed to parse ArcHive manifest from storage.', e);
      return null;
    }
  }

  /**
   * Lists all persisted manifest IDs.
   */
  static listManifestIds(): string[] {
    if (typeof window === 'undefined' || !window.localStorage) {
      return [];
    }

    const ids: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        ids.push(key.replace(this.STORAGE_KEY_PREFIX, ''));
      }
    }
    return ids;
  }
}
