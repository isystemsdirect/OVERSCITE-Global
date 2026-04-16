/**
 * @fileOverview Inspection Finding Contract — Recognition Stack Extension
 * @domain Inspections / Field Intelligence
 * @canonical true
 * @phase Phase 1 — Foundation
 *
 * Defines the extended Finding contract that enforces the three-layer truth
 * structure required by the Recognition Stack:
 *
 *   Layer 1 — Observed Condition   (deterministic, direct language)
 *   Layer 2 — System Identification (probabilistic, confidence-qualified)
 *   Layer 3 — Human Assessment      (reserved for human authority or approved workflow)
 *
 * This contract is additive to and compatible with the existing `Finding`
 * type in `src/lib/types.ts`. It extends that surface with recognition-stack
 * required fields without breaking existing code paths.
 *
 * HARD RULES:
 * - observedCondition and systemIdentification must never be collapsed
 * - humanAssessment is reserved for human authority; engines may not populate it
 * - verified status requires a completed governed verification path
 * - visibilityState must always be present
 *
 * @see src/lib/types.ts (base Finding type)
 * @see src/lib/contracts/recognition-stack-contract.ts
 * @see docs/architecture/INSPECTIONS_RECOGNITION_STACK.md
 */

import type {
  VisibilityState,
  ConfidenceBand,
  InspectionDomainClass,
  MediaAnalysisState,
} from '../constants/recognition-truth-states';

import type {
  PacketAuditRef,
  BoundingRegion,
} from './recognition-stack-contract';

// ---------------------------------------------------------------------------
// Extended Finding Contract
// ---------------------------------------------------------------------------

/**
 * Recognition-stack-compliant inspection finding.
 * Enforces the three-layer truth structure and full evidence lineage.
 *
 * Compatible with `Finding` from `src/lib/types.ts` — this is a strict superset.
 * Components should use this type when the finding was produced by the recognition stack.
 */
export interface RecognitionFinding {
  /** Unique finding identifier */
  findingId: string;
  /** Parent inspection */
  inspectionId: string;
  /** The recognition packet this finding originates from */
  recognitionPacketId: string;
  /** The specific pass that produced the primary evidence for this finding */
  sourcePassId: string;
  /** The engine(s) that contributed to this finding */
  enginesContributing: string[];

  // --- Three-Layer Truth Structure ---

  /**
   * Layer 1: Deterministic observation of what is physically present.
   * Use direct, factual language only. No probabilistic claims.
   * Example: "Dark staining visible on northeast corner of ceiling surface."
   */
  observedCondition: string;

  /**
   * Layer 2: Probabilistic identification of what the observed condition likely is.
   * May use 'possible', 'likely', 'consistent with', etc.
   * Must be qualified with confidence band.
   * Example: "Pattern consistent with possible water intrusion from above — moderate confidence."
   */
  systemIdentification: string;

  /**
   * Layer 3: RESERVED for human authority or an explicitly approved workflow.
   * Engines must NOT populate this field. Leave empty until human reviews.
   * Example: "Inspector confirmed active roof leak at flashing junction — corrective action required."
   */
  humanAssessment?: string;

  // --- Evidence & Media ---

  /** References to media assets that support this finding */
  evidenceRefs: EvidenceRef[];
  /** Bounding region within the source image (if applicable) */
  regionHint?: BoundingRegion;

  // --- Visibility & Confidence ---

  /**
   * Visibility state for the subject of this finding.
   * HARD RULE: This field must always be present — empty visibility state is not permitted.
   */
  visibilityState: VisibilityState;

  /** Overall confidence band for this finding */
  confidenceBand: ConfidenceBand;

  /** Numeric confidence score (0–1) when available from the engine */
  confidenceScore?: number;

  // --- Classification ---

  /** Severity of the finding — human authority may override engine assessment */
  severity: FindingSeverity;

  /** Domain classification for this finding */
  domainTag: InspectionDomainClass;

  /** Structured finding category within the domain taxonomy */
  findingCategory?: FindingCategory;

  // --- State ---

  /** Current analysis state for the associated media */
  mediaAnalysisState: MediaAnalysisState;

  /** Whether this finding is awaiting or has received human review */
  reviewStatus: FindingReviewStatus;

  // --- Timestamps & Audit ---

  /** When this finding was created (ISO 8601) */
  createdAt: string;
  /** When this finding was last updated (ISO 8601) */
  updatedAt: string;
  /** Audit trail for all transitions on this finding */
  auditRefs: PacketAuditRef[];
}

// ---------------------------------------------------------------------------
// Supporting Types
// ---------------------------------------------------------------------------

/** Reference to a piece of evidence supporting a finding */
export interface EvidenceRef {
  /** ID of the referenced media asset */
  mediaAssetId: string;
  /** ID of the recognition packet that produced the analysis */
  recognitionPacketId?: string;
  /** Type of evidence referenced */
  evidenceType: 'photo' | 'video_frame' | 'drawing' | 'lidar_scan' | 'document';
  /** Optional annotation or note about how this evidence supports the finding */
  annotation?: string;
}

/** Severity levels for inspection findings */
export const FINDING_SEVERITIES = [
  'critical',
  'high',
  'medium',
  'low',
  'informational',
  'review_required',
] as const;

export type FindingSeverity = typeof FINDING_SEVERITIES[number];

/** Review status for a finding */
export const FINDING_REVIEW_STATUSES = [
  'awaiting_review',
  'in_review',
  'reviewed_accepted',
  'reviewed_contested',
  'reviewed_dismissed',
] as const;

export type FindingReviewStatus = typeof FINDING_REVIEW_STATUSES[number];

/**
 * Structured finding category within a domain taxonomy.
 * Categories are governed by the Recognition Taxonomy Registry in ArcHive™.
 */
export interface FindingCategory {
  /** Top-level category ID from the active taxonomy */
  categoryId: string;
  /** Human-readable category name */
  categoryName: string;
  /** Sub-category ID if applicable */
  subCategoryId?: string;
  /** Sub-category name if applicable */
  subCategoryName?: string;
  /** Taxonomy version from which this category was resolved */
  taxonomyVersion: string;
}

// ---------------------------------------------------------------------------
// Finding Aggregation Summary (for Evidence UI surface)
// ---------------------------------------------------------------------------

/**
 * Summary aggregation of all findings from a single recognition packet.
 * Used by the Evidence mode UI to render the truth-state overview panel.
 */
export interface PacketFindingsSummary {
  /** Recognition packet this summary belongs to */
  recognitionPacketId: string;
  /** Total number of findings in this packet */
  totalFindings: number;
  /** Findings by severity */
  bySeverity: Record<FindingSeverity, number>;
  /** Findings by confidence band */
  byConfidence: Record<ConfidenceBand, number>;
  /** Whether any living entity occlusion was detected */
  hasLivingEntityOcclusion: boolean;
  /** Whether any pest evidence was detected */
  hasPestEvidence: boolean;
  /** Whether any unknown elements remain unresolved */
  hasUnresolvedUnknowns: boolean;
  /** Whether drafting artifacts were found and their interpretation is partial */
  hasDraftingPartialRead: boolean;
  /** Overall review posture for this packet's findings */
  reviewPosture: 'no_review_required' | 'review_recommended' | 'review_required';
}
