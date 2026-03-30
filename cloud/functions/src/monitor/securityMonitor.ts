/**
 * OVERSCITE Global — BANE-Watcher: Security Monitor
 * ATCB-O V1.0.00 — Phase 1 Signal Foundation
 *
 * Core observation and recording logic for security signals.
 * Observational only — does not modify source records.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { SIGNAL_REGISTRY } from '../lib/bane_watcher/securityRegistry';
import type { SecurityEvent, SignalSeverity, TruthState, TrustLevel } from '../types/security_types';
import { enforceBaneCallable } from '../bane/enforce';

const MONITOR_VERSION = 'sec-mon-v1';
const POLICY_VERSION = '1.0.0';

/**
 * Record a standardized Security Signal
 * This is the primary intake for BANE-Watcher signals.
 */
export const recordSecuritySignal = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({
    name: 'monitor.recordSecuritySignal',
    data,
    ctx: context,
  });

  const { signal_id, message, domain, payload, org_id, uid, severity, trust_level, truth_state } = data ?? {};
  
  if (!signal_id || !message || !domain) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing mandatory fields.');
  }

  const descriptor = SIGNAL_REGISTRY[signal_id];
  if (!descriptor) {
    throw new functions.https.HttpsError('not-found', `Unknown signal_id: ${signal_id}`);
  }

  const db = admin.firestore();
  const event_id = `sec_${db.collection('_').doc().id}`;
  const now = new Date().toISOString();

  // Sealed Record Integrity Check (Scaffolded Placeholder)
  const bane_integrity_hash = `v1_sha256_${event_id}_${now}`;

  const event: SecurityEvent = {
    event_id,
    signal_id,
    timestamp: now,
    severity: severity ?? descriptor.default_severity as SignalSeverity,
    truth_state: truth_state ?? 'verified' as TruthState,
    trust_level: trust_level ?? 'high' as TrustLevel,
    bane_integrity_hash,
    org_id,
    uid: uid ?? context.auth?.uid,
    domain,
    message,
    data: payload ?? {},
    engine_version: MONITOR_VERSION,
    policy_version: POLICY_VERSION,
  };

  // Record to the primary security log
  await db.collection('monitor_security_signals').doc(event_id).set(event);

  // If critical or higher, log a warning
  if (event.severity === 'critical' || event.severity === 'lethal') {
    functions.logger.warn(`[SECURITY_ALERT] ${event.signal_id} detected!`, {
      event_id,
      message: event.message,
      org_id,
      severity: event.severity,
    });
  }

  return {
    ok: true,
    event_id,
    severity: event.severity,
  };
});

/**
 * Audit Security Signals
 * Standardized read-only access for security audits.
 */
export const querySecuritySignals = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({
    name: 'monitor.querySecuritySignals',
    data,
    ctx: context,
  });

  const { org_id, limit = 50 } = data ?? {};
  const db = admin.firestore();
  
  let query = db.collection('monitor_security_signals')
    .orderBy('timestamp', 'desc')
    .limit(limit);

  if (org_id) {
    query = query.where('org_id', '==', org_id);
  }

  const snap = await query.get();
  const signals = snap.docs.map(d => d.data() as SecurityEvent);

  return {
    ok: true,
    count: signals.length,
    signals,
  };
});
