/**
 * LARI (Language and Reasoning Intelligence) — Type Contracts
 *
 * Canon: LARI is a bounded reasoning federation.
 * LARI does NOT have direct tool execution, database mutation, or governance authority.
 * All external actions are mediated by Scing orchestration.
 * BANE remains the external enforcement boundary.
 */

// ---------------------------------------------------------------------------
// Engine Identity
// ---------------------------------------------------------------------------

/** Typed engine identifier — each engine has a unique string ID. */
export type LariEngineId = string;

/** Capability domain of a LARI engine. */
export type LariCapability = 'language' | 'vision' | 'reasoning' | 'multimodal';

// ---------------------------------------------------------------------------
// Request / Response Contracts
// ---------------------------------------------------------------------------

/**
 * Input contract for LARI engine invocation.
 * All inputs are read-only payloads — no tool handles, no DB references.
 */
export interface LariRequest {
  /** Unique trace ID for this invocation (assigned by caller). */
  traceId: string;
  /** Primary text input to the engine. */
  text: string;
  /** Optional binary/media reference (URL or base64 stub — never raw bytes). */
  mediaRef?: string;
  /** Upstream context from Scing orchestration (session summary, constraints). */
  context?: Record<string, unknown>;
  /** Capability hint — caller suggests which engine domain to use. */
  capabilityHint?: LariCapability;
}

/**
 * Output contract for LARI engine invocation.
 * Engines return structured results — they do NOT trigger side effects.
 */
export interface LariResponse {
  /** Engine that produced this response. */
  engineId: LariEngineId;
  /** Primary textual result. */
  result: string;
  /** Structured data payload (engine-specific). */
  data?: Record<string, unknown>;
  /** Confidence score [0.0 – 1.0] if the engine provides one. */
  confidence?: number;
  /** Duration of engine computation in milliseconds. */
  durationMs: number;
  /** Trace ID echoed from request for audit correlation. */
  traceId: string;
  /** Optional engine-specific metadata for audit/debugging. */
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Engine Contract
// ---------------------------------------------------------------------------

/**
 * The handler signature for a LARI engine.
 * Engines receive a LariRequest and return a LariResponse.
 * Handlers MUST NOT access tools, databases, or external services directly.
 */
export type LariEngineHandler = (request: LariRequest) => Promise<LariResponse>;

/**
 * Registration contract for a LARI engine.
 * Each engine declares its identity, capability domain, and handler.
 */
export interface LariEngineContract {
  /** Unique engine identifier. */
  id: LariEngineId;
  /** Human-readable description of what this engine does. */
  description: string;
  /** Primary capability domain of this engine. */
  capability: LariCapability;
  /** The handler function that processes requests. */
  handler: LariEngineHandler;
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/**
 * Decision record for engine routing.
 * Captures which engine was selected, why, and the trace context.
 */
export interface LariRouteDecision {
  /** Engine selected for invocation. */
  engineId: LariEngineId;
  /** Capability matched. */
  capability: LariCapability;
  /** Brief rationale for selection. */
  rationale: string;
  /** Trace ID for this routing decision. */
  traceId: string;
}
