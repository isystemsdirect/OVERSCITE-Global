/**
 * OVERSCITE Global — LARI-Monitor: classifyEvent Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function.
 * Accepts a raw event payload, validates against CanonicalMonitorEvent schema,
 * assigns trust_class, severity, actionability, visibility_class, and writes
 * to the appropriate monitor_events_{domain} collection via Admin SDK.
 *
 * BANE-gated: only authenticated actors with 'bane:invoke' capability may call.
 * LARI-Monitor is observational. This function does not alter entitlements,
 * payouts, or governance state — classification only.
 *
 * Implementation Status: LIVE — classification logic.
 * Firestore write: requires monitor_events_* collections to exist.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import type { CanonicalMonitorEvent, MonitorDomain } from '../types/monitor';
import {
  MONITOR_COLLECTION_MAP,
  MONITOR_SHARED_COLLECTIONS,
} from '../types/monitor';

// ---------------------------------------------------------------------------
// ENGINE CONSTANTS
// ---------------------------------------------------------------------------

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// DOMAIN → COLLECTION resolver
// ---------------------------------------------------------------------------

function resolveCollection(domain: MonitorDomain): string {
  return MONITOR_COLLECTION_MAP[domain] ?? 'monitor_events_admin_ops';
}

// ---------------------------------------------------------------------------
// CALLABLE
// ---------------------------------------------------------------------------

export const classifyEvent = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'monitor.classifyEvent',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  // ----- Input validation -----
  const rawEvent = data?.event as Partial<CanonicalMonitorEvent> | undefined;
  if (!rawEvent) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'classifyEvent: event payload is required.',
    );
  }

  const required = [
    'event_domain', 'event_type', 'org_id', 'actor_id',
    'actor_role', 'entity_type', 'entity_id', 'source_service', 'source_ref',
  ] as const;

  const missingFields = required.filter((f) => !rawEvent[f]);
  if (missingFields.length > 0) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `classifyEvent: missing required fields: ${missingFields.join(', ')}`,
    );
  }

  const domain = rawEvent.event_domain as MonitorDomain;

  // ----- Assemble canonical event -----
  const event_id = rawEvent.event_id ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const canonicalEvent: CanonicalMonitorEvent = {
    event_id,
    event_domain:    domain,
    event_type:      rawEvent.event_type!,
    event_subtype:   rawEvent.event_subtype,
    org_id:          rawEvent.org_id!,
    actor_id:        rawEvent.actor_id!,
    actor_role:      rawEvent.actor_role!,
    entity_type:     rawEvent.entity_type!,
    entity_id:       rawEvent.entity_id!,
    trust_class:     rawEvent.trust_class ?? deriveDefaultTrustClass(domain),
    severity:        rawEvent.severity ?? 'info',
    actionability:   rawEvent.actionability ?? 'none',
    visibility_class: rawEvent.visibility_class ?? deriveDefaultVisibility(rawEvent.trust_class ?? deriveDefaultTrustClass(domain)),
    source_service:  rawEvent.source_service!,
    source_ref:      rawEvent.source_ref!,
    payload_ref:     rawEvent.payload_ref,
    timestamp:       now as any,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    correlation_key: rawEvent.correlation_key,
  };

  // ----- Write to domain collection -----
  const collection = resolveCollection(domain);
  await db.collection(collection).doc(event_id).set(canonicalEvent);

  // ----- Write audit event -----
  const auditId = `aud_${event_id}`;
  await db.collection(MONITOR_SHARED_COLLECTIONS.audit_events).doc(auditId).set({
    audit_event_id:  auditId,
    source_event_id: event_id,
    action:          'event_classified',
    actor_id:        gate.uid,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    metadata: {
      domain,
      collection,
      severity:        canonicalEvent.severity,
      trust_class:     canonicalEvent.trust_class,
      actionability:   canonicalEvent.actionability,
      visibility_class: canonicalEvent.visibility_class,
    },
    timestamp: now,
  });

  functions.logger.info(`[classifyEvent] Classified event ${event_id} in ${collection}`, {
    domain,
    trust_class: canonicalEvent.trust_class,
    severity: canonicalEvent.severity,
  });

  return {
    ok: true,
    event_id,
    collection,
    trust_class:    canonicalEvent.trust_class,
    severity:       canonicalEvent.severity,
    actionability:  canonicalEvent.actionability,
  };
});

// ---------------------------------------------------------------------------
// CLASSIFICATION HELPERS
// ---------------------------------------------------------------------------

function deriveDefaultTrustClass(domain: MonitorDomain): CanonicalMonitorEvent['trust_class'] {
  if (domain === 'finance')     return 'financial';
  if (domain === 'governance')  return 'governance_sensitive';
  if (domain === 'safety')      return 'safety_critical';
  if (domain === 'identity')    return 'governance_sensitive';
  if (domain === 'compliance')  return 'governance_sensitive';
  if (domain === 'inspection')  return 'evidentiary';
  return 'operational';
}

function deriveDefaultVisibility(
  trustClass: CanonicalMonitorEvent['trust_class'],
): CanonicalMonitorEvent['visibility_class'] {
  if (trustClass === 'financial')            return 'finance_admin_only';
  if (trustClass === 'governance_sensitive') return 'governance_only';
  if (trustClass === 'safety_critical')      return 'admin_only';
  if (trustClass === 'evidentiary')          return 'admin_only';
  return 'org_visible';
}
