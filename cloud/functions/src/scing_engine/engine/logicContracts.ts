/**
 * SCING_ENGINES — Canonical Logic Contracts
 *
 * These six contracts define the universal boundary surface for all engine
 * families across Scing, LARI, BANE, orchestration, and truth-artifact layers.
 *
 * Canon:
 * - Pure types only — no runtime logic, no side effects.
 * - Every engine invocation must be expressible through these contracts.
 * - No engine may bypass these contracts or introduce shadow contracts.
 *
 * Authority: UTCB Track C (BFI Imprint) — Director Anderson, 2026-03-23
 */

import type { EngineId } from './engineTypes';
import type { ExecutionClass } from './executionClass';
import type { RiskClass } from './engineTypes';

// ---------------------------------------------------------------------------
// EngineInput — Typed input envelope
// ---------------------------------------------------------------------------

/**
 * Universal input envelope for any engine invocation.
 * The source engine, trace correlation, and typed payload are mandatory.
 */
export interface EngineInput<TPayload = unknown> {
  /** Engine that produced or is sending this input. */
  sourceEngineId: EngineId | 'EXTERNAL';

  /** Target engine that should receive this input. */
  targetEngineId: EngineId;

  /** Unique trace ID for audit correlation across the full invocation chain. */
  traceId: string;

  /** ISO-8601 timestamp of input creation. */
  timestamp: string;

  /** Typed payload — schema determined by the target engine's contract. */
  payload: TPayload;

  /** Optional upstream trace IDs for multi-hop correlation. */
  upstreamTraceIds?: string[];
}

// ---------------------------------------------------------------------------
// EngineContext — Execution context
// ---------------------------------------------------------------------------

/**
 * Execution context provided to every engine invocation.
 * Carries actor identity, session, capability set, and policy constraints.
 */
export interface EngineContext {
  /** Actor identity (human user or system agent). */
  actorId: string;

  /** Session ID for continuity and replay protection. */
  sessionId: string;

  /** Capability set granted to the actor for this invocation. */
  capabilities: string[];

  /** Active policy constraints that restrict engine behavior. */
  policyConstraints: PolicyConstraint[];

  /** Execution class expected for this invocation (cross-checked at runtime). */
  expectedExecutionClass: ExecutionClass;

  /** Environment context (e.g., edge, server, hybrid). */
  environment?: 'edge' | 'server' | 'hybrid';
}

/**
 * Individual policy constraint applied to an engine invocation.
 */
export interface PolicyConstraint {
  /** Constraint identifier (e.g., 'bane.max-token-length'). */
  id: string;

  /** Human-readable description. */
  description: string;

  /** Constraint value — interpretation is engine-specific. */
  value: unknown;

  /** Source of the constraint (BANE policy, Director override, etc.). */
  source: 'bane' | 'director' | 'system' | 'session';
}

// ---------------------------------------------------------------------------
// EngineResult — Typed output container
// ---------------------------------------------------------------------------

/**
 * Universal result container for engine invocations.
 * Status, typed payload, duration, and trace are mandatory.
 */
export interface EngineResult<TPayload = unknown> {
  /** Engine that produced this result. */
  engineId: EngineId;

  /** Execution status. */
  status: 'ok' | 'error' | 'partial' | 'deferred';

  /** Typed output payload — schema determined by the engine's contract. */
  payload: TPayload;

  /** Execution duration in milliseconds. */
  durationMs: number;

  /** Trace ID echoed from the input for audit correlation. */
  traceId: string;

  /** ISO-8601 timestamp of result creation. */
  timestamp: string;

  /** Structured warnings that do not constitute failures. */
  warnings: string[];

  /** Error detail (populated when status is 'error'). */
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}

// ---------------------------------------------------------------------------
// EngineTrace — Per-engine audit trace record
// ---------------------------------------------------------------------------

/**
 * Audit-grade trace record for a single engine invocation.
 * Every engine invocation must produce exactly one EngineTrace.
 */
export interface EngineTrace {
  /** Engine that was invoked. */
  engineId: EngineId;

  /** Execution class the engine operated under. */
  executionClass: ExecutionClass;

  /** Pipeline stage or invocation phase. */
  stage: string;

  /** Execution duration in milliseconds. */
  durationMs: number;

  /** Trace ID for correlation. */
  traceId: string;

  /** ISO-8601 timestamp of invocation start. */
  startedAt: string;

  /** Summarized input (safe for audit logging — no PII, no secrets). */
  inputSummary: string;

  /** Summarized output (safe for audit logging). */
  outputSummary: string;

  /** Parent trace ID if this invocation was triggered by another engine. */
  parentTraceId?: string;

  /** Upstream engine that triggered this invocation. */
  triggeredBy?: EngineId;
}

// ---------------------------------------------------------------------------
// EngineFinding — Structured finding
// ---------------------------------------------------------------------------

/**
 * Structured finding produced by reasoning, sensing, or enforcement engines.
 * Findings are the primary output currency of the intelligence stack.
 */
export interface EngineFinding {
  /** Unique finding identifier. */
  id: string;

  /** Human-readable title. */
  title: string;

  /** Detailed description. */
  description: string;

  /** Severity classification. */
  severity: RiskClass;

  /** Confidence score (0.0–1.0). */
  confidence: number;

  /** Engine that produced this finding. */
  sourceEngineId: EngineId;

  /** Evidence references supporting this finding. */
  evidenceRefs: EvidenceRef[];

  /** ISO-8601 timestamp of finding creation. */
  timestamp: string;

  /** Trace ID for audit correlation. */
  traceId: string;

  /** Whether this finding requires human review before action. */
  requiresHumanReview: boolean;
}

/**
 * Reference to evidence supporting a finding.
 */
export interface EvidenceRef {
  /** Evidence type (image, measurement, document, sensor reading, etc.). */
  type: 'image' | 'measurement' | 'document' | 'sensor' | 'computed' | 'external';

  /** URI or identifier for the evidence artifact. */
  ref: string;

  /** Human-readable label. */
  label: string;
}

// ---------------------------------------------------------------------------
// EngineVerdict — Final disposition
// ---------------------------------------------------------------------------

/**
 * Final verdict from an enforcement or audit engine.
 * Represents the terminal decision on an action, request, or finding chain.
 */
export interface EngineVerdict {
  /** Disposition of the verdict. */
  disposition: 'permitted' | 'denied' | 'deferred' | 'escalated';

  /** Human-readable rationale for the verdict. */
  rationale: string;

  /** Authority chain that produced this verdict (ordered, root first). */
  authorityChain: VerdictAuthority[];

  /** Engine that issued the verdict. */
  issuedBy: EngineId;

  /** Trace ID for audit correlation. */
  traceId: string;

  /** ISO-8601 timestamp. */
  timestamp: string;

  /** Conditions under which the verdict may change on retry or escalation. */
  conditions?: string[];

  /** If deferred or escalated, where does authority transfer to? */
  escalationTarget?: string;
}

/**
 * Single authority entry in a verdict's authority chain.
 */
export interface VerdictAuthority {
  /** Authority source (e.g., 'BANE-POLICY', 'Director', 'system-default'). */
  source: string;

  /** Policy or rule that contributed to the verdict. */
  policyRef: string;

  /** Weight of this authority in the decision (0.0–1.0). */
  weight: number;
}
