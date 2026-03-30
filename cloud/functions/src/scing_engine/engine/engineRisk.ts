import { EngineId, RiskClass } from './engineTypes';

export type EngineRiskProfile = {
  id: EngineId;
  risk: RiskClass;
  requiresCriticGate: boolean; // “nothing ships to UI/memory/external without validation”
  requiresBaneGate: boolean; // policy/security review required
  affectsPhysicalControl: boolean; // can cause device action (drone/actuator)
};

export const RISK: Record<EngineId, EngineRiskProfile> = {
  SCING: {
    id: 'SCING',
    risk: 'R1-low',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  LARI: {
    id: 'LARI',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  BANE: {
    id: 'BANE',
    risk: 'R4-critical',
    requiresCriticGate: false,
    requiresBaneGate: false,
    affectsPhysicalControl: true,
  },

  'LARI-VISION': {
    id: 'LARI-VISION',
    risk: 'R2-medium',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-MAPPER': {
    id: 'LARI-MAPPER',
    risk: 'R2-medium',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-DOSE': {
    id: 'LARI-DOSE',
    risk: 'R4-critical',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: true,
  },
  'LARI-PRISM': {
    id: 'LARI-PRISM',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-ECHO': {
    id: 'LARI-ECHO',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },

  'LARI-WEATHERBOT': {
    id: 'LARI-WEATHERBOT',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: true,
  },
  'LARI-GIS': {
    id: 'LARI-GIS',
    risk: 'R2-medium',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-CONTROL': {
    id: 'LARI-CONTROL',
    risk: 'R4-critical',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: true,
  },

  'LARI-THERM': {
    id: 'LARI-THERM',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-NOSE': {
    id: 'LARI-NOSE',
    risk: 'R4-critical',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: true,
  },
  'LARI-SONIC': {
    id: 'LARI-SONIC',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-GROUND': {
    id: 'LARI-GROUND',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-AEGIS': {
    id: 'LARI-AEGIS',
    risk: 'R4-critical',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: true,
  },
  'LARI-EDDY': {
    id: 'LARI-EDDY',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },

  // Orchestration family
  'SCING-ORCH': {
    id: 'SCING-ORCH',
    risk: 'R1-low',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-ORCH': {
    id: 'LARI-ORCH',
    risk: 'R1-low',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },

  // LARI core reasoning family
  'LARI-PLANNER': {
    id: 'LARI-PLANNER',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-CRITIC': {
    id: 'LARI-CRITIC',
    risk: 'R3-high',
    requiresCriticGate: false, // critic IS the critic gate
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-SYNTHESIZER': {
    id: 'LARI-SYNTHESIZER',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-CONTEXT-ENGINE': {
    id: 'LARI-CONTEXT-ENGINE',
    risk: 'R2-medium',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-ANALYST': {
    id: 'LARI-ANALYST',
    risk: 'R2-medium',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-RETRIEVER': {
    id: 'LARI-RETRIEVER',
    risk: 'R2-medium',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },

  // BANE enforcement family
  'BANE-CORE': {
    id: 'BANE-CORE',
    risk: 'R4-critical',
    requiresCriticGate: false,
    requiresBaneGate: false, // BANE IS the bane gate
    affectsPhysicalControl: true,
  },
  'BANE-POLICY': {
    id: 'BANE-POLICY',
    risk: 'R4-critical',
    requiresCriticGate: false,
    requiresBaneGate: false, // BANE IS the bane gate
    affectsPhysicalControl: true,
  },
  'BANE-AUDIT': {
    id: 'BANE-AUDIT',
    risk: 'R2-medium',
    requiresCriticGate: false,
    requiresBaneGate: false,
    affectsPhysicalControl: false,
  },
  'BANE-COMPLIANCE': {
    id: 'BANE-COMPLIANCE',
    risk: 'R3-high',
    requiresCriticGate: false,
    requiresBaneGate: false,
    affectsPhysicalControl: false,
  },

  // Truth / report / audit family
  'LARI-STANDARDS': {
    id: 'LARI-STANDARDS',
    risk: 'R2-medium',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'SCING-REPORT': {
    id: 'SCING-REPORT',
    risk: 'R1-low',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'SCING-AUDIT': {
    id: 'SCING-AUDIT',
    risk: 'R2-medium',
    requiresCriticGate: false,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },

  'LARI-CONTRACTOR': {
    id: 'LARI-CONTRACTOR',
    risk: 'R3-high',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
  'LARI-ENGINEER': {
    id: 'LARI-ENGINEER',
    risk: 'R4-critical',
    requiresCriticGate: true,
    requiresBaneGate: true,
    affectsPhysicalControl: false,
  },
};
