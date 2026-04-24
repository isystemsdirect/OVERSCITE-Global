/**
 * @fileOverview ArcHive™ Versioning — Sovereign Artifact Lineage Control
 * @domain DocuSCRIBE / ArcHive / Versioning
 * @canonical true
 * @status Phase 5 Implementation
 *
 * Enforces archive-before-mutate doctrine and version chain tracking
 * for all sovereign DocuSCRIBE™ artifacts.
 *
 * Doctrine:
 *   - Archive before mutate
 *   - No silent edits
 *   - Full diff trace required
 *   - Version snapshots embedded in lineageRef.versionChain
 */

import type { SovereignArtifactMetadata, SovereignArtifact } from './sovereign-file-classes';

// ═══════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════

export interface ArtifactVersionEntry {
  versionId: string;
  artifactId: string;
  artifactClass: string;
  timestamp: string;
  actor: string;
  changeLog: string;
  snapshotHash: string;
  /** Serialized snapshot — stored as JSON string */
  snapshot: string;
}

export interface ArtifactDiff {
  field: string;
  before: string;
  after: string;
}

// ═══════════════════════════════════════════════════════════════════════
// In-Memory Version Store
// ═══════════════════════════════════════════════════════════════════════

const versionStore: Map<string, ArtifactVersionEntry[]> = new Map();

// ═══════════════════════════════════════════════════════════════════════
// Version Operations
// ═══════════════════════════════════════════════════════════════════════

/**
 * Archives the current state of an artifact before mutation.
 * Enforces archive-before-mutate doctrine.
 */
export function archiveBeforeMutate(
  artifact: SovereignArtifactMetadata,
  actor: string,
): ArtifactVersionEntry {
  const versionId = `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const snapshot = JSON.stringify(artifact);

  // Simple hash for version tracking (production would use SHA-256)
  let hash = 0;
  for (let i = 0; i < snapshot.length; i++) {
    const chr = snapshot.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  const entry: ArtifactVersionEntry = {
    versionId,
    artifactId: artifact.artifactId,
    artifactClass: artifact.artifactClass,
    timestamp: new Date().toISOString(),
    actor,
    changeLog: 'Pre-mutation archive',
    snapshotHash: Math.abs(hash).toString(16),
    snapshot,
  };

  const existing = versionStore.get(artifact.artifactId) || [];
  existing.push(entry);
  versionStore.set(artifact.artifactId, existing);

  return entry;
}

/**
 * Creates a new version entry for an artifact after mutation.
 * Updates the artifact's lineageRef.versionChain.
 */
export function createArtifactVersion(
  artifact: SovereignArtifactMetadata,
  changeLog: string,
  actor: string,
): ArtifactVersionEntry {
  // Archive current state first
  const archiveEntry = archiveBeforeMutate(artifact, actor);

  // Create version entry
  const versionId = `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const snapshot = JSON.stringify(artifact);

  let hash = 0;
  for (let i = 0; i < snapshot.length; i++) {
    const chr = snapshot.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }

  const entry: ArtifactVersionEntry = {
    versionId,
    artifactId: artifact.artifactId,
    artifactClass: artifact.artifactClass,
    timestamp: new Date().toISOString(),
    actor,
    changeLog,
    snapshotHash: Math.abs(hash).toString(16),
    snapshot,
  };

  const existing = versionStore.get(artifact.artifactId) || [];
  existing.push(entry);
  versionStore.set(artifact.artifactId, existing);

  // Update lineage chain on the artifact
  artifact.lineageRef.versionChain.push(versionId);
  artifact.updatedAt = new Date().toISOString();

  return entry;
}

/**
 * Returns the full version history for an artifact.
 */
export function getArtifactHistory(artifactId: string): ArtifactVersionEntry[] {
  return (versionStore.get(artifactId) || []).map(e => ({ ...e }));
}

/**
 * Performs a structural diff between two version snapshots.
 */
export function diffArtifactVersions(
  versionA: ArtifactVersionEntry,
  versionB: ArtifactVersionEntry,
): ArtifactDiff[] {
  const diffs: ArtifactDiff[] = [];

  try {
    const objA = JSON.parse(versionA.snapshot) as Record<string, unknown>;
    const objB = JSON.parse(versionB.snapshot) as Record<string, unknown>;

    const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

    for (const key of allKeys) {
      const valA = JSON.stringify(objA[key]) || 'undefined';
      const valB = JSON.stringify(objB[key]) || 'undefined';

      if (valA !== valB) {
        diffs.push({
          field: key,
          before: valA.substring(0, 200),
          after: valB.substring(0, 200),
        });
      }
    }
  } catch {
    diffs.push({
      field: '_parse_error',
      before: 'Could not parse version A',
      after: 'Could not parse version B',
    });
  }

  return diffs;
}

/**
 * Restores an artifact to a previous version state.
 * Returns the restored metadata for the caller to apply.
 */
export function restoreArtifactVersion(
  artifactId: string,
  versionId: string,
  actor: string,
): { restored: SovereignArtifactMetadata | null; changeLog: string } {
  const history = versionStore.get(artifactId) || [];
  const targetVersion = history.find(v => v.versionId === versionId);

  if (!targetVersion) {
    return { restored: null, changeLog: `Version ${versionId} not found for artifact ${artifactId}` };
  }

  try {
    const restored = JSON.parse(targetVersion.snapshot) as SovereignArtifactMetadata;
    restored.updatedAt = new Date().toISOString();
    restored.lineageRef.versionChain.push(`restore-${versionId}`);
    return {
      restored,
      changeLog: `Restored to version ${versionId} by ${actor}`,
    };
  } catch {
    return { restored: null, changeLog: `Failed to parse snapshot for version ${versionId}` };
  }
}

/**
 * Clears the version store (for testing purposes only).
 */
export function clearVersionStore(): void {
  versionStore.clear();
}
