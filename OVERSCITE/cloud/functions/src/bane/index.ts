import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { requestCapability } from './capability';
import { createSDR } from './sdr';
import { checkPolicy } from './policy';

/**
 * BANE (Backend Augmented Neural Engine)
 * Security governance and capability-based authorization
 */

// Request capability token
export const requestCapabilityFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'Must be authenticated to request capabilities'
    );
  }

  const { action, metadata } = request.data;
  const userId = request.auth.uid;

  try {
    const token = await requestCapability(userId, action, metadata);
    return { token };
  } catch (error: any) {
    throw new HttpsError('permission-denied', error.message);
  }
});

// Create Security Decision Record
export const createSDRFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const sdrId = await createSDR({
    userId: request.auth.uid,
    action: request.data.action,
    result: request.data.result,
    metadata: request.data.metadata,
  });

  return { sdrId };
});

// Check if action is allowed by policy
export const checkPolicyFunc = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const { action, resource } = request.data;
  const userId = request.auth.uid;

  const allowed = await checkPolicy(userId, action, resource);
  return { allowed };
});

export const baneRouter = {
  requestCapability: requestCapabilityFunc,
  createSDR: createSDRFunc,
  checkPolicy: checkPolicyFunc,
};