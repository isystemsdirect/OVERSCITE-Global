/**
 * SRT Edge Spine Router
 *
 * Grouping export for all functions governing the SRT Accepted Media Pipeline.
 */

import * as functions from 'firebase-functions';

export const srtRouter = {
  // 1. Acceptance
  acceptSrtMediaBatch: functions.https.onCall(async (data, context) => {
    return require('./accept').acceptSrtMediaBatch({ data, auth: context.auth });
  }),
  acceptSrtMediaSingle: functions.https.onCall(async (data, context) => {
    return require('./accept').acceptSrtMediaSingle({ data, auth: context.auth });
  }),

  // 2. Processing & Storage
  processAcceptedSrtMedia: functions.https.onCall(async (data, context) => {
    return require('./process').processAcceptedSrtMedia({ data, auth: context.auth });
  }),

  // 3. Derivatives
  generateSrtDerivatives: functions.https.onCall(async (data, context) => {
    return require('./derivative').generateSrtDerivatives({ data, auth: context.auth });
  }),

  // 3.5 Validation / Compute Gate (CB-005)
  requestSrtMediaAnalysis: functions.https.onCall(async (data, context) => {
    return require('./analysis-request').requestSrtMediaAnalysis({ data, auth: context.auth });
  }),

  // 4. Analysis Dispatch
  dispatchSrtEngineAnalysis: functions.https.onCall(async (data, context) => {
    return require('./dispatch').dispatchSrtEngineAnalysis({ data, auth: context.auth });
  }),

  // 5. Findings
  persistSrtEngineFindings: functions.https.onCall(async (data, context) => {
    return require('./findings').persistSrtEngineFindings({ data, auth: context.auth });
  }),

  // 6. Verification
  bindBaneVerification: functions.https.onCall(async (data, context) => {
    return require('./verification').bindBaneVerification({ data, auth: context.auth });
  }),

  // 7. Export
  assembleSrtEvidenceExport: functions.https.onCall(async (data, context) => {
    return require('./export').assembleSrtEvidenceExport({ data, auth: context.auth });
  }),

  // 8. Error Handling & Recovery
  retrySrtPipelineStep: functions.https.onCall(async (data, context) => {
    return require('./recovery').retrySrtPipelineStep({ data, auth: context.auth });
  }),
  quarantineSrtPipelineFailure: functions.https.onCall(async (data, context) => {
    return require('./recovery').quarantineSrtPipelineFailure({ data, auth: context.auth });
  }),

  // 9. Status
  querySrtPipelineStatus: functions.https.onCall(async (data, context) => {
    return require('./query').querySrtPipelineStatus({ data, auth: context.auth });
  })
};
