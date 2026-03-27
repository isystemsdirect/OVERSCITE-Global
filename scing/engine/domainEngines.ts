/**
 * SCINGULAR Canonical Logic Contracts — LARI Domain Traits
 *
 * Defines the structural constraints for all LARI Domain (Sensor/Specialist) Engines.
 * Domain engines are the sensory and pattern-matching endpoints of the federation.
 *
 * Canon constraints:
 * - Domain engines have ZERO execution authority.
 * - Domain engines evaluate, ingest, or interrogate localized data.
 * - They ONLY return `EngineFinding` arrays. They do not formulate plans or edit state.
 * - They are orchestrated by LARI_ORCH or invoked by LARI_PLANNER/LARI_SYNTHESIZER.
 *
 * Authority: UTCB Track F — Director Anderson, 2026-03-23
 */

import { EngineId } from './engineTypes';
import { EngineFinding } from './logicContracts';

export interface DomainEngineRequest<TInputPayload = unknown> {
  traceId: string;
  sessionContext?: Record<string, unknown>;
  inputPayload: TInputPayload;
}

export interface DomainEngineResponse {
  engineId: EngineId;
  findings: EngineFinding[];
  durationMs: number;
}

/**
 * Signature for any LARI Domain Engine.
 * Must adhere strictly to the DomainEngineRequest -> DomainEngineResponse pipeline
 * to guarantee no side-effects or out-of-band execution.
 */
export type LariDomainEngine<TInput> = (req: DomainEngineRequest<TInput>) => Promise<DomainEngineResponse>;

// ---------------------------------------------------------------------------
// Base Template for Domain Engine Instantiation
// ---------------------------------------------------------------------------

/**
 * Helper to wrap a domain-specific logic block securely, guaranteeing
 * it only produces bindings. Prevents execution bleed.
 */
export function createDomainEngine<TInput>(
  engineId: EngineId,
  engineLogic: (input: TInput, traceId: string) => Promise<EngineFinding[]>
): LariDomainEngine<TInput> {
  return async (req: DomainEngineRequest<TInput>): Promise<DomainEngineResponse> => {
    const start = Date.now();
    try {
      // Execute the domain-specific bounded logic
      const findings = await engineLogic(req.inputPayload, req.traceId);
      
      // Enforce zero-execution contract formatting
      return {
        engineId,
        findings,
        durationMs: Date.now() - start,
      };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      // Produce an anomaly finding if the engine crashes, keeping the response structure intact
      return {
        engineId,
        findings: [
          {
            id: `err_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            title: `${engineId} Internal Failure`,
            description: `Domain engine failed to synthesize inputs: ${errorMsg}`,
            severity: 'R3-high', // Failures in sensing are high severity
            confidence: 1.0,
            sourceEngineId: engineId,
            evidenceRefs: [],
            timestamp: new Date().toISOString(),
            traceId: req.traceId,
            requiresHumanReview: true,
          }
        ],
        durationMs: Date.now() - start,
      };
    }
  };
}
