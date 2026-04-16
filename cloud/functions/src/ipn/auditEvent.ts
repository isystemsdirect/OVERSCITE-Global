import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

interface AuditEventData {
  sessionId: string;
  eventType: string;
  decision: string;
  reasoningSummary?: string;
  hash: string;
}

export const auditEvent = onCall<AuditEventData>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "ARC-bound identity required");
  }

  const { sessionId, eventType, decision, reasoningSummary, hash } = request.data;

  if (!sessionId || !eventType || !decision || !hash) {
    throw new HttpsError("invalid-argument", "Missing mandatory audit parameters");
  }

  logger.info(
    `IPN AUDIT WRITTEN: [${decision}] ${eventType} on session ${sessionId}. Hash: ${hash}`,
    {
      reasoningSummary: reasoningSummary ?? null,
      uid: request.auth.uid,
    }
  );

  return {
    success: true,
    persistedAt: new Date().toISOString(),
  };
});