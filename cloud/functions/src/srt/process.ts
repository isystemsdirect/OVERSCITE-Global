import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { emitSrtAuditEvent } from './audit';
import { advanceSrtRecordState } from './state';
import { createHash } from 'crypto';

export interface ProcessMediaPayload {
  acceptedMediaId: string;
  sourceType: string;
  telemetry: any;
  subsystem: 'overscite' | 'rebel' | 'contractor';
  actorId: string;
}

/**
 * processAcceptedSrtMedia
 *
 * Hydrates accepted image payload, computes hash, locks source, and advances
 * the state to stored_source.
 */
export async function processAcceptedSrtMedia(request: CallableRequest<ProcessMediaPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();
  
  // 1. Compute Hash deterministically
  const metadata = { sourceType: data.sourceType, ...data.telemetry };
  const serialized = JSON.stringify(metadata, Object.keys(metadata).sort());
  const sourceHash = createHash('sha256').update(serialized).digest('hex');

  const sourceMediaId = `src-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString();

  const sourceRecord = {
    id: sourceMediaId,
    sourceType: data.sourceType,
    acceptedMediaId: data.acceptedMediaId, // Provenance linkage back to the accepted UI block
    immutableUri: `srt://evidence/${sourceMediaId}`, // Mocked path to a real Cloud Storage write
    capturedAt: timestamp,
    uploadedAt: timestamp,
    uploadedBy: data.actorId,
    metadataHash: sourceHash,
    metadata: metadata, // written once, frozen
    truthState: 'locked_source',
  };

  try {
    // Write Source Collection
    await db.collection('srt_source_media_records').doc(sourceMediaId).set(sourceRecord);

    // Call advance state helper for the Accepted Queue
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'stored_source',
      sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'processAcceptedSrtMedia'
    });

    return { success: true, sourceMediaId, sourceHash };
  } catch (error) {
    throw new HttpsError('internal', 'Source processing failed', error);
  }
}
