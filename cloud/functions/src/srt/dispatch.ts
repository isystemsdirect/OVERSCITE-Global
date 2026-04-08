import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { ENGINE_DISPATCH_REGISTRY } from '../../../../src/lib/srt/engine-dispatch-registry';
import { EngineDispatchContract, SrtJobType } from '../../../../src/lib/srt/contracts/engine-dispatch-contract';
import { advanceSrtRecordState } from './state';
import { emitSrtAuditEvent } from './audit';

export interface DispatchAnalysisPayload {
  acceptedMediaId: string;
  sourceMediaId: string;
  sourceHash: string;
  derivativeUri?: string;
  jobType: SrtJobType;
  actorId: string;
  subsystem: 'overscite' | 'rebel' | 'contractor';
  projectId?: string;
  inspectionId?: string;
}

/**
 * dispatchSrtEngineAnalysis
 *
 * Emits explicitly governed routing jobs towards the LARI endpoints
 * strictly enforcing the pipeline transition.
 */
export async function dispatchSrtEngineAnalysis(request: CallableRequest<DispatchAnalysisPayload>) {
  const { data, auth } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'User must be authenticated.');

  const db = admin.firestore();

  // Find registry endpoint
  const endpoint = Object.values(ENGINE_DISPATCH_REGISTRY).find(e => e.jobType === data.jobType);
  if (!endpoint) {
    throw new HttpsError('invalid-argument', `Invalid dispatch requested: ${data.jobType} unsupported.`);
  }

  // Explicit CB-005 Pre-check: Reject unanalyzed accepted-only without explicit request
  const queueDoc = await db.collection('srt_accepted_media_queue').doc(data.acceptedMediaId).get();
  const queueState = queueDoc.data()?.state;
  if (queueState !== 'accepted_analysis_requested' && queueState !== 'analysis_pending') {
    throw new HttpsError('permission-denied', `Rejected: Engine dispatch requires explicit analysis request. Item is ${queueState}`);
  }

  // Contract builder
  const contract: EngineDispatchContract = {
    ...data,
    requestedByFunction: 'dispatchSrtEngineAnalysis',
    dispatchTimestamp: new Date().toISOString(),
    truthState: 'accepted_for_analysis'
  };

  const engineJobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'analysis_pending',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'dispatchSrtEngineAnalysis'
    });

    // Write outbound job schema
    await db.collection('srt_engine_jobs').doc(engineJobId).set({
      id: engineJobId,
      endpointId: endpoint.id,
      contract: contract,
      status: 'dispatched'
    });

    await advanceSrtRecordState({
      acceptedMediaId: data.acceptedMediaId,
      toState: 'analysis_in_progress',
      sourceMediaId: data.sourceMediaId,
      actorId: data.actorId,
      subsystem: data.subsystem,
      functionContext: 'dispatchSrtEngineAnalysis'
    });

    await emitSrtAuditEvent({
      auditEventId: `aud-${Date.now()}-${Math.floor(Math.random()*100)}`,
      eventType: 'srt_analysis_dispatched',
      actorId: data.actorId,
      functionName: 'dispatchSrtEngineAnalysis',
      sourceMediaId: data.sourceMediaId,
      engineJobId: engineJobId,
      timestamp: new Date().toISOString(),
      subsystem: data.subsystem
    });

    return { success: true, engineJobId };
  } catch (error) {
    throw new HttpsError('internal', 'Job dispatch failed', error);
  }
}
