/**
 * SCINGULAR Global — Canonical Sender Profile Registry
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Defines the 9 canonical sender profiles. This registry is the
 * authoritative reference for sender-identity-to-notification-class mapping.
 *
 * Doctrine:
 * - One single sender profile for all financial and system notices is PROHIBITED.
 * - Admin and governance alerts must route through restricted sender profiles.
 * - No-reply usage is allowed only where deliberately justified.
 * - No client-side override of sender identity is permitted.
 *
 * Implementation Status: LIVE — registry definition only.
 * Domain verification status: UNVERIFIED — requires provider onboarding.
 */

import type { NotificationSenderProfile, NotificationClass } from '@/lib/types/notifications';

// ---------------------------------------------------------------------------
// SENDER PROFILE IDs — canonical stable references
// ---------------------------------------------------------------------------

export const SENDER_PROFILE_IDS = {
  RECEIPTS_PRIMARY:      'sp_receipts_primary',
  ORDERS_PRIMARY:        'sp_orders_primary',
  PAYOUTS_PRIMARY:       'sp_payouts_primary',
  PAYMENT_ALERTS:        'sp_payment_alerts_primary',
  RETURNS_PRIMARY:       'sp_returns_primary',
  DISPUTES_PRIMARY:      'sp_disputes_primary',
  FINANCE_ADMIN:         'sp_finance_admin_primary',
  GOVERNANCE:            'sp_governance_primary',
  MONITOR_PRIMARY:       'sp_monitor_primary',
} as const;

export type SenderProfileId = typeof SENDER_PROFILE_IDS[keyof typeof SENDER_PROFILE_IDS];

// ---------------------------------------------------------------------------
// 9 CANONICAL SENDER PROFILES
// Note: verification_status is 'unverified' — domain onboarding required before live send.
// ---------------------------------------------------------------------------

const NOW = new Date().toISOString();

export const SENDER_PROFILES: Record<SenderProfileId, NotificationSenderProfile> = {
  sp_receipts_primary: {
    sender_profile_id: 'sp_receipts_primary',
    display_name: 'SCINGULAR Receipts',
    from_address: 'receipts@billing.SCINGULAR.com',
    reply_to_address: 'support@SCINGULAR.com',
    notification_classes: ['transactional_receipt', 'entitlement_notice'],
    active: true,
    verification_status: 'unverified', // [SCAFFOLD] requires DNS verification + provider onboarding
    retention_policy: 'standard_7y',
    notes: 'Primary receipts sender for purchase confirmations and entitlement receipts.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_orders_primary: {
    sender_profile_id: 'sp_orders_primary',
    display_name: 'SCINGULAR Orders',
    from_address: 'orders@billing.SCINGULAR.com',
    reply_to_address: 'support@SCINGULAR.com',
    notification_classes: ['transactional_receipt', 'dispatch_notice'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'standard_7y',
    notes: 'Order confirmations and dispatch notices sourced from billing subdomain.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_payouts_primary: {
    sender_profile_id: 'sp_payouts_primary',
    display_name: 'SCINGULAR Payouts',
    from_address: 'payouts@billing.SCINGULAR.com',
    reply_to_address: 'finance-support@SCINGULAR.com',
    notification_classes: ['payout_notice'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'financial_10y',
    notes: 'Payout state notices only. Finance-support reply-to for payout query routing.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_payment_alerts_primary: {
    sender_profile_id: 'sp_payment_alerts_primary',
    display_name: 'SCINGULAR Payment Alerts',
    from_address: 'payment-alerts@billing.SCINGULAR.com',
    reply_to_address: 'billing-support@SCINGULAR.com',
    notification_classes: ['payment_warning'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'standard_7y',
    notes: 'Action-bearing payment warnings. Visually distinct from receipts by design.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_returns_primary: {
    sender_profile_id: 'sp_returns_primary',
    display_name: 'SCINGULAR Returns',
    from_address: 'returns@billing.SCINGULAR.com',
    reply_to_address: 'billing-support@SCINGULAR.com',
    notification_classes: ['refund_return_case'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'financial_10y',
    notes: 'Refund and return lifecycle notices only.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_disputes_primary: {
    sender_profile_id: 'sp_disputes_primary',
    display_name: 'SCINGULAR Disputes',
    from_address: 'disputes@billing.SCINGULAR.com',
    reply_to_address: 'billing-support@SCINGULAR.com',
    notification_classes: ['dispute_case_notice'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'financial_10y',
    notes: 'Dispute lifecycle notices. Segregated from receipts and returns by dedicated address.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_finance_admin_primary: {
    sender_profile_id: 'sp_finance_admin_primary',
    display_name: 'SCINGULAR Finance Operations',
    from_address: 'finance-admin@ops.SCINGULAR.com',
    reply_to_address: 'finance-admin@ops.SCINGULAR.com',
    notification_classes: ['finance_admin_alert', 'system_exception_alert'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'ops_5y',
    notes: 'RESTRICTED. Internal finance ops and system exception alerts only. Not customer-facing.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_governance_primary: {
    sender_profile_id: 'sp_governance_primary',
    display_name: 'SCINGULAR Governance',
    from_address: 'governance@ops.SCINGULAR.com',
    reply_to_address: 'governance@ops.SCINGULAR.com',
    notification_classes: ['governance_notice'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'governance_indefinite',
    notes: 'RESTRICTED. Governance and policy alerts. Reply-to loops back to governance ops.',
    created_at: NOW,
    updated_at: NOW,
  },

  sp_monitor_primary: {
    sender_profile_id: 'sp_monitor_primary',
    display_name: 'SCINGULAR Monitor',
    from_address: 'monitor@ops.SCINGULAR.com',
    reply_to_address: 'support@SCINGULAR.com',
    notification_classes: ['support_case_notice', 'inspection_notice', 'dispatch_notice', 'safety_notice'],
    active: true,
    verification_status: 'unverified',
    retention_policy: 'ops_5y',
    notes: 'Operational monitoring notices: support, inspection, dispatch, safety. General support reply-to.',
    created_at: NOW,
    updated_at: NOW,
  },
};

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Returns the sender profile ID authorized for a given notification class.
 * If multiple profiles match, returns the most specific one.
 * Throws if no profile is registered for the class — prevents unrouted sends.
 */
export function getSenderProfileForClass(
  notificationClass: NotificationClass,
): NotificationSenderProfile {
  // Priority: most-specific profile (fewest classes) wins for a given class
  const candidates = Object.values(SENDER_PROFILES).filter(
    (p) => p.active && p.notification_classes.includes(notificationClass),
  );

  if (candidates.length === 0) {
    throw new Error(
      `[SenderProfileRegistry] No active sender profile registered for NotificationClass: '${notificationClass}'. ` +
      `All notification classes must have a sender profile. This is a configuration error.`,
    );
  }

  // Most specific = fewest notification_classes in its list
  candidates.sort((a, b) => a.notification_classes.length - b.notification_classes.length);
  return candidates[0];
}

/** Returns all active sender profiles. */
export function getActiveSenderProfiles(): NotificationSenderProfile[] {
  return Object.values(SENDER_PROFILES).filter((p) => p.active);
}

/** Returns a sender profile by ID. Throws if not found. */
export function getSenderProfileById(id: SenderProfileId): NotificationSenderProfile {
  const profile = SENDER_PROFILES[id];
  if (!profile) {
    throw new Error(`[SenderProfileRegistry] Unknown sender profile ID: '${id}'`);
  }
  return profile;
}
