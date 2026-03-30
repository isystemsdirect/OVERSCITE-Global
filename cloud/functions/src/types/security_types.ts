/**
 * OVERSCITE Global — BANE-Watcher: Security Types
 * ATCB-O V1.0.00 — Phase 1 Signal Foundation
 *
 * Ground-truth definitions for security monitoring and observability.
 * Strictly observational. Part of the BANE Zero-Trust Infrastructure.
 */

export type SignalSeverity = 'low' | 'med' | 'high' | 'critical' | 'lethal';
export type TruthState = 'verified' | 'unverified' | 'disputed' | 'synthetic';
export type TrustLevel = 'high' | 'med' | 'low' | 'zero';

/**
 * Canonical Security Event
 * Represents a single observable security signal in the OVERSCITE ecosystem.
 */
export interface SecurityEvent {
  event_id: string;              // Primary key
  signal_id: string;             // Signal Registry ID (e.g., AUTH_COLLAPSE)
  timestamp: string;             // ISO8601
  severity: SignalSeverity;
  
  // Governance Metadata
  truth_state: TruthState;       // Is the signal confirmed by consensus?
  trust_level: TrustLevel;       // Reliability of the signal source
  bane_integrity_hash: string;   // Sealed record integrity check
  
  // Context
  org_id?: string;
  uid?: string;                  // Actor UID if applicable
  device_id?: string;            // Source device if applicable
  trace_id?: string;             // Distributed trace link
  
  // Payload
  domain: string;                // finance, identity, srt, etc.
  message: string;               // Human-readable summary
  data: Record<string, any>;     // Raw signal data
  
  // Lineage
  engine_version: string;
  policy_version: string;
}

/**
 * Signal Registry Descriptor
 */
export interface SignalDescriptor {
  signal_id: string;
  domain: string;
  default_severity: SignalSeverity;
  description: string;
}
