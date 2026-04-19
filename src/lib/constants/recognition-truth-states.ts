/**
 * @fileOverview Recognition Stack Truth States & Domain Constants
 * @domain Inspections / Field Intelligence
 * @canonical true
 * @phase Phase 1 — Foundation
 *
 * Defines recognition-domain-specific truth states, domain classes, visibility
 * states, confidence bands, and pass identifiers for the OVERSCITE Recognition Stack.
 *
 * IMPORTANT: This file extends the core truth state system WITHOUT modifying
 * the protected canonical `truth-states.ts`. These constants are scoped to
 * the recognition stack domain only.
 *
 * @see src/lib/constants/truth-states.ts (protected — do not modify)
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

// ---------------------------------------------------------------------------
// Media Analysis State Machine
// ---------------------------------------------------------------------------

/**
 * Lifecycle states for a media asset within the recognition pipeline.
 *
 * State machine:
 *   accepted_unanalyzed
 *     → accepted_analysis_requested   (explicit request + attribution)
 *     → analysis_in_progress          (engine execution begun)
 *     → analysis_complete             (all requested passes complete)
 *     → verification_pending          (awaiting human review)
 *     → verified_by_overscite         (human authority confirmed)
 *     → review_required               (anomaly or confidence failure — at any stage)
 *
 * HARD RULE: Verification cannot precede analysis completion and governed binding.
 * HARD RULE: accepted_unanalyzed media is usable and placeable; it implies NO analysis.
 */
export const MEDIA_ANALYSIS_STATES = [
  'accepted_unanalyzed',
  'accepted_analysis_requested',
  'analysis_in_progress',
  'analysis_complete',
  'verification_pending',
  'verified_by_overscite',
  'review_required',
] as const;

export type MediaAnalysisState = typeof MEDIA_ANALYSIS_STATES[number];

// ---------------------------------------------------------------------------
// Recognition States
// ---------------------------------------------------------------------------

/**
 * Fine-grained recognition output states for individual elements within a pass.
 *
 * HARD RULE: 'unknown_object_present' is a first-class state — never silently skip.
 * HARD RULE: 'visibility_limited' must propagate into reporting and confidence.
 */
export const RECOGNITION_STATES = [
  'observed_only',
  'identified_candidate',
  'identified_with_low_confidence',
  'unknown_object_present',
  'visibility_limited',
  'human_review_required',
] as const;

export type RecognitionState = typeof RECOGNITION_STATES[number];

// ---------------------------------------------------------------------------
// Drafting States
// ---------------------------------------------------------------------------

/**
 * States for drawing/document recognition output.
 *
 * HARD RULE: 'drawing_review_required' must be surfaced when content is ambiguous.
 * HARD RULE: Partial-read states must not masquerade as complete interpretation.
 */
export const DRAFTING_STATES = [
  'document_detected',
  'sheet_structure_detected',
  'symbol_set_partial',
  'dimension_context_partial',
  'drawing_review_required',
  'no_drawing_present',
] as const;

export type DraftingState = typeof DRAFTING_STATES[number];

// ---------------------------------------------------------------------------
// Inspection Domain Classes
// ---------------------------------------------------------------------------

/**
 * Top-level domain classification for an inspection or recognition session.
 * Output of Pass 1 (Scene Interrogation).
 * Determines which domain packs are activated for subsequent passes.
 */
export const INSPECTION_DOMAIN_CLASSES = [
  'residential',
  'commercial',
  'industrial',
  'site',
  'insurance',
  'safety',
  'drafting_design',
  'indeterminate',
] as const;

export type InspectionDomainClass = typeof INSPECTION_DOMAIN_CLASSES[number];

// ---------------------------------------------------------------------------
// Visibility States
// ---------------------------------------------------------------------------

/**
 * Visibility state for a specific inspection target or scene region.
 * Applied by Pass 6 and propagated into Pass 10 (Truth State Assembly).
 *
 * HARD RULE: An empty visibility state is not permitted on any finding.
 */
export const VISIBILITY_STATES = [
  'visible',
  'partially_visible',
  'occluded',
  'non_assessable',
  'lighting_limited',
  'angle_limited',
] as const;

export type VisibilityState = typeof VISIBILITY_STATES[number];

// ---------------------------------------------------------------------------
// Confidence Bands
// ---------------------------------------------------------------------------

/**
 * Qualitative confidence band for recognition outputs.
 * Used throughout the recognition stack as the canonical confidence vocabulary.
 *
 * HARD RULE: Confidence bands are published outputs — never collapse into
 * a boolean pass/fail without explicit human authorization.
 */
export const CONFIDENCE_BANDS = [
  'high',
  'moderate',
  'low',
  'review_required',
  'verified_by_overscite',
] as const;

export type ConfidenceBand = typeof CONFIDENCE_BANDS[number];

/**
 * Maps a numeric confidence score (0–1) to a qualitative band.
 * Thresholds are governed — do not adjust without ArcHive™ proposal.
 */
export function scoreToConfidenceBand(score: number): ConfidenceBand {
  if (score >= 0.85) return 'high';
  if (score >= 0.65) return 'moderate';
  if (score >= 0.40) return 'low';
  return 'review_required';
}

// ---------------------------------------------------------------------------
// Recognition Pass Identifiers
// ---------------------------------------------------------------------------

/**
 * Named identifiers for each of the 10 recognition passes executed by the stack.
 * Pass 0 is the SRT ingestion layer (handled upstream, not a named engine pass).
 *
 * HARD RULES:
 * - No pass may silently erase prior uncertainty.
 * - Occlusion results from Pass 6 must affect downstream confidence.
 * - Drafting pass (Pass 8) may not claim authoritative CAD/BIM fidelity
 *   without a validated source path.
 */
export const RECOGNITION_PASS_IDS = [
  'pass_1_scene',
  'pass_2_object',
  'pass_3_living_entity',
  'pass_4_target_component',
  'pass_5_pest_bio',
  'pass_6_occlusion',
  'pass_7_condition_anomaly',
  'pass_8_drafting',
  'pass_9_standards_context',
  'pass_10_truth_state',
] as const;

export type RecognitionPassId = typeof RECOGNITION_PASS_IDS[number];

/** Human-readable pass labels for UI display */
export const RECOGNITION_PASS_LABELS: Record<RecognitionPassId, string> = {
  pass_1_scene:           'Scene Interrogation',
  pass_2_object:          'Object & Component Recognition',
  pass_3_living_entity:   'Living Entity Recognition',
  pass_4_target_component:'Inspection Target Recognition',
  pass_5_pest_bio:        'Pest & Bio-Condition Recognition',
  pass_6_occlusion:       'Occlusion & Visibility Assessment',
  pass_7_condition_anomaly:'Condition & Anomaly Detection',
  pass_8_drafting:        'Drafting & Design Intelligence',
  pass_9_standards_context:'Standards & Context Reasoning',
  pass_10_truth_state:    'Truth State Assembly',
};

// ---------------------------------------------------------------------------
// Domain Mode Labels (for UI shell)
// ---------------------------------------------------------------------------

/** UI display names for each inspection domain mode */
export const DOMAIN_MODE_LABELS: Record<InspectionDomainClass, string> = {
  residential:      'Residential',
  commercial:       'Commercial',
  industrial:       'Industrial',
  site:             'Site',
  insurance:        'Insurance',
  safety:           'Safety',
  drafting_design:  'Drafting / Design',
  indeterminate:    'Indeterminate',
};

// ---------------------------------------------------------------------------
// Shell Lane Identifiers (for UI shell)
// ---------------------------------------------------------------------------

/**
 * Canonical shell lane identifiers for the Inspections command environment.
 * Shell lanes define the primary navigation regions of the Inspections division.
 *
 * HARD RULE: Do not add lanes without updating the shell lane manifest and
 * submitting a BANE-governed shell mutation request.
 */
export const INSPECTION_SHELL_LANES = [
  'command',
  'queue',
  'active',
  'types',
  'sites',
  'evidence',
  'hazards',
  'incidents',
  'reports',
  'audit',
] as const;

export type InspectionShellLane = typeof INSPECTION_SHELL_LANES[number];

/** Human-readable labels for shell lanes */
export const SHELL_LANE_LABELS: Record<InspectionShellLane, string> = {
  command:   'Command',
  queue:     'Queue',
  active:    'Active',
  types:     'Types',
  sites:     'Sites',
  evidence:  'Evidence',
  hazards:   'Hazards',
  incidents: 'Incidents',
  reports:   'Reports',
  audit:     'Audit',
};
