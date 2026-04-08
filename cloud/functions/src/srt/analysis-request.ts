import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { advanceSrtRecordState } from './state';
import { emitSrtAuditEvent } from './audit';

export interface RequestAnalysisPayload {
  acceptedMediaId: string;
  sourceMediaId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
  actorId: string;
}

/**
 * requestSrtMediaAnalysis
 *
 * Explicitly elevates an accepted_unanalyzed resting item into the active
 * engine analysis queue. Costs compute tokens. Guarded explicit action.
 */
export async function requestSrtMediaAnalysis(request: CallableRequest<RequestAnalysisPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();

  // 1. Validate Current State is resting
  const queueDoc = await db.collection('srt_accepted_media_queue').doc(data.acceptedMediaId).get();
  if (!queueDoc.exists) {
    throw new HttpsError('not-found', 'Pipeline record missing');
  }
  
  const currentStatus = queueDoc.data()?.state;
  if (currentStatus !== 'accepted_unanalyzed') {
    throw new HttpsError('failed-precondition', `Cannot request analysis on item in ${currentStatus}`);
  }

  try {
    // 2. Advance to requested
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'accepted_analysis_requested',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'requestSrtMediaAnalysis'
    });

    // Explicit audit for token burn gate
    await emitSrtAuditEvent({
      auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
      eventType: 'srt_media_analysis_requested',
      actorId: data.actorId,
      functionName: 'requestSrtMediaAnalysis',
      sourceMediaId: data.sourceMediaId,
      timestamp: new Date().toISOString(),
      subsystem: data.subsystem
    });

    return { success: true };
  } catch (error) {
    throw new HttpsError('internal', 'Analysis request failed to route', error);
  }
}
