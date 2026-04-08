import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { emitSrtAuditEvent } from './audit';

export interface AcceptBatchPayload {
  captureSessionId: string;
  acceptedCandidateIds: string[];
  actorId: string;
  projectId?: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
}

/**
 * acceptSrtMediaBatch
 *
 * Accepts selected candidate images from a capture session into the
 * immutable execution spine. Emits a queue job for each item.
 */
export async function acceptSrtMediaBatch(request: CallableRequest<AcceptBatchPayload>) {
  const { data, auth } = request;
  if (!auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const db = admin.firestore();
  const timestamp = new Date().toISOString();

  // Create accepted intake records and queue tasks per candidate
  const acceptedItems = [];
  try {
    for (const candidateId of data.acceptedCandidateIds) {
      const acceptedMediaId = `acc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const intakeRecord = {
        acceptedMediaId,
        captureSessionId: data.captureSessionId,
        candidateId,
        actorId: data.actorId,
        projectId: data.projectId || null,
        subsystem: data.subsystem,
        acceptedAt: timestamp,
        state: 'accepted_pending_queue',
      };

      await db.collection('srt_accepted_media_queue').doc(acceptedMediaId).set(intakeRecord);
      
      await emitSrtAuditEvent({
        auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        eventType: 'srt_media_accepted',
        actorId: data.actorId,
        functionName: 'acceptSrtMediaBatch',
        nextState: 'accepted_pending_queue',
        acceptedMediaId,
        timestamp,
        subsystem: data.subsystem
      });

      acceptedItems.push(intakeRecord);
    }
    return { success: true, acceptedItems };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to enqueue accepted batch', error);
  }
}

/**
 * acceptSrtMediaSingle
 */
export async function acceptSrtMediaSingle(request: CallableRequest<any>) {
  // Directly passes through to Batch logic using an array of 1
  const payload: AcceptBatchPayload = {
    ...request.data,
    acceptedCandidateIds: [request.data.candidateId]
  };
  return acceptSrtMediaBatch({ ...request, data: payload });
}
