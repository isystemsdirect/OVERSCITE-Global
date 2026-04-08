/**
 * SRT Audit Event
 *
 * Defines the standardized, append-only audit emission schema mapped to the pipeline transitions.
 * Implements Doctrine UTCB-S__20260408-000000Z__SCING__004.
 */

export interface SrtAuditEvent {
  auditEventId: string;
  eventType: string;
  actorId?: string;
  functionName: string;
  previousState?: string;
  nextState?: string;
  sourceMediaId?: string;
  acceptedMediaId?: string;
  engineJobId?: string;
  verificationId?: string;
  exportId?: string;
  sourceHash?: string;
  timestamp: string;
  subsystem: "overscite" | "rebel" | "contractor";
  integrityNotes?: string[];
}
