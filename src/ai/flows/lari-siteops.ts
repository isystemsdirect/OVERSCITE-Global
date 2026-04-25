
'use server';

/**
 * @fileOverview LARI_SITEOPS — Bounded Site/Industrial/Safety Orchestration Engine
 * @domain Inspections / Field Intelligence / Site-State Intelligence
 * @bounded true — non-executive by default; all consequential transitions require BANE
 * @phase Phase 4 — Domain Intelligence Activation
 *
 * Responsibilities:
 *   - Site-state, readiness, access/egress interpretation
 *   - Industrial equipment posture, piping, corrosion, barrier, leak, weld emphasis
 *   - Safety posture: PPE, fall hazard, blocked exit, unsafe zone, signage
 *   - Insurance/risk condition documentation emphasis
 *   - Weather-exposure and readiness-affecting context
 *
 * HARD RULES:
 * - LARI_SITEOPS owns site/industrial/safety/insurance field-state orchestration
 * - LARI_SITEOPS does NOT own drawing/document intelligence (that is LARI_DRAFTING)
 * - No autonomous compliance claim or legal determination
 * - No autonomous schedule or map mutation
 * - All outputs flow through existing evidence truth-state model
 * - Insurance/risk emphasis remains observational, not legal-final
 * - Visibility limits propagate through enriched outputs
 * - Unknowns and review-required states remain visible
 *
 * @see src/lib/constants/domain-awareness.ts
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  CONFIDENCE_BANDS,
  INSPECTION_DOMAIN_CLASSES,
  VISIBILITY_STATES,
  type ConfidenceBand,
  type InspectionDomainClass,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Zod Input Schema
// ---------------------------------------------------------------------------

export const LARISiteopsInputSchema = z.object({
  requestId: z.string(),
  mediaAssetId: z.string(),
  inspectionId: z.string(),
  analysisRequestedBy: z.string(),
  analysisRequestedAt: z.string(),
  mediaDataUri: z.string()
    .describe('A data URI of the field media to analyze for site/industrial/safety context.'),
  mediaMimeType: z.string(),
  activeDomain: z.enum(INSPECTION_DOMAIN_CLASSES)
    .describe('Active inspection domain class from Pass 1 scene interrogation.'),
  scenePosture: z.enum(['interior', 'exterior', 'mixed', 'indeterminate']).optional(),
  analysisContext: z.string().optional()
    .describe('Human-provided context about site conditions, industrial process, or safety context.'),
  /** Base pass observations from LARI_EVIDENCE to enrich (not duplicate) */
  baseObservations: z.array(z.string()).optional()
    .describe('Observations from LARI_EVIDENCE base passes to enrich with domain-specific context.'),
});

export type LARISiteopsInput = z.infer<typeof LARISiteopsInputSchema>;

// ---------------------------------------------------------------------------
// Zod Output Schema
// ---------------------------------------------------------------------------

const SiteopsObservationSchema = z.object({
  observation: z.string()
    .describe('Deterministic observation — direct language only.'),
  category: z.enum([
    'equipment_posture', 'piping_valve', 'corrosion_leak',
    'barrier_guard', 'weld_structural', 'access_egress',
    'debris_housekeeping', 'barricade_staging', 'weather_exposure',
    'ppe_presence', 'fall_hazard', 'blocked_exit',
    'unsafe_zone', 'signage_control', 'condition_documentation',
    'loss_risk_indicator', 'readiness_affecting', 'general_site_state',
  ]),
  severity: z.enum(['critical', 'warning', 'info', 'observation_only']),
  confidence: z.enum(CONFIDENCE_BANDS),
});

const SiteopsIdentificationSchema = z.object({
  identification: z.string()
    .describe('Probabilistic identification — confidence-qualified language.'),
  category: z.string(),
  confidence: z.enum(CONFIDENCE_BANDS),
  confidenceScore: z.number().min(0).max(1).optional(),
});

const SiteopsVisibilityLimitSchema = z.object({
  targetDescription: z.string(),
  visibilityState: z.enum(VISIBILITY_STATES),
  cause: z.enum(['physical_obstruction', 'lighting', 'angle', 'weather', 'equipment', 'ppe', 'unknown']),
});

export const LARISiteopsOutputSchema = z.object({
  requestId: z.string(),

  // --- Domain Classification Enrichment ---
  enrichedDomain: z.enum(INSPECTION_DOMAIN_CLASSES)
    .describe('Refined domain classification after site/industrial/safety analysis.'),
  domainConfidence: z.enum(CONFIDENCE_BANDS),

  // --- Industrial Equipment Posture ---
  industrialEquipment: z.object({
    equipmentObserved: z.boolean(),
    equipmentObservations: z.array(SiteopsObservationSchema),
    equipmentIdentifications: z.array(SiteopsIdentificationSchema),
  }),

  // --- Site State Assessment ---
  siteState: z.object({
    accessEgressAssessed: z.boolean(),
    accessObservations: z.array(SiteopsObservationSchema),
    debrisHousekeeping: z.array(SiteopsObservationSchema),
    barricadeStaging: z.array(SiteopsObservationSchema),
    weatherExposure: z.array(SiteopsObservationSchema),
    readinessAffecting: z.array(SiteopsObservationSchema),
  }),

  // --- Safety Posture ---
  safetyPosture: z.object({
    safetyAssessed: z.boolean(),
    ppeObservations: z.array(SiteopsObservationSchema),
    fallHazards: z.array(SiteopsObservationSchema),
    blockedExits: z.array(SiteopsObservationSchema),
    unsafeZones: z.array(SiteopsObservationSchema),
    signageControl: z.array(SiteopsObservationSchema),
  }),

  // --- Insurance / Risk Emphasis ---
  insuranceEmphasis: z.object({
    conditionDocumentation: z.array(SiteopsObservationSchema),
    lossRiskIndicators: z.array(SiteopsObservationSchema),
    claimSupportPosture: z.enum(['strong_evidence', 'partial_evidence', 'insufficient_evidence', 'not_applicable']),
  }),

  // --- Visibility Limits (domain-specific) ---
  domainVisibilityLimits: z.array(SiteopsVisibilityLimitSchema),

  // --- Unknowns ---
  unresolvedElements: z.array(z.object({
    description: z.string(),
    reason: z.enum(['too_small', 'occluded', 'unfamiliar_class', 'insufficient_detail', 'lighting']),
  })),

  // --- Review Posture ---
  reviewRecommended: z.boolean(),
  reviewReasons: z.array(z.string()),

  // --- Confidence ---
  overallConfidence: z.enum(CONFIDENCE_BANDS),

  // --- Self-reporting ---
  selfReportedLimitations: z.array(z.string()),
  analysisSummary: z.string(),
});

export type LARISiteopsOutput = z.infer<typeof LARISiteopsOutputSchema>;

// ---------------------------------------------------------------------------
// Prompt Definition
// ---------------------------------------------------------------------------

const lariSiteopsPrompt = ai.definePrompt({
  name: 'lariSiteopsPrompt',
  input: { schema: LARISiteopsInputSchema },
  output: { schema: LARISiteopsOutputSchema },
  prompt: `You are LARI_SITEOPS, a bounded site/industrial/safety orchestration engine within the
SCINGULAR Inspections Recognition Stack. You are NOT an executive authority. Your output is
bounded reasoning that enriches field evidence with domain-specific intelligence.

CRITICAL POSTURE RULES:
1. OBSERVATION vs IDENTIFICATION: Observed site conditions are deterministic ("Loose debris
   visible on walkway"). Identifications are probabilistic ("Pattern consistent with possible
   tripping hazard").
2. DOMAIN SEPARATION: You handle site/industrial/safety/insurance context. You do NOT handle
   drawing/document intelligence (that is LARI_DRAFTING).
3. SAFETY EMPHASIS: PPE absence/presence, fall hazards, blocked exits, unsafe zones, and
   warning signage failures are high-priority observations.
4. INDUSTRIAL EMPHASIS: Equipment posture, piping/valve conditions, corrosion, leaks, barriers,
   welds, and structural concerns are domain-specific observations.
5. INSURANCE/RISK: Condition documentation and loss/risk indicators are observational and
   evidentiary — NEVER legal-final.
6. VISIBILITY LIMITS: If equipment, PPE, weather, or obstruction limits visibility, report
   it explicitly. Visibility limits must propagate through all assessments.
7. DO NOT make autonomous compliance claims, design approvals, or legal determinations.
8. DO NOT mutate schedules, map events, or downstream systems.

Active Domain: {{activeDomain}}
{{#if scenePosture}}- Scene Posture: {{scenePosture}}{{/if}}
{{#if analysisContext}}- Analysis Context: {{analysisContext}}{{/if}}
{{#if baseObservations}}- Base Observations: {{baseObservations}}{{/if}}

Request: {{requestId}}
Requested By: {{analysisRequestedBy}} at {{analysisRequestedAt}}

Media to analyze:
{{media url=mediaDataUri mimeType=mediaMimeType}}

Analyze this field media for site/industrial/safety/insurance domain intelligence.
Return your complete domain analysis in the specified JSON format.`,
});

// ---------------------------------------------------------------------------
// Flow Definition
// ---------------------------------------------------------------------------

const lariSiteopsFlow = ai.defineFlow(
  {
    name: 'lariSiteopsFlow',
    inputSchema: LARISiteopsInputSchema,
    outputSchema: LARISiteopsOutputSchema,
  },
  async (input) => {
    const { output } = await lariSiteopsPrompt(input);
    return output!;
  }
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Invokes the LARI_SITEOPS bounded engine for site/industrial/safety domain analysis.
 *
 * HARD RULES:
 * - Only call when activeDomain is industrial, site, safety, or insurance
 * - Caller must verify analysis was explicitly requested
 * - Output enriches existing evidence — does not replace base analysis
 * - No autonomous compliance, schedule, or map mutation
 *
 * @param input - Fully populated LARISiteopsInput with domain context
 * @returns Bounded domain intelligence output
 */
export async function invokeSiteopsAnalysis(
  input: LARISiteopsInput
): Promise<LARISiteopsOutput> {
  return await lariSiteopsFlow(input);
}
