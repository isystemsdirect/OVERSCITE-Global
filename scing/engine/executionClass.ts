/**
 * SCING_ENGINES — Execution Class Taxonomy
 *
 * Every engine and sub-engine in the SCING_ENGINES registry must be assigned
 * exactly one execution class. Execution classes are non-overlapping by design —
 * an engine that performs coordination MUST NOT also perform reasoning.
 *
 * Canon:
 * - Six classes, no extensions without Director authority.
 * - Classes define behavioral boundaries, not capability levels.
 * - An engine violating its assigned class constitutes an architectural breach.
 *
 * Authority: UTCB Track C (BFI Imprint) — Director Anderson, 2026-03-23
 */

// ---------------------------------------------------------------------------
// Execution Class Union
// ---------------------------------------------------------------------------

/**
 * The six canonical execution classes.
 *
 * - `coordination`  — Orchestration and routing. Does not reason, enforce, or capture.
 * - `reasoning`     — Analysis, classification, synthesis. Does not execute actions.
 * - `sensing`       — IO ingestion and signal translation. Does not analyze or enforce.
 * - `enforcement`   — Policy and boundary enforcement. Does not reason or report.
 * - `reporting`     — Presentation and report generation. Does not enforce or reason.
 * - `audit`         — Audit trail and truth-artifact management. Does not enforce or reason.
 */
export type ExecutionClass =
  | 'coordination'
  | 'reasoning'
  | 'sensing'
  | 'enforcement'
  | 'reporting'
  | 'audit';

// ---------------------------------------------------------------------------
// Descriptors
// ---------------------------------------------------------------------------

export interface ExecutionClassDescriptor {
  /** Execution class identifier. */
  id: ExecutionClass;

  /** Human-readable name. */
  displayName: string;

  /** What this class is permitted to do. */
  permits: string[];

  /** What this class is explicitly prohibited from doing. */
  prohibits: string[];
}

/**
 * Canonical descriptors for all six execution classes.
 * These define the behavioral contract — not just a label but the boundaries.
 */
export const EXECUTION_CLASS_DESCRIPTORS: Record<ExecutionClass, ExecutionClassDescriptor> = {
  coordination: {
    id: 'coordination',
    displayName: 'Coordination',
    permits: [
      'Route requests between engines',
      'Maintain pipeline ordering',
      'Emit orchestration trace events',
    ],
    prohibits: [
      'Perform reasoning or analysis',
      'Enforce policy or deny requests',
      'Capture or ingest sensor data',
      'Generate findings or verdicts',
    ],
  },

  reasoning: {
    id: 'reasoning',
    displayName: 'Reasoning',
    permits: [
      'Analyze data and produce findings',
      'Classify inputs against domain models',
      'Synthesize conclusions from multiple inputs',
      'Emit reasoning trace events',
    ],
    prohibits: [
      'Execute tools or mutate databases',
      'Enforce policy or deny requests',
      'Capture or ingest raw sensor data',
      'Issue verdicts with enforcement authority',
    ],
  },

  sensing: {
    id: 'sensing',
    displayName: 'Sensing / Translation',
    permits: [
      'Ingest raw signals from sensors, cameras, devices',
      'Translate signals into structured data',
      'Emit sensor trace events',
    ],
    prohibits: [
      'Perform reasoning or analysis on ingested data',
      'Enforce policy or deny requests',
      'Generate findings or verdicts',
      'Route requests to other engines',
    ],
  },

  enforcement: {
    id: 'enforcement',
    displayName: 'Enforcement',
    permits: [
      'Evaluate policy constraints',
      'Issue allow/deny/defer verdicts',
      'Throttle or contain hostile actors',
      'Emit enforcement trace events',
    ],
    prohibits: [
      'Perform domain reasoning or analysis',
      'Generate reports or presentations',
      'Capture or ingest sensor data',
      'Replace or override Director authority',
    ],
  },

  reporting: {
    id: 'reporting',
    displayName: 'Reporting',
    permits: [
      'Aggregate findings into structured reports',
      'Generate human-readable presentations',
      'Format data for investor/regulator-grade output',
      'Emit reporting trace events',
    ],
    prohibits: [
      'Perform reasoning or analysis',
      'Enforce policy or deny requests',
      'Modify source findings or evidence',
      'Issue verdicts',
    ],
  },

  audit: {
    id: 'audit',
    displayName: 'Audit',
    permits: [
      'Record and index trace events',
      'Validate truth-artifact integrity',
      'Produce audit summaries and chain-of-custody records',
      'Emit audit trace events',
    ],
    prohibits: [
      'Perform reasoning or analysis',
      'Enforce policy or deny requests',
      'Modify source data or findings',
      'Issue enforcement verdicts',
    ],
  },
};

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if two execution classes are compatible for co-assignment.
 * By design, no two classes are compatible — every engine gets exactly one.
 */
export function areClassesCompatible(a: ExecutionClass, b: ExecutionClass): boolean {
  return a === b;
}

/**
 * Returns the descriptor for a given execution class.
 */
export function getClassDescriptor(cls: ExecutionClass): ExecutionClassDescriptor {
  return EXECUTION_CLASS_DESCRIPTORS[cls];
}
