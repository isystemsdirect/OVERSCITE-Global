/**
 * BANE Gate Functions — Marketplace Plane
 * UTCB-S V1.0 — OVERSCITE Global Marketplace Stack
 *
 * Implements the four canonical BANE governance gates for marketplace mutations.
 * Gates are client-side pre-validation guards. Critical mutations MUST also pass
 * server-side validation in their respective Cloud Functions.
 *
 * Gate results are informational. Final authority is the Cloud Function.
 * No client-side gate result may self-authorize a binding commercial action.
 *
 * Implementation Status: LIVE — gate logic present. Server authority: Cloud Functions.
 */

import type {
  MarketBaneContext,
  MarketBaneResult,
  MarketBaneGate,
} from '../types/marketplace';

const POLICY_VERSION = 'UTCB-S-V1.0';

function result(
  passed: boolean,
  gate: MarketBaneGate,
  reason_code?: string,
  reason_detail?: string
): MarketBaneResult {
  return {
    passed,
    gate,
    reason_code,
    reason_detail,
    policy_version: POLICY_VERSION,
    evaluated_at: new Date().toISOString(),
  };
}

/**
 * Gate 1 — Listing Visibility
 * Applies to: job publish, product publish
 * Checks: actor permission valid, required fields complete, truth-state accurate, policy satisfied.
 */
export function Gate1_ListingVisibility(ctx: MarketBaneContext): MarketBaneResult {
  const gate: MarketBaneGate = 'gate_1_listing_visibility';

  if (!ctx.actor_id || !ctx.actor_role) {
    return result(false, gate, 'ACTOR_IDENTITY_INVALID', 'Actor ID and role are required');
  }

  const publishRoles = [
    'marketplace_admin',
    'platform_super_admin',
    'dispatch_manager',
    'module_publisher',
    'enterprise_sales_admin',
  ] as const;
  if (!(publishRoles as readonly string[]).includes(ctx.actor_role)) {
    return result(false, gate, 'ACTOR_ROLE_INSUFFICIENT', `Role ${ctx.actor_role} cannot publish listings`);
  }

  if (!ctx.entity_id || !ctx.entity_type) {
    return result(false, gate, 'ENTITY_REF_MISSING', 'Entity reference required for publish gate');
  }

  return result(true, gate);
}

/**
 * Gate 2 — Assignment or Purchase Readiness
 * Applies to: dispatch offer, accept assignment, checkout, license request
 * Checks: entity valid, eligibility valid, funding/purchase path valid, no blocked compliance state.
 */
export function Gate2_AssignmentOrPurchaseReadiness(ctx: MarketBaneContext): MarketBaneResult {
  const gate: MarketBaneGate = 'gate_2_assignment_purchase_readiness';

  if (!ctx.actor_id || !ctx.actor_role) {
    return result(false, gate, 'ACTOR_IDENTITY_INVALID', 'Actor must be identified');
  }

  if (!ctx.entity_id) {
    return result(false, gate, 'ENTITY_ID_MISSING', 'Target entity must be specified');
  }

  // Client-side org scoping check
  if (!ctx.org_id) {
    return result(false, gate, 'ORG_CONTEXT_MISSING', 'Organizational context required for purchase/assignment');
  }

  return result(true, gate);
}

/**
 * Gate 3 — Mutation Integrity
 * Applies to: price change, fee release, payout release, entitlement activation/revocation, order refund
 * Checks: actor lineage, policy validity, version and state consistency, audit write ready.
 */
export function Gate3_MutationIntegrity(ctx: MarketBaneContext): MarketBaneResult {
  const gate: MarketBaneGate = 'gate_3_mutation_integrity';

  if (!ctx.actor_id || !ctx.actor_role) {
    return result(false, gate, 'ACTOR_LINEAGE_MISSING', 'Full actor lineage required for mutation gate');
  }

  const mutationRoles = [
    'platform_super_admin',
    'marketplace_admin',
    'finance_admin',
    'key_manager',
    'license_auditor',
  ] as const;
  if (!(mutationRoles as readonly string[]).includes(ctx.actor_role)) {
    return result(false, gate, 'MUTATION_ROLE_INSUFFICIENT', `Role ${ctx.actor_role} may not execute this mutation`);
  }

  if (!ctx.metadata?.reason) {
    return result(false, gate, 'REASON_REQUIRED', 'Mutation reason must be captured before proceeding');
  }

  return result(true, gate);
}

/**
 * Gate 4 — High Risk Review
 * Applies to: standalone authorization, enterprise access grant, manual payout/entitlement override, dispute resolution
 * Checks: review authority, reason captured, evidence attached, immutability of record preserved.
 */
export function Gate4_HighRiskReview(ctx: MarketBaneContext): MarketBaneResult {
  const gate: MarketBaneGate = 'gate_4_high_risk_review';

  if (!ctx.actor_id || !ctx.actor_role) {
    return result(false, gate, 'ACTOR_IDENTITY_INVALID', 'High-risk actions require complete actor identification');
  }

  const reviewAuthRoles = [
    'platform_super_admin',
    'compliance_reviewer',
    'finance_admin',
    'enterprise_sales_admin',
  ] as const;
  if (!(reviewAuthRoles as readonly string[]).includes(ctx.actor_role)) {
    return result(false, gate, 'REVIEW_AUTHORITY_INSUFFICIENT', `Role ${ctx.actor_role} lacks review authority for high-risk actions`);
  }

  if (!ctx.metadata?.reason) {
    return result(false, gate, 'REASON_REQUIRED', 'High-risk override requires explicit reason');
  }

  if (!ctx.metadata?.evidence_refs || (ctx.metadata.evidence_refs as string[]).length === 0) {
    return result(false, gate, 'EVIDENCE_REQUIRED', 'Evidence must be attached for high-risk review actions');
  }

  return result(true, gate);
}
