/**
 * DocuSCRIBE™ — Core Document Model, Authority Classes, Trust Stamp & CARR
 *
 * @classification DATA_MODEL
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 * @phase Phase 2 — Trust Stamp, CARR, and Formal Generation Gate
 *
 * Defines the canonical document structure, authority class enforcement,
 * Trust Stamp issuance, CARR calculation, stamp audit types, and
 * type-safe helpers for the DocuSCRIBE™ governed authoring system.
 */

// ─── Authority Classes ───────────────────────────────────────────────
// These define the edit/view posture of a document. Enforcement is mandatory.

export type AuthorityClass =
  | 'draft_editable'
  | 'partial_edit'
  | 'immutable_view_only'
  | 'protected_log_view_only'
  | 'finalized_fork_only';

// ─── Document Status ─────────────────────────────────────────────────

export type DocumentStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'archived'
  | 'superseded';

// ─── Core Document Interface ────────────────────────────────────────

export interface DocuScribeDocument {
  /** Unique document identifier */
  document_id: string;
  /** Human-readable document title */
  title: string;
  /** Current lifecycle status */
  status: DocumentStatus;
  /** Governs edit/view permissions */
  authority_class: AuthorityClass;
  /** Whether this document has been formally verified */
  is_verified: boolean;
  /** Major version number */
  version: number;
  /** Minor version number within a major version */
  sub_version: number;
  /** Reference to the parent document ID for lineage tracking */
  lineage_parent_id: string | null;
  /** ISO timestamp of creation */
  created_at: string;
  /** ISO timestamp of last modification */
  updated_at: string;
  /** Document body content */
  content: string;
  /** Template ID used to create this document (if any) */
  template_id: string | null;
  /** Trust Stamp applied to this document (P2) */
  trust_stamp?: TrustStamp | null;
  /** Findings with confidence values for CARR calculation (P2) */
  findings?: DocumentFinding[];
}

// ─── Document Template ──────────────────────────────────────────────

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  default_content: string;
  authority_class: AuthorityClass;
}

// ─── Authority Class Enforcement Helpers ─────────────────────────────

/**
 * Determines whether a document is editable based on its authority class.
 * Protected logs are NEVER editable. Immutable = view/export only.
 */
export function canEdit(authorityClass: AuthorityClass): boolean {
  switch (authorityClass) {
    case 'draft_editable':
      return true;
    case 'partial_edit':
      return true; // Editable regions only — UI must enforce locked-region indicators
    case 'immutable_view_only':
      return false;
    case 'protected_log_view_only':
      return false;
    case 'finalized_fork_only':
      return false; // View only; fork creates a new draft_editable document
    default:
      return false;
  }
}

/**
 * Convenience: checks if a full document is editable.
 */
export function isEditable(doc: DocuScribeDocument): boolean {
  return canEdit(doc.authority_class);
}

/**
 * Returns a human-readable label for an authority class.
 */
export function getAuthorityClassLabel(ac: AuthorityClass): string {
  switch (ac) {
    case 'draft_editable':
      return 'Draft — Editable';
    case 'partial_edit':
      return 'Partial Edit';
    case 'immutable_view_only':
      return 'Immutable — View Only';
    case 'protected_log_view_only':
      return 'Protected Log — View Only';
    case 'finalized_fork_only':
      return 'Finalized — Fork Only';
    default:
      return 'Unknown';
  }
}

/**
 * Returns Tailwind color classes for authority class display.
 * Consistent with OVERSCITE design token vocabulary.
 */
export function getAuthorityClassColor(ac: AuthorityClass): string {
  switch (ac) {
    case 'draft_editable':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'partial_edit':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'immutable_view_only':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'protected_log_view_only':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'finalized_fork_only':
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    default:
      return 'bg-white/5 text-white/50 border-white/10';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Phase 2 — Trust Stamp, CARR, Findings, and Stamp Audit
// ═══════════════════════════════════════════════════════════════════════

// ─── Finding Confidence ─────────────────────────────────────────────

export type FindingConfidence = 'high' | 'medium' | 'low' | 'inconclusive';

export type FindingSeverity = 'Critical' | 'Major' | 'Minor' | 'None';

export interface DocumentFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  category: string;
}


// ─── Trust Stamp ────────────────────────────────────────────────────

export interface TrustStamp {
  /** Unique stamp identifier */
  stamp_id: string;
  /** Human identity that issued the stamp */
  issued_by: string;
  /** ISO timestamp of stamp issuance */
  issued_at: string;
  /** Document this stamp is bound to */
  document_id: string;
  /** Exact major version at time of stamp */
  document_version: number;
  /** Exact sub-version at time of stamp */
  document_sub_version: number;
  /** CARR score at time of stamp (0.0–1.0) */
  carr_score: number;
  /** Ordered list of approver identifiers in the approval chain */
  approval_chain: string[];
  /** SHA-256 hash of document content at stamp time */
  content_hash: string;
  /** Whether this stamp is currently valid */
  is_valid: boolean;
}

// ─── Stamp Audit ────────────────────────────────────────────────────

export type StampAuditAction =
  | 'stamp_issued'
  | 'stamp_revoked'
  | 'stamp_reissued'
  | 'stamp_viewed'
  | 'generation_blocked'
  | 'generation_authorized';

export interface StampAuditEntry {
  /** Unique entry identifier */
  entry_id: string;
  /** Stamp ID this entry relates to */
  stamp_id: string;
  /** Document ID this entry relates to */
  document_id: string;
  /** Action performed */
  action: StampAuditAction;
  /** Identity of the actor performing the action */
  actor: string;
  /** ISO timestamp */
  timestamp: string;
  /** Human-readable detail string */
  detail: string;
  /** Cryptographic hash of this entry for chain integrity */
  hash: string;
  /** Hash of the prior entry for chain linking (null for first entry) */
  prior_hash: string | null;
}

// ─── Confidence Helpers ─────────────────────────────────────────────

/**
 * Returns a numeric weight for a finding confidence level.
 * Used in CARR calculation.
 */
export function getConfidenceWeight(conf: FindingConfidence): number {
  switch (conf) {
    case 'high': return 1.0;
    case 'medium': return 0.7;
    case 'low': return 0.4;
    case 'inconclusive': return 0.1;
    default: return 0;
  }
}

/**
 * Returns Tailwind color classes for a finding confidence level.
 */
export function getConfidenceColor(conf: FindingConfidence): string {
  switch (conf) {
    case 'high': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'low': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'inconclusive': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default: return 'bg-white/5 text-white/50 border-white/10';
  }
}

// ─── CARR Calculation ───────────────────────────────────────────────

/**
 * Calculates the Confidence-Adjusted Report Rating (CARR).
 * CARR = average of all finding confidence weights.
 * Returns 0 if no findings exist.
 */
export function calculateCARR(findings: DocumentFinding[]): number {
  if (!findings || findings.length === 0) return 0;
  const totalWeight = findings.reduce((sum, f) => sum + getConfidenceWeight(f.confidence), 0);
  return Math.round((totalWeight / findings.length) * 100) / 100;
}

// ─── Formal Report Generation Gate ──────────────────────────────────

/**
 * Determines whether a document is eligible for formal report generation.
 * A valid Trust Stamp must be present.
 */
export function canGenerateFormalReport(doc: DocuScribeDocument): boolean {
  return !!doc.trust_stamp && doc.trust_stamp.is_valid;
}

// ─── Content Hashing ────────────────────────────────────────────────

/**
 * Computes SHA-256 hash of content using browser-native SubtleCrypto.
 * Falls back to a deterministic mock hash if SubtleCrypto is unavailable.
 */
export async function hashContent(content: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const buffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(buffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fall through to mock hash
  }
  // Deterministic fallback for SSR or environments without SubtleCrypto
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `mock-sha256-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}
