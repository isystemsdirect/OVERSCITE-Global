/**
 * OVERSCITE Global — BANE-Watcher: Signal Registry
 * ATCB-O V1.0.00 — Phase 1 Signal Foundation
 *
 * Canonical mapping of security signals in the OVERSCITE ecosystem.
 * All observable security events must be registered here.
 */

import type { SignalDescriptor } from '../../types/security_types';

export const SIGNAL_REGISTRY: Record<string, SignalDescriptor> = {
  // Identity & Auth Signals
  'AUTH_COLLAPSE': {
    signal_id: 'AUTH_COLLAPSE',
    domain: 'identity',
    default_severity: 'high',
    description: 'Sudden, unexplained failure of established auth consensus.',
  },
  'PRIV_DRIFT': {
    signal_id: 'PRIV_DRIFT',
    domain: 'identity',
    default_severity: 'med',
    description: 'Observed permissions do not match canonical policy state.',
  },

  // Finance & Market Signals
  'FIN_ANOMALY': {
    signal_id: 'FIN_ANOMALY',
    domain: 'finance',
    default_severity: 'high',
    description: 'Transaction pattern deviates from historical baseline.',
  },
  'MARKET_CONVERGE': {
    signal_id: 'MARKET_CONVERGE',
    domain: 'marketplace',
    default_severity: 'high',
    description: 'Capability and Field market layers appear to be converging.',
  },

  // Operations & Performance Signals
  'LATENCY_DRIFT': {
    signal_id: 'LATENCY_DRIFT',
    domain: 'ops',
    default_severity: 'low',
    description: 'Significant performance regression in critical path.',
  },
  'SYNC_FAIL': {
    signal_id: 'SYNC_FAIL',
    domain: 'ops',
    default_severity: 'med',
    description: 'Failure of synchronized truth state across nodes.',
  },

  // Governance & Integrity Signals
  'CANON_BREACH': {
    signal_id: 'CANON_BREACH',
    domain: 'governance',
    default_severity: 'critical',
    description: 'Modification of a protected canonical file without ATCB-O.',
  },
  'BANE_INTEGRITY_FAIL': {
    signal_id: 'BANE_INTEGRITY_FAIL',
    domain: 'governance',
    default_severity: 'lethal',
    description: 'Failure of BANE record-sealing integrity check.',
  },
};
