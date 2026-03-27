/**
 * OVERSCITE Global — Notification Template Registry Stub
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Maps NotificationClass → template metadata contract.
 * Actual template bodies are stored server-side only (Cloud Functions).
 * This provides the type contract and class→templateId mapping for
 * client-side reference and admin console display.
 *
 * Implementation Status: SCAFFOLD — template bodies not yet authored.
 * Requires: template content authoring, approval workflow, provider rendering test.
 */

import type { NotificationClass, NotificationChannel, TemplateStatus } from '@/lib/types/notifications';

// ---------------------------------------------------------------------------
// TEMPLATE STUB RECORD — metadata only, no body content in client bundle
// ---------------------------------------------------------------------------

export interface TemplateStub {
  template_id: string;
  notification_class: NotificationClass;
  name: string;
  channel: NotificationChannel;
  version: string;
  status: TemplateStatus;
  /** Subject line preview for admin console display. NOT the live template. */
  subject_preview: string;
}

// ---------------------------------------------------------------------------
// TEMPLATE STUBS — 13 classes × primary channel pairs
// All marked 'draft' — require authoring and approval before activation.
// ---------------------------------------------------------------------------

export const TEMPLATE_STUBS: TemplateStub[] = [
  {
    template_id: 'tpl_transactional_receipt_email_v1',
    notification_class: 'transactional_receipt',
    name: 'Transactional Receipt — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Your OVERSCITE receipt for {{order_reference}}',
  },
  {
    template_id: 'tpl_transactional_receipt_inapp_v1',
    notification_class: 'transactional_receipt',
    name: 'Transactional Receipt — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Receipt: {{order_reference}}',
  },
  {
    template_id: 'tpl_payment_warning_email_v1',
    notification_class: 'payment_warning',
    name: 'Payment Warning — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Action required: Payment issue on your OVERSCITE account',
  },
  {
    template_id: 'tpl_payment_warning_inapp_v1',
    notification_class: 'payment_warning',
    name: 'Payment Warning — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Payment action required',
  },
  {
    template_id: 'tpl_finance_admin_alert_email_v1',
    notification_class: 'finance_admin_alert',
    name: 'Finance Admin Alert — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: '[Finance OPS] Alert: {{alert_type}} — {{entity_id}}',
  },
  {
    template_id: 'tpl_finance_admin_alert_board_v1',
    notification_class: 'finance_admin_alert',
    name: 'Finance Admin Alert — Admin Board',
    channel: 'admin_board',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Finance Alert: {{alert_type}}',
  },
  {
    template_id: 'tpl_refund_return_case_email_v1',
    notification_class: 'refund_return_case',
    name: 'Refund / Return Case — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Update on your refund request {{case_id}}',
  },
  {
    template_id: 'tpl_payout_notice_email_v1',
    notification_class: 'payout_notice',
    name: 'Payout Notice — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'OVERSCITE payout update: {{payout_status}}',
  },
  {
    template_id: 'tpl_dispute_case_notice_email_v1',
    notification_class: 'dispute_case_notice',
    name: 'Dispute Case Notice — Email',
    channel: 'email',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Dispute update: Case {{dispute_id}}',
  },
  {
    template_id: 'tpl_entitlement_notice_inapp_v1',
    notification_class: 'entitlement_notice',
    name: 'Entitlement Notice — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Entitlement {{entitlement_status}}: {{product_name}}',
  },
  {
    template_id: 'tpl_dispatch_notice_inapp_v1',
    notification_class: 'dispatch_notice',
    name: 'Dispatch Notice — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Job update: {{job_title}}',
  },
  {
    template_id: 'tpl_inspection_notice_inapp_v1',
    notification_class: 'inspection_notice',
    name: 'Inspection Notice — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Inspection update: {{inspection_id}}',
  },
  {
    template_id: 'tpl_safety_notice_inapp_v1',
    notification_class: 'safety_notice',
    name: 'Safety Notice — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Safety alert: {{alert_type}}',
  },
  {
    template_id: 'tpl_safety_notice_board_v1',
    notification_class: 'safety_notice',
    name: 'Safety Notice — Admin Board',
    channel: 'admin_board',
    version: '1.0.0',
    status: 'draft',
    subject_preview: '[SAFETY] {{alert_type}} — {{entity_id}}',
  },
  {
    template_id: 'tpl_governance_notice_board_v1',
    notification_class: 'governance_notice',
    name: 'Governance Notice — Admin Board',
    channel: 'admin_board',
    version: '1.0.0',
    status: 'draft',
    subject_preview: '[GOV] {{notice_type}} — Review required',
  },
  {
    template_id: 'tpl_support_case_notice_inapp_v1',
    notification_class: 'support_case_notice',
    name: 'Support Case Notice — In-App',
    channel: 'in_app',
    version: '1.0.0',
    status: 'draft',
    subject_preview: 'Support case update: {{case_id}}',
  },
  {
    template_id: 'tpl_system_exception_alert_board_v1',
    notification_class: 'system_exception_alert',
    name: 'System Exception Alert — Admin Board',
    channel: 'admin_board',
    version: '1.0.0',
    status: 'draft',
    subject_preview: '[SYS EXCEPTION] {{exception_type}}',
  },
];

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/** Returns all stubs for a given notification class. */
export function getTemplateStubsForClass(cls: NotificationClass): TemplateStub[] {
  return TEMPLATE_STUBS.filter((t) => t.notification_class === cls);
}

/** Returns all stubs for a given channel. */
export function getTemplateStubsForChannel(channel: NotificationChannel): TemplateStub[] {
  return TEMPLATE_STUBS.filter((t) => t.channel === channel);
}

/** Returns a template stub by ID. Returns undefined if not found. */
export function getTemplateStubById(templateId: string): TemplateStub | undefined {
  return TEMPLATE_STUBS.find((t) => t.template_id === templateId);
}

/** Returns all stubs with a given status. */
export function getTemplateStubsByStatus(status: TemplateStatus): TemplateStub[] {
  return TEMPLATE_STUBS.filter((t) => t.status === status);
}
