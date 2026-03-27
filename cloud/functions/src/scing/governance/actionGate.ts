/**
 * Scing Cloud Core — Action Gate
 *
 * The first BANE-aligned governance perimeter around Scing's action paths.
 * Evaluates actions against classification-level policies and emits
 * governance receipts with full provenance chain.
 *
 * Design principles:
 *   - Separable from orchestration logic
 *   - Rule-based now, designed for BANE engine integration later
 *   - Fail-closed: unknown classifications → 'sensitive' → elevated scrutiny
 *   - Every gate evaluation emits a receipt (permit or deny)
 *   - Read actions pass through with minimal overhead
 *
 * Canon: BANE enforces boundaries and integrity. This gate is the first
 * seed of that enforcement. It does not become an independent ruler —
 * it applies policies defined by the governance type system.
 */

import {
  ActionClassification,
  ActionGateDecision,
  ActorContext,
  ClassificationPolicy,
  GovernancePolicy,
} from './governanceTypes';
import { classifyAction, buildDefaultPolicy } from './actionClassification';
import { emitGovernanceReceipt } from './governanceAudit';

// ---------------------------------------------------------------------------
// Trace ID generation
// ---------------------------------------------------------------------------

function generateTraceId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `gov_${ts}_${rand}`;
}

// ---------------------------------------------------------------------------
// Gate evaluation
// ---------------------------------------------------------------------------

/** Cached policy instance — rebuilt on cold start only */
let cachedPolicy: GovernancePolicy | null = null;

function getPolicy(): GovernancePolicy {
  if (!cachedPolicy) {
    cachedPolicy = buildDefaultPolicy();
  }
  return cachedPolicy;
}

/**
 * Evaluate an action through the governance gate.
 *
 * This is the primary entry point for governance enforcement.
 * Every non-trivial action should pass through this function
 * before execution.
 *
 * Returns an ActionGateDecision indicating whether the action
 * is permitted. A governance receipt is emitted regardless of outcome.
 */
export async function evaluateActionGate(params: {
  /** The action being requested (e.g., 'scing_updateContext', 'scing.chat') */
  action: string;
  /** Actor context for provenance capture */
  actor: ActorContext;
  /** Optional explicit classification override */
  classification?: ActionClassification;
  /** Optional metadata to include in the governance receipt */
  metadata?: Record<string, unknown>;
}): Promise<ActionGateDecision> {
  const policy = getPolicy();
  const traceId = generateTraceId();

  // 1. Classify the action
  const classification =
    params.classification ?? classifyAction(params.action, policy.defaultClassification);
  const classPolicy = policy.classificationPolicies[classification];

  // 2. Check capability requirements
  const capabilityCheck = checkCapabilities(params.actor.capabilities, classPolicy);

  // 3. Determine gate decision
  const permitted = capabilityCheck.ok;
  const reason = permitted
    ? `Action '${params.action}' permitted (${classification})`
    : capabilityCheck.reason;

  // 4. Emit pre-execution governance receipt (if policy requires it or if denied)
  let receiptId = '';
  if (policy.emitReceipts && (classPolicy.requiresPreReceipt || !permitted)) {
    receiptId = await emitGovernanceReceipt({
      action: params.action,
      classification,
      phase: 'pre',
      decision: permitted ? 'permit' : 'deny',
      reason,
      actor: params.actor,
      traceId,
      metadata: params.metadata,
    });
  }

  // 5. If gate enforcement is disabled (audit-only mode), always permit
  if (!policy.enforceGate && !permitted) {
    // Audit-only: log the would-be denial but permit anyway
    return {
      permitted: true,
      reason: `AUDIT-ONLY: Would deny — ${reason}`,
      classification,
      traceId,
      receiptId,
    };
  }

  return {
    permitted,
    reason,
    classification,
    traceId,
    receiptId,
    errorCode: permitted ? undefined : 'GOVERNANCE_DENIED',
  };
}

/**
 * Emit a post-execution governance receipt.
 * Called after successful action execution to complete the receipt pair.
 */
export async function emitPostGateReceipt(params: {
  action: string;
  classification: ActionClassification;
  actor: ActorContext;
  traceId: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}): Promise<string> {
  const policy = getPolicy();
  const classPolicy = policy.classificationPolicies[params.classification];

  if (!policy.emitReceipts || !classPolicy.requiresPostReceipt) {
    return '';
  }

  return emitGovernanceReceipt({
    action: params.action,
    classification: params.classification,
    phase: 'post',
    decision: params.success ? 'permit' : 'deny',
    reason: params.success
      ? `Action '${params.action}' completed successfully`
      : `Action '${params.action}' failed during execution`,
    actor: params.actor,
    traceId: params.traceId,
    metadata: params.metadata,
  });
}

// ---------------------------------------------------------------------------
// Capability evaluation
// ---------------------------------------------------------------------------

function checkCapabilities(
  actorCapabilities: string[],
  classPolicy: ClassificationPolicy,
): { ok: boolean; reason: string } {
  const missing = classPolicy.requiredCapabilities.filter(
    (cap) => !actorCapabilities.includes(cap),
  );

  if (missing.length > 0) {
    return {
      ok: false,
      reason: `Missing required capabilities: ${missing.join(', ')}`,
    };
  }

  return { ok: true, reason: 'All required capabilities present.' };
}

// ---------------------------------------------------------------------------
// Utility: build actor context from gate parameters
// ---------------------------------------------------------------------------

/**
 * Build an ActorContext from the typical Cloud Functions parameters.
 * Convenience helper for consistent provenance capture.
 */
export function buildActorContext(params: {
  userId: string;
  sessionId: string;
  capabilities: string[];
  ipHash?: string;
}): ActorContext {
  return {
    userId: params.userId,
    sessionId: params.sessionId,
    capabilities: params.capabilities,
    ipHash: params.ipHash,
    resolvedAt: new Date().toISOString(),
  };
}

/**
 * Reset cached policy — for testing or hot-reload scenarios only.
 * @internal
 */
export function _resetCachedPolicy(): void {
  cachedPolicy = null;
}
