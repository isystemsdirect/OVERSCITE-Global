import { BaneEngine } from '../types';

export const BANE_CORE: BaneEngine = {
  id: 'BANE_CORE',
  role: 'Structural integrity guardian',
  mandate: "Protect against adversarial interference, boundary violation, and internal drift while anchoring the subsystem's refusal logic.",
};

export const BANE_POLICY: BaneEngine = {
  id: 'BANE_POLICY',
  role: 'Governance and escalation enforcement engine',
  mandate: 'Apply active policy constraints, block unauthorized escalation, and ensure action pathways remain subordinate to IU-defined governance.',
};

export const BANE_AUDIT: BaneEngine = {
  id: 'BANE_AUDIT',
  role: 'Immutable accountability engine',
  mandate: 'Generate decision records, preserve forensic-grade traceability, and maintain cryptographic audit continuity.',
};

export const BANE_COMPLIANCE: BaneEngine = {
  id: 'BANE_COMPLIANCE',
  role: 'Regulatory and corporate conformance engine',
  mandate: 'Ensure all system behavior remains within legal, regulatory, contractual, privacy, and risk-governed boundaries.',
};

export const BANE_ORCH = {
  id: 'BANE_ORCH',
  function: 'Coordinate evaluation order, evidence capture, refusal routing, escalation discipline, containment handling, and final disposition logging across BANE™ engines.',
  non_overlap_rule: 'No BANE™ engine may silently absorb the responsibilities of another. Non-overlapping roles are mandatory to preserve audit clarity and prevent hidden authority concentration.',
};
