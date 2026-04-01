import type { BaneAuditRecord, BaneEventRecord, BaneIncidentRecord } from './records';

export interface BaneStore {
  appendAudit(record: BaneAuditRecord): Promise<void>;
  appendEvent(event: BaneEventRecord): Promise<void>;
  getRecentAudits(limit: number): Promise<BaneAuditRecord[]>;
  
  // Governance anchors for strict chaining
  getAnchor(): Promise<{ lastHash: string; sequence: number }>;
  updateAnchor(lastHash: string, sequence: number): Promise<void>;
  getLastSequenceForIdentity(identityId: string): Promise<number>;

  appendIncident?(incident: BaneIncidentRecord): Promise<void>;
  getRecentIncidents?(limit: number): Promise<BaneIncidentRecord[]>;
  getIncidentByTrace?(traceId: string): Promise<BaneIncidentRecord | null>;
}
