/**
 * SCINGULAR Global — LARI-Monitor Event Normalizer
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Client-side event normalization helper.
 * Accepts raw source events and validates/produces the CanonicalMonitorEvent shape.
 *
 * IMPORTANT: This module validates shape only. It does NOT write to Firestore.
 * All Firestore writes for monitor events are server-only via Cloud Functions
 * (classifyEvent callable). Never call Admin SDK from the client.
 */

import type {
  CanonicalMonitorEvent,
  MonitorDomain,
  EventTrustClass,
  EventActionabilityClass,
  EventVisibilityClass,
  EventSeverity,
} from '@/lib/types/monitor';

// ---------------------------------------------------------------------------
// VALIDATION RESULT
// ---------------------------------------------------------------------------

export interface NormalizationResult {
  ok: boolean;
  event?: CanonicalMonitorEvent;
  errors?: string[];
}

/** Partial shape accepted as raw input before normalization. */
export type RawMonitorEventInput = Partial<CanonicalMonitorEvent> & {
  event_domain: MonitorDomain;
  event_type: string;
  org_id: string;
  actor_id: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  source_service: string;
  source_ref: string;
};

// ---------------------------------------------------------------------------
// VALIDATION SETS — prevents drift in classification values
// ---------------------------------------------------------------------------

const VALID_DOMAINS: Set<MonitorDomain> = new Set([
  'finance', 'marketplace', 'dispatch', 'inspection', 'geo', 'srt',
  'safety', 'identity', 'notification', 'compliance', 'governance',
  'admin_ops', 'device', 'customer_service',
]);

const VALID_TRUST_CLASSES: Set<EventTrustClass> = new Set([
  'informational', 'operational', 'financial', 'evidentiary',
  'governance_sensitive', 'safety_critical', 'commercial_sensitive',
]);

const VALID_ACTIONABILITY: Set<EventActionabilityClass> = new Set([
  'none', 'review', 'approval_required', 'block', 'escalate', 'dispatch_notice_only',
]);

const VALID_VISIBILITY: Set<EventVisibilityClass> = new Set([
  'self_only', 'org_visible', 'admin_only', 'finance_admin_only',
  'governance_only', 'support_only', 'cross_role_restricted',
]);

const VALID_SEVERITY: Set<EventSeverity> = new Set([
  'debug', 'info', 'warning', 'elevated', 'critical', 'safety_critical',
]);

// ---------------------------------------------------------------------------
// CONVENIENCE DEFAULTS — conservative fallbacks when optional fields are absent.
// Designers of source-event emitters should always provide explicit values.
// ---------------------------------------------------------------------------

function defaultTrustClass(domain: MonitorDomain): EventTrustClass {
  if (domain === 'finance')     return 'financial';
  if (domain === 'governance')  return 'governance_sensitive';
  if (domain === 'safety')      return 'safety_critical';
  if (domain === 'identity')    return 'governance_sensitive';
  if (domain === 'srt')         return 'operational';
  return 'informational';
}

function defaultVisibility(trustClass: EventTrustClass): EventVisibilityClass {
  if (trustClass === 'financial')            return 'finance_admin_only';
  if (trustClass === 'governance_sensitive') return 'governance_only';
  if (trustClass === 'safety_critical')      return 'admin_only';
  if (trustClass === 'evidentiary')          return 'admin_only';
  return 'org_visible';
}

// ---------------------------------------------------------------------------
// NORMALIZE — validate and produce a complete CanonicalMonitorEvent
// ---------------------------------------------------------------------------

/**
 * Validates raw input and produces a CanonicalMonitorEvent.
 * Client-side use only for pre-validation before calling classifyEvent cloud function.
 * Does NOT generate event_id (server responsibility) — if absent, placeholder is used.
 */
export function normalizeMonitorEvent(
  input: RawMonitorEventInput,
  options: {
    policyVersion?: string;
    engineVersion?: string;
  } = {},
): NormalizationResult {
  const errors: string[] = [];

  // Required field presence check
  if (!input.event_domain)    errors.push('event_domain is required');
  if (!input.event_type)      errors.push('event_type is required');
  if (!input.org_id)          errors.push('org_id is required');
  if (!input.actor_id)        errors.push('actor_id is required');
  if (!input.actor_role)      errors.push('actor_role is required');
  if (!input.entity_type)     errors.push('entity_type is required');
  if (!input.entity_id)       errors.push('entity_id is required');
  if (!input.source_service)  errors.push('source_service is required');
  if (!input.source_ref)      errors.push('source_ref is required');

  // Domain validation
  if (input.event_domain && !VALID_DOMAINS.has(input.event_domain)) {
    errors.push(`Unknown event_domain: '${input.event_domain}'`);
  }

  // Trust class validation (with default)
  const trustClass = input.trust_class ?? defaultTrustClass(input.event_domain);
  if (!VALID_TRUST_CLASSES.has(trustClass)) {
    errors.push(`Invalid trust_class: '${trustClass}'`);
  }

  // Severity validation (with default)
  const severity = input.severity ?? 'info';
  if (!VALID_SEVERITY.has(severity)) {
    errors.push(`Invalid severity: '${severity}'`);
  }

  // Actionability validation (with default)
  const actionability = input.actionability ?? 'none';
  if (!VALID_ACTIONABILITY.has(actionability)) {
    errors.push(`Invalid actionability: '${actionability}'`);
  }

  // Visibility validation (with default)
  const visibilityClass = input.visibility_class ?? defaultVisibility(trustClass);
  if (!VALID_VISIBILITY.has(visibilityClass)) {
    errors.push(`Invalid visibility_class: '${visibilityClass}'`);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const event: CanonicalMonitorEvent = {
    event_id:         input.event_id ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    event_domain:     input.event_domain,
    event_type:       input.event_type,
    event_subtype:    input.event_subtype,
    org_id:           input.org_id,
    actor_id:         input.actor_id,
    actor_role:       input.actor_role,
    entity_type:      input.entity_type,
    entity_id:        input.entity_id,
    trust_class:      trustClass,
    severity,
    actionability,
    visibility_class: visibilityClass,
    source_service:   input.source_service,
    source_ref:       input.source_ref,
    payload_ref:      input.payload_ref,
    timestamp:        input.timestamp ?? new Date().toISOString(),
    policy_version:   options.policyVersion ?? input.policy_version ?? '1.0.0',
    engine_version:   options.engineVersion ?? input.engine_version ?? 'lari-monitor-v1',
    correlation_key:  input.correlation_key,
  };

  return { ok: true, event };
}
