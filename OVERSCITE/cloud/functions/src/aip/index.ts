import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * AIP (Augmented Intelligence Portal)
 * Real-time communication protocol handlers
 */

// AIP message handler
export const handleMessage = onCall(async (request) => {
  // Authentication check
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { type, payload } = request.data;
  const uid = request.auth.uid;

  switch (type) {
    case 'task.request':
      return await handleTaskRequest(payload, uid);
    
    case 'context.update':
      return await handleContextUpdate(payload, uid);
    
    default:
      throw new HttpsError('invalid-argument', `Unknown message type: ${type}`);
  }
});

async function handleTaskRequest(payload: any, userId: string) {
  const { action, params: _params } = payload;

  console.log(`Task request from ${userId}: ${action}`);

  // Route to appropriate handler
  // TODO: Implement actual routing logic

  return {
    status: 'success',
    result: {
      message: `Task '${action}' processed`,
    },
  };
}

async function handleContextUpdate(payload: any, userId: string) {
  const { updates } = payload;

  console.log(`Context update from ${userId}:`, updates);

  // Update session context in Firestore
  // TODO: Implement context storage

  return {
    status: 'success',
  };
}

export const aipRouter = {
  handleMessage,
};