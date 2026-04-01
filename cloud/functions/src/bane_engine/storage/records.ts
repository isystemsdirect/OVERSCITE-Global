import type { BaneEnforcementLevel, BaneSeverity, BaneVerdict } from '../types';

export type BaneAuditRecord = {
  at: number;
  traceId: string;
  route: string;
  requiredCapability?: string;
  identityId?: string;
  verdict: BaneVerdict;
  severity: BaneSeverity;
  enforcementLevel: BaneEnforcementLevel;
  inputHash: string;
  safeTextHash?: string;
  findingsSummary: Array<{ id: string; severity: BaneSeverity; verdict: BaneVerdict }>;
  prevHash?: string;
  signature?: string;
  sequenceRef?: number; // Monotonically increasing sequence
  linkageId?: string;   // Link to parent action trace
};

export type BaneEventRecord = {
  type: string;
  traceId: string;
  at: number;
  data?: Record<string, unknown>;
};

export type BaneIncidentRecord = {
  traceId: string;
  occurredAt: number;
  identityId?: string;
  sessionId?: string;
  ipHash?: string;
  enforcementLevel: number;
  verdict: string;
  severity: string;
  findingsSummary: Array<{ id: string; severity: string; verdict: string }>;
};
