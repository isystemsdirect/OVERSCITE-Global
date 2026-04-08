import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export interface QueryStatusPayload {
  acceptedMediaId: string;
}

/**
 * querySrtPipelineStatus
 *
 * Exposes status visibility to clients without granting state mutation authority.
 */
export async function querySrtPipelineStatus(request: CallableRequest<QueryStatusPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();
  
  try {
    const doc = await db.collection('srt_accepted_media_queue').doc(data.acceptedMediaId).get();
    
    if (!doc.exists) {
      return { found: false, state: null };
    }

    const item = doc.data()!;
    return {
      found: true,
      state: item.state,
      lastUpdatedAt: item.lastUpdatedAt || item.acceptedAt,
      actorId: item.actorId
    };
  } catch (error) {
    throw new HttpsError('internal', 'Unable to query pipeline status', error);
  }
}
