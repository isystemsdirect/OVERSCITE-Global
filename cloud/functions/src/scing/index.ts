/**
 * Scing Cloud Core — Router
 *
 * Exposes three callable Cloud Functions for Scing orchestration:
 *   - scingBoot:  create or restore a session
 *   - scingChat:  send a message through the orchestrator
 *   - scingTools: list available tools
 *
 * All endpoints enforce BANE authentication via enforceBaneCallable.
 */

import * as functions from 'firebase-functions';
import { enforceBaneCallable } from '../bane/enforce';
import { asString, getRecord } from '../shared/types/safe';
import * as sessionManager from './sessionManager';
import { globalOrchestrate } from './scingOrch';
import { scingToolRegistry } from './toolRegistry';
import { emitScingEvent } from './auditEmitter';

// ---------------------------------------------------------------------------
// scingBoot — create or restore a session
// ---------------------------------------------------------------------------

export const scingBoot = functions.https.onCall(async (data, context) => {
  const gate = await enforceBaneCallable({
    name: 'scing.boot',
    data,
    ctx: context,
  });

  const payload = getRecord(data, 'scing.boot');
  const existingSessionId = asString(payload.sessionId);

  // Restore existing session
  if (existingSessionId) {
    const session = await sessionManager.getSession(existingSessionId, gate.uid);

    await emitScingEvent({
      type: 'session.restored',
      sessionId: session.id,
      userId: gate.uid,
      metadata: { restoredAt: new Date().toISOString() },
    });

    return {
      sessionId: session.id,
      status: session.status,
      title: session.title,
      context: session.context,
      restored: true,
    };
  }

  // Create new session
  const title = asString(payload.title) || 'New Session';
  const sessionContext =
    typeof payload.context === 'object' && payload.context !== null
      ? (payload.context as Record<string, unknown>)
      : {};

  const sessionId = await sessionManager.createSession({
    userId: gate.uid,
    title,
    context: sessionContext,
  });

  await emitScingEvent({
    type: 'session.created',
    sessionId,
    userId: gate.uid,
    metadata: { title },
  });

  return {
    sessionId,
    status: 'active',
    title,
    context: sessionContext,
    restored: false,
  };
});

// ---------------------------------------------------------------------------
// scingChat — send a message through the orchestrator
// ---------------------------------------------------------------------------

export const scingChat = functions
  .runWith({ timeoutSeconds: 120, memory: '512MB' })
  .https.onCall(async (data, context) => {
    const gate = await enforceBaneCallable({
      name: 'scing.chat',
      data,
      ctx: context,
    });

    const payload = getRecord(data, 'scing.chat');
    const sessionId = asString(payload.sessionId);
    const message = asString(payload.message);

    if (!sessionId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'sessionId is required.',
      );
    }
    if (!message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'message is required.',
      );
    }

    const result = await globalOrchestrate({
      request: {
        sessionId,
        message,
        contextOverride:
          typeof payload.contextOverride === 'object' && payload.contextOverride !== null
            ? (payload.contextOverride as Record<string, unknown>)
            : undefined,
      },
      userId: gate.uid,
      capabilities: gate.capabilities,
    });

    return {
      message: result.message,
      toolInvocations: result.toolInvocations,
      auditTrail: result.auditTrail,
      reportBlocks: result.reportBlocks,
    };
  });

// ---------------------------------------------------------------------------
// scingTools — list available tools
// ---------------------------------------------------------------------------

export const scingTools = functions.https.onCall(async (data, context) => {
  await enforceBaneCallable({
    name: 'scing.tools',
    data,
    ctx: context,
  });

  return {
    tools: scingToolRegistry.list(),
  };
});

// ---------------------------------------------------------------------------
// Router export
// ---------------------------------------------------------------------------

export const scingRouter = {
  boot: scingBoot,
  chat: scingChat,
  tools: scingTools,
};
