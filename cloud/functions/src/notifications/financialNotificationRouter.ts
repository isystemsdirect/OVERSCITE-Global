/**
 * OVERSCITE Global — Financial Notification Router Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Resolves financial event → notification class → sender profile per
 * canonical routing rules. Enforces customer/admin segregation.
 *
 * Routing Rules:
 *   Receipts/order confirmations   → receipts_primary / orders_primary
 *   Payment warnings               → payment_alerts_primary
 *   Payout states                  → payouts_primary
 *   Refund/return lifecycle        → returns_primary
 *   Dispute lifecycle              → disputes_primary
 *   Internal finance review alerts → finance_admin_primary
 *
 * Hard Rule: Customer purchase confirmations and internal finance alerts
 * must NEVER share the same inbox class or sender identity.
 */

import * as functions from 'firebase-functions';
import { enforceBaneCallable } from '../bane/enforce';
import type { FinancialEventType } from '../../../../src/lib/types/notifications';

const POLICY_VERSION = '1.0.0';
const ENGINE_VERSION = 'lari-monitor-v1';

// ---------------------------------------------------------------------------
// ROUTING TABLE — FinancialEventType → {notification_class, sender_profile_id}
// ---------------------------------------------------------------------------

interface FinancialRoute {
  notification_class: string;
  sender_profile_id: string;
  /** If false, this is an admin-only alert — must not be sent to customer recipients. */
  customer_facing: boolean;
}

const FINANCIAL_ROUTING_TABLE: Record<FinancialEventType, FinancialRoute> = {
  // eslint-disable-next-line max-len
  order_created:                    { notification_class: 'transactional_receipt', sender_profile_id: 'sp_orders_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  payment_pending:                  { notification_class: 'transactional_receipt', sender_profile_id: 'sp_receipts_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  payment_succeeded:                { notification_class: 'transactional_receipt', sender_profile_id: 'sp_receipts_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  payment_failed:                   { notification_class: 'payment_warning',       sender_profile_id: 'sp_payment_alerts_primary', customer_facing: true  },
  // eslint-disable-next-line max-len
  invoice_generated:                { notification_class: 'transactional_receipt', sender_profile_id: 'sp_receipts_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  invoice_paid:                     { notification_class: 'transactional_receipt', sender_profile_id: 'sp_receipts_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  subscription_renewal_upcoming:    { notification_class: 'payment_warning',       sender_profile_id: 'sp_payment_alerts_primary', customer_facing: true  },
  // eslint-disable-next-line max-len
  subscription_renewed:             { notification_class: 'transactional_receipt', sender_profile_id: 'sp_receipts_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  subscription_past_due:            { notification_class: 'payment_warning',       sender_profile_id: 'sp_payment_alerts_primary', customer_facing: true  },
  // eslint-disable-next-line max-len
  refund_requested:                 { notification_class: 'refund_return_case',    sender_profile_id: 'sp_returns_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  refund_approved:                  { notification_class: 'refund_return_case',    sender_profile_id: 'sp_returns_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  refund_denied:                    { notification_class: 'refund_return_case',    sender_profile_id: 'sp_returns_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  refund_completed:                 { notification_class: 'refund_return_case',    sender_profile_id: 'sp_returns_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  return_request_created:           { notification_class: 'refund_return_case',    sender_profile_id: 'sp_returns_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  dispute_opened:                   { notification_class: 'dispute_case_notice',   sender_profile_id: 'sp_disputes_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  dispute_resolved:                 { notification_class: 'dispute_case_notice',   sender_profile_id: 'sp_disputes_primary',       customer_facing: true  },
  // eslint-disable-next-line max-len
  payout_pending:                   { notification_class: 'payout_notice',         sender_profile_id: 'sp_payouts_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  payout_on_hold:                   { notification_class: 'finance_admin_alert',   sender_profile_id: 'sp_finance_admin_primary',  customer_facing: false }, // admin only
  // eslint-disable-next-line max-len
  payout_released:                  { notification_class: 'payout_notice',         sender_profile_id: 'sp_payouts_primary',        customer_facing: true  },
  // eslint-disable-next-line max-len
  manual_financial_review_required: { notification_class: 'finance_admin_alert',   sender_profile_id: 'sp_finance_admin_primary',  customer_facing: false }, // admin only
  // eslint-disable-next-line max-len
  tax_fee_computation_failed:       { notification_class: 'system_exception_alert', sender_profile_id: 'sp_finance_admin_primary', customer_facing: false }, // admin only
  // eslint-disable-next-line max-len
  entitlement_activation_blocked:   { notification_class: 'finance_admin_alert',   sender_profile_id: 'sp_finance_admin_primary',  customer_facing: false }, // admin only
};

// ---------------------------------------------------------------------------
// CALLABLE
// ---------------------------------------------------------------------------

export const financialNotificationRouter = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'notifications.financialNotificationRouter',
    data,
    ctx: context,
  });

  const {
    financial_event_type,
    source_event_id,
    org_id,
    recipient_id,
    recipient_type,
  } = data as {
    financial_event_type: FinancialEventType;
    source_event_id:      string;
    org_id:               string;
    recipient_id:         string;
    recipient_type:       string;
  };

  if (!financial_event_type || !source_event_id || !org_id || !recipient_id) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'financialNotificationRouter: financial_event_type, source_event_id,' +
      ' org_id, and recipient_id are required.',
    );
  }

  const route = FINANCIAL_ROUTING_TABLE[financial_event_type];
  if (!route) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'financialNotificationRouter: No routing rule for FinancialEventType' +
      ` '${financial_event_type}'.`,
    );
  }

  // Segregation enforcement: admin-only events must not route to customer recipients
  if (!route.customer_facing && recipient_type === 'user') {
    throw new functions.https.HttpsError(
      'permission-denied',
      `financialNotificationRouter: FinancialEventType '${financial_event_type}'` +
      'is admin-only; cannot route to recipient_type user. Segregation violation.',
    );
  }

  functions.logger.info(
    `[financialNotificationRouter] Routed ${financial_event_type}` +
    ` → ${route.notification_class} via ${route.sender_profile_id}`,
    {
      source_event_id,
      org_id,
      customer_facing: route.customer_facing,
    });

  return {
    ok: true,
    financial_event_type,
    notification_class:   route.notification_class,
    sender_profile_id:    route.sender_profile_id,
    customer_facing:      route.customer_facing,
    source_event_id,
    resolved_by:          gate.uid,
    policy_version:       POLICY_VERSION,
    engine_version:       ENGINE_VERSION,
  };
});
