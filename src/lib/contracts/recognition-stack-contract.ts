/**
 * @fileOverview SCINGULAR Recognition Stack Contract
 * @domain Inspections / Field Intelligence
 * @canonical true
 * @phase Phase 1 — Foundation
 *
 * Defines the core typed contracts governing the 11-layer Recognition Stack
 * that powers SCINGULAR Inspections as the unified field-intelligence division.
 *
 * HARD BOUNDARIES:
 * - Engines are bounded reasoning units; they do not self-authorize conclusions.
 * - Analysis is explicit and attributable; no silent background fan-out.
 * - Observation and identification are distinct layers; never collapse them.
 * - BANE governs every consequential mutation via policy gate before state transition.
 *
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import type {
  MediaAnalysisState,
  RecognitionState,
  DraftingState,
  InspectionDomainClass,
  VisibilityState,
  ConfidenceBand,
  RecognitionPassId,
} from '../constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// Taxonomy Version
// ---------------------------------------------------------------------------

/** Pinned taxonomy version for audit lineage. Updated only via ArcHive™ governance. */
export interface RecognitionTaxonomyVersion {
  /** e.g. "1.0.0" */
  version: string;
  /** ISO 8601 timestamp of when this taxonomy version was published */
  publishedAt: string;
  /** ArcHive™ proposal ID that authorized this version */
  arcHiveProposalId: string;
}

// ---------------------------------------------------------------------------
// Recognition Pass Result
// ---------------------------------------------------------------------------

/**
 * The typed output of a single named recognition pass.
 * Each pass interrogates the scene for a specific class of information.
 * Passes may not silently erase prior uncertainty.
 */
export interface RecognitionPassResult {
  /** The canonical pass identifier */
  passId: RecognitionPassId;
  /** ISO 8601 start of pass execution */
  executedAt: string;
  /** Engine(s) that participated in this pass */
  enginesUsed: string[];
  /** Deterministic observations made during this pass — direct language only */
  observations: string[];
  /** Probabilistic candidates identified — may use 'possible', 'likely', confidence-qualified language */
  candidates: RecognitionCandidate[];
  /** Objects or regions for which visibility was too limited to classify */
  unknowns: UnknownElement[];
  /** Visibility constraints discovered during this pass */
  visibilityLimits: VisibilityLimit[];
  /** Overall confidence output of this pass */
  passConfidenceBand: ConfidenceBand;
  /** Whether this pass completed successfully or was partial/failed */
  passStatus: 'complete' | 'partial' | 'failed' | 'skipped';
  /** Human-readable diagnostics if partial or failed */
  diagnosticNote?: string;
}

// ---------------------------------------------------------------------------
// Scene Context Profile (Layer 1)
// ---------------------------------------------------------------------------

/**
 * Output of Pass 1 — scene interrogation.
 * Determines domain posture and broad environmental context.
 */
export interface SceneContextProfile {
  /** Primary domain classification for this scene */
  domainClass: InspectionDomainClass;
  /** Interior or exterior determination */
  scenePosture: 'interior' | 'exterior' | 'mixed' | 'indeterminate';
  /** Named room, zone, system, or process area if detected */
  contextLabel?: string;
  /** Overall luminosity and imaging quality signal */
  imagingQuality: 'good' | 'degraded' | 'poor' | 'unusable';
  /** Whether this is a drawing/document image rather than a field photo */
  isDrawingArtifact: boolean;
  /** Confidence in the domain and scene posture determination */
  contextConfidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Living Entity Presence (Layer 3)
// ---------------------------------------------------------------------------

/** Class of a detected living entity */
export type LivingEntityClass =
  | 'human_adult'
  | 'human_child'
  | 'service_animal'
  | 'domestic_pet'
  | 'wildlife'
  | 'vegetation'
  | 'indeterminate_living';

/**
 * Output of Pass 3 — living entity recognition.
 * Humans, animals, vegetation, and occupancy-sensitive entities.
 */
export interface LivingEntityPresence {
  entityClass: LivingEntityClass;
  /** Whether this entity partially or fully occludes an inspection target */
  causesOcclusion: boolean;
  /** Region of the image where this entity was detected (normalized 0–1 fractions) */
  regionHint?: BoundingRegion;
  /** Confidence of entity detection */
  confidence: ConfidenceBand;
  /** If causing occlusion, what target area is affected */
  occlusionTargetHint?: string;
}

// ---------------------------------------------------------------------------
// Pest Evidence Record (Layer 5)
// ---------------------------------------------------------------------------

/** Sub-categories of pest or biological condition evidence */
export type PestEvidenceClass =
  | 'pest_droppings'
  | 'pest_frass'
  | 'mud_tubes'
  | 'webbing'
  | 'nest'
  | 'chew_pattern'
  | 'infestation_signature'
  | 'mold_growth'
  | 'organic_intrusion'
  | 'bio_staining'
  | 'indeterminate_bio_evidence';

/**
 * Output of Pass 5 — pest and bio-condition recognition.
 * Infestation indicators, organic intrusion, and related damage patterns.
 */
export interface PestEvidenceRecord {
  evidenceClass: PestEvidenceClass;
  /** Deterministic observation of the physical evidence */
  observedCondition: string;
  /** Probabilistic identification of the likely pest or bio agent */
  suspectedAgent?: string;
  regionHint?: BoundingRegion;
  confidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Occlusion Map (Layer 7)
// ---------------------------------------------------------------------------

/**
 * Output of Pass 6 — occlusion and visibility recognition.
 * Documents blocked, partially visible, and non-visible regions.
 * Occlusion results MUST propagate into downstream confidence.
 */
export interface OcclusionMap {
  /** Regions of the scene with visibility constraints */
  occludedRegions: VisibilityLimit[];
  /** Whether occlusion is caused by a living entity */
  livingEntityOcclusion: boolean;
  /** Whether occlusion is caused by a physical obstruction */
  physicalObstruction: boolean;
  /** Overall visibility score for the image (0–1) */
  overallVisibilityScore: number;
  /** Human-readable summary of visibility constraints */
  visibilitySummary: string;
}

/** A single region with constrained visibility */
export interface VisibilityLimit {
  /** What is occluded or visibility-limited */
  targetDescription: string;
  /** State of visibility for this target */
  visibilityState: VisibilityState;
  /** Cause of limited visibility */
  cause: 'living_entity' | 'physical_obstruction' | 'lighting' | 'angle' | 'damage' | 'unknown';
  regionHint?: BoundingRegion;
}

// ---------------------------------------------------------------------------
// Drafting Artifact Profile (Layer 8)
// ---------------------------------------------------------------------------

/** Type of drawing or design artifact */
export type DrawingType =
  | 'architectural'
  | 'structural'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'site_plan'
  | 'detail_sheet'
  | 'schematic'
  | 'mep_sheet'
  | 'assembly_drawing'
  | 'indeterminate_drawing';

/**
 * Output of Pass 8 — drawing/document structure recognition.
 * Supported reference classes: architectural, structural, MEP, site plans, schematics, markups.
 *
 * HARD RULE: Drafting pass may NOT claim authoritative CAD/BIM fidelity without
 * a validated source path (e.g., verified file-format extraction).
 * Field-photo interpretation of drawings is always confidence-qualified.
 */
export interface DraftingArtifactProfile {
  /** Whether a drawing/document structure was detected at all */
  drawingDetected: boolean;
  /** Detected drawing type */
  drawingType?: DrawingType;
  /** Drafting recognition state */
  draftingState: DraftingState;
  /** Detected sheet structure elements */
  sheetStructure?: DrawingSheetStructure;
  /** Overall confidence of drafting interpretation */
  interpretationConfidence: ConfidenceBand;
  /**
   * IMPORTANT: This is field-image interpretation only.
   * Claims of CAD/BIM fidelity require validated source path.
   */
  fidelityWarning: 'field_photo_interpretation' | 'validated_source';
}

/** Structure of a detected drawing sheet */
export interface DrawingSheetStructure {
  /** Whether a title block was detected */
  titleBlockDetected: boolean;
  /** Extracted title block fields (best-effort, confidence-qualified) */
  titleBlockFields?: Partial<{
    projectName: string;
    sheetNumber: string;
    revisionMarker: string;
    drawnBy: string;
    checkedBy: string;
    scale: string;
    date: string;
  }>;
  /** Number of detected symbol instances */
  symbolCount?: number;
  /** Whether dimension annotations were detected */
  dimensionsDetected: boolean;
  /** Whether notes/callouts were detected */
  notesDetected: boolean;
  /** Whether revision clouds or delta markers were detected */
  revisionsDetected: boolean;
}

/** Binding of recognized drawing content to a standard or code */
export interface EngineeringReferenceBinding {
  /** The standard referenced (e.g. "ANSI Y14.5", "IBC 2021") */
  standardId: string;
  /** Human-readable name */
  standardName: string;
  /** Clause or section referenced */
  clauseRef?: string;
  /** How this binding was determined */
  bindingBasis: 'symbol_match' | 'note_text' | 'title_block' | 'context_inference';
  confidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Recognition Candidate
// ---------------------------------------------------------------------------

/** A probabilistically identified candidate in a recognition pass. */
export interface RecognitionCandidate {
  /** Human-readable label for the candidate */
  label: string;
  /** Specific classification within the domain taxonomy */
  taxonomyClass?: string;
  /** Confidence of this identification */
  confidence: ConfidenceBand;
  /** Numeric confidence score (0–1) when available */
  confidenceScore?: number;
  regionHint?: BoundingRegion;
}

/** An element that was detected as present but could not be classified */
export interface UnknownElement {
  /** Where in the scene this unknown was detected */
  regionHint?: BoundingRegion;
  /** Why classification failed */
  reason: 'too_small' | 'occluded' | 'unfamiliar_class' | 'insufficient_detail' | 'lighting';
  /** Any partial observation that could be made */
  partialObservation?: string;
}

/** Normalized bounding region (0–1 fractions of image dimensions) */
export interface BoundingRegion {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

// ---------------------------------------------------------------------------
// Evidence Analysis State
// ---------------------------------------------------------------------------

/**
 * Full evidence analysis state for a single media asset.
 * Governs the lifecycle from SRT ingestion to human-verified finding.
 *
 * HARD RULE: Verification cannot precede analysis completion and governed binding.
 * The state machine enforces this sequencing.
 */
export interface EvidenceAnalysisState {
  /** Unique identifier for this analysis state record */
  stateId: string;
  /** Associated media asset */
  mediaAssetId: string;
  /** Associated inspection */
  inspectionId: string;
  /** Current state in the analysis lifecycle */
  mediaState: MediaAnalysisState;
  /** Who explicitly requested analysis (required for analysis_requested state) */
  analysisRequestedBy?: string;
  /** When analysis was requested (ISO 8601) */
  analysisRequestedAt?: string;
  /** When analysis completed (ISO 8601) */
  analysisCompletedAt?: string;
  /** Who performed or triggered verification */
  verifiedBy?: string;
  /** When verification occurred (ISO 8601) */
  verifiedAt?: string;
  /** Associated recognition packet ID, set when analysis completes */
  recognitionPacketId?: string;
  /** Reason if review is required */
  reviewRequiredReason?: string;
}

// ---------------------------------------------------------------------------
// Inspection Recognition Packet (Master Record)
// ---------------------------------------------------------------------------

/**
 * The master recognition record for a single analyzed media asset.
 * Every recognition packet is auditable and attributable.
 *
 * HARD RULES:
 * - packetId is immutable after creation
 * - auditRefs must be populated before any state transition
 * - verificationState may not advance to 'verified_by_SCINGULAR' without
 *   a completed governed analysis path
 */
export interface InspectionRecognitionPacket {
  /** Immutable unique identifier for this recognition packet */
  readonly packetId: string;
  /** Associated inspection record */
  inspectionId: string;
  /** Associated project */
  projectId: string;
  /** Associated site */
  siteId: string;
  /** The media asset this packet analyzes */
  mediaAssetId: string;
  /** Domain classification assigned by Pass 1 */
  domainClass: InspectionDomainClass;
  /** Who explicitly requested analysis */
  analysisRequestedBy: string;
  /** When analysis was explicitly requested (ISO 8601) */
  analysisRequestedAt: string;
  /** Taxonomy version in use at time of analysis */
  taxonomyVersion: string;
  /** When this packet was created (ISO 8601) */
  createdAt: string;
  /** When this packet was last updated (ISO 8601) */
  updatedAt: string;

  // --- Pass Results ---
  /** Results from each named recognition pass, keyed by passId */
  passResults: Partial<Record<RecognitionPassId, RecognitionPassResult>>;
  /** Scene context determined by Pass 1 */
  sceneContext?: SceneContextProfile;
  /** Living entity presences detected by Pass 3 */
  livingEntities: LivingEntityPresence[];
  /** Pest evidence records detected by Pass 5 */
  pestEvidence: PestEvidenceRecord[];
  /** Occlusion map from Pass 6 */
  occlusionMap?: OcclusionMap;
  /** Drafting artifact profile from Pass 8 (if applicable) */
  draftingArtifact?: DraftingArtifactProfile;
  /** Engineering reference bindings from Pass 9 */
  engineeringRefs: EngineeringReferenceBinding[];

  // --- Truth State Assembly (Pass 10) ---
  /** Deterministic observations — direct language, no probabilistic claims */
  observedFindings: string[];
  /** Probabilistic identification candidates — confidence-qualified */
  identifiedCandidates: RecognitionCandidate[];
  /** Elements present but not classifiable */
  unknowns: UnknownElement[];
  /** Visibility constraints affecting the assessment */
  visibilityLimits: VisibilityLimit[];
  /** Overall confidence profile for the packet */
  confidenceProfile: PacketConfidenceProfile;
  /** Current recognition state */
  recognitionState: RecognitionState;
  /** Verification state — must not be 'verified_by_SCINGULAR' without governed path */
  verificationState: MediaAnalysisState;
  /** Human review posture */
  reviewPosture: 'no_review_required' | 'review_recommended' | 'review_required' | 'review_in_progress' | 'review_complete';

  // --- Audit Lineage ---
  /** Ordered list of audit references for all state transitions on this packet */
  auditRefs: PacketAuditRef[];
}

/** Confidence profile summarizing the packet's overall analytical quality */
export interface PacketConfidenceProfile {
  /** Overall confidence band for the packet */
  overall: ConfidenceBand;
  /** Per-pass confidence signals */
  byPass: Partial<Record<RecognitionPassId, ConfidenceBand>>;
  /** Whether occlusion materially degraded confidence */
  occlusionImpact: boolean;
  /** Whether unknown elements remain after all passes */
  unresolvedUnknowns: boolean;
  /** Whether drafting interpretation is partial */
  draftingPartial: boolean;
}

/** An immutable audit reference for a state transition on a recognition packet */
export interface PacketAuditRef {
  /** When this transition occurred (ISO 8601) */
  timestamp: string;
  /** The actor (user ID or engine ID) that triggered the transition */
  actorId: string;
  /** Type of actor */
  actorType: 'human' | 'engine' | 'bane_gate';
  /** The action that occurred */
  action: string;
  /** Previous state */
  fromState?: string;
  /** New state */
  toState?: string;
  /** BANE policy decision reference if applicable */
  banePolicyRef?: string;
}
