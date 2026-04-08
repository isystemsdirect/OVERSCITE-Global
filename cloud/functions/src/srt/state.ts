import * as admin from 'firebase-admin';
import { AcceptedPipelineState, isValidPipelineTransition } from '../../../../src/lib/srt/state-machine/srt-pipeline-state-machine';
import { emitSrtAuditEvent } from './audit';

export interface AdvanceStatePayload {
  acceptedMediaId: string;
  sourceMediaId?: string;
  toState: AcceptedPipelineState;
  actorId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
  functionContext: string;
}

/**
 * advanceSrtRecordState
 *
 * Centralized guarded transition executor. Enforces monotonic logic.
 */
export async function advanceSrtRecordState(payload: AdvanceStatePayload): Promise<void> {
  const db = admin.firestore();
  const docRef = db.collection('srt_accepted_media_queue').doc(payload.acceptedMediaId);
  const timestamp = new Date().toISOString();

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    if (!doc.exists) throw new Error(`Queue item ${payload.acceptedMediaId} not found`);

    const data = doc.data()!;
    const fromState = data.state as AcceptedPipelineState;
    
    // 1. Guard Enforcement
    if (!isValidPipelineTransition(fromState, payload.toState)) {
      throw new Error(`Invalid Pipeline Transition: Cannot move from ${fromState} to ${payload.toState}`);
    }

    // 2. Perform write
    transaction.update(docRef, { state: payload.toState, lastUpdatedAt: timestamp });

    // 3. Emit matching audit action directly from this wrapper
    await emitSrtAuditEvent({
      auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
      eventType: `srt_transition_${payload.toState}`,
      actorId: payload.actorId,
      functionName: payload.functionContext,
      previousState: fromState,
      nextState: payload.toState,
      acceptedMediaId: payload.acceptedMediaId,
      sourceMediaId: payload.sourceMediaId,
      timestamp,
      subsystem: payload.subsystem
    });
  });
}
