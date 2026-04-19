/**
 * DocuSCRIBE™ — Stamp Audit Log Manager
 *
 * @classification DATA_SERVICE
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * In-memory, append-only audit chain for Trust Stamp events.
 * Mirrors BANE SecurityAuditLog hash/prior_hash chain pattern.
 *
 * Audit entries are NEVER editable or deletable once created.
 * Each entry's hash binds to the prior entry's hash for chain integrity.
 */

import type { StampAuditAction, StampAuditEntry } from './types';
import { hashContent } from './types';

// ─── In-Memory Audit Chain ──────────────────────────────────────────

let auditChain: StampAuditEntry[] = [];

/**
 * Computes a deterministic hash for an audit entry.
 * Uses entry_id + action + timestamp + prior_hash as input.
 */
async function computeEntryHash(
  entryId: string,
  action: StampAuditAction,
  timestamp: string,
  priorHash: string | null
): Promise<string> {
  const input = `${entryId}:${action}:${timestamp}:${priorHash ?? 'GENESIS'}`;
  return hashContent(input);
}

/**
 * Records a stamp audit action. Append-only — no edit or delete.
 * Returns the created audit entry.
 */
export async function recordStampAction(
  action: StampAuditAction,
  stampId: string,
  documentId: string,
  actor: string,
  detail: string
): Promise<StampAuditEntry> {
  const priorHash = auditChain.length > 0
    ? auditChain[auditChain.length - 1].hash
    : null;

  const entryId = `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const timestamp = new Date().toISOString();
  const hash = await computeEntryHash(entryId, action, timestamp, priorHash);

  const entry: StampAuditEntry = {
    entry_id: entryId,
    stamp_id: stampId,
    document_id: documentId,
    action,
    actor,
    timestamp,
    detail,
    hash,
    prior_hash: priorHash,
  };

  auditChain.push(entry);
  return entry;
}

/**
 * Returns all audit entries for a specific document.
 * Read-only — returns a copy to prevent external mutation.
 */
export function getAuditLog(documentId: string): StampAuditEntry[] {
  return auditChain
    .filter(e => e.document_id === documentId)
    .map(e => ({ ...e }));
}

/**
 * Returns the full audit chain across all documents.
 * Read-only — returns a copy.
 */
export function getFullAuditChain(): StampAuditEntry[] {
  return auditChain.map(e => ({ ...e }));
}

/**
 * Seeds the audit chain with pre-existing entries (for mock data).
 * Only callable when the chain is empty — prevents overwrite.
 */
export function seedAuditChain(entries: StampAuditEntry[]): void {
  if (auditChain.length === 0) {
    auditChain = [...entries];
  }
}

/**
 * Returns the current chain length (for diagnostics).
 */
export function getChainLength(): number {
  return auditChain.length;
}
