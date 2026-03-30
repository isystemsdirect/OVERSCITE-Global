import * as admin from 'firebase-admin';

export type NotificationClass =
  | 'transactional_receipt'
  | 'payment_warning'
  | 'finance_admin_alert'
  | 'refund_return_case'
  | 'payout_notice'
  | 'dispute_case_notice'
  | 'entitlement_notice'
  | 'dispatch_notice'
  | 'inspection_notice'
  | 'safety_notice'
  | 'governance_notice'
  | 'support_case_notice'
  | 'system_exception_alert';

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

export type NotificationChannel =
  | 'email'
  | 'in_app'
  | 'sms'
  | 'admin_board'
  | 'webhook_internal';

export type NotificationQueueState =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'dispatched'
  | 'suppressed'
  | 'failed';

export type NotificationDeliveryState =
  | 'not_started'
  | 'sent'
  | 'delivered'
  | 'acknowledged'
  | 'bounced'
  | 'failed'
  | 'retry_pending';

export interface NotificationEvent {
  notification_id: string;
  source_event_id: string;
  notification_class: NotificationClass;
  severity: string;
  recipient_type: string;
  recipient_id: string;
  org_id: string;
  sender_profile_id: string;
  template_id: string;
  template_version: string;
  channel: NotificationChannel;
  queue_state: NotificationQueueState;
  delivery_state: NotificationDeliveryState;
  generated_at: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  queued_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  dispatched_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  delivered_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  failed_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  visibility_class: string;
  audit_event_ref?: string;
  rendered_subject?: string;
  metadata?: Record<string, unknown>;
}

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
