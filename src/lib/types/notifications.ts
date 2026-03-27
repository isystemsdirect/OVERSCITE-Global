/**
 * OVERSCITE Global — Canonical Notifications Fabric Type System
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Governance: BANE-governed, Director-authorized, human-sovereign.
 *
 * Doctrine:
 * - Notifications are DELIVERY ARTIFACTS derived from classified events.
 * - They must never be treated as the authoritative state record for
 *   finance, entitlement, dispatch, audit, compliance, or safety.
 * - queued ≠ sent  |  sent ≠ delivered  |  delivered ≠ acknowledged
 * - warning ≠ block  |  review_required ≠ failed
 *
 * Implementation Status: LIVE — types only.
 * Email/SMS delivery channels: SCAFFOLD — provider integration pending approval.
 * In-app and admin_board channels: PARTIAL — Firestore write functional.
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// NOTIFICATION CLASSES — 13 canonical classes. Each class maps to a specific
// sender profile set, allowed channels, and template family.
// Customer-facing and admin-only classes must NEVER be conflated.
// ---------------------------------------------------------------------------

export type NotificationClass =
  | 'transactional_receipt'   // Receipts, purchase confirmations, invoice confirmations, payout confirmations
  | 'payment_warning'         // Failed payments, expiring billing, renewal risks, payment action required
  | 'finance_admin_alert'     // Internal finance warnings, hold and reconciliation alerts — admin only
  | 'refund_return_case'      // Refund requests, return cases, approvals, denials, completed outcomes
  | 'payout_notice'           // Payout pending, on hold, released, adjustment or correction notice
  | 'dispute_case_notice'     // Dispute opened, evidence requested, resolved, chargeback states
  | 'entitlement_notice'      // Entitlement pending, active, suspended, revoked, expiring, incompatible
  | 'dispatch_notice'         // Offer received, assignment changed, schedule updated, route issue
  | 'inspection_notice'       // Inspection changes, report ready, export completed, review requested
  | 'safety_notice'           // Safety threshold alert, degraded field state, emergency escalation
  | 'governance_notice'       // Override review required, policy block, security review, audit exception
  | 'support_case_notice'     // Case opened, response posted, escalation required, closure confirmation
  | 'system_exception_alert'; // Critical operational anomaly — admin or governance review required

// ---------------------------------------------------------------------------
// CHANNELS — Supported delivery channels.
// Not all channels are available for all notification classes.
// SMS must remain policy-bound and consent-aware.
// ---------------------------------------------------------------------------

export type NotificationChannel =
  | 'email'
  | 'in_app'
  | 'sms'
  | 'admin_board'
  | 'webhook_internal';

// ---------------------------------------------------------------------------
// DELIVERY STATE GRAMMAR — Truth-state vocabulary.
// These states must mean the same thing everywhere in the platform.
// Anti-drift rule: no route may improvise its own status grammar.
// ---------------------------------------------------------------------------

export type NotificationQueueState =
  | 'pending'      // created but not yet dispatched
  | 'queued'       // placed in dispatch queue
  | 'processing'   // being dispatched
  | 'dispatched'   // handed off to channel/provider
  | 'suppressed'   // suppressed by policy — still auditable
  | 'failed';      // dispatch permanently failed

export type NotificationDeliveryState =
  | 'not_started'
  | 'sent'         // handed to provider — NOT confirmed delivered
  | 'delivered'    // provider confirmed delivery — NOT acknowledged
  | 'acknowledged' // recipient opened/confirmed — when tracked
  | 'bounced'
  | 'failed'
  | 'retry_pending';

// ---------------------------------------------------------------------------
// NOTIFICATION EVENT — Core record for every generated notification.
// Every notification must have a source_event_id.
// No notification may exist without traceability to a CanonicalMonitorEvent.
// ---------------------------------------------------------------------------

export interface NotificationEvent {
  notification_id: string;
  /** Source CanonicalMonitorEvent ID — required. No orphan notifications. */
  source_event_id: string;
  notification_class: NotificationClass;
  severity: string;
  /** 'user' | 'org' | 'finance_admin' | 'support_admin' | 'governance_admin' */
  recipient_type: string;
  recipient_id: string;
  org_id: string;
  /** References notification_sender_profiles collection. */
  sender_profile_id: string;
  /** References notification_templates collection. */
  template_id: string;
  template_version: string;
  channel: NotificationChannel;
  queue_state: NotificationQueueState;
  delivery_state: NotificationDeliveryState;
  generated_at: Timestamp | FieldValue | string;
  queued_at?: Timestamp | FieldValue | string;
  dispatched_at?: Timestamp | FieldValue | string;
  delivered_at?: Timestamp | FieldValue | string;
  failed_at?: Timestamp | FieldValue | string;
  /** Visibility policy inherited from source event. */
  visibility_class: string;
  /** Reference back to the audit record for cross-linkage. */
  audit_event_ref?: string;
  /** Human-readable subject — rendered from template. */
  rendered_subject?: string;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// DELIVERY ATTEMPTS — Evidence-grade delivery tracking.
// Final delivery claim may NOT exist without delivery evidence.
// Provider IDs, attempt history, bounce analysis, retry state — all required.
// ---------------------------------------------------------------------------

export interface NotificationDeliveryAttempt {
  attempt_id: string;
  notification_id: string;
  /** e.g. 'sendgrid' | 'twilio' | 'firestore_in_app' | 'admin_board_write' */
  provider: string;
  /** Provider's own message or delivery reference ID. */
  provider_message_id?: string;
  attempted_at: Timestamp | FieldValue | string;
  outcome: 'success' | 'bounced' | 'failed' | 'deferred' | 'rejected';
  error_code?: string;
  error_detail?: string;
  retry_count: number;
  is_final_attempt: boolean;
}

// ---------------------------------------------------------------------------
// TEMPLATES — Version-controlled notification templates.
// All templates must be approved before use. No ad hoc template construction.
// Template bodies are server-side only; this interface governs metadata.
// ---------------------------------------------------------------------------

export type TemplateStatus = 'draft' | 'review_pending' | 'active' | 'deprecated' | 'blocked';

export interface NotificationTemplate {
  template_id: string;
  notification_class: NotificationClass;
  name: string;
  /** Handlebars or similar template string for subject line. */
  subject_template: string;
  /** Template reference key — full body stored server-side only. */
  body_template_ref: string;
  channel: NotificationChannel;
  version: string;
  status: TemplateStatus;
  approved_by?: string;
  approved_at?: Timestamp | FieldValue | string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// SENDER PROFILES — Canonical sender identities.
// One single sender profile for all financial and system notices is prohibited.
// Admin and governance alerts must route through restricted sender profiles.
// No-reply usage is allowed only where deliberately justified and documented.
// ---------------------------------------------------------------------------

export type SenderVerificationStatus =
  | 'unverified'
  | 'pending_dns'
  | 'dns_verified'
  | 'provider_verified'
  | 'live';

export interface NotificationSenderProfile {
  sender_profile_id: string;
  display_name: string;
  /** Full from-address. e.g. "receipts@billing.overscite.com" */
  from_address: string;
  /** Reply-to address — must be intentional, not accidental. */
  reply_to_address: string;
  /** Notification classes this profile is authorized to send for. */
  notification_classes: NotificationClass[];
  active: boolean;
  verification_status: SenderVerificationStatus;
  /** Data retention policy key for this profile's sent mail. */
  retention_policy: string;
  notes?: string;
  created_at: Timestamp | FieldValue | string;
  updated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// PREFERENCES — Scoped notification preference records.
// Critical notices may override low-priority suppression where policy requires.
// Customer-facing preferences must not suppress mandatory contractual notices.
// ---------------------------------------------------------------------------

export type PreferenceScope =
  | 'user'
  | 'org'
  | 'role'
  | 'finance_admin'
  | 'support_admin'
  | 'governance_admin';

export interface NotificationPreference {
  preference_id: string;
  scope: PreferenceScope;
  scope_id: string;
  /** Per-class channel preference overrides. Empty array = use defaults. */
  channel_preferences: {
    notification_class: NotificationClass;
    preferred_channels: NotificationChannel[];
    suppressed: boolean;
    digest: boolean;
  }[];
  /** Digest window in minutes for suppressed informational events. */
  digest_window_minutes?: number;
  updated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// MAILBOX ROUTES — Administrative email routing configuration.
// Governs alias routing, escalation aliases, and org-level overrides.
// ---------------------------------------------------------------------------

export interface NotificationMailboxRoute {
  route_id: string;
  label: string;
  notification_classes: NotificationClass[];
  target_address: string;
  org_id?: string;
  role?: string;
  active: boolean;
  created_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// FINANCIAL EVENT TYPES — 22 canonical financial events that must normalize
// into CanonicalMonitorEvent before entering any monitor lane or notification
// pipeline. No subsystem may emit ad hoc financial events bypassing this list.
// ---------------------------------------------------------------------------

export type FinancialEventType =
  | 'order_created'
  | 'payment_pending'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'invoice_generated'
  | 'invoice_paid'
  | 'subscription_renewal_upcoming'
  | 'subscription_renewed'
  | 'subscription_past_due'
  | 'refund_requested'
  | 'refund_approved'
  | 'refund_denied'
  | 'refund_completed'
  | 'return_request_created'
  | 'dispute_opened'
  | 'dispute_resolved'
  | 'payout_pending'
  | 'payout_on_hold'
  | 'payout_released'
  | 'manual_financial_review_required'
  | 'tax_fee_computation_failed'
  | 'entitlement_activation_blocked';

// ---------------------------------------------------------------------------
// BANE GATE CONTEXT — Notifications-specific gate evaluation.
// Gate 2 governs notification eligibility; Gate 3/4 govern high-risk escalation.
// Notifications may inform, warn, request action. They may not self-execute.
// ---------------------------------------------------------------------------

export type NotificationBaneGate =
  | 'gate_1_event_eligibility'
  | 'gate_2_notification_eligibility'
  | 'gate_3_high_risk_escalation'
  | 'gate_4_mutation_bearing_outcome';

export interface NotificationBaneGateRecord {
  gate: NotificationBaneGate;
  notification_id: string;
  source_event_id: string;
  passed: boolean;
  checks_run: string[];
  failed_check?: string;
  reason_code?: string;
  policy_version: string;
  evaluated_at: Timestamp | FieldValue | string;
}

// ---------------------------------------------------------------------------
// COLLECTION NAMES — canonical Firestore collection names.
// ---------------------------------------------------------------------------

export const NOTIFICATION_COLLECTIONS = {
  templates:          'notification_templates',
  sender_profiles:    'notification_sender_profiles',
  events:             'notification_events',
  delivery_attempts:  'notification_delivery_attempts',
  preferences:        'notification_preferences',
  mailbox_routes:     'notification_mailbox_routes',
  financial_events:   'financial_events',
  financial_notices:  'financial_notifications',
  exception_reviews:  'financial_exception_reviews',
} as const;
