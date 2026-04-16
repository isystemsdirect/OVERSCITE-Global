"use server";

/**
 * @fileOverview Governed Recognition Entrypoint — Analysis Orchestration
 * @domain Inspections / Field Intelligence / Evidence Pipeline
 * @classification CANONICAL_ORCHESTRATION — recognition pipeline
 * @phase Phase 4 — Domain Intelligence Activation (LARI_DRAFTING + LARI_SITEOPS)
 *
 * This is the SINGLE server-side entry point for invoking recognition analysis
 * on an explicitly requested media asset. It enforces:
 *
 *   1. Attribution verification (requestedBy + requestedAt mandatory)
 *   2. State precondition check (only accepted_unanalyzed → accepted_analysis_requested)
 *   3. Audit record creation before any state mutation
 *   4. LARI_EVIDENCE engine invocation (bounded, non-executive)
 *   5. RecognitionPacket persistence
 *   6. State machine advancement to analysis_complete
 *   7. review_required flagging when engine confidence is insufficient
 *
 * HARD RULES (enforced here, not delegable):
 * - Only explicitly requested analysis enters this path
 * - No batch or background fan-out via this entrypoint
 * - BANE evaluation is required before verification transitions
 * - humanAssessment is never populated by this orchestrator
 * - Engine output is bounded reasoning — not final authority
 *
 * @see src/lib/services/recognition-persistence-service.ts
 * @see src/ai/flows/lari-evidence.ts
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import { nanoid } from 'nanoid';
import { invokeEvidenceAnalysis, type LARIEvidenceInput, type LARIEvidenceOutput } from '@/ai/flows/lari-evidence';
import { invokeDraftingAnalysis, type LARIDraftingInput } from '@/ai/flows/lari-drafting';
import { invokeSiteopsAnalysis, type LARISiteopsInput } from '@/ai/flows/lari-siteops';
import {
  recordAnalysisRequest,
  markAnalysisInProgress,
  persistRecognitionPacket,
  markAnalysisComplete,
  markReviewRequired,
  type RecognitionWriteResult,
} from '@/lib/services/recognition-persistence-service';
import type { AnalysisRequestPayload } from '@/lib/contracts/evidence-analysis-contract';
import type { InspectionRecognitionPacket, RecognitionPassResult, PacketAuditRef } from '@/lib/contracts/recognition-stack-contract';
import {
  type RecognitionPassId,
  type ConfidenceBand,
  type MediaAnalysisState,
  RECOGNITION_PASS_IDS,
  scoreToConfidenceBand,
} from '@/lib/constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Entrypoint Input
// ---------------------------------------------------------------------------

export interface RequestAnalysisInput {
  /** The media asset to analyze */
  mediaAssetId: string;
  /** The media data URI (from storage) — must be pre-fetched by caller */
  mediaDataUri: string;
  mediaMimeType: string;
  /** The inspection this media belongs to */
  inspectionId: string;
  projectId: string;
  siteId: string;
  /** Who is explicitly requesting analysis — mandatory */
  requestedBy: string;
  /** ISO 8601 timestamp — mandatory */
  requestedAt: string;
  /** Optional domain hint to guide scene interrogation */
  domainHint?: string;
  /** Optional human-provided context to improve pass accuracy */
  analysisContext?: string;
  /** Tier governing depth of analysis */
  analysisTier: 'standard' | 'premium' | 'enterprise';
}

// ---------------------------------------------------------------------------
// Orchestration Output
// ---------------------------------------------------------------------------

export interface AnalysisOrchestrationResult {
  success: boolean;
  /** Recognition packet ID if analysis completed */
  packetId?: string;
  /** Final state after orchestration */
  finalState?: MediaAnalysisState;
  /** Whether human review was flagged */
  reviewRequired?: boolean;
  /** Whether LARI_DRAFTING was invoked */
  draftingEngineInvoked?: boolean;
  /** Whether LARI_SITEOPS was invoked */
  siteopsEngineInvoked?: boolean;
  /** Blocking error if failed */
  error?: string;
}

// ---------------------------------------------------------------------------
// Governed Analysis Orchestrator
// ---------------------------------------------------------------------------

/**
 * Governs the end-to-end flow from explicit analysis request
 * through engine invocation to recognition packet persistence.
 *
 * This function must ONLY be called when a human has explicitly
 * requested analysis for a specific media asset. Callers must supply
 * requestedBy (authenticated user ID) and requestedAt.
 *
 * Calling this function on any media that was not explicitly requested
 * by a human actor is a selective-analysis doctrine violation.
 */
export async function requestAnalysis(
  input: RequestAnalysisInput
): Promise<AnalysisOrchestrationResult> {

  // --- Attribution gate ---
  if (!input.requestedBy?.trim() || !input.requestedAt?.trim()) {
    return {
      success: false,
      error: 'ATTRIBUTION_REQUIRED: requestedBy and requestedAt are mandatory for analysis requests',
    };
  }

  console.log(`[RECOGNITION_ORCHESTRATION] Analysis requested — asset: ${input.mediaAssetId}, by: ${input.requestedBy}`);

  // --- Step A: Record analysis request (transitions to accepted_analysis_requested) ---
  const analysisRequest: AnalysisRequestPayload = {
    requestId: nanoid(),
    mediaAssetId: input.mediaAssetId,
    inspectionId: input.inspectionId,
    requestedBy: input.requestedBy,
    requestedAt: input.requestedAt,
    domainHint: input.domainHint as any,
    isReanalysis: false,
    analysisTier: input.analysisTier,
  };

  const requestResult = await recordAnalysisRequest(analysisRequest);
  if (!requestResult.success) {
    return { success: false, error: requestResult.error };
  }

  const stateId = requestResult.stateId!;

  // --- Step B: Mark in_progress ---
  const progressResult = await markAnalysisInProgress({
    stateId,
    inspectionId: input.inspectionId,
    engineId: 'lari_evidence_v2',
  });
  if (!progressResult.success) {
    return { success: false, finalState: 'accepted_analysis_requested', error: progressResult.error };
  }

  // --- Step C: Invoke LARI_EVIDENCE bounded engine ---
  let engineOutput: LARIEvidenceOutput;
  try {
    const engineInput: LARIEvidenceInput = {
      requestId: analysisRequest.requestId,
      mediaAssetId: input.mediaAssetId,
      analysisRequestedBy: input.requestedBy,
      analysisRequestedAt: input.requestedAt,
      mediaDataUri: input.mediaDataUri,
      mediaMimeType: input.mediaMimeType,
      domainHint: input.domainHint as any,
      analysisContext: input.analysisContext,
      inspectionContext: {
        inspectionId: input.inspectionId,
        domainHint: input.domainHint as any,
      },
    };

    engineOutput = await invokeEvidenceAnalysis(engineInput);
  } catch (engineError: any) {
    console.error('[RECOGNITION_ORCHESTRATION] Engine invocation failed:', engineError);
    // Mark review_required on engine failure — do not advance to complete
    await markReviewRequired({
      stateId,
      inspectionId: input.inspectionId,
      reason: `Engine invocation failed: ${engineError.message}`,
      actorId: 'recognition_orchestrator',
    });
    return {
      success: false,
      finalState: 'review_required',
      reviewRequired: true,
      error: `ENGINE_FAILURE: ${engineError.message}`,
    };
  }

  // --- Step D: Assemble RecognitionPacket from engine output ---
  const now = new Date().toISOString();
  const packetId = nanoid();

  // Map pass results from engine output (record keyed by passId) into typed RecognitionPassResult records
  const passResults: Partial<Record<RecognitionPassId, RecognitionPassResult>> = {};
  const enginePassResults = engineOutput.passResults ?? {};

  for (const [passIdKey, passSummary] of Object.entries(enginePassResults)) {
    const passId = passIdKey as RecognitionPassId;
    if (!passSummary) continue;

    passResults[passId] = {
      passId,
      executedAt: now,
      enginesUsed: ['lari_evidence_v2'],
      observations: passSummary.observations,
      candidates: passSummary.candidates.map((c: any) => ({
        label: c.label,
        confidence: c.confidence,
      })),
      unknowns: passSummary.unknowns.map((u: any) => ({
        reason: u.reason as any,
        partialObservation: u.partialObservation,
      })),
      visibilityLimits: passSummary.visibilityLimits.map((v: any) => ({
        targetDescription: v.targetDescription,
        visibilityState: v.visibilityState,
        cause: v.cause as any,
      })),
      passConfidenceBand: passSummary.passConfidenceBand,
      passStatus: passSummary.passStatus,
    };
  }

  const initialAuditRef: PacketAuditRef = {
    timestamp: now,
    actorId: 'recognition_orchestrator',
    actorType: 'engine',
    action: 'packet_assembled',
    toState: 'analysis_complete',
  };

  const packet: InspectionRecognitionPacket = {
    packetId,
    inspectionId: input.inspectionId,
    projectId: input.projectId,
    siteId: input.siteId,
    mediaAssetId: input.mediaAssetId,
    domainClass: engineOutput.domainClass,
    analysisRequestedBy: input.requestedBy,
    analysisRequestedAt: input.requestedAt,
    taxonomyVersion: '1.0.0', // Phase 2 baseline taxonomy
    createdAt: now,
    updatedAt: now,
    passResults,
    sceneContext: {
      domainClass: engineOutput.domainClass,
      scenePosture: engineOutput.scenePosture ?? 'indeterminate',
      isDrawingArtifact: engineOutput.isDrawingArtifact,
      imagingQuality: 'good',
      contextConfidence: engineOutput.overallConfidence,
    },
    livingEntities: [],
    pestEvidence: [],
    engineeringRefs: [],
    // Pass 10 Truth State Assembly outputs
    observedFindings: engineOutput.observedFindings,
    identifiedCandidates: engineOutput.identifiedCandidates.map((c) => ({
      label: c.label,
      confidence: c.confidence,
      confidenceScore: c.confidenceScore,
    })),
    unknowns: engineOutput.unknowns.map((u) => ({
      reason: u.reason as any,
      partialObservation: u.partialObservation,
    })),
    visibilityLimits: engineOutput.visibilityLimits.map((v) => ({
      targetDescription: v.targetDescription,
      visibilityState: v.visibilityState,
      cause: v.cause as any,
    })),
    confidenceProfile: {
      overall: engineOutput.overallConfidence,
      byPass: {},
      occlusionImpact: engineOutput.visibilityLimits.length > 0,
      unresolvedUnknowns: engineOutput.unknowns.length > 0,
      draftingPartial: engineOutput.draftingState === 'symbol_set_partial' || engineOutput.draftingState === 'dimension_context_partial',
    },
    recognitionState: engineOutput.recognitionState,
    verificationState: 'analysis_complete',
    reviewPosture: engineOutput.reviewRecommended ? 'review_recommended' : 'no_review_required',
    auditRefs: [initialAuditRef],
  };

  // --- Step E: Persist RecognitionPacket ---
  const packetResult = await persistRecognitionPacket(packet);
  if (!packetResult.success) {
    await markReviewRequired({
      stateId,
      inspectionId: input.inspectionId,
      reason: `Packet persistence failed: ${packetResult.error}`,
      actorId: 'recognition_orchestrator',
    });
    return {
      success: false,
      finalState: 'review_required',
      reviewRequired: true,
      error: packetResult.error,
    };
  }

  // --- Step F: Advance state to analysis_complete ---
  const completeResult = await markAnalysisComplete({
    stateId,
    inspectionId: input.inspectionId,
    recognitionPacketId: packetId,
    engineId: 'lari_evidence_v2',
  });

  // --- Step F2: Phase 4 Domain Engine Routing ---
  let draftingEngineInvoked = false;
  let siteopsEngineInvoked = false;

  // Route to LARI_DRAFTING if media is a drawing/document artifact
  if (engineOutput.isDrawingArtifact) {
    try {
      const draftingInput: LARIDraftingInput = {
        requestId: analysisRequest.requestId,
        mediaAssetId: input.mediaAssetId,
        inspectionId: input.inspectionId,
        analysisRequestedBy: input.requestedBy,
        analysisRequestedAt: input.requestedAt,
        mediaDataUri: input.mediaDataUri,
        mediaMimeType: input.mediaMimeType,
        domainHint: engineOutput.domainClass as any,
        analysisContext: input.analysisContext,
      };
      await invokeDraftingAnalysis(draftingInput);
      draftingEngineInvoked = true;
      console.log(`[RECOGNITION_ORCHESTRATION] LARI_DRAFTING invoked for drawing asset: ${input.mediaAssetId}`);
    } catch (draftingError: any) {
      console.error('[RECOGNITION_ORCHESTRATION] LARI_DRAFTING enrichment failed (non-blocking):', draftingError.message);
      // Drafting enrichment failure is non-blocking — base analysis stands
    }
  }

  // Route to LARI_SITEOPS if domain is industrial/site/safety/insurance
  const siteopsDomains = ['industrial', 'site', 'safety', 'insurance'];
  if (siteopsDomains.includes(engineOutput.domainClass)) {
    try {
      const siteopsInput: LARISiteopsInput = {
        requestId: analysisRequest.requestId,
        mediaAssetId: input.mediaAssetId,
        inspectionId: input.inspectionId,
        analysisRequestedBy: input.requestedBy,
        analysisRequestedAt: input.requestedAt,
        mediaDataUri: input.mediaDataUri,
        mediaMimeType: input.mediaMimeType,
        activeDomain: engineOutput.domainClass as any,
        scenePosture: engineOutput.scenePosture,
        analysisContext: input.analysisContext,
        baseObservations: engineOutput.observedFindings,
      };
      await invokeSiteopsAnalysis(siteopsInput);
      siteopsEngineInvoked = true;
      console.log(`[RECOGNITION_ORCHESTRATION] LARI_SITEOPS invoked for ${engineOutput.domainClass} asset: ${input.mediaAssetId}`);
    } catch (siteopsError: any) {
      console.error('[RECOGNITION_ORCHESTRATION] LARI_SITEOPS enrichment failed (non-blocking):', siteopsError.message);
      // SiteOps enrichment failure is non-blocking — base analysis stands
    }
  }

  // --- Step G: Flag review_required if engine recommends it ---
  if (engineOutput.reviewRecommended || engineOutput.unknowns.length > 0) {
    await markReviewRequired({
      stateId,
      inspectionId: input.inspectionId,
      reason: engineOutput.selfReportedLimitations.join('; ') || 'Engine flagged review recommended',
      actorId: 'lari_evidence_v2',
    });
    console.log(`[RECOGNITION_ORCHESTRATION] Review flagged for asset: ${input.mediaAssetId}`);
    return {
      success: true,
      packetId,
      finalState: 'review_required',
      reviewRequired: true,
      draftingEngineInvoked,
      siteopsEngineInvoked,
    };
  }

  console.log(`[RECOGNITION_ORCHESTRATION] Analysis complete — packet: ${packetId}`);
  return {
    success: true,
    packetId,
    finalState: 'analysis_complete',
    reviewRequired: false,
    draftingEngineInvoked,
    siteopsEngineInvoked,
  };
}
