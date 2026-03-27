import * as functions from 'firebase-functions';
import { asString, getRecord } from '../shared/types/safe';
import { enforceBaneCallable } from '../bane/enforce';
import { globalOrchestrate } from '../scing/scingOrch';
import { updateSessionContext } from '../scing/sessionManager';

/**
 * AIP (Augmented Intelligence Portal)
 * Real-time communication protocol handlers.
 *
 * Wired to Scing Cloud Core orchestration for live request routing
 * and session context management.
 */

// AIP message handler
export const handleMessage = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({ name: 'aip.handleMessage', data, ctx: context });
  const uid = gate.uid;

  const { type, payload } = data;

  switch (type) {
  case 'task.request':
    return await handleTaskRequest(payload, uid, gate.capabilities);
    
  case 'context.update':
    return await handleContextUpdate(payload, uid);
    
  default:
    throw new functions.https.HttpsError('invalid-argument', `Unknown message type: ${type}`);
  }
});

async function handleTaskRequest(payload: unknown, userId: string, capabilities: string[]) {
  const p = getRecord(payload, 'aip.taskRequest');
  const sessionId = asString(p.sessionId);
  const message = asString(p.action) || asString(p.message);

  if (!sessionId || !message) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'sessionId and action/message are required.',
    );
  }

  // Route through Scing global orchestrator for live AI processing
  const result = await globalOrchestrate({
    request: { sessionId, message },
    userId,
    capabilities,
  });

  return {
    status: 'success',
    result: {
      message: result.message,
      toolInvocations: result.toolInvocations,
      auditTrail: result.auditTrail,
      reportBlocks: result.reportBlocks,
    },
  };
}

async function handleContextUpdate(payload: unknown, userId: string) {
  const p = getRecord(payload, 'aip.contextUpdate');
  const sessionId = asString(p.sessionId);
  const updates =
    typeof p.updates === 'object' && p.updates !== null
      ? (p.updates as Record<string, unknown>)
      : {};

  if (!sessionId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'sessionId is required for context updates.',
    );
  }

  // Persist context updates to Scing session
  await updateSessionContext(sessionId, updates);

  return {
    status: 'success',
  };
}

export const aipRouter = {
  handleMessage,
};