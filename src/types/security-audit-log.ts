/**
 * BANE-Watcher — Canonical SecurityAuditLog Types
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

export type SecurityAuditAction =
  | 'security_signal_ingested'
  | 'security_signal_normalized'
  | 'security_signal_stored'
  | 'security_source_registered'
  | 'security_panel_rendered';

export interface SecurityAuditLog {
  /** Reference to the normalized event ID. */
  eventId: string;
  /** Mandatory audit action type. */
  action: SecurityAuditAction;
  /** Identity account performing the action. */
  actor: string;
  /** Operational timestamp. */
  timestamp: Timestamp | FieldValue | string;
  /**
   * Cryptographic hash of the logic and data state for this transition.
   * If reconstruction is impossible, the design is governance-deficient.
   */
  hash: string;
  /** Link to prior state for audit chain integrity. */
  prior_hash?: string;
  /** Intermediate or final result state of the action. */
  resultState: string;
  /** Optional source identity reference. */
  source?: string;
  /** Optional Firestore collection target reference. */
  collection?: string;
}
