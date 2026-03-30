/**
 * LARI (Language and Reasoning Intelligence) — Router
 *
 * Registers engines in the LARI engine registry and exposes three
 * callable Cloud Functions for LARI invocation.
 *
 * Canon constraints:
 * - LARI is a bounded reasoning federation — no direct tool/DB/governance authority.
 * - All callables enforce BANE authentication via enforceBaneCallable.
 * - Tool execution is mediated by Scing through runGuardedTool.
 * - BANE remains the external enforcement boundary.
 */

import * as functions from 'firebase-functions';
import { enforceBaneCallable } from '../bane/enforce';
import { runGuardedTool } from '../scing_engine/bane/server/toolBoundary';

// Engine imports
import { understandIntent } from './language';
import { detectDefects } from './vision';
import { generateReport } from './reasoning';

// Registry and contract imports
import { registerEngine, listEngines } from './engineRegistry';
import { languageEngine } from './language';
import { visionEngine } from './vision';
import { reasoningEngine } from './reasoning';

// ---------------------------------------------------------------------------
// Engine Registration (runs at module load — before any callable invocation)
// ---------------------------------------------------------------------------

registerEngine(languageEngine);
registerEngine(visionEngine);
registerEngine(reasoningEngine);

// ---------------------------------------------------------------------------
// Callable Functions (preserve existing BANE enforcement pattern)
// ---------------------------------------------------------------------------

// Language understanding
export const understandIntentFunc = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({ name: 'lari.understandIntent', data, ctx: context });

  const { text } = data;
  try {
    const intent = await runGuardedTool({
      toolName: 'lari_understandIntent',
      requiredCapability: 'tool:external_call',
      payloadText: JSON.stringify({ text: typeof text === 'string' ? text.slice(0, 200) : null }),
      identityId: gate.uid,
      capabilities: gate.capabilities,
      exec: async () => understandIntent(text),
    });
    return { intent };
  } catch (e: any) {
    if (e?.baneTraceId) throw new functions.https.HttpsError('permission-denied', e.message, { traceId: e.baneTraceId });
    throw e;
  }
});

// Vision: Detect defects
export const detectDefectsFunc = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({ name: 'lari.detectDefects', data, ctx: context });

  const { imageUrl } = data;
  try {
    const defects = await runGuardedTool({
      toolName: 'lari_detectDefects',
      requiredCapability: 'tool:external_call',
      payloadText: JSON.stringify({ imageUrl: typeof imageUrl === 'string' ? imageUrl.slice(0, 500) : null }),
      identityId: gate.uid,
      capabilities: gate.capabilities,
      exec: async () => detectDefects(imageUrl),
    });
    return { defects };
  } catch (e: any) {
    if (e?.baneTraceId) throw new functions.https.HttpsError('permission-denied', e.message, { traceId: e.baneTraceId });
    throw e;
  }
});

// Reasoning: Generate report
export const generateReportFunc = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({ name: 'lari.generateReport', data, ctx: context });

  const { inspectionId } = data;
  try {
    const report = await runGuardedTool({
      toolName: 'lari_generateReport',
      requiredCapability: 'tool:db_read',
      payloadText: JSON.stringify({ inspectionId: inspectionId ? String(inspectionId) : null }),
      identityId: gate.uid,
      capabilities: gate.capabilities,
      exec: async () => generateReport(inspectionId),
    });
    return { report };
  } catch (e: any) {
    if (e?.baneTraceId) throw new functions.https.HttpsError('permission-denied', e.message, { traceId: e.baneTraceId });
    throw e;
  }
});

// ---------------------------------------------------------------------------
// List LARI Engines (new capability)
// ---------------------------------------------------------------------------

export const listLariEnginesFunc = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({ name: 'lari.listEngines', data, ctx: context });
  return { engines: listEngines() };
});

// ---------------------------------------------------------------------------
// Router export
// ---------------------------------------------------------------------------

export const lariRouter = {
  understandIntent: understandIntentFunc,
  detectDefects: detectDefectsFunc,
  generateReport: generateReportFunc,
  listEngines: listLariEnginesFunc,
};
