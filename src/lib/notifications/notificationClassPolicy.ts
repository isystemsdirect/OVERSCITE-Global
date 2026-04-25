/**
 * SCINGULAR Global — Notification Class Policy
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Pure policy — no network calls. Maps each notification class to its
 * allowed channels, required sender profiles, eligibility rules, and
 * suppression rules.
 *
 * Doctrine:
 * - Notifications must not be email-only.
 * - Critical admin alerts must appear in board surfaces even if email dispatch also occurs.
 * - SMS must remain policy-bound and consent-aware.
 * - Customer-facing preferences must not suppress mandatory contractual or financial notices.
 */

import type { NotificationClass, NotificationChannel } from '@/lib/types/notifications';
import type { SenderProfileId } from '@/lib/monitor/senderProfileRegistry';

// ---------------------------------------------------------------------------
// NOTIFICATION CLASS POLICY RECORD
// ---------------------------------------------------------------------------

export interface NotificationClassPolicy {
  notification_class: NotificationClass;
  /** Canonical label for this class. */
  label: string;
  /** Short description of what this class covers. */
  description: string;
  /** Channels on which this class is allowed to be dispatched. */
  allowed_channels: NotificationChannel[];
  /** Channel(s) that MUST fire regardless of user preference. Cannot be suppressed. */
  mandatory_channels: NotificationChannel[];
  /** Authorized sender profile ID(s) for this class. First item is the default. */
  authorized_sender_profile_ids: SenderProfileId[];
  /** Whether this notice is customer-facing. False = admin/internal only. */
  is_customer_facing: boolean;
  /** Whether this class is mandatory and cannot be suppressed by user preference. */
  is_mandatory: boolean;
  /** Whether in-app notices for this class can be digested (batched). */
  digesting_allowed: boolean;
  /** Whether this class may trigger a BANE Gate 3 escalation review. */
  escalation_eligible: boolean;
  /** Visibility class this inherits from the source event. */
  default_visibility:
    | 'self_only'
    | 'org_visible'
    | 'admin_only'
    | 'finance_admin_only'
    | 'governance_only'
    | 'support_only';
}

// ---------------------------------------------------------------------------
// POLICY TABLE — 13 canonical notification classes
// ---------------------------------------------------------------------------

export const NOTIFICATION_CLASS_POLICY_TABLE: Record<NotificationClass, NotificationClassPolicy> = {
  transactional_receipt: {
    notification_class: 'transactional_receipt',
    label: 'Transactional Receipt',
    description: 'Receipts, purchase confirmations, invoice confirmations, payout confirmations.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['email'],
    authorized_sender_profile_ids: ['sp_receipts_primary', 'sp_orders_primary'],
    is_customer_facing: true,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: false,
    default_visibility: 'self_only',
  },

  payment_warning: {
    notification_class: 'payment_warning',
    label: 'Payment Warning',
    description: 'Failed payments, expiring billing methods, renewal risks, payment action required.',
    allowed_channels: ['email', 'in_app', 'sms'],
    mandatory_channels: ['email', 'in_app'],
    authorized_sender_profile_ids: ['sp_payment_alerts_primary'],
    is_customer_facing: true,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: false,
    default_visibility: 'self_only',
  },

  finance_admin_alert: {
    notification_class: 'finance_admin_alert',
    label: 'Finance Admin Alert',
    description: 'Internal finance warnings, review-needed anomalies, hold and reconciliation alerts.',
    allowed_channels: ['email', 'in_app', 'admin_board'],
    mandatory_channels: ['admin_board'],
    authorized_sender_profile_ids: ['sp_finance_admin_primary'],
    is_customer_facing: false,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'finance_admin_only',
  },

  refund_return_case: {
    notification_class: 'refund_return_case',
    label: 'Refund / Return Case',
    description: 'Refund requests, return cases, approvals, denials, completed outcomes.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['email'],
    authorized_sender_profile_ids: ['sp_returns_primary'],
    is_customer_facing: true,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: false,
    default_visibility: 'self_only',
  },

  payout_notice: {
    notification_class: 'payout_notice',
    label: 'Payout Notice',
    description: 'Payout pending, on hold, released, adjustment or correction notice.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['email'],
    authorized_sender_profile_ids: ['sp_payouts_primary'],
    is_customer_facing: true,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'self_only',
  },

  dispute_case_notice: {
    notification_class: 'dispute_case_notice',
    label: 'Dispute Case Notice',
    description: 'Dispute opened, evidence requested, dispute resolved, chargeback states.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['email'],
    authorized_sender_profile_ids: ['sp_disputes_primary'],
    is_customer_facing: true,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'self_only',
  },

  entitlement_notice: {
    notification_class: 'entitlement_notice',
    label: 'Entitlement Notice',
    description: 'Entitlement pending, active, suspended, revoked, expiring, incompatible.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['in_app'],
    authorized_sender_profile_ids: ['sp_receipts_primary'],
    is_customer_facing: true,
    is_mandatory: false,
    digesting_allowed: false,
    escalation_eligible: false,
    default_visibility: 'self_only',
  },

  dispatch_notice: {
    notification_class: 'dispatch_notice',
    label: 'Dispatch Notice',
    description: 'Offer received, assignment changed, schedule updated, route issue, dispatch action required.',
    allowed_channels: ['email', 'in_app', 'sms'],
    mandatory_channels: ['in_app'],
    authorized_sender_profile_ids: ['sp_orders_primary', 'sp_monitor_primary'],
    is_customer_facing: true,
    is_mandatory: false,
    digesting_allowed: false,
    escalation_eligible: false,
    default_visibility: 'org_visible',
  },

  inspection_notice: {
    notification_class: 'inspection_notice',
    label: 'Inspection Notice',
    description: 'Inspection changes, report ready, export completed, review requested.',
    allowed_channels: ['email', 'in_app'],
    mandatory_channels: ['in_app'],
    authorized_sender_profile_ids: ['sp_monitor_primary'],
    is_customer_facing: true,
    is_mandatory: false,
    digesting_allowed: true,
    escalation_eligible: false,
    default_visibility: 'org_visible',
  },

  safety_notice: {
    notification_class: 'safety_notice',
    label: 'Safety Notice',
    description: 'Safety threshold alert, degraded field state, emergency escalation.',
    allowed_channels: ['email', 'in_app', 'sms', 'admin_board'],
    mandatory_channels: ['in_app', 'admin_board'],
    authorized_sender_profile_ids: ['sp_monitor_primary'],
    is_customer_facing: false,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'admin_only',
  },

  governance_notice: {
    notification_class: 'governance_notice',
    label: 'Governance Notice',
    description: 'Override review required, policy block, security review, audit-sensitive exception.',
    allowed_channels: ['email', 'in_app', 'admin_board'],
    mandatory_channels: ['admin_board'],
    authorized_sender_profile_ids: ['sp_governance_primary'],
    is_customer_facing: false,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'governance_only',
  },

  support_case_notice: {
    notification_class: 'support_case_notice',
    label: 'Support Case Notice',
    description: 'Case opened, response posted, escalation required, closure confirmation.',
    allowed_channels: ['email', 'in_app', 'admin_board'],
    mandatory_channels: ['in_app'],
    authorized_sender_profile_ids: ['sp_monitor_primary'],
    is_customer_facing: true,
    is_mandatory: false,
    digesting_allowed: true,
    escalation_eligible: false,
    default_visibility: 'support_only',
  },

  system_exception_alert: {
    notification_class: 'system_exception_alert',
    label: 'System Exception Alert',
    description: 'Critical operational anomaly requiring admin or governance review.',
    allowed_channels: ['email', 'in_app', 'admin_board'],
    mandatory_channels: ['admin_board'],
    authorized_sender_profile_ids: ['sp_finance_admin_primary'],
    is_customer_facing: false,
    is_mandatory: true,
    digesting_allowed: false,
    escalation_eligible: true,
    default_visibility: 'admin_only',
  },
};

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/** Returns the policy for a given notification class. Throws if not found. */
export function getClassPolicy(cls: NotificationClass): NotificationClassPolicy {
  const policy = NOTIFICATION_CLASS_POLICY_TABLE[cls];
  if (!policy) {
    throw new Error(
      `[NotificationClassPolicy] Unknown NotificationClass: '${cls}'. ` +
      `All classes must be registered in the policy table.`,
    );
  }
  return policy;
}

/**
 * Returns true if the given channel is allowed for the given class.
 * Used as a BANE Gate 2 pre-check.
 */
export function isChannelAllowedForClass(
  cls: NotificationClass,
  channel: NotificationChannel,
): boolean {
  return getClassPolicy(cls).allowed_channels.includes(channel);
}

/**
 * Returns the mandatory channels for a class.
 * These channels must fire regardless of user preference or suppression rules.
 */
export function getMandatoryChannels(cls: NotificationClass): NotificationChannel[] {
  return getClassPolicy(cls).mandatory_channels;
}

/**
 * Returns true if this class is customer-facing.
 * Customer-facing and admin-only classes must never be conflated.
 */
export function isCustomerFacing(cls: NotificationClass): boolean {
  return getClassPolicy(cls).is_customer_facing;
}

/**
 * Returns all notification classes that are eligible for BANE Gate 3 escalation.
 */
export function getEscalationEligibleClasses(): NotificationClass[] {
  return (Object.values(NOTIFICATION_CLASS_POLICY_TABLE) as NotificationClassPolicy[])
    .filter((p) => p.escalation_eligible)
    .map((p) => p.notification_class);
}
