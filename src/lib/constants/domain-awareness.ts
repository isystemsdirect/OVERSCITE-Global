/**
 * @fileOverview Domain Awareness — Prioritization, Expansion Hooks, and Metadata
 * @domain Inspections / Field Intelligence
 * @classification CANONICAL_CONSTANT — domain intelligence
 * @phase Phase 4 — Domain Intelligence Activation (LARI_DRAFTING + LARI_SITEOPS)
 *
 * Provides domain-specific prioritization weights, flag emphasis, and observation
 * groupings for each active inspection domain class. Active domain changes
 * prioritization, NOT truth — out-of-domain signals may be de-emphasized but
 * never fabricated away.
 *
 * HARD RULES:
 * - Active domain changes prioritization, not truth
 * - Out-of-domain signals may be de-emphasized but not fabricated away
 * - No domain filter may hide review_required state
 * - Do not claim engine activation where engine is not implemented
 * - Do not create fake domain intelligence beyond current pass support
 *
 * @see src/lib/constants/recognition-truth-states.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

import type {
  InspectionDomainClass,
  RecognitionPassId,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Domain Prioritization Weights
// ---------------------------------------------------------------------------

/**
 * Per-domain emphasis weights for recognition pass outputs.
 * Higher weight = higher visual priority in the Evidence lane.
 * Weight of 0 = suppress (but never hide review_required or unknowns).
 */
export interface DomainPassWeight {
  passId: RecognitionPassId;
  weight: number; // 0.0 – 1.0
}

/**
 * Domain metadata describing prioritization behavior and activation status.
 */
export interface DomainExpansionMetadata {
  /** Canonical domain class identifier */
  domainClass: InspectionDomainClass;
  /** Human-readable domain label */
  label: string;
  /** Brief description for UI */
  description: string;
  /** Whether this domain has full engine support (vs hook-only readiness) */
  engineActivated: boolean;
  /** Engine family expected (hook reference, not active claim) */
  expectedEngine?: string;
  /** Recognition pass prioritization weights for this domain */
  passWeights: DomainPassWeight[];
  /** Key flags to emphasize in this domain */
  emphasisFlags: string[];
  /** Observation keywords to boost ranking */
  observationBoostTerms: string[];
}

// ---------------------------------------------------------------------------
// Domain Prioritization Registry
// ---------------------------------------------------------------------------

export const DOMAIN_EXPANSION_REGISTRY: Record<InspectionDomainClass, DomainExpansionMetadata> = {
  residential: {
    domainClass: 'residential',
    label: 'Residential',
    description: 'Home components, belongings, living entities, pest indicators, and visibility limits',
    engineActivated: true,
    passWeights: [
      { passId: 'pass_1_scene', weight: 0.8 },
      { passId: 'pass_2_object', weight: 0.9 },
      { passId: 'pass_3_living_entity', weight: 1.0 },
      { passId: 'pass_4_target_component', weight: 1.0 },
      { passId: 'pass_5_pest_bio', weight: 1.0 },
      { passId: 'pass_6_occlusion', weight: 0.9 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.5 },
      { passId: 'pass_9_standards_context', weight: 0.7 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasLivingEntityOcclusion', 'hasPestEvidence', 'hasVisibilityLimitations', 'hasUnresolvedUnknowns'],
    observationBoostTerms: ['ceiling', 'wall', 'floor', 'foundation', 'roof', 'attic', 'basement', 'plumbing', 'electrical', 'HVAC', 'window', 'door', 'staining', 'crack', 'moisture', 'mold', 'pest'],
  },
  commercial: {
    domainClass: 'commercial',
    label: 'Commercial',
    description: 'Commercial fixtures, occupancy obstructions, signage, and maintenance/safety cues',
    engineActivated: true,
    passWeights: [
      { passId: 'pass_1_scene', weight: 0.9 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 0.6 },
      { passId: 'pass_4_target_component', weight: 1.0 },
      { passId: 'pass_5_pest_bio', weight: 0.7 },
      { passId: 'pass_6_occlusion', weight: 0.9 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.6 },
      { passId: 'pass_9_standards_context', weight: 0.9 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasVisibilityLimitations', 'hasUnresolvedUnknowns'],
    observationBoostTerms: ['occupancy', 'fixture', 'signage', 'exit', 'sprinkler', 'fire', 'maintenance', 'safety', 'ADA', 'egress', 'HVAC', 'electrical', 'panel'],
  },
  industrial: {
    domainClass: 'industrial',
    label: 'Industrial',
    description: 'Equipment, piping, corrosion, leaks, barriers, platforms, and safety-sensitive presence',
    engineActivated: true,
    expectedEngine: 'LARI_SITEOPS',
    passWeights: [
      { passId: 'pass_1_scene', weight: 1.0 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 0.4 },
      { passId: 'pass_4_target_component', weight: 1.0 },
      { passId: 'pass_5_pest_bio', weight: 0.3 },
      { passId: 'pass_6_occlusion', weight: 1.0 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.7 },
      { passId: 'pass_9_standards_context', weight: 1.0 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasVisibilityLimitations', 'hasUnresolvedUnknowns'],
    observationBoostTerms: ['equipment', 'piping', 'corrosion', 'leak', 'barrier', 'platform', 'valve', 'vessel', 'tank', 'conduit', 'weld', 'structural', 'crane', 'machinery'],
  },
  site: {
    domainClass: 'site',
    label: 'Site',
    description: 'Access, egress, debris, barricades, material staging, readiness, and weather-exposure context',
    engineActivated: true,
    expectedEngine: 'LARI_SITEOPS',
    passWeights: [
      { passId: 'pass_1_scene', weight: 1.0 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 0.5 },
      { passId: 'pass_4_target_component', weight: 0.8 },
      { passId: 'pass_5_pest_bio', weight: 0.2 },
      { passId: 'pass_6_occlusion', weight: 1.0 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.4 },
      { passId: 'pass_9_standards_context', weight: 0.8 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasVisibilityLimitations', 'hasUnresolvedUnknowns'],
    observationBoostTerms: ['access', 'egress', 'debris', 'barricade', 'staging', 'excavation', 'trench', 'grading', 'erosion', 'weather', 'exposure', 'scaffold', 'concrete'],
  },
  insurance: {
    domainClass: 'insurance',
    label: 'Insurance',
    description: 'Condition documentation, loss/risk indicators, and claim-support evidence',
    engineActivated: true,
    expectedEngine: 'LARI_SITEOPS (insurance-emphasis enrichment)',
    passWeights: [
      { passId: 'pass_1_scene', weight: 0.9 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 0.5 },
      { passId: 'pass_4_target_component', weight: 1.0 },
      { passId: 'pass_5_pest_bio', weight: 0.6 },
      { passId: 'pass_6_occlusion', weight: 1.0 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.5 },
      { passId: 'pass_9_standards_context', weight: 0.8 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasVisibilityLimitations', 'hasUnresolvedUnknowns', 'hasLivingEntityOcclusion'],
    observationBoostTerms: ['damage', 'loss', 'risk', 'condition', 'wear', 'deterioration', 'claim', 'coverage', 'liability', 'deficiency', 'failure'],
  },
  safety: {
    domainClass: 'safety',
    label: 'Safety',
    description: 'PPE, fall hazards, blocked exits, unsafe zones, and control/signage failures',
    engineActivated: true,
    expectedEngine: 'LARI_SITEOPS',
    passWeights: [
      { passId: 'pass_1_scene', weight: 1.0 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 1.0 },
      { passId: 'pass_4_target_component', weight: 0.8 },
      { passId: 'pass_5_pest_bio', weight: 0.3 },
      { passId: 'pass_6_occlusion', weight: 1.0 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 0.3 },
      { passId: 'pass_9_standards_context', weight: 1.0 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['hasVisibilityLimitations', 'hasUnresolvedUnknowns', 'hasLivingEntityOcclusion'],
    observationBoostTerms: ['PPE', 'fall', 'hazard', 'exit', 'blocked', 'unsafe', 'signage', 'guardrail', 'harness', 'confined', 'lockout', 'tagout', 'electrical'],
  },
  drafting_design: {
    domainClass: 'drafting_design',
    label: 'Drafting / Design',
    description: 'Architectural drawings, floor plans, specifications, and design documentation',
    engineActivated: true,
    expectedEngine: 'LARI_DRAFTING',
    passWeights: [
      { passId: 'pass_1_scene', weight: 0.5 },
      { passId: 'pass_2_object', weight: 0.5 },
      { passId: 'pass_3_living_entity', weight: 0.1 },
      { passId: 'pass_4_target_component', weight: 0.5 },
      { passId: 'pass_5_pest_bio', weight: 0.0 },
      { passId: 'pass_6_occlusion', weight: 0.3 },
      { passId: 'pass_7_condition_anomaly', weight: 0.4 },
      { passId: 'pass_8_drafting', weight: 1.0 },
      { passId: 'pass_9_standards_context', weight: 0.8 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: ['isDrawingArtifact'],
    observationBoostTerms: ['drawing', 'floor plan', 'elevation', 'section', 'detail', 'specification', 'title block', 'gridline', 'dimension', 'symbol', 'legend'],
  },
  indeterminate: {
    domainClass: 'indeterminate',
    label: 'Indeterminate',
    description: 'Domain not yet classified — all passes weighted equally',
    engineActivated: true,
    passWeights: [
      { passId: 'pass_1_scene', weight: 1.0 },
      { passId: 'pass_2_object', weight: 1.0 },
      { passId: 'pass_3_living_entity', weight: 1.0 },
      { passId: 'pass_4_target_component', weight: 1.0 },
      { passId: 'pass_5_pest_bio', weight: 1.0 },
      { passId: 'pass_6_occlusion', weight: 1.0 },
      { passId: 'pass_7_condition_anomaly', weight: 1.0 },
      { passId: 'pass_8_drafting', weight: 1.0 },
      { passId: 'pass_9_standards_context', weight: 1.0 },
      { passId: 'pass_10_truth_state', weight: 1.0 },
    ],
    emphasisFlags: [],
    observationBoostTerms: [],
  },
};

// ---------------------------------------------------------------------------
// Domain Filtering Utility
// ---------------------------------------------------------------------------

/**
 * Returns true if the given flag name is emphasized for the active domain.
 * Emphasis does NOT hide content — it visually promotes relevant flags.
 */
export function isDomainEmphasisFlag(
  domainClass: InspectionDomainClass,
  flagName: string
): boolean {
  return DOMAIN_EXPANSION_REGISTRY[domainClass]?.emphasisFlags.includes(flagName) ?? false;
}

/**
 * Gets the weight for a specific pass in a domain.
 * Returns 1.0 if domain or pass is not found (safe default).
 */
export function getDomainPassWeight(
  domainClass: InspectionDomainClass,
  passId: RecognitionPassId
): number {
  const metadata = DOMAIN_EXPANSION_REGISTRY[domainClass];
  if (!metadata) return 1.0;
  const weight = metadata.passWeights.find((w) => w.passId === passId);
  return weight?.weight ?? 1.0;
}

/**
 * Checks whether a domain has engine-activated status.
 * Hook-only domains return false — their intelligence is provided
 * through existing passes, not a dedicated engine.
 */
export function isDomainEngineActivated(
  domainClass: InspectionDomainClass
): boolean {
  return DOMAIN_EXPANSION_REGISTRY[domainClass]?.engineActivated ?? false;
}
