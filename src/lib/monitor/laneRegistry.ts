/**
 * SCINGULAR Global — LARI-Monitor Lane Registry
 * UTCB-S V1.0.00 — Unified Notifications & LARI-Monitor Architecture
 *
 * Defines the 12 canonical LARI-Monitor lanes. Each lane has its own
 * filters, queues, dashboards, and retention logic. Events may correlate
 * across lanes, but visibility must remain policy-bound. No lane may
 * escalate itself into autonomous command authority.
 *
 * Implementation Status: LIVE — registry definition only.
 * Live event ingestion per lane: SCAFFOLD — cloud function wiring required.
 */

import type {
  MonitorLaneId,
  MonitorLaneDefinition,
  MonitorDomain,
  EventSeverity,
} from '@/lib/types/monitor';

// ---------------------------------------------------------------------------
// 12-LANE REGISTRY
// ---------------------------------------------------------------------------

export const LARI_MONITOR_LANES: Record<MonitorLaneId, MonitorLaneDefinition> = {
  MON_FIN: {
    lane_id: 'MON_FIN',
    label: 'Finance Monitor',
    domain: 'finance',
    collection: 'monitor_events_finance',
    board_target: 'finance_board',
    alert_threshold: 'warning',
    governance_routable: true,
  },

  MON_MARKET: {
    lane_id: 'MON_MARKET',
    label: 'Marketplace Monitor',
    domain: 'marketplace',
    collection: 'monitor_events_marketplace',
    board_target: 'marketplace_board',
    alert_threshold: 'warning',
    governance_routable: false,
  },

  MON_DISPATCH: {
    lane_id: 'MON_DISPATCH',
    label: 'Dispatch Monitor',
    domain: 'dispatch',
    collection: 'monitor_events_dispatch',
    board_target: 'dispatch_board',
    alert_threshold: 'elevated',
    governance_routable: false,
  },

  MON_INSPECT: {
    lane_id: 'MON_INSPECT',
    label: 'Inspections Monitor',
    domain: 'inspection',
    collection: 'monitor_events_inspection',
    board_target: 'inspections_board',
    alert_threshold: 'warning',
    governance_routable: true,
  },

  MON_GEO: {
    lane_id: 'MON_GEO',
    label: 'Geo Monitor',
    domain: 'geo',
    secondary_domains: ['device'],
    collection: 'monitor_events_geo',
    board_target: 'dispatch_board',
    alert_threshold: 'elevated',
    governance_routable: false,
  },

  MON_SRT: {
    lane_id: 'MON_SRT',
    label: 'SRT Monitor',
    domain: 'srt',
    secondary_domains: ['device'],
    collection: 'monitor_events_srt',
    board_target: 'safety_board',
    alert_threshold: 'warning',
    governance_routable: false,
  },

  MON_SAFE: {
    lane_id: 'MON_SAFE',
    label: 'Safety Monitor',
    domain: 'safety',
    collection: 'monitor_events_safety',
    board_target: 'safety_board',
    alert_threshold: 'elevated',
    governance_routable: true,
  },

  MON_IDENT: {
    lane_id: 'MON_IDENT',
    label: 'Identity Monitor',
    domain: 'identity',
    collection: 'monitor_events_identity',
    board_target: 'governance_board',
    alert_threshold: 'warning',
    governance_routable: true,
  },

  MON_NOTIFY: {
    lane_id: 'MON_NOTIFY',
    label: 'Notifications Monitor',
    domain: 'notification',
    collection: 'monitor_events_notification',
    board_target: 'notifications_reliability_board',
    alert_threshold: 'warning',
    governance_routable: false,
  },

  MON_COMP: {
    lane_id: 'MON_COMP',
    label: 'Compliance Monitor',
    domain: 'compliance',
    collection: 'monitor_events_compliance',
    board_target: 'governance_board',
    alert_threshold: 'elevated',
    governance_routable: true,
  },

  MON_GOV: {
    lane_id: 'MON_GOV',
    label: 'Governance Monitor',
    domain: 'governance',
    collection: 'monitor_events_governance',
    board_target: 'governance_board',
    alert_threshold: 'warning',
    governance_routable: true,
  },

  MON_ADMIN: {
    lane_id: 'MON_ADMIN',
    label: 'Admin Ops Monitor',
    domain: 'admin_ops',
    secondary_domains: ['customer_service'],
    collection: 'monitor_events_admin_ops',
    board_target: 'support_board',
    alert_threshold: 'elevated',
    governance_routable: false,
  },
};

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------

/** Returns the lane definition for a given lane ID. */
export function getLane(laneId: MonitorLaneId): MonitorLaneDefinition {
  return LARI_MONITOR_LANES[laneId];
}

/** Returns all lane IDs that are governance-routable (can produce review queue items). */
export function getGovernanceRoutableLanes(): MonitorLaneId[] {
  return Object.values(LARI_MONITOR_LANES)
    .filter((lane) => lane.governance_routable)
    .map((lane) => lane.lane_id);
}

/**
 * Resolves the primary lane for a given MonitorDomain.
 * If a domain maps to multiple lanes (via secondary_domains), only the primary is returned.
 * Use correlation for multi-lane event propagation.
 */
export function getPrimaryLaneForDomain(domain: MonitorDomain): MonitorLaneId | undefined {
  const primary = Object.values(LARI_MONITOR_LANES).find(
    (lane) => lane.domain === domain,
  );
  return primary?.lane_id;
}

/**
 * Severity order map for threshold comparison.
 * Higher number = higher severity.
 */
export const SEVERITY_ORDER: Record<EventSeverity, number> = {
  debug:          0,
  info:           1,
  warning:        2,
  elevated:       3,
  critical:       4,
  safety_critical: 5,
};

/**
 * Returns true if the given event severity meets or exceeds the lane's alert threshold.
 */
export function meetsAlertThreshold(
  eventSeverity: EventSeverity,
  lane: MonitorLaneDefinition,
): boolean {
  return SEVERITY_ORDER[eventSeverity] >= SEVERITY_ORDER[lane.alert_threshold];
}
