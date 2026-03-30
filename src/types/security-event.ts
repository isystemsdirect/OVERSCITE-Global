/**
 * BANE-Watcher — Canonical SecurityEvent Types
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

import { Timestamp, FieldValue } from 'firebase/firestore';
import { TruthState } from './truth-state';

export type SecuritySeverity =
  | 'debug'
  | 'info'
  | 'warning'
  | 'elevated'
  | 'critical'
  | 'safety_critical';

export type SourceClass =
  | 'os'
  | 'edr'
  | 'network'
  | 'application'
  | 'device';

export interface SecurityTrustMetadata {
  /** Source reliability score (0.0 to 1.0). */
  sourceReliability: number;
  /** Whether the signal has been cryptographically or protocol-verified. */
  verified: boolean;
  /** Categorical class of the signal source. */
  sourceClass: SourceClass;
}

export interface SecurityEvent {
  /** Unique normalized event identifier. */
  id: string;
  /** Identity of the registered source adapter. */
  source: string;
  /** Source-specific event type string. */
  type: string;
  /** Normalized severity assignment. */
  severity: SecuritySeverity;
  /** Mandatory truth-state disclosure. */
  truthState: TruthState;
  /** Normalized trust metadata. */
  trust: SecurityTrustMetadata;
  /** ISO-8601 or Firestore timestamp. */
  timestamp: Timestamp | FieldValue | string;
  /** Optional hardware/session device linkage. */
  deviceId?: string;
  /** Optional human actor/user linkage. */
  userId?: string;
  /** Raw payload reference or truncated payload blob. */
  payload?: any;
  /** Reference to the full raw payload artifact if separate. */
  payloadRef?: string;
}
