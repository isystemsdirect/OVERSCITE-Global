/**
 * OVERSCITE Global — Notifications: recordDeliveryAttempt Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function.
 * Records a delivery attempt outcome into notification_delivery_attempts.
 * Serves as the evidence anchor for delivery state.
 *
 * No final delivery claim may exist without delivery evidence.
 * Provider IDs, attempt history, bounce/failure, retry state — all required.
 *
 * Implementation Status: LIVE — evidence recording logic.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import { NOTIFICATION_COLLECTIONS } from '../../../../src/lib/types/notifications';

const POLICY_VERSION = '1.0.0';
const ENGINE_VERSION = 'lari-monitor-v1';

// Terminal delivery outcomes — after these, no retry is expected
const TERMINAL_OUTCOMES = new Set(['success', 'bounced', 'rejected']);

export const recordDeliveryAttempt = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({
    name: 'notifications.recordDeliveryAttempt',
    data,
    ctx: context,
  });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const {
    notification_id,
    provider,
    provider_message_id,
    outcome,
    error_code,
    error_detail,
    retry_count,
  } = data as {
    notification_id:     string;
    provider:            string;
    provider_message_id?: string;
    outcome:             string;
    error_code?:         string;
    error_detail?:       string;
    retry_count?:        number;
  };

  if (!notification_id || !provider || !outcome) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'recordDeliveryAttempt: notification_id, provider, and outcome are required.',
    );
  }

  const isFinal = TERMINAL_OUTCOMES.has(outcome);
  const attempt_id = `att_rec_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const attemptRecord = {
    attempt_id,
    notification_id,
    provider,
    provider_message_id: provider_message_id ?? null,
    attempted_at:        now,
    outcome,
    error_code:          error_code ?? null,
    error_detail:        error_detail ?? null,
    retry_count:         retry_count ?? 0,
    is_final_attempt:    isFinal,
    policy_version:      POLICY_VERSION,
    engine_version:      ENGINE_VERSION,
  };

  await db
    .collection(NOTIFICATION_COLLECTIONS.delivery_attempts)
    .doc(attempt_id)
    .set(attemptRecord);

  // Update the parent notification delivery_state based on outcome
  let delivery_state: string;
  switch (outcome) {
    case 'success':  delivery_state = 'delivered'; break;
    case 'bounced':  delivery_state = 'bounced';   break;
    case 'rejected': delivery_state = 'failed';    break;
    case 'failed':   delivery_state = 'failed';    break;
    default:         delivery_state = 'retry_pending';
  }

  const notifUpdate: Record<string, unknown> = {
    delivery_state,
    updated_at: now,
  };
  if (delivery_state === 'delivered') {
    notifUpdate.delivered_at = now;
  }
  if (delivery_state === 'failed' || delivery_state === 'bounced') {
    notifUpdate.failed_at = now;
    notifUpdate.queue_state = 'failed';
  }

  await db
    .collection(NOTIFICATION_COLLECTIONS.events)
    .doc(notification_id)
    .update(notifUpdate);

  functions.logger.info(`[recordDeliveryAttempt] Recorded attempt ${attempt_id}`, {
    notification_id,
    provider,
    outcome,
    is_final: isFinal,
  });

  return { ok: true, attempt_id, delivery_state, is_final: isFinal };
});
