/**
 * LARI Engine Registry
 *
 * Provides engine registration, capability-based routing, and invocation.
 *
 * Canon constraints:
 * - LARI engines do NOT execute tools or mutate databases.
 * - All external side effects are mediated by Scing orchestration.
 * - BANE enforcement occurs outside this registry (at the callable layer).
 * - Every invocation produces audit-correlatable metadata via traceId.
 */

import type {
  LariEngineContract,
  LariEngineId,
  LariCapability,
  LariRequest,
  LariResponse,
  LariRouteDecision,
} from './lariTypes';

// ---------------------------------------------------------------------------
// Registry State
// ---------------------------------------------------------------------------

const engines: Map<LariEngineId, LariEngineContract> = new Map();

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Register a LARI engine. Replaces any existing engine with the same ID.
 */
export function registerEngine(contract: LariEngineContract): void {
  if (!contract.id || !contract.handler) {
    throw new Error(`LARI: Engine registration requires 'id' and 'handler'.`);
  }
  engines.set(contract.id, contract);
}

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

/**
 * List all registered engines (exposes contract metadata, not handlers).
 */
export function listEngines(): Array<{
  id: LariEngineId;
  description: string;
  capability: LariCapability;
}> {
  return Array.from(engines.values()).map((e) => ({
    id: e.id,
    description: e.description,
    capability: e.capability,
  }));
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/**
 * Select an engine for a given request based on capability hint.
 * Falls back to the first engine matching the hint, or the first registered engine.
 */
export function route(request: LariRequest): LariRouteDecision | null {
  if (engines.size === 0) return null;

  const hint = request.capabilityHint;

  // Prefer exact capability match
  if (hint) {
    for (const engine of engines.values()) {
      if (engine.capability === hint) {
        return {
          engineId: engine.id,
          capability: engine.capability,
          rationale: `Matched capability hint '${hint}'.`,
          traceId: request.traceId,
        };
      }
    }
  }

  // Fallback: first registered engine
  const fallback = engines.values().next().value;
  if (!fallback) return null;

  return {
    engineId: fallback.id,
    capability: fallback.capability,
    rationale: hint
      ? `No engine matched capability '${hint}'; fell back to '${fallback.id}'.`
      : `No capability hint provided; routed to '${fallback.id}'.`,
    traceId: request.traceId,
  };
}

// ---------------------------------------------------------------------------
// Invocation
// ---------------------------------------------------------------------------

/**
 * Invoke the routed engine for a given request.
 * Returns the engine response or throws if no engine is available.
 *
 * This function does NOT enforce BANE — BANE enforcement is handled at the
 * callable layer (enforceBaneCallable) before this function is reached.
 */
export async function invoke(request: LariRequest): Promise<LariResponse> {
  const decision = route(request);
  if (!decision) {
    throw new Error('LARI: No engines registered. Cannot process request.');
  }

  const engine = engines.get(decision.engineId);
  if (!engine) {
    throw new Error(`LARI: Engine '${decision.engineId}' not found after routing.`);
  }

  const t0 = Date.now();
  try {
    const response = await engine.handler(request);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown engine error';
    return {
      engineId: decision.engineId,
      result: '',
      durationMs: Date.now() - t0,
      traceId: request.traceId,
      metadata: { error: true, errorMessage: message },
    };
  }
}
