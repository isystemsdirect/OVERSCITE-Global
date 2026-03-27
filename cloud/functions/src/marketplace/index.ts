/**
 * OVERSCITE Global Marketplace — Cloud Functions
 * UTCB-S V1.0 — Ultra-Grade Marketplace Stack
 *
 * Implementation Status: SCAFFOLD — all function stubs are typed with canonical
 * signatures, BANE gate calls, and audit event writes.
 * Payment provider integration, entitlement backend wiring, and payout disbursement
 * require production backend pipeline implementation.
 *
 * Each function:
 *  1. Validates actor context (non-anonymous)
 *  2. Runs the appropriate BANE gate check
 *  3. Validates entity state
 *  4. Executes the governed mutation
 *  5. Writes an immutable audit event to market_audit_events
 */

// Barrel export — individual functions import firebase-functions/admin as needed

// ---------------------------------------------------------------------------
// Re-export all marketplace Cloud Functions
// ---------------------------------------------------------------------------

export { publishJob } from './publishJob';
export { issueDispatchOffer } from './issueDispatchOffer';
export { acceptJobOffer } from './acceptJobOffer';
export { closeJobAndPreparePayout } from './closeJobAndPreparePayout';
export { publishMarketProduct } from './publishMarketProduct';
export { createMarketOrder } from './createMarketOrder';
export { activateEntitlement } from './activateEntitlement';
export { revokeEntitlement } from './revokeEntitlement';
export { requestStandaloneAuthorization } from './requestStandaloneAuthorization';
export { recordMarketAuditEvent } from './recordMarketAuditEvent';
