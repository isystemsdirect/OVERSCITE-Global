import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { advanceSrtRecordState } from './state';
import { emitSrtAuditEvent } from './audit';

export interface GenerateDerivativesPayload {
  acceptedMediaId: string;
  sourceMediaId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
  actorId: string;
}

/**
 * generateSrtDerivatives
 *
 * Generates secondary working assets without corrupting source.
 */
export async function generateSrtDerivatives(request: CallableRequest<GenerateDerivativesPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();

  // 1. Advance to generating
  await advanceSrtRecordState({
    acceptedMediaId: data.acceptedMediaId,
    toState: 'derivative_generation_pending',
    sourceMediaId: data.sourceMediaId,
    actorId: data.actorId,
    subsystem: data.subsystem,
    functionContext: 'generateSrtDerivatives'
  });

  // Mocking the binary image processor behavior. Real implementation uses GCP ImageMagick or Sharp.
  const derivativeId = `der-${Date.now()}`;
  const derivativeMetadata = {
    id: derivativeId,
    sourceMediaId: data.sourceMediaId,
    previewUri: `srt://derivative/preview/${data.sourceMediaId}`,
    generatedAt: new Date().toISOString()
  };

  try {
    await db.collection('srt_derivative_records').doc(derivativeId).set(derivativeMetadata);

    // 2. Advance to complete
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'derivative_generation_complete',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'generateSrtDerivatives'
    });

    // 3. Fall into explicit CB-005 resting state (halts auto-analysis)
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'accepted_unanalyzed',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'generateSrtDerivatives'
    });

    await emitSrtAuditEvent({
      auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
      eventType: 'srt_derivative_generated',
      actorId: data.actorId,
      functionName: 'generateSrtDerivatives',
      sourceMediaId: data.sourceMediaId,
      timestamp: new Date().toISOString(),
      subsystem: data.subsystem
    });

    return { success: true, derivativeId };
  } catch (error) {
    throw new HttpsError('internal', 'Failed to generate derivative working assets', error);
  }
}
