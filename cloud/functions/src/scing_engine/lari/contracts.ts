/**
 * LARI Contracts — Barrel Export
 *
 * Canonical barrel for all LARI contract types, schemas, and validation.
 * Consumers import from this file to access LARI type contracts without
 * reaching into internal subdirectory structure.
 *
 * Canon: LARI = bounded reasoning federation.
 * These contracts define the boundary surface — no tool execution,
 * no database mutation, no governance authority.
 */

// ---------------------------------------------------------------------------
// I/O Schemas
// ---------------------------------------------------------------------------

export type {
  InputEvidenceRef,
  ToleranceBlock,
  UnitValue,
  LariInputArtifact,
  LariInputMeasurement,
  LariFieldInput,
  LariEngineInput,
} from './contracts/lariInput.schema';

export type {
  EvidenceRef,
  ConfidenceBlock,
  LariFinding,
  LariEngineOutput,
} from './contracts/lariOutput.schema';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export { validateLariInput } from './contracts/validateLariInput';
export { validateLariOutput } from './contracts/validateLariOutput';

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

export type { QuantityKind, UnitId } from './contracts/units';
export { isKnownUnit, unitKind, areUnitsCompatible, convertValue } from './contracts/units';

// ---------------------------------------------------------------------------
// Critic Types
// ---------------------------------------------------------------------------

export type { CriticDecision, CriticResult } from './critic/criticTypes';

// ---------------------------------------------------------------------------
// Pipeline Types (for engines/ layer)
// ---------------------------------------------------------------------------

/**
 * Request from Scing orchestrator into the LARI pipeline.
 * This is the top-level entry contract for the reasoning federation.
 */
export interface LariPipelineRequest {
  /** Unique trace ID for audit correlation. */
  traceId: string;
  /** User's message text. */
  text: string;
  /** Session ID for context continuity. */
  sessionId: string;
  /** User ID for identity-aware reasoning. */
  userId: string;
  /** Conversation history for context (last N messages). */
  history?: Array<{ role: string; content: string }>;
  /** Additional structured context from Scing. */
  metadata?: Record<string, unknown>;
}

/**
 * Response from the LARI pipeline back to Scing orchestrator.
 * Scing uses this to augment its final response synthesis.
 */
export interface LariPipelineResponse {
  /** Trace ID echoed from request. */
  traceId: string;
  /** Primary reasoning output text. */
  reasoning: string;
  /** Structured findings from the pipeline. */
  findings: LariPipelineFinding[];
  /** Overall pipeline confidence. */
  confidence: number;
  /** Pipeline execution duration in milliseconds. */
  durationMs: number;
  /** Warnings and notes from pipeline stages. */
  warnings: string[];
  /** Per-stage trace for audit. */
  stageTrace: LariStageTrace[];
  /** Raw SRT captures retrieved (Simulation/Testing). */
  rawCaptures?: any[];
}

/**
 * Individual finding produced by the pipeline.
 */
export interface LariPipelineFinding {
  id: string;
  title: string;
  description: string;
  confidence: number;
  source: 'planner' | 'critic' | 'synthesizer' | 'context' | 'analyst' | 'retriever' | 'contractor' | 'engineer';
}

/**
 * Trace record for a single pipeline stage.
 */
export interface LariStageTrace {
  stage: string;
  engineId: string;
  durationMs: number;
  inputSummary: string;
  outputSummary: string;
}
