import * as admin from 'firebase-admin';

export type MonitorDomain =
  | 'finance'
  | 'marketplace'
  | 'dispatch'
  | 'inspection'
  | 'geo'
  | 'srt'
  | 'safety'
  | 'identity'
  | 'notification'
  | 'compliance'
  | 'governance'
  | 'admin_ops'
  | 'device'
  | 'customer_service';

export type EventTrustClass =
  | 'informational'
  | 'operational'
  | 'financial'
  | 'evidentiary'
  | 'governance_sensitive'
  | 'safety_critical'
  | 'commercial_sensitive';

export type EventActionabilityClass =
  | 'none'
  | 'review'
  | 'approval_required'
  | 'block'
  | 'escalate'
  | 'dispatch_notice_only';

export type EventVisibilityClass =
  | 'self_only'
  | 'org_visible'
  | 'admin_only'
  | 'finance_admin_only'
  | 'governance_only'
  | 'support_only'
  | 'cross_role_restricted';

export type EventSeverity =
  | 'debug'
  | 'info'
  | 'warning'
  | 'elevated'
  | 'critical'
  | 'safety_critical';

export interface CanonicalMonitorEvent {
  event_id: string;
  event_domain: MonitorDomain;
  event_type: string;
  event_subtype?: string;
  org_id: string;
  actor_id: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  trust_class: EventTrustClass;
  severity: EventSeverity;
  actionability: EventActionabilityClass;
  visibility_class: EventVisibilityClass;
  source_service: string;
  source_ref: string;
  payload_ref?: string;
  timestamp: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  policy_version: string;
  engine_version: string;
  correlation_key?: string;
}

export type MonitorLaneId =
  | 'MON_FIN'
  | 'MON_MARKET'
  | 'MON_DISPATCH'
  | 'MON_INSPECT'
  | 'MON_GEO'
  | 'MON_SRT'
  | 'MON_SAFE'
  | 'MON_IDENT'
  | 'MON_NOTIFY'
  | 'MON_COMP'
  | 'MON_GOV'
  | 'MON_ADMIN';

export type MonitorBoardTarget =
  | 'command_board'
  | 'finance_board'
  | 'marketplace_board'
  | 'dispatch_board'
  | 'inspections_board'
  | 'safety_board'
  | 'notifications_reliability_board'
  | 'governance_board'
  | 'support_board';

export interface MonitorAlertPacket {
  alert_packet_id: string;
  lane: MonitorLaneId;
  source_event_ids: string[];
  correlation_summary: string;
  severity: EventSeverity;
  actionability: EventActionabilityClass;
  board_target: MonitorBoardTarget;
  status: 'open' | 'acknowledged' | 'resolved' | 'escalated' | 'suppressed';
  review_queue_ref?: string;
  created_at: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  updated_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
}

export type ReviewQueueType =
  | 'finance_review'
  | 'governance_review'
  | 'support_escalation'
  | 'safety_escalation'
  | 'compliance_review'
  | 'manual_override_record';

export interface MonitorReviewQueue {
  review_id: string;
  queue_type: ReviewQueueType;
  related_alert_packet_id: string;
  related_notification_ids: string[];
  assigned_role: string;
  assigned_actor_id?: string;
  status: 'pending' | 'in_review' | 'resolved' | 'escalated' | 'closed';
  reason: string;
  created_at: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  resolved_at?: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
  resolved_by?: string;
  resolution_notes?: string;
}

export interface MonitorTrendRollup {
  rollup_id: string;
  lane: MonitorLaneId;
  period_start: string;
  period_end: string;
  event_count: number;
  alert_count: number;
  critical_count: number;
  open_review_count: number;
  top_event_types: { event_type: string; count: number }[];
  generated_at: admin.firestore.Timestamp | admin.firestore.FieldValue | string;
}

export const MONITOR_COLLECTION_MAP: Record<MonitorDomain, string> = {
  finance:          'monitor_events_finance',
  marketplace:      'monitor_events_marketplace',
  dispatch:         'monitor_events_dispatch',
  inspection:       'monitor_events_inspection',
  geo:              'monitor_events_geo',
  srt:              'monitor_events_srt',
  safety:           'monitor_events_safety',
  identity:         'monitor_events_identity',
  notification:     'monitor_events_notification',
  compliance:       'monitor_events_compliance',
  governance:       'monitor_events_governance',
  admin_ops:        'monitor_events_admin_ops',
  device:           'monitor_events_admin_ops',
  customer_service: 'monitor_events_admin_ops',
} as const;

export const MONITOR_SHARED_COLLECTIONS = {
  correlations:    'monitor_correlations',
  alert_packets:   'monitor_alert_packets',
  review_queues:   'monitor_review_queues',
  trend_rollups:   'monitor_trend_rollups',
  audit_events:    'monitor_audit_events',
} as const;
