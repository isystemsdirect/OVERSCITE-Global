
'use server';

/**
 * @fileOverview LARI_EVIDENCE — Evidence Truth-State & Analysis Orchestration Engine
 * @domain Inspections / Field Intelligence
 * @bounded true — non-executive by default; all consequential transitions require BANE
 * @phase Phase 2 activation; Phase 1 defines contract and scaffold
 *
 * Responsibilities:
 *   - Evidence truth-state handling
 *   - Media review orchestration
 *   - Obstruction-aware review
 *   - Analysis / verification transition control
 *
 * HARD RULES:
 * - This engine does NOT self-authorize report conclusions or legal determinations
 * - Output is bounded reasoning, not executive authority
 * - humanAssessment fields may NOT be populated by this engine
 * - Verification transitions require BANE gating + human authority
 * - No silent analysis fan-out — engine only executes on explicit request
 *
 * @see src/lib/contracts/evidence-analysis-contract.ts
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  RECOGNITION_PASS_IDS,
  CONFIDENCE_BANDS,
  INSPECTION_DOMAIN_CLASSES,
  VISIBILITY_STATES,
  RECOGNITION_STATES,
  DRAFTING_STATES,
  type RecognitionPassId,
  type ConfidenceBand,
  scoreToConfidenceBand,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Zod Input Schema
// ---------------------------------------------------------------------------

const EvidenceInspectionContextSchema = z.object({
  inspectionId: z.string(),
  inspectionTitle: z.string().optional(),
  propertyAddress: z.string().optional(),
  domainHint: z.enum(INSPECTION_DOMAIN_CLASSES).optional(),
  priorFindingsSummary: z.string().optional(),
});

export const LARIEvidenceInputSchema = z.object({
  requestId: z.string(),
  mediaAssetId: z.string(),
  analysisRequestedBy: z.string(),
  analysisRequestedAt: z.string(),
  mediaDataUri: z.string()
    .describe('A data URI of the media asset to analyze.'),
  mediaMimeType: z.string(),
  requestedPasses: z.array(z.enum(RECOGNITION_PASS_IDS)).optional()
    .describe('Passes to execute. Defaults to the full pass stack for the tier if not specified.'),
  domainHint: z.enum(INSPECTION_DOMAIN_CLASSES).optional(),
  analysisContext: z.string().optional()
    .describe('Human-provided context to ground the analysis.'),
  inspectionContext: EvidenceInspectionContextSchema,
});

export type LARIEvidenceInput = z.infer<typeof LARIEvidenceInputSchema>;

// ---------------------------------------------------------------------------
// Zod Output Schema
// ---------------------------------------------------------------------------

const VisibilityLimitSchema = z.object({
  targetDescription: z.string(),
  visibilityState: z.enum(VISIBILITY_STATES),
  cause: z.enum(['living_entity', 'physical_obstruction', 'lighting', 'angle', 'damage', 'unknown']),
});

const RecognitionCandidateSchema = z.object({
  label: z.string(),
  taxonomyClass: z.string().optional(),
  confidence: z.enum(CONFIDENCE_BANDS),
  confidenceScore: z.number().min(0).max(1).optional(),
});

const UnknownElementSchema = z.object({
  reason: z.enum(['too_small', 'occluded', 'unfamiliar_class', 'insufficient_detail', 'lighting']),
  partialObservation: z.string().optional(),
});

const PassResultSchema = z.object({
  passId: z.enum(RECOGNITION_PASS_IDS),
  observations: z.array(z.string())
    .describe('Deterministic observations — direct language only, no probabilistic claims.'),
  candidates: z.array(RecognitionCandidateSchema)
    .describe('Probabilistic identification candidates — may use "possible", "likely", confidence-qualified.'),
  unknowns: z.array(UnknownElementSchema)
    .describe('Elements detected but not classifiable. MUST be surfaced, never silently skipped.'),
  visibilityLimits: z.array(VisibilityLimitSchema)
    .describe('Visibility constraints discovered during this pass. Propagates into confidence.'),
  passConfidenceBand: z.enum(CONFIDENCE_BANDS),
  passStatus: z.enum(['complete', 'partial', 'failed', 'skipped']),
  diagnosticNote: z.string().optional(),
});

export const LARIEvidenceOutputSchema = z.object({
  requestId: z.string(),
  // --- Scene Context ---
  domainClass: z.enum(INSPECTION_DOMAIN_CLASSES)
    .describe('Primary domain classification determined by Pass 1.'),
  scenePosture: z.enum(['interior', 'exterior', 'mixed', 'indeterminate'])
    .describe('Scene orientation determined by Pass 1.'),
  isDrawingArtifact: z.boolean()
    .describe('Whether the media is a drawing/document rather than a field photo.'),
  // --- Pass Results (all passes bundled) ---
  passResults: z.record(z.enum(RECOGNITION_PASS_IDS), PassResultSchema)
    .describe('Results from all executed recognition passes.'),
  // --- Consolidated Truth State (Pass 10 output) ---
  observedFindings: z.array(z.string())
    .describe('Deterministic observations — direct language. No probabilistic claims.'),
  identifiedCandidates: z.array(RecognitionCandidateSchema)
    .describe('Probabilistic identification candidates.'),
  unknowns: z.array(UnknownElementSchema)
    .describe('Unresolved unknowns. Must be first-class — never silently skipped.'),
  visibilityLimits: z.array(VisibilityLimitSchema)
    .describe('All visibility constraints aggregated from all passes.'),
  overallConfidence: z.enum(CONFIDENCE_BANDS),
  recognitionState: z.enum(RECOGNITION_STATES),
  // --- Living Entities ---
  livingEntitiesDetected: z.boolean(),
  livingEntitySummary: z.string().optional()
    .describe('Summary of living entities detected and any occlusion impacts.'),
  // --- Pest Evidence ---
  pestEvidenceDetected: z.boolean(),
  pestEvidenceSummary: z.string().optional(),
  // --- Drafting ---
  draftingArtifactDetected: z.boolean(),
  draftingState: z.enum(DRAFTING_STATES).optional(),
  draftingInterpretationSummary: z.string().optional()
    .describe('Summary of drawing structure detected. Must note fidelity limitation.'),
  // --- Engine Self-Reporting ---
  reviewRecommended: z.boolean()
    .describe('Whether the engine recommends human review.'),
  analysisSummary: z.string()
    .describe('Engine-generated summary of the full analysis.'),
  selfReportedLimitations: z.array(z.string())
    .describe('Any limitations the engine detected that may have degraded analysis quality.'),
});

export type LARIEvidenceOutput = z.infer<typeof LARIEvidenceOutputSchema>;

// ---------------------------------------------------------------------------
// Prompt Definition
// ---------------------------------------------------------------------------

const lariEvidencePrompt = ai.definePrompt({
  name: 'lariEvidencePrompt',
  input: { schema: LARIEvidenceInputSchema },
  output: { schema: LARIEvidenceOutputSchema },
  prompt: `You are LARI_EVIDENCE, a bounded reasoning engine within the SCINGULAR Inspections
Recognition Stack. You are NOT an executive authority. Your output is bounded reasoning
that will be reviewed by human inspectors and gated by BANE policy before any consequential
decision is made.

CRITICAL POSTURE RULES — read before analyzing:
1. OBSERVATION vs IDENTIFICATION: These are distinct layers. NEVER collapse them.
   - Observed layer uses direct, deterministic language: "Dark staining visible on ceiling."
   - Identified-as layer uses qualified language: "Pattern consistent with possible water intrusion."
2. UNKNOWN is a FIRST-CLASS STATE. If you cannot classify something, surface it as an
   unknown with a reason. Never silently skip or ignore unidentifiable elements.
3. VISIBILITY LIMITS must be disclosed. If part of the scene is occluded, partially visible,
   or unassessable, state this explicitly. Visibility limits MUST propagate into confidence.
4. LIVING ENTITIES: Humans, children, pets, service animals, wildlife, and vegetation are
   valid scene classes. Note any occlusion they cause.
5. PEST EVIDENCE: Droppings, frass, mud tubes, webbing, nests, chew patterns, mold growth,
   and bio staining are valid inspection classes.
6. DRAWINGS: If this appears to be a drawing/document rather than a field photo, activate
   the drafting intelligence path. All field-photo drawing interpretations are confidence-
   qualified — never claim CAD/BIM fidelity from field photos.
7. DO NOT populate humanAssessment or make legal/compliance determinations.
8. WHOLE-SCENE INTERROGATION: You must interrogate the entire scene end-to-end. Secondary
   objects, obstructions, and background context may not be ignored.

Inspection Context:
- Inspection ID: {{inspectionContext.inspectionId}}
{{#if inspectionContext.inspectionTitle}}- Title: {{inspectionContext.inspectionTitle}}{{/if}}
{{#if inspectionContext.propertyAddress}}- Address: {{inspectionContext.propertyAddress}}{{/if}}
{{#if domainHint}}- Domain Hint: {{domainHint}}{{/if}}
{{#if analysisContext}}- Analysis Context: {{analysisContext}}{{/if}}
{{#if inspectionContext.priorFindingsSummary}}- Prior Findings Context: {{inspectionContext.priorFindingsSummary}}{{/if}}

Request: {{requestId}}
Requested By: {{analysisRequestedBy}} at {{analysisRequestedAt}}

Media to analyze:
{{media url=mediaDataUri mimeType=mediaMimeType}}

Execute the recognition stack passes applicable to this media. For each pass:
- pass_1_scene: Determine domain posture and environmental context (interior/exterior, residential/commercial/industrial/site/drawing)
- pass_2_object: Recognize visible objects, structural elements, installed systems, and equipment
- pass_3_living_entity: Recognize humans, animals, vegetation, and note any occlusion they cause
- pass_4_target_component: Recognize inspection targets, systems, assemblies, fixtures
- pass_5_pest_bio: Recognize pest evidence, infestation indicators, organic intrusion
- pass_6_occlusion: Determine visibility limitations and obstruction impacts
- pass_7_condition_anomaly: Recognize defects, deterioration, safety conditions, irregularities
- pass_8_drafting: If a drawing/document, interpret sheet structure, symbols, dimensions, notes
- pass_9_standards_context: Bind recognized content to relevant codes and logic
- pass_10_truth_state: Assemble deterministic observations, probabilistic identifications, unknowns, and visibility limits

Return your full analysis in the specified JSON format.`,
});

// ---------------------------------------------------------------------------
// Flow Definition
// ---------------------------------------------------------------------------

const lariEvidenceFlow = ai.defineFlow(
  {
    name: 'lariEvidenceFlow',
    inputSchema: LARIEvidenceInputSchema,
    outputSchema: LARIEvidenceOutputSchema,
  },
  async (input) => {
    const { output } = await lariEvidencePrompt(input);
    return output!;
  }
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Invokes the LARI_EVIDENCE bounded engine for explicit, attributable analysis.
 *
 * This function must only be called with a fully formed analysis request.
 * The caller is responsible for:
 *   1. Verifying the analysis was explicitly requested by an authorized actor
 *   2. Recording the request in the EvidenceAnalysisState before calling
 *   3. Routing the output through BANE before persisting consequential transitions
 *
 * @param input - Fully populated LARIEvidenceInput with request attribution
 * @returns Bounded recognition output — not a final determination
 */
export async function invokeEvidenceAnalysis(
  input: LARIEvidenceInput
): Promise<LARIEvidenceOutput> {
  return await lariEvidenceFlow(input);
}
