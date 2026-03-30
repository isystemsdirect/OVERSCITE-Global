/**
 * OVERSCITE Global — LARI-Monitor: Financial Event Classifier Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Specialized classifier for the 22 canonical FinancialEventType entries.
 * Routes to MON_FIN lane and triggers financial_events write.
 *
 * Builds on classifyEvent with pre-resolved domain=finance classifications.
 * All financial events carry trust_class=financial and are finance_admin_only visible.
 *
 * Implementation Status: PARTIAL
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import type { FinancialEventType } from '../types/notifications';
import {
  NOTIFICATION_COLLECTIONS,
} from '../types/notifications';
import {
  MONITOR_SHARED_COLLECTIONS,
  MONITOR_COLLECTION_MAP,
} from '../types/monitor';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// FINANCIAL EVENT TYPE → SEVERITY + ACTIONABILITY MAP
// ---------------------------------------------------------------------------

const FINANCIAL_EVENT_POLICY: Record<
  FinancialEventType,
  { severity: string; actionability: string; customer_facing: boolean }
> = {
  order_created:                     { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  payment_pending:                   { severity: 'info',     actionability: 'none',                 customer_facing: true  },
  payment_succeeded:                 { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  payment_failed:                    { severity: 'elevated', actionability: 'review',               customer_facing: true  },
  invoice_generated:                 { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  invoice_paid:                      { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  subscription_renewal_upcoming:     { severity: 'warning',  actionability: 'dispatch_notice_only', customer_facing: true  },
  subscription_renewed:              { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  subscription_past_due:             { severity: 'elevated', actionability: 'review',               customer_facing: true  },
  refund_requested:                  { severity: 'warning',  actionability: 'approval_required',    customer_facing: true  },
  refund_approved:                   { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  refund_denied:                     { severity: 'warning',  actionability: 'dispatch_notice_only', customer_facing: true  },
  refund_completed:                  { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  return_request_created:            { severity: 'warning',  actionability: 'review',               customer_facing: true  },
  dispute_opened:                    { severity: 'critical', actionability: 'escalate',             customer_facing: true  },
  dispute_resolved:                  { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  payout_pending:                    { severity: 'info',     actionability: 'none',                 customer_facing: true  },
  payout_on_hold:                    { severity: 'elevated', actionability: 'review',               customer_facing: false }, // admin only
  payout_released:                   { severity: 'info',     actionability: 'dispatch_notice_only', customer_facing: true  },
  manual_financial_review_required:  { severity: 'critical', actionability: 'approval_required',    customer_facing: false }, // admin only
  tax_fee_computation_failed:        { severity: 'critical', actionability: 'review',               customer_facing: false }, // admin only
  entitlement_activation_blocked:    { severity: 'elevated', actionability: 'review',               customer_facing: false }, // admin only
};

// ---------------------------------------------------------------------------
// CALLABLE
// ---------------------------------------------------------------------------

export const financialEventClassifier = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'monitor.financialEventClassifier',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const {
    financial_event_type,
    org_id,
    actor_id,
    actor_role,
    entity_type,
    entity_id,
    source_service,
    source_ref,
    payload_ref,
    correlation_key,
    amount,
    currency,
    metadata,
  } = data as {
    financial_event_type: FinancialEventType;
    org_id: string;
    actor_id: string;
    actor_role: string;
    entity_type: string;
    entity_id: string;
    source_service: string;
    source_ref: string;
    payload_ref?: string;
    correlation_key?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  };

  if (!financial_event_type || !org_id || !actor_id ||
      !entity_type || !entity_id || !source_service) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'financialEventClassifier: financial_event_type, org_id, actor_id,' +
      ' entity_type, entity_id, source_service are required.',
    );
  }

  const policy = FINANCIAL_EVENT_POLICY[financial_event_type];
  if (!policy) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `financialEventClassifier: Unknown financial_event_type: '${financial_event_type}'.`,
    );
  }

  const event_id = `fin_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const canonicalEvent = {
    event_id,
    event_domain:    'finance',
    event_type:      financial_event_type,
    org_id,
    actor_id,
    actor_role:      actor_role ?? 'system',
    entity_type,
    entity_id,
    trust_class:     'financial',
    severity:        policy.severity,
    actionability:   policy.actionability,
    visibility_class: policy.customer_facing ? 'org_visible' : 'finance_admin_only',
    source_service,
    source_ref,
    payload_ref:     payload_ref ?? null,
    timestamp:       now,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    correlation_key: correlation_key ?? null,
  };

  // Write to MON_FIN lane collection
  await db.collection(MONITOR_COLLECTION_MAP['finance']).doc(event_id).set(canonicalEvent);

  // Write financial_event record for dedicated financial audit surface
  await db.collection(NOTIFICATION_COLLECTIONS.financial_events).add({
    event_id,
    financial_event_type,
    org_id,
    actor_id,
    entity_type,
    entity_id,
    amount:    amount ?? null,
    currency:  currency ?? null,
    severity:  policy.severity,
    actionability: policy.actionability,
    customer_facing: policy.customer_facing,
    source_ref,
    metadata:  metadata ?? null,
    timestamp: now,
    policy_version: POLICY_VERSION,
  });

  // Write audit record
  const auditId = `aud_fin_${event_id}`;
  await db.collection(MONITOR_SHARED_COLLECTIONS.audit_events).doc(auditId).set({
    audit_event_id:  auditId,
    source_event_id: event_id,
    action:          'event_classified',
    actor_id:        gate.uid,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
    metadata: {
      financial_event_type,
      severity: policy.severity,
      actionability: policy.actionability,
    },
    timestamp: now,
  });

  functions.logger.info(
    `[financialEventClassifier] Classified ${financial_event_type} → ${event_id}`,
    {
    severity: policy.severity,
    actionability: policy.actionability,
    customer_facing: policy.customer_facing,
  });

  return {
    ok: true,
    event_id,
    financial_event_type,
    severity:      policy.severity,
    actionability: policy.actionability,
    customer_facing: policy.customer_facing,
  };
});
