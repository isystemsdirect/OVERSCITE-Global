/**
 * @classification SCIMEGA_SIMULATION_LEDGER
 * @authority BANE Audit Layer
 * @purpose In-memory ledger service for recording SCIMEGA simulation lifecycle events.
 * @warning Records are observational evidence only. No execution authority is conferred.
 */

import type { SCIMEGASimulationAuditRecord, SCIMEGAAuditEvent, SCIMEGAAuditEventType, SCIMEGAProposalLifecycleState, SCIMEGAOperatorReviewAction } from './scimega-simulation-audit-types';
import { ScimegaAuditHash } from './scimega-audit-hash';

export class ScimegaSimulationLedger {
  private records: Map<string, SCIMEGASimulationAuditRecord> = new Map();

  getRecord(proposalId: string): SCIMEGASimulationAuditRecord | undefined {
    return this.records.get(proposalId);
  }

  getAllRecords(): SCIMEGASimulationAuditRecord[] {
    return Array.from(this.records.values());
  }

  initializeRecord(proposalId: string): SCIMEGASimulationAuditRecord {
    const now = new Date().toISOString();
    const record: SCIMEGASimulationAuditRecord = {
      proposalId,
      lifecycleState: 'draft',
      events: [],
      operatorActions: [],
      boundaryAcknowledged: false,
      createdAt: now,
      lastUpdatedAt: now
    };
    this.records.set(proposalId, record);
    this.appendEvent(proposalId, 'proposal_generated', 'SYSTEM', 'Proposal record initialized.');
    return record;
  }

  appendEvent(proposalId: string, eventType: SCIMEGAAuditEventType, actor: string, detail: string): SCIMEGAAuditEvent | null {
    const record = this.records.get(proposalId);
    if (!record) return null;

    const priorHash = record.events.length > 0
      ? record.events[record.events.length - 1].eventHash
      : ScimegaAuditHash.GENESIS_HASH;

    const timestamp = new Date().toISOString();
    const eventHash = ScimegaAuditHash.generate(detail, timestamp, proposalId, priorHash);

    const event: SCIMEGAAuditEvent = {
      eventId: `EVT-${Date.now()}-${record.events.length}`,
      eventType, timestamp, proposalId, actor, detail, priorHash, eventHash
    };

    record.events.push(event);
    record.lastUpdatedAt = timestamp;
    return event;
  }

  transitionLifecycle(proposalId: string, newState: SCIMEGAProposalLifecycleState, actor: string): boolean {
    const record = this.records.get(proposalId);
    if (!record) return false;
    const oldState = record.lifecycleState;
    record.lifecycleState = newState;
    this.appendEvent(proposalId, 'lifecycle_state_transition', actor, `${oldState} → ${newState}`);
    return true;
  }

  recordOperatorAction(action: SCIMEGAOperatorReviewAction): boolean {
    const record = this.records.get(action.proposalId);
    if (!record) return false;
    record.operatorActions.push(action);
    this.appendEvent(action.proposalId, 'operator_review_action', action.operator, `${action.action}: ${action.checklistItemId}`);
    return true;
  }

  acknowledgeBoundary(proposalId: string, operator: string): boolean {
    const record = this.records.get(proposalId);
    if (!record) return false;
    record.boundaryAcknowledged = true;
    this.appendEvent(proposalId, 'boundary_acknowledgment', operator, 'NO-FLASH / NO-C2 / NO-EXECUTION boundary acknowledged.');
    return true;
  }
}
