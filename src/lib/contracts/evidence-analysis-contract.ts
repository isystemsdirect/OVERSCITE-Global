/**
 * @fileOverview Evidence Analysis Contract
 * @domain Inspections / Field Intelligence
 * @canonical true
 * @phase Phase 1 — Foundation
 *
 * Governs the full evidence analysis lifecycle for media assets within the
 * OVERSCITE Inspections Recognition Stack.
 *
 * This contract defines:
 *   - The analysis request payload (explicit, attributable, auditable)
 *   - The analysis result envelope (multi-pass output)
 *   - The verification request and result (governed path required)
 *   - The evidence review queue entry (for Evidence mode UI)
 *
 * HARD RULES (Selective Analysis Doctrine):
 * - Accepted images are stored and usable by default; NOT auto-analyzed
 * - Analysis is explicit and attributable — requestedBy + requestedAt required
 * - Verification cannot precede analysis completion and governed binding
 * - No silent background fan-out analysis
 * - Analysis request is auditable
 *
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import type {
  MediaAnalysisState,
  RecognitionPassId,
  ConfidenceBand,
  InspectionDomainClass,
} from '../constants/recognition-truth-states';

import type {
  InspectionRecognitionPacket,
  PacketAuditRef,
} from './recognition-stack-contract';

// ---------------------------------------------------------------------------
// Analysis Request
// ---------------------------------------------------------------------------

/**
 * Explicit, attributable analysis request payload.
 * Every analysis invocation must produce a request record.
 *
 * HARD RULE: requestedBy and requestedAt are mandatory — anonymous or implicit
 * analysis requests are not permitted.
 */
export interface AnalysisRequestPayload {
  /** Unique ID for this request */
  requestId: string;
  /** Media asset to analyze */
  mediaAssetId: string;
  /** Associated inspection */
  inspectionId: string;
  /** User ID or authorized system actor that explicitly requested analysis */
  requestedBy: string;
  /** When the request was made (ISO 8601) */
  requestedAt: string;
  /** Passes to execute — if empty, defaults to full 10-pass stack */
  requestedPasses?: RecognitionPassId[];
  /** Domain context hint to optimize pass selection */
  domainHint?: InspectionDomainClass;
  /** Whether this is a re-analysis request (prior packet exists) */
  isReanalysis: boolean;
  /** Prior packet ID if re-analysis */
  priorPacketId?: string;
  /** Human-provided context to improve pass accuracy */
  analysisContext?: string;
  /** Tier that governs depth of analysis */
  analysisTier: AnalysisTier;
}

/**
 * Analysis tier governs the depth and specialization of recognition passes.
 * Baseline tier includes broad recognition; premium tiers increase depth.
 *
 * HARD RULE: Standard tier provides real baseline recognition — not a crippled toy-pass.
 * Subscription tiers scale depth, specialization, and automation — not existence.
 */
export type AnalysisTier = 'standard' | 'premium' | 'enterprise';

/** Which passes are activated per tier */
export const TIER_PASS_ACTIVATION: Record<AnalysisTier, RecognitionPassId[]> = {
  standard: [
    'pass_1_scene',
    'pass_2_object',
    'pass_3_living_entity',
    'pass_4_target_component',
    'pass_5_pest_bio',
    'pass_6_occlusion',
    'pass_7_condition_anomaly',
    'pass_10_truth_state',
  ],
  premium: [
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
  ],
  enterprise: [
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
  ],
};

// ---------------------------------------------------------------------------
// Analysis Result Envelope
// ---------------------------------------------------------------------------

/**
 * The output envelope returned by the recognition stack after completing analysis.
 * This is the typed contract between the recognition engine and downstream consumers.
 */
export interface AnalysisResultEnvelope {
  /** The analysis request this envelope satisfies */
  requestId: string;
  /** The recognition packet produced by this analysis */
  recognitionPacket: InspectionRecognitionPacket;
  /** Whether all requested passes completed successfully */
  allPassesComplete: boolean;
  /** Passes that failed or were skipped with reasons */
  incompletePassReasons: IncompletePassReason[];
  /** Overall assessment of result quality */
  resultQuality: 'high' | 'acceptable' | 'degraded' | 'insufficient';
  /** Time taken to complete analysis (milliseconds) */
  analysisLatencyMs: number;
  /** Estimated token and compute consumption (for monitoring) */
  computeConsumption: ComputeConsumption;
  /** When this envelope was produced (ISO 8601) */
  producedAt: string;
}

export interface IncompletePassReason {
  passId: RecognitionPassId;
  status: 'failed' | 'skipped';
  reason: string;
}

/** Compute consumption record for monitoring and tier enforcement */
export interface ComputeConsumption {
  /** Estimated input tokens consumed */
  inputTokensEstimate: number;
  /** Estimated output tokens produced */
  outputTokensEstimate: number;
  /** Passes that consumed tokens, with per-pass estimates */
  byPass: Partial<Record<RecognitionPassId, number>>;
}

// ---------------------------------------------------------------------------
// Verification Request & Result
// ---------------------------------------------------------------------------

/**
 * Verification request — the explicit human-authority step to advance a
 * recognition packet from analysis_complete → verified_by_overscite.
 *
 * HARD RULE: Verification cannot precede analysis completion.
 * BANE must gate this transition and record the human authority decision.
 */
export interface VerificationRequest {
  /** Unique ID for this verification request */
  verificationRequestId: string;
  /** Recognition packet to verify */
  recognitionPacketId: string;
  /** Media asset being verified */
  mediaAssetId: string;
  /** Inspection associated */
  inspectionId: string;
  /** Human reviewer making the verification */
  requestedBy: string;
  /** When verification was requested (ISO 8601) */
  requestedAt: string;
  /** Reviewer's assessment notes */
  reviewerNotes?: string;
  /** Whether the reviewer accepts the packet's findings as-is */
  acceptFindings: boolean;
  /** Finding IDs the reviewer is contesting (if any) */
  contestedFindingIds: string[];
  /** Human authority determination — populated only by human reviewer */
  humanDetermination?: string;
}

/** Result of a verification request */
export interface VerificationResult {
  /** The verification request this satisfies */
  verificationRequestId: string;
  /** Outcome of BANE policy evaluation */
  baneDecision: 'allowed' | 'denied' | 'escalated';
  /** Reason for denial or escalation if applicable */
  baneReasonCode?: string;
  /** Final verification state assigned */
  assignedState: MediaAnalysisState;
  /** BANE policy reference for audit */
  banePolicyRef: string;
  /** When verification was completed (ISO 8601) */
  completedAt: string;
  /** Audit reference for this transition */
  auditRef: PacketAuditRef;
}

// ---------------------------------------------------------------------------
// Evidence Review Queue Entry (for Evidence Mode UI)
// ---------------------------------------------------------------------------

/**
 * Entry in the Evidence review queue.
 * Used by Evidence mode to render the analysis state for each media asset
 * in an inspection, including unanalyzed assets.
 *
 * HARD RULE: Accepted but unanalyzed media must appear with
 * 'accepted_unanalyzed' state — never imply analysis completion.
 */
export interface EvidenceReviewQueueEntry {
  /** Queue entry ID */
  queueEntryId: string;
  /** Media asset */
  mediaAssetId: string;
  /** Thumbnail URL for display */
  thumbnailUrl?: string;
  /** Asset type */
  assetType: 'photo' | 'video_frame' | 'drawing' | 'lidar_scan' | 'document';
  /** Current analysis state */
  mediaAnalysisState: MediaAnalysisState;
  /** Domain classification (null if unanalyzed) */
  domainClass?: InspectionDomainClass;
  /** Overall confidence (null if unanalyzed) */
  overallConfidence?: ConfidenceBand;
  /** Number of findings (null if unanalyzed) */
  findingsCount?: number;
  /** Whether this asset has living entity occlusion noted */
  hasLivingEntityOcclusion: boolean;
  /** Whether this asset has pest evidence noted */
  hasPestEvidence: boolean;
  /** Whether this asset has unresolved unknowns */
  hasUnresolvedUnknowns: boolean;
  /** Whether this asset has visibility limitations */
  hasVisibilityLimitations: boolean;
  /** Whether this asset is a drawing/document */
  isDrawingArtifact: boolean;
  /** Drafting state if applicable */
  draftingState?: string;
  /** Associated recognition packet ID (null if unanalyzed) */
  recognitionPacketId?: string;
  /** When this entry was last updated (ISO 8601) */
  updatedAt: string;
  /** Priority signal for review ordering */
  reviewPriority: 'urgent' | 'normal' | 'low' | 'none';
}

/**
 * Persistence-layer record for the analysis state of a media asset.
 * Tracks the progression from unanalyzed → requested → in_progress → complete → verified.
 */
export interface EvidenceAnalysisState {
  /** collection primary key, typically nanoid() */
  stateId: string;
  /** Link to original media asset */
  mediaAssetId: string;
  /** Link to parent inspection */
  inspectionId: string;
  /** Current state in the Lifecycle Machine */
  mediaState: MediaAnalysisState;
  /** Linked recognition packet (populated at analysis_complete) */
  currentPacketId?: string;
  /** Alias for currentPacketId for recognition-stack contract parity */
  recognitionPacketId?: string;
  /** Linked analysis request ID */
  currentRequestId?: string;
  /** Engine ID used for analysis (if in_progress or complete) */
  currentEngineId?: string;
  /** Overall confidence of the analysis results */
  overallConfidence?: ConfidenceBand;
  /** When this state record was created */
  createdAt: string;
  /** When this state record was last updated */
  updatedAt?: string;
  /** Who explicitly requested analysis */
  analysisRequestedBy?: string;
  /** When analysis was requested */
  analysisRequestedAt?: string;
  /** Reason if review is required */
  reviewRequiredReason?: string;
  /** Who explicitly verified the analysis */
  verifiedBy?: string;
  /** When verification occurred */
  verifiedAt?: string;
  /** Audit version of the state contract */
  __v: string;
  /** Canonical truth marker */
  __canonical: boolean;
}

// ---------------------------------------------------------------------------
// LARI_EVIDENCE Engine Input/Output Contracts
// ---------------------------------------------------------------------------

/**
 * Input to the LARI_EVIDENCE bounded engine.
 * LARI_EVIDENCE orchestrates evidence truth-state handling,
 * media review, and analysis/verification transition control.
 */
export interface LARIEvidenceInput {
  /** The analysis request triggering this engine invocation */
  analysisRequest: AnalysisRequestPayload;
  /** Media data URI or storage reference for the asset */
  mediaDataUri: string;
  /** MIME type of the media */
  mediaMimeType: string;
  /** Prior context from the inspection (for grounding) */
  inspectionContext: EvidenceInspectionContext;
}

/** Minimal inspection context passed to LARI_EVIDENCE for grounding */
export interface EvidenceInspectionContext {
  inspectionId: string;
  inspectionTitle?: string;
  propertyAddress?: string;
  domainHint?: InspectionDomainClass;
  priorFindingsSummary?: string;
}

/**
 * Output from the LARI_EVIDENCE bounded engine.
 * Engine output is bounded reasoning — not executive authority.
 * Human review and BANE gating govern all consequential transitions.
 */
export interface LARIEvidenceOutput {
  /** The analysis request this output satisfies */
  requestId: string;
  /** Resulting recognition packet state (pre-BANE gating) */
  proposedPacket: InspectionRecognitionPacket;
  /** Whether the engine recommends human review */
  reviewRecommended: boolean;
  /** Engine-generated summary of the analysis */
  analysisSummary: string;
  /** Whether the engine detected that it may have missed content */
  selfReportedLimitations: string[];
  /** Compute consumption for monitoring */
  computeConsumption: ComputeConsumption;
}
