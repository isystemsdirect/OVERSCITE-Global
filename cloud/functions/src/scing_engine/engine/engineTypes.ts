import type { ExecutionClass } from './executionClass';

export type { ExecutionClass };

export type EngineTier = 'core' | 'key' | 'platform' | 'roadmap';
export type EngineRuntime = 'edge' | 'server' | 'hybrid';

export type EngineFamily =
  | 'scing' // presentation/reporting (legacy SCING core)
  | 'scing-orch' // Scing orchestration layer
  | 'lari' // central intelligence
  | 'lari-orch' // LARI orchestration layer
  | 'lari-reasoning' // LARI core reasoning engines
  | 'lari-key' // dedicated device-domain keys
  | 'lari-platform' // platform sub-engines (GIS, weather, control)
  | 'bane' // security/enforcement (legacy BANE core)
  | 'bane-enforcement' // BANE policy enforcement engines
  | 'truth-audit' // truth-artifact, reporting, and audit engines
  | 'unknown';

export type RiskClass =
  | 'R0-info' // non-actionable info only
  | 'R1-low' // low consequence
  | 'R2-medium' // moderate consequence
  | 'R3-high' // safety/financial impact
  | 'R4-critical'; // could cause harm if incorrect

export type VisualChannel =
  | 'lari-thinking' // amber/gold/orange rhythms
  | 'lari-speaking' // full neon spectrum
  | 'bane-alert' // red-violet override
  | 'scing-present' // UI/reporting channel
  | 'neutral';

export type EngineStage = 'A' | 'B' | 'NA';

export type EngineCapability =
  | 'capture'
  | 'control'
  | 'analyze'
  | 'classify'
  | 'map'
  | 'report'
  | 'enforce'
  | 'ingest'
  | 'fuse'
  | 'audit'
  | 'coordinate' // orchestration routing
  | 'plan' // reasoning decomposition
  | 'critique' // reasoning validation
  | 'synthesize' // reasoning synthesis
  | 'interrogate' // pattern interrogation
  | 'ground' // context grounding and data recovery
  | 'evaluate'; // policy evaluation and compliance checks

export type EngineId =
  // Core triad
  | 'SCING'
  | 'LARI'
  | 'BANE'
  // Orchestration family
  | 'SCING-ORCH'
  | 'LARI-ORCH'
  // LARI core reasoning family
  | 'LARI-PLANNER'
  | 'LARI-CRITIC'
  | 'LARI-SYNTHESIZER'
  | 'LARI-CONTEXT-ENGINE'
  | 'LARI-ANALYST'
  | 'LARI-RETRIEVER'
  // LARI domain/sensor keys
  | 'LARI-VISION'
  | 'LARI-MAPPER'
  | 'LARI-DOSE'
  | 'LARI-PRISM'
  | 'LARI-ECHO'
  // LARI platform sub-engines
  | 'LARI-WEATHERBOT'
  | 'LARI-GIS'
  | 'LARI-CONTROL'
  // BANE enforcement
  | 'BANE-CORE'
  | 'BANE-POLICY'
  | 'BANE-AUDIT'
  | 'BANE-COMPLIANCE'
  // Truth / report / audit 
  | 'LARI-STANDARDS'
  | 'SCING-REPORT'
  | 'SCING-AUDIT'
  // Roadmap sensors
  | 'LARI-THERM'
  | 'LARI-NOSE'
  | 'LARI-SONIC'
  | 'LARI-GROUND'
  | 'LARI-AEGIS'
  | 'LARI-EDDY'
  // Contractor Division
  | 'LARI-CONTRACTOR'
  | 'LARI-ENGINEER';
