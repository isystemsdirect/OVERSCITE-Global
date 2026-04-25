import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { understandIntent } from './language';
import { detectDefects } from './vision';
import { generateReport } from './reasoning';

/**
 * LARI (Language and Reasoning Intelligence)
 * AI engines for perception, analysis, and decision support
 */

// Language understanding
export const understandIntentFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { text } = request.data;
  const intent = await understandIntent(text);
  return { intent };
});

// Vision: Detect defects
export const detectDefectsFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { imageUrl } = request.data;
  const defects = await detectDefects(imageUrl);
  return { defects };
});

// Reasoning: Generate report
export const generateReportFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { inspectionId } = request.data;
  const report = await generateReport(inspectionId);
  return { report };
});

export const lariRouter = {
  understandIntent: understandIntentFunc,
  detectDefects: detectDefectsFunc,
  generateReport: generateReportFunc,
};