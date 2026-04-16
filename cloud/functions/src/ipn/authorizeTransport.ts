import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

interface AuthorizeTransportData {
  sessionId: string;
  requestedAction: string;
  target?: string;
}

export const authorizeTransport = onCall<AuthorizeTransportData>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "ARC-bound identity required");
  }

  const { sessionId, requestedAction, target } = request.data;

  if (!sessionId || !requestedAction) {
    throw new HttpsError("invalid-argument", "Missing transport authorization inputs");
  }

  logger.info(
    `BANE IPN evaluating transport ${requestedAction} for session ${sessionId} to target ${target ?? "N/A"}`
  );

  const isAllowed = requestedAction === "READ_TELEMETRY";
  const decision = isAllowed ? "ALLOW" : "DENY";
  const reason = isAllowed
    ? "Telemetry permitted within granted scope"
    : "BANE Zero-Trust Default Deny";

  return {
    success: true,
    decision,
    reason,
    decisionId: `bane-tr-dec-${Date.now()}`,
  };
});