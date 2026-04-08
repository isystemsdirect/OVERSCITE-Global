import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { advanceSrtRecordState } from './state';
import { emitSrtAuditEvent } from './audit';
import { SrtPipelineFailure, PipelineFailureClass } from '../../../../src/lib/srt/contracts/srt-pipeline-failure';

export interface RetryPayload {
  acceptedMediaId: string;
  sourceMediaId?: string;
  actorId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
}

export interface QuarantinePayload {
  acceptedMediaId: string;
  sourceMediaId?: string;
  failureClass: PipelineFailureClass;
  errorCode: string;
  errorMessage: string;
  actorId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
}

/**
 * retrySrtPipelineStep
 */
export async function retrySrtPipelineStep(request: CallableRequest<RetryPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  // Recovery pushes the state to retry_scheduled. From there the queue loop will
  // bump it into the pending state associated with the missing action.
  await advanceSrtRecordState({
    acceptedMediaId: data.acceptedMediaId,
    toState: 'retry_scheduled',
    sourceMediaId: data.sourceMediaId,
    actorId: data.actorId,
    subsystem: data.subsystem,
    functionContext: 'retrySrtPipelineStep'
  });

  return { success: true };
}

/**
 * quarantineSrtPipelineFailure
 */
export async function quarantineSrtPipelineFailure(request: CallableRequest<QuarantinePayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();

  const failureLog: SrtPipelineFailure = {
    queueId: data.acceptedMediaId,
    sourceMediaId: data.sourceMediaId,
    failureClass: data.failureClass,
    errorCode: data.errorCode,
    errorMessage: data.errorMessage,
    timestamp: new Date().toISOString(),
    failedState: 'quarantined_failure' // Will be assigned
  };

  const toState = data.failureClass === 'terminal' ? 'terminal_failure' : 'quarantined_failure';

  await db.collection('srt_pipeline_failures').add(failureLog);

  await advanceSrtRecordState({
    acceptedMediaId: data.acceptedMediaId,
    toState: toState,
    sourceMediaId: data.sourceMediaId,
    actorId: data.actorId,
    subsystem: data.subsystem,
    functionContext: `quarantineSrtPipelineFailure(${data.failureClass})`
  });

  await emitSrtAuditEvent({
    auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
    eventType: `srt_${toState}`,
    actorId: data.actorId,
    functionName: 'quarantineSrtPipelineFailure',
    sourceMediaId: data.sourceMediaId,
    acceptedMediaId: data.acceptedMediaId,
    timestamp: new Date().toISOString(),
    subsystem: data.subsystem,
    integrityNotes: [`Pipeline failure: ${data.errorCode} - ${data.errorMessage}`]
  });

  return { success: true };
}
