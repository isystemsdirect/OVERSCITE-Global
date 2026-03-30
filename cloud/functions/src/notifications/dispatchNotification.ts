/**
 * OVERSCITE Global — Notifications: dispatchNotification Cloud Function
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * BANE-callable Cloud Function.
 * Accepts a notification_id, selects channel dispatch path, dispatches.
 * Writes initial delivery attempt record.
 *
 * Implementation Status: PARTIAL
 * In-app channel: PARTIAL — Firestore write to user notification inbox.
 * Admin board channel: PARTIAL — Firestore write to admin board feed.
 * Email channel: SCAFFOLD — provider not yet integrated. Stub only.
 * SMS channel: SCAFFOLD — provider not yet integrated. Consent-gate not wired.
 * Webhook internal: SCAFFOLD — downstream queue population not yet wired.
 *
 * Notifications may inform, warn, request action.
 * They may NOT self-execute irreversible state change.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { enforceBaneCallable } from '../bane/enforce';
import { NOTIFICATION_COLLECTIONS } from '../types/notifications';

const ENGINE_VERSION = 'lari-monitor-v1';
const POLICY_VERSION = '1.0.0';

export const dispatchNotification = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'notifications.dispatchNotification',
    data,
    ctx: context,
  });

  functions.logger.info(`[dispatchNotification] Gate Decision Locked`, { traceId: gate.traceId });

  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  const { notification_id } = data as { notification_id: string };

  if (!notification_id) {
    throw new functions.https.HttpsError('invalid-argument', 'dispatchNotification: notification_id is required.');
  }

  // Fetch the notification record
  const snap = await db.collection(NOTIFICATION_COLLECTIONS.events).doc(notification_id).get();
  if (!snap.exists) {
    throw new functions.https.HttpsError('not-found', `dispatchNotification: notification '${notification_id}' not found.`);
  }

  const notif = snap.data() as {
    channel: string;
    notification_class: string;
    sender_profile_id: string;
    recipient_id: string;
    org_id: string;
    queue_state: string;
  };

  // Guard: already dispatched or failed
  if (notif.queue_state === 'dispatched' || notif.queue_state === 'failed') {
    return {
      ok: false,
      reason: `Cannot re-dispatch notification in state '${notif.queue_state}'.`,
    };
  }

  // Update queue state to processing
  await snap.ref.update({ queue_state: 'processing', updated_at: now });

  const attempt_id = `att_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  let outcome: string;
  let provider: string;
  let provider_message_id: string | undefined;
  let error_detail: string | undefined;

  // ---------------------------------------------------------------------------
  // CHANNEL DISPATCH
  // ---------------------------------------------------------------------------

  if (notif.channel === 'in_app') {
    // PARTIAL — write to user notification inbox collection
    provider = 'firestore_in_app';
    await db.collection('user_notifications').add({
      notification_id,
      recipient_id:       notif.recipient_id,
      org_id:             notif.org_id,
      notification_class: notif.notification_class,
      channel:            'in_app',
      read:               false,
      created_at:         now,
    });
    outcome = 'success';
    provider_message_id = `inapp_${notification_id}`;

  } else if (notif.channel === 'admin_board') {
    // PARTIAL — write to admin board notification feed
    provider = 'admin_board_write';
    await db.collection('admin_board_notifications').add({
      notification_id,
      org_id:             notif.org_id,
      notification_class: notif.notification_class,
      sender_profile_id:  notif.sender_profile_id,
      read:               false,
      created_at:         now,
    });
    outcome = 'success';
    provider_message_id = `board_${notification_id}`;

  } else if (notif.channel === 'email') {
    // SCAFFOLD — email provider not integrated. Records stub attempt.
    provider = 'email_provider_stub';
    outcome = 'deferred';
    error_detail = '[SCAFFOLD] Email provider not yet integrated. Delivery deferred pending provider approval and DNS verification.';
    functions.logger.warn(`[dispatchNotification] Email dispatch to ${notif.recipient_id} deferred — provider scaffold.`);

  } else if (notif.channel === 'sms') {
    // SCAFFOLD — SMS provider not integrated. Policy-bound, consent not wired.
    provider = 'sms_provider_stub';
    outcome = 'deferred';
    error_detail = '[SCAFFOLD] SMS provider not integrated and consent-gate not wired. Delivery deferred.';
    functions.logger.warn(`[dispatchNotification] SMS dispatch deferred — scaffold.`);

  } else {
    // webhook_internal or unknown — scaffold
    provider = 'webhook_stub';
    outcome = 'deferred';
    error_detail = `[SCAFFOLD] Channel '${notif.channel}' dispatch not yet wired.`;
  }

  // ---------------------------------------------------------------------------
  // RECORD DELIVERY ATTEMPT
  // ---------------------------------------------------------------------------

  const attemptRecord = {
    attempt_id,
    notification_id,
    provider,
    provider_message_id,
    attempted_at:     now,
    outcome,
    error_detail,
    retry_count:      0,
    is_final_attempt: outcome === 'success',
    engine_version:   ENGINE_VERSION,
    policy_version:   POLICY_VERSION,
  };

  await db.collection(NOTIFICATION_COLLECTIONS.delivery_attempts).doc(attempt_id).set(attemptRecord);

  // Update notification state
  const finalQueueState = outcome === 'success' ? 'dispatched' : 'processing';
  const finalDeliveryState = outcome === 'success' ? 'sent' : 'not_started';

  await snap.ref.update({
    queue_state:      finalQueueState,
    delivery_state:   finalDeliveryState,
    dispatched_at:    outcome === 'success' ? now : null,
    updated_at:       now,
  });

  functions.logger.info(`[dispatchNotification] Dispatched ${notification_id}`, {
    channel: notif.channel,
    outcome,
    attempt_id,
  });

  return {
    ok: true,
    notification_id,
    attempt_id,
    channel:      notif.channel,
    outcome,
    queue_state:  finalQueueState,
    delivery_state: finalDeliveryState,
  };
});
