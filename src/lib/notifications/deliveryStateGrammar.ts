/**
 * SCINGULAR Global — Delivery State Grammar
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Canonical truth-state vocabulary for notification delivery.
 * Anti-drift rule: no route may improvise its own status grammar.
 * Equivalent notice classes must render consistently across all surfaces.
 *
 * Core doctrine:
 *   queued ≠ sent
 *   sent ≠ delivered
 *   delivered ≠ acknowledged
 *   warning ≠ block
 *   review_required ≠ failed
 *   partial coverage ≠ full system readiness
 */

import type {
  NotificationQueueState,
  NotificationDeliveryState,
} from '@/lib/types/notifications';

// ---------------------------------------------------------------------------
// HUMAN-READABLE LABELS — used by boards, consoles, admin surfaces.
// Labels must express exactly the confidence level of the state.
// ---------------------------------------------------------------------------

export const QUEUE_STATE_LABELS: Record<NotificationQueueState, string> = {
  pending:     'Pending',
  queued:      'Queued',      // in queue — NOT dispatched yet
  processing:  'Processing',
  dispatched:  'Dispatched',  // left the system — NOT confirmed delivered
  suppressed:  'Suppressed',  // policy suppressed
  failed:      'Failed',
};

export const DELIVERY_STATE_LABELS: Record<NotificationDeliveryState, string> = {
  not_started:   'Not Started',
  sent:          'Sent',          // handed to provider — NOT confirmed delivered
  delivered:     'Delivered',     // provider confirmed — NOT acknowledged by recipient
  acknowledged:  'Acknowledged',  // recipient confirmed receipt
  bounced:       'Bounced',
  failed:        'Failed',
  retry_pending: 'Retry Pending',
};

// ---------------------------------------------------------------------------
// DERIVED COMPOSITE STATUS — single label for UI surfaces that combine queue
// and delivery state into one display string.
// ---------------------------------------------------------------------------

export type CompositeDeliveryStatus =
  | 'pending'
  | 'queued'
  | 'dispatched'
  | 'sent'
  | 'delivered'
  | 'acknowledged'
  | 'suppressed'
  | 'bounced'
  | 'failed'
  | 'retry_pending'
  | 'unknown';

/**
 * Derives a single composite display status from the separate queue + delivery states.
 * Preserves the most precise state available.
 */
export function deriveCompositeStatus(
  queueState: NotificationQueueState,
  deliveryState: NotificationDeliveryState,
): CompositeDeliveryStatus {
  // Delivery-layer states take precedence when available
  if (deliveryState === 'acknowledged') return 'acknowledged';
  if (deliveryState === 'delivered')    return 'delivered';
  if (deliveryState === 'sent')         return 'sent';
  if (deliveryState === 'bounced')      return 'bounced';
  if (deliveryState === 'failed')       return 'failed';
  if (deliveryState === 'retry_pending') return 'retry_pending';

  // Fall through to queue-layer state
  if (queueState === 'suppressed')  return 'suppressed';
  if (queueState === 'failed')      return 'failed';
  if (queueState === 'dispatched')  return 'dispatched';
  if (queueState === 'processing')  return 'dispatched';
  if (queueState === 'queued')      return 'queued';
  if (queueState === 'pending')     return 'pending';

  return 'unknown';
}

const COMPOSITE_LABELS: Record<CompositeDeliveryStatus, string> = {
  pending:       'Pending',
  queued:        'Queued',
  dispatched:    'Dispatched',
  sent:          'Sent to Provider',
  delivered:     'Delivered',
  acknowledged:  'Acknowledged',
  suppressed:    'Suppressed',
  bounced:       'Bounced',
  failed:        'Failed',
  retry_pending: 'Retry Pending',
  unknown:       'Unknown',
};

export function getCompositeStatusLabel(status: CompositeDeliveryStatus): string {
  return COMPOSITE_LABELS[status];
}

// ---------------------------------------------------------------------------
// SEVERITY GRAMMAR — consistent treatment across monitor and notification surfaces.
// ---------------------------------------------------------------------------

export const SEVERITY_LABELS: Record<string, string> = {
  debug:          'Debug',
  info:           'Info',
  warning:        'Warning',
  elevated:       'Elevated',
  critical:       'Critical',
  safety_critical: 'Safety Critical',
};

export const SEVERITY_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  debug:          'outline',
  info:           'secondary',
  warning:        'secondary',
  elevated:       'default',
  critical:       'destructive',
  safety_critical: 'destructive',
};

// ---------------------------------------------------------------------------
// MONITOR EVENT STATE GRAMMAR
// ---------------------------------------------------------------------------

export const ALERT_STATUS_LABELS: Record<string, string> = {
  open:         'Open',
  acknowledged: 'Acknowledged',
  resolved:     'Resolved',
  escalated:    'Escalated',
  suppressed:   'Suppressed',
};

export const REVIEW_QUEUE_STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  in_review:  'In Review',
  resolved:   'Resolved',
  escalated:  'Escalated',
  closed:     'Closed',
};

// ---------------------------------------------------------------------------
// IS-TERMINAL checks — whether a state is final (no further transitions expected).
// ---------------------------------------------------------------------------

export function isQueueStateTerminal(state: NotificationQueueState): boolean {
  return state === 'dispatched' || state === 'suppressed' || state === 'failed';
}

export function isDeliveryStateTerminal(state: NotificationDeliveryState): boolean {
  return (
    state === 'delivered' ||
    state === 'acknowledged' ||
    state === 'bounced' ||
    state === 'failed'
  );
}
