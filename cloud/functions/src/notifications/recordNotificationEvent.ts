/**
 * OVERSCITE Global — Notifications: recordNotificationEvent Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function. Enforces BANE Gate 2.
 * Accepts a classified CanonicalMonitorEvent ID, resolves notification class,
 * template, sender profile, recipients. Writes notification_events record.
 *
 * No notification may exist without a source_event_id.
 * Notifications are delivery artifacts — not source of truth.
 *
 * Implementation Status: PARTIAL — notification record creation.
 * Template body rendering: SCAFFOLD — template content not yet authored.
 * Email dispatch: SCAFFOLD — provider integration pending approval.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import { NOTIFICATION_COLLECTIONS } from '../types/notifications';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// NOTIFICATION CLASS → DEFAULT TEMPLATE MAP (stub references)
// Full template resolution requires live notification_templates collection.
// ---------------------------------------------------------------------------
const CLASS_TEMPLATE_MAP: Record<string, string> = {
  transactional_receipt:  'tpl_transactional_receipt_email_v1',
  payment_warning:        'tpl_payment_warning_email_v1',
  finance_admin_alert:    'tpl_finance_admin_alert_board_v1',
  refund_return_case:     'tpl_refund_return_case_email_v1',
  payout_notice:          'tpl_payout_notice_email_v1',
  dispute_case_notice:    'tpl_dispute_case_notice_email_v1',
  entitlement_notice:     'tpl_entitlement_notice_inapp_v1',
  dispatch_notice:        'tpl_dispatch_notice_inapp_v1',
  inspection_notice:      'tpl_inspection_notice_inapp_v1',
  safety_notice:          'tpl_safety_notice_board_v1',
  governance_notice:      'tpl_governance_notice_board_v1',
  support_case_notice:    'tpl_support_case_notice_inapp_v1',
  system_exception_alert: 'tpl_system_exception_alert_board_v1',
};

// ---------------------------------------------------------------------------
// CALLABLE
// ---------------------------------------------------------------------------

export const recordNotificationEvent = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'notifications.recordNotificationEvent',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const {
    source_event_id,
    notification_class,
    severity,
    recipient_type,
    recipient_id,
    org_id,
    sender_profile_id,
    channel,
    visibility_class,
  } = data as {
    source_event_id:    string;
    notification_class: string;
    severity:           string;
    recipient_type:     string;
    recipient_id:       string;
    org_id:             string;
    sender_profile_id:  string;
    channel:            string;
    visibility_class:   string;
  };

  // Required field checks
  const required = ['source_event_id', 'notification_class', 'recipient_type', 'recipient_id', 'org_id', 'sender_profile_id', 'channel'];
  const missing = required.filter((k) => !(data as any)[k]);
  if (missing.length > 0) {
    throw new functions.https.HttpsError('invalid-argument', `recordNotificationEvent: missing fields: ${missing.join(', ')}`);
  }

  // Resolve template stub
  const template_id = CLASS_TEMPLATE_MAP[notification_class] ?? `tpl_${notification_class}_v1`;

  const notification_id = `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const record = {
    notification_id,
    source_event_id,
    notification_class,
    severity: severity ?? 'info',
    recipient_type,
    recipient_id,
    org_id,
    sender_profile_id,
    template_id,
    template_version: '1.0.0',
    channel,
    queue_state: 'pending',
    delivery_state: 'not_started',
    generated_at: now,
    visibility_class: visibility_class ?? 'org_visible',
    policy_version: POLICY_VERSION,
    engine_version: ENGINE_VERSION,
  };

  await db.collection(NOTIFICATION_COLLECTIONS.events).doc(notification_id).set(record);

  // Also write to monitor_events_notification for MON_NOTIFY lane visibility
  await db.collection('monitor_events_notification').add({
    event_domain:    'notification',
    event_type:      'notification_generated',
    event_subtype:   notification_class,
    org_id,
    actor_id:        gate.uid,
    actor_role:      'system',
    entity_type:     'notification_event',
    entity_id:       notification_id,
    trust_class:     'operational',
    severity:        'info',
    actionability:   'none',
    visibility_class: 'admin_only',
    source_service:  'notifications_fabric',
    source_ref:      `notification_events/${notification_id}`,
    timestamp:       now,
    policy_version:  POLICY_VERSION,
    engine_version:  ENGINE_VERSION,
  });

  functions.logger.info(`[recordNotificationEvent] Created ${notification_id}`, {
    notification_class,
    channel,
    sender_profile_id,
  });

  return { ok: true, notification_id, template_id, queue_state: 'pending' };
});
