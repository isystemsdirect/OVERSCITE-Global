/**
 * @fileOverview Sovereign Artifact Audit — BANE Lifecycle Events
 * @domain DocuSCRIBE / BANE / Audit
 * @canonical true
 * @status Phase 5 Implementation
 *
 * Produces cryptographically chained audit events for sovereign artifact
 * lifecycle mutations. Mirrors the stamp-audit.ts chain-hashing pattern.
 *
 * Doctrine:
 *   - Every artifact mutation emits an audit entry
 *   - No overwrite without artifact_modified audit
 *   - No export without artifact_exported with lineage reference
 *   - Chain integrity via SHA-256 hash linking
 */

import type { ForensicAuditEntry, MutationClass } from '@/lib/types';
import type { SovereignArtifactMetadata, ArtifactClass } from './sovereign-file-classes';
import { hashContent } from './types';

// ─── Audit Chain State ───────────────────────────────────────────────

let lastArtifactEventHash: string = 'GENESIS_ARTIFACT';

/**
 * Core artifact audit event builder.
 */
async function buildArtifactAuditEvent(
  mutationClass: MutationClass,
  artifact: SovereignArtifactMetadata,
  actor: string,
  details: string,
): Promise<ForensicAuditEntry> {
  const eventId = `saa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();
  const priorHash = lastArtifactEventHash;

  const checksumInput = `${eventId}:${mutationClass}:${timestamp}:${priorHash}`;
  const eventHash = await hashContent(checksumInput);
  lastArtifactEventHash = eventHash;

  return {
    event_id: eventId,
    prior_event_hash: priorHash,
    event_hash: eventHash,
    checksum: await hashContent(`${eventHash}:${actor}:${artifact.artifactId}`),
    timestamp,
    actor_type: 'human',
    actor_id: actor,
    role: 'author',
    policy_version: '1.0.0',
    engine_version: '1.0.0',
    success_state: true,
    mutation_class: mutationClass,
    linkedEntityType: `sovereign_artifact_${artifact.artifactClass}`,
    linkedEntityId: artifact.artifactId,
    linkedMethodId: artifact.methodBinding.methodId,
    provenance: {
      source: 'SovereignArtifactAudit',
      origin_id: artifact.artifactId,
      chain_of_custody_notes: details,
    },
  };
}

// ─── Public Emitters ─────────────────────────────────────────────────

/**
 * Emits an audit event when a sovereign artifact is created.
 */
export async function emitArtifactCreated(
  artifact: SovereignArtifactMetadata,
  actor: string,
): Promise<ForensicAuditEntry> {
  return buildArtifactAuditEvent(
    'artifact_created',
    artifact,
    actor,
    `Created ${artifact.artifactClass} artifact: ${artifact.artifactId}`,
  );
}

/**
 * Emits an audit event when a sovereign artifact is modified.
 */
export async function emitArtifactModified(
  artifact: SovereignArtifactMetadata,
  changeDescription: string,
  actor: string,
): Promise<ForensicAuditEntry> {
  return buildArtifactAuditEvent(
    'artifact_modified',
    artifact,
    actor,
    `Modified ${artifact.artifactClass} artifact: ${changeDescription}`,
  );
}

/**
 * Emits an audit event when a sovereign artifact is locked.
 */
export async function emitArtifactLocked(
  artifact: SovereignArtifactMetadata,
  actor: string,
): Promise<ForensicAuditEntry> {
  return buildArtifactAuditEvent(
    'artifact_locked',
    artifact,
    actor,
    `Locked ${artifact.artifactClass} artifact: ${artifact.artifactId} — no further modifications permitted`,
  );
}

/**
 * Emits an audit event when a sovereign artifact is exported.
 */
export async function emitArtifactExported(
  artifact: SovereignArtifactMetadata,
  exportFormat: string,
  actor: string,
): Promise<ForensicAuditEntry> {
  return buildArtifactAuditEvent(
    'artifact_exported',
    artifact,
    actor,
    `Exported ${artifact.artifactClass} artifact to ${exportFormat} — lineage ref: ${artifact.lineageRef.parentId || 'root'}`,
  );
}

/**
 * Resets the artifact audit chain (for testing purposes only).
 */
export function resetArtifactAuditChain(): void {
  lastArtifactEventHash = 'GENESIS_ARTIFACT';
}
