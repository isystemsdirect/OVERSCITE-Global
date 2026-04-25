/**
 * SCINGULAR Global — Canonical LARI-Monitor Type System
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Governance: BANE-governed, Director-authorized, human-sovereign.
 * LARI-Monitor observes, classifies, correlates, and surfaces events.
 * It does NOT finalize payments, release payouts, grant entitlements,
 * assign jobs autonomously, or override governance.
 *
 * Implementation Status: LIVE — types only.
 * Backend event pipeline: SCAFFOLD — cloud function wiring required per-lane.
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// EVENT DOMAIN — Canonical domain vocabulary for all SCINGULAR events.
// No subsystem may invent a private ad hoc domain string for critical events.
// ---------------------------------------------------------------------------

export type MonitorDomain =
  | 'finance'
  | 'marketplace'
  | 'dispatch'
  | 'inspection'
  | 'geo'
  | 'srt'
  | 'safety'
  | 'identity'
  | 'notification'
  | 'compliance'
  | 'governance'
  | 'admin_ops'
  | 'device'
  | 'customer_service';

// ---------------------------------------------------------------------------
// TRUST CLASSES — Determines visibility policy and audit requirements.
// Never collapse security-sensitive classes into informational for convenience.
// ---------------------------------------------------------------------------

export type EventTrustClass =
  | 'informational'
  | 'operational'
  | 'financial'
  | 'evidentiary'
  | 'governance_sensitive'
  | 'safety_critical'
  | 'commercial_sensitive';

// ---------------------------------------------------------------------------
// ACTIONABILITY — What, if anything, should happen as a result of this event.
// LARI-Monitor may recommend; it does not self-execute irreversible actions.
// ---------------------------------------------------------------------------

export type EventActionabilityClass =
  | 'none'
  | 'review'
  | 'approval_required'
  | 'block'
  | 'escalate'
  | 'dispatch_notice_only';

// ---------------------------------------------------------------------------
// VISIBILITY — Who is permitted to see this event and its derived alerts.
// ---------------------------------------------------------------------------

export type EventVisibilityClass =
  | 'self_only'
  | 'org_visible'
  | 'admin_only'
  | 'finance_admin_only'
  | 'governance_only'
  | 'support_only'
  | 'cross_role_restricted';

// ---------------------------------------------------------------------------
// SEVERITY — Operational severity of the event.
// ---------------------------------------------------------------------------

export type EventSeverity =
  | 'debug'
  | 'info'
  | 'warning'
  | 'elevated'
  | 'critical'
  | 'safety_critical';

// ---------------------------------------------------------------------------
// CANONICAL MONITOR EVENT — The normalized form all platform events must adopt.
// All 22 fields are required for meaningful events. Missing fields indicate
// an improperly classified event that should not propagate to monitor lanes.
// ---------------------------------------------------------------------------

export interface CanonicalMonitorEvent {
  /** Unique event identifier. Must be globally unique across all collections. */
  event_id: string;
  /** Top-level platform domain this event originates from. */
  event_domain: MonitorDomain;
  /** Normalized type string within the domain (e.g. 'payment_failed'). */
  event_type: string;
  /** Optional sub-classification within the event type. */
  event_subtype?: string;
  /** Organizational context of the event. */
  org_id: string;
  /** Identity of the actor who triggered or is associated with this event. */
  actor_id: string;
  /** Role of the actor at the time of event generation. */
  actor_role: string;
  /** Type of the primary entity this event concerns. */
  entity_type: string;
  /** ID of the primary entity this event concerns. */
  entity_id: string;
  /** Trust class assignment — governs audit and visibility policy. */
  trust_class: EventTrustClass;
  /** Operational severity. */
  severity: EventSeverity;
  /** What action is expected or required downstream. */
  actionability: EventActionabilityClass;
  /** Who is permitted to see this event and its derived surfaces. */
  visibility_class: EventVisibilityClass;
  /** Service or subsystem that generated this event. */
  source_service: string;
  /** Reference into the source service's own record (e.g. Firestore doc path). */
  source_ref: string;
  /** Reference to the payload document or data blob, if separate. */
  payload_ref?: string;
  /** ISO-8601 event timestamp. */
  timestamp: Timestamp | FieldValue | string;
  /** Governance policy version active at time of classification. */
  policy_version: string;
  /** Engine version that classified this event. */
  engine_version: string;
  /** Correlation key for grouping related events across lanes. */
  correlation_key?: string;
}

// ---------------------------------------------------------------------------
// MONITOR LANES — Each lane has a defined domain scope, purpose, and board target.
// Events may correlate across lanes but visibility remains policy-bound.
// No lane may escalate itself into autonomous command authority.
// ---------------------------------------------------------------------------

export type MonitorLaneId =
  | 'MON_FIN'
  | 'MON_MARKET'
  | 'MON_DISPATCH'
  | 'MON_INSPECT'
  | 'MON_GEO'
  | 'MON_SRT'
  | 'MON_SAFE'
  | 'MON_IDENT'
  | 'MON_NOTIFY'
  | 'MON_COMP'
  | 'MON_GOV'
  | 'MON_ADMIN';

export type MonitorBoardTarget =
  | 'command_board'
  | 'finance_board'
  | 'marketplace_board'
  | 'dispatch_board'
  | 'inspections_board'
  | 'safety_board'
  | 'notifications_reliability_board'
  | 'governance_board'
  | 'support_board';

export interface MonitorLaneDefinition {
  lane_id: MonitorLaneId;
  label: string;
  domain: MonitorDomain;
  /** Secondary domains this lane may also receive events from. */
  secondary_domains?: MonitorDomain[];
  collection: string;
  board_target: MonitorBoardTarget;
  /** Minimum severity before an alert packet is generated. */
  alert_threshold: EventSeverity;
  /** Whether this lane routes to governance/BANE review queue. */
  governance_routable: boolean;
}

// ---------------------------------------------------------------------------
// ALERT PACKETS — Synthesized signals surfaced to board operators.
// Alert packets are derived from one or more correlated events.
// They are NOT raw event dumps. Board surfaces show alert packets, not raw events.
// ---------------------------------------------------------------------------

export interface MonitorAlertPacket {
  /** Unique alert packet identifier. */
  alert_packet_id: string;
  /** Which monitor lane produced this packet. */
  lane: MonitorLaneId;
  /** Source event IDs that contributed to this packet. */
  source_event_ids: string[];
  /** Human-readable correlation summary for board operators. */
  correlation_summary: string;
  severity: EventSeverity;
  actionability: EventActionabilityClass;
  /** Which board surface this packet is routed to. */
  board_target: MonitorBoardTarget;
  status: 'open' | 'acknowledged' | 'resolved' | 'escalated' | 'suppressed';
  /** If escalated, reference to the review queue record. */
  review_queue_ref?: string;
  created_at: Timestamp | FieldValue | string;
  updated_at?: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// REVIEW QUEUES — Approval-required or high-risk event paths.
// Human review is mandatory for any queue_type that touches payout,
// entitlement, override, or compliance state. BANE validates outcomes.
// ---------------------------------------------------------------------------

export type ReviewQueueType =
  | 'finance_review'
  | 'governance_review'
  | 'support_escalation'
  | 'safety_escalation'
  | 'compliance_review'
  | 'manual_override_record';

export interface MonitorReviewQueue {
  review_id: string;
  queue_type: ReviewQueueType;
  /** Related alert packet, if generated from a packet. */
  related_alert_packet_id: string;
  /** Notification IDs derived from the same source events, if any. */
  related_notification_ids: string[];
  /** Role that must complete this review. */
  assigned_role: string;
  /** Specific actor assigned, if known. */
  assigned_actor_id?: string;
  status: 'pending' | 'in_review' | 'resolved' | 'escalated' | 'closed';
  reason: string;
  created_at: Timestamp | FieldValue | string;
  resolved_at?: Timestamp | FieldValue | string;
  resolved_by?: string;
  resolution_notes?: string;
}

// ---------------------------------------------------------------------------
// CORRELATION — Link record connecting events across lanes.
// Used to reconstruct multi-domain incident timelines.
// ---------------------------------------------------------------------------

export interface MonitorCorrelation {
  correlation_id: string;
  correlation_key: string;
  event_ids: string[];
  domains: MonitorDomain[];
  lanes: MonitorLaneId[];
  severity: EventSeverity;
  description: string;
  created_at: Timestamp | FieldValue | string;
  resolved_at?: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// TREND ROLLUPS — Aggregated lane-level signals for executive/command views.
// Rollups summarize without distorting. They must not hide critical signal.
// ---------------------------------------------------------------------------

export interface MonitorTrendRollup {
  rollup_id: string;
  lane: MonitorLaneId;
  period_start: string;
  period_end: string;
  event_count: number;
  alert_count: number;
  critical_count: number;
  open_review_count: number;
  top_event_types: { event_type: string; count: number }[];
  generated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// BANE GATE TYPES — for monitor-specific gate evaluation contexts.
// LARI-Monitor recommends; BANE decides and records high-risk gate outcomes.
// ---------------------------------------------------------------------------

export type MonitorBaneGate =
  | 'gate_1_event_eligibility'       // schema valid, trust class, visibility, source recognized
  | 'gate_2_notification_eligibility' // notice class allowed, template active, sender approved
  | 'gate_3_high_risk_escalation'    // finance/governance threshold, safety-critical escalation
  | 'gate_4_mutation_bearing_outcome'; // payout, entitlement, override, compliance state change

export interface MonitorBaneGateRecord {
  gate: MonitorBaneGate;
  event_id: string;
  passed: boolean;
  reason_code?: string;
  reason_detail?: string;
  policy_version: string;
  evaluated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// AUDIT EVENTS — Append-only monitor-specific audit trail.
// Written by Cloud Functions via Admin SDK only.
// ---------------------------------------------------------------------------

export interface MonitorAuditEvent {
  audit_event_id: string;
  source_event_id: string;
  action:
    | 'event_classified'
    | 'alert_packet_built'
    | 'review_queue_routed'
    | 'bane_gate_evaluated'
    | 'trend_rollup_generated'
    | 'correlation_recorded';
  actor_id: string;
  policy_version: string;
  engine_version: string;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// COLLECTION NAME MAP — canonical Firestore collection names per lane.
// Used by both cloud functions and client-side reads to prevent ad hoc naming.
// ---------------------------------------------------------------------------

export const MONITOR_COLLECTION_MAP: Record<MonitorDomain, string> = {
  finance:          'monitor_events_finance',
  marketplace:      'monitor_events_marketplace',
  dispatch:         'monitor_events_dispatch',
  inspection:       'monitor_events_inspection',
  geo:              'monitor_events_geo',
  srt:              'monitor_events_srt',
  safety:           'monitor_events_safety',
  identity:         'monitor_events_identity',
  notification:     'monitor_events_notification',
  compliance:       'monitor_events_compliance',
  governance:       'monitor_events_governance',
  admin_ops:        'monitor_events_admin_ops',
  device:           'monitor_events_admin_ops', // device events share admin_ops collection
  customer_service: 'monitor_events_admin_ops', // customer service events share admin_ops collection
} as const;

export const MONITOR_SHARED_COLLECTIONS = {
  correlations:    'monitor_correlations',
  alert_packets:   'monitor_alert_packets',
  review_queues:   'monitor_review_queues',
  trend_rollups:   'monitor_trend_rollups',
  audit_events:    'monitor_audit_events',
} as const;
