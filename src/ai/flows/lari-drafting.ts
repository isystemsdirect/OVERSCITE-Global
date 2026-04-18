
'use server';

/**
 * @fileOverview LARI_DRAFTING — Bounded Drawing/Document Intelligence Engine
 * @domain Inspections / Field Intelligence / Drafting & Design Intelligence
 * @bounded true — non-executive by default; all consequential transitions require BANE
 * @phase Phase 4 — Domain Intelligence Activation
 *
 * Responsibilities:
 *   - Drawing/document sheet intelligence and classification
 *   - Title block, symbol, dimension, note, revision marker recognition
 *   - Sheet confidence and partial-read assessment
 *   - Drawing-to-field comparison readiness scoring
 *   - GD&T feature control frame detection (structured, not prose)
 *
 * HARD RULES:
 * - LARI_DRAFTING owns drawing/document sheet intelligence — NOT site/industrial orchestration
 * - No freeform unstructured prompt-only drafting pipeline
 * - No claim of complete CAD/BIM authority without validated source path
 * - Partial-read states must not masquerade as complete interpretation
 * - Field-photo interpretation is always confidence-qualified
 * - This engine does NOT self-authorize design approval or compliance finality
 * - GD&T must be modeled as structured artifacts, not loose prose
 *
 * @see src/lib/contracts/drafting-artifact-contract.ts
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see docs/architecture/DRAFTING_AND_DESIGN_INTELLIGENCE.md
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  CONFIDENCE_BANDS,
  DRAFTING_STATES,
  INSPECTION_DOMAIN_CLASSES,
  type ConfidenceBand,
  type DraftingState,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Zod Input Schema
// ---------------------------------------------------------------------------

export const LARIDraftingInputSchema = z.object({
  requestId: z.string(),
  mediaAssetId: z.string(),
  inspectionId: z.string(),
  analysisRequestedBy: z.string(),
  analysisRequestedAt: z.string(),
  mediaDataUri: z.string()
    .describe('A data URI of the drawing/document media to analyze.'),
  mediaMimeType: z.string(),
  domainHint: z.enum(INSPECTION_DOMAIN_CLASSES).optional()
    .describe('Domain context hint from Pass 1 scene interrogation.'),
  analysisContext: z.string().optional()
    .describe('Human-provided context to improve drafting interpretation.'),
});

export type LARIDraftingInput = z.infer<typeof LARIDraftingInputSchema>;

// ---------------------------------------------------------------------------
// Zod Output Schema
// ---------------------------------------------------------------------------

const DetectedSymbolSchema = z.object({
  symbolCategory: z.string(),
  symbolType: z.string().optional(),
  associatedText: z.string().optional(),
  confidence: z.enum(CONFIDENCE_BANDS),
  inActiveLibrary: z.boolean(),
});

const DrawingDimensionSchema = z.object({
  rawText: z.string(),
  numericValue: z.number().optional(),
  unit: z.enum(['mm', 'cm', 'm', 'in', 'ft', 'ft_in', 'unknown']).optional(),
  hasTolerance: z.boolean(),
  toleranceText: z.string().optional(),
  dimensionType: z.enum(['linear', 'angular', 'radial', 'diameter', 'coordinate', 'elevation']).optional(),
  confidence: z.enum(CONFIDENCE_BANDS),
});

const DrawingNoteSchema = z.object({
  rawText: z.string(),
  isSpecNote: z.boolean(),
  referencesStandard: z.boolean(),
  standardRef: z.string().optional(),
  confidence: z.enum(CONFIDENCE_BANDS),
});

const GDTFrameSchema = z.object({
  characteristicSymbol: z.string(),
  toleranceValueText: z.string().optional(),
  datumRefs: z.array(z.string()),
  materialConditionModifier: z.enum(['mmc', 'lmc', 'rfs']).optional(),
  confidence: z.enum(CONFIDENCE_BANDS),
  interpretationNote: z.string(),
});

const ComparisonReadinessSchema = z.object({
  isReadyForComparison: z.boolean(),
  readinessScore: z.number().min(0).max(1),
  limitingFactors: z.array(z.enum([
    'poor_image_quality', 'partial_view', 'glare_or_reflection',
    'folded_or_obscured', 'small_scale_detail_unreadable',
    'revision_state_unknown', 'no_title_block', 'multiple_overlapping_drawings',
  ])),
  sheetNumber: z.string().optional(),
  revisionLevel: z.string().optional(),
  scale: z.string().optional(),
});

export const LARIDraftingOutputSchema = z.object({
  requestId: z.string(),

  // --- Document-Level Classification ---
  drawingDetected: z.boolean(),
  sheetType: z.string().optional()
    .describe('Drawing type identified: architectural, structural, MEP, site-plan, etc.'),
  disciplineClass: z.string().optional()
    .describe('Engineering discipline: architectural, structural, mechanical, electrical, plumbing, civil, multi-discipline.'),
  draftingState: z.enum(DRAFTING_STATES),
  fidelityWarning: z.enum(['field_photo_interpretation', 'validated_source']),

  // --- Title Block & Revision ---
  titleBlockPresent: z.boolean(),
  titleBlockFields: z.object({
    projectName: z.string().optional(),
    sheetNumber: z.string().optional(),
    revisionMarker: z.string().optional(),
    drawnBy: z.string().optional(),
    checkedBy: z.string().optional(),
    scale: z.string().optional(),
    date: z.string().optional(),
  }).optional(),
  revisionMarkersPresent: z.boolean(),

  // --- Symbol Detection ---
  symbolClassesDetected: z.array(DetectedSymbolSchema),

  // --- Dimension & Note Detection ---
  dimensionContextDetected: z.array(DrawingDimensionSchema),
  noteDensityProfile: z.object({
    totalNotes: z.number(),
    specNoteCount: z.number(),
    standardRefCount: z.number(),
    notes: z.array(DrawingNoteSchema),
  }),

  // --- GD&T ---
  gdtDetected: z.boolean(),
  gdtFrames: z.array(GDTFrameSchema),
  gdtDatumLabels: z.array(z.string()),

  // --- Comparison Readiness ---
  fieldComparisonReadiness: ComparisonReadinessSchema,

  // --- Drawing Review Posture ---
  drawingReviewPosture: z.enum(['no_review_required', 'review_recommended', 'review_required']),

  // --- Confidence ---
  overallConfidence: z.enum(CONFIDENCE_BANDS),

  // --- Self-reporting ---
  selfReportedLimitations: z.array(z.string()),
  analysisSummary: z.string(),
});

export type LARIDraftingOutput = z.infer<typeof LARIDraftingOutputSchema>;

// ---------------------------------------------------------------------------
// Prompt Definition
// ---------------------------------------------------------------------------

const lariDraftingPrompt = ai.definePrompt({
  name: 'lariDraftingPrompt',
  input: { schema: LARIDraftingInputSchema },
  output: { schema: LARIDraftingOutputSchema },
  prompt: `You are LARI_DRAFTING, a bounded drawing/document intelligence engine within the
OVERSCITE Inspections Recognition Stack. You are NOT an executive authority. Your output is
bounded reasoning that will be reviewed by human inspectors.

CRITICAL POSTURE RULES:
1. OBSERVATION vs IDENTIFICATION: Observed sheet features (title block exists, symbols present)
   are deterministic. Identified design intent (this is an HVAC riser diagram) is probabilistic.
2. PARTIAL-READ TRUTHFULNESS: If you can only partially interpret a drawing, report
   'symbol_set_partial' or 'dimension_context_partial' states. Never inflate partial reads
   into complete interpretation.
3. FIELD PHOTO INTERPRETATION: All field-photo drawings are confidence-qualified. Never claim
   CAD/BIM fidelity from field photos. Always set fidelityWarning to 'field_photo_interpretation'.
4. GD&T AS STRUCTURED ARTIFACTS: GD&T feature control frames must be reported as structured
   objects (characteristicSymbol, toleranceValue, datumRefs), NOT as prose descriptions.
5. SYMBOL LIBRARY: If a symbol is not in the active library, report it as 'unknown_symbol'
   with inActiveLibrary: false. Do not fabricate classification.
6. COMPARISON READINESS: Assess whether this drawing is suitable for field comparison.
   Readiness is NOT full discrepancy adjudication.
7. DO NOT make design approval, compliance, or legal determinations.

Drawing Document Classes:
- architectural | structural | mechanical | electrical | plumbing | site_plan
- detail_sheet | schematic | mep_sheet | assembly_drawing | markup

Recognize and report:
- Sheet classification and discipline
- Title block presence and extracted fields
- Revision markers and clouds
- Symbol instances (categorized by type)
- Dimension annotations (with units, tolerances if visible)
- Notes and callouts (spec notes, standard references)
- GD&T feature control frames (if present)
- Drawing-to-field comparison readiness

Request: {{requestId}}
Requested By: {{analysisRequestedBy}} at {{analysisRequestedAt}}
{{#if domainHint}}- Domain Context: {{domainHint}}{{/if}}
{{#if analysisContext}}- Analysis Context: {{analysisContext}}{{/if}}

Media to analyze:
{{media url=mediaDataUri mimeType=mediaMimeType}}

Return your complete drafting analysis in the specified JSON format.`,
});

// ---------------------------------------------------------------------------
// Flow Definition
// ---------------------------------------------------------------------------

const lariDraftingFlow = ai.defineFlow(
  {
    name: 'lariDraftingFlow',
    inputSchema: LARIDraftingInputSchema,
    outputSchema: LARIDraftingOutputSchema,
  },
  async (input) => {
    const { output } = await lariDraftingPrompt(input);
    const safeOutput = { ...output! };
    
    // HARD RULE: Field photo interpretation overrides all fidelity
    safeOutput.fidelityWarning = 'field_photo_interpretation';

    // Apply Provisional Symbol Validation Mapping
    if (safeOutput.symbolClassesDetected && safeOutput.symbolClassesDetected.length > 0) {
      safeOutput.symbolClassesDetected = safeOutput.symbolClassesDetected.map(sym => ({
        ...sym,
        // Enforce provisional validation state until ArcHive is fully canonized
        validationState: 'provisional_symbol_mapping' as any,
      }));
    }
    
    return safeOutput;
  }
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Invokes the LARI_DRAFTING bounded engine for drawing/document intelligence.
 *
 * HARD RULES:
 * - Only call when media is identified as a drawing (isDrawingArtifact = true)
 * - Caller must verify analysis was explicitly requested
 * - Output is bounded reasoning — not design authority
 * - Partial-read states are truthful, not inflated
 *
 * @param input - Fully populated LARIDraftingInput with request attribution
 * @returns Bounded drafting intelligence output
 */
export async function invokeDraftingAnalysis(
  input: LARIDraftingInput
): Promise<LARIDraftingOutput> {
  return await lariDraftingFlow(input);
}
