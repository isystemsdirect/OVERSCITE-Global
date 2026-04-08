import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { advanceSrtRecordState } from './state';
import { emitSrtAuditEvent } from './audit';

export interface PersistFindingsPayload {
  acceptedMediaId: string;
  sourceMediaId: string;
  engineJobId: string;
  findingsPayload: any;
  actorId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
}

/**
 * persistSrtEngineFindings
 *
 * Captures asynchronous LARI engine return payloads and locks them as bounding boxes, OCR, and tags.
 */
export async function persistSrtEngineFindings(request: CallableRequest<PersistFindingsPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();

  // 1. Advance to analysis_complete (signaling job return)
  await advanceSrtRecordState({
    acceptedMediaId: data.acceptedMediaId,
    toState: 'analysis_complete',
    sourceMediaId: data.sourceMediaId,
    actorId: data.actorId,
    subsystem: data.subsystem,
    functionContext: 'persistSrtEngineFindings'
  });

  const findingId = `fnd-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  
  const findingRecord = {
    id: findingId,
    acceptedMediaId: data.acceptedMediaId,
    sourceMediaId: data.sourceMediaId,
    engineJobId: data.engineJobId,
    payload: data.findingsPayload,
    recordedAt: new Date().toISOString(),
    truthState: 'locked_finding'
  };

  try {
    // 2. Persist Finding Logic
    await db.collection('srt_locked_findings').doc(findingId).set(findingRecord);

    const jobRef = db.collection('srt_engine_jobs').doc(data.engineJobId);
    await jobRef.update({ status: 'completed' });

    // 3. Advance state to findings returned
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'findings_recorded',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'persistSrtEngineFindings'
    });

    await emitSrtAuditEvent({
      auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
      eventType: 'srt_findings_recorded',
      actorId: data.actorId,
      functionName: 'persistSrtEngineFindings',
      sourceMediaId: data.sourceMediaId,
      timestamp: new Date().toISOString(),
      subsystem: data.subsystem
    });

    return { success: true, findingId };
  } catch (error) {
    throw new HttpsError('internal', 'Unable to persist findings', error);
  }
}
