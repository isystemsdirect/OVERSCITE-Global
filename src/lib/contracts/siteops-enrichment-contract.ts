/**
 * @fileOverview SiteOps Domain Enrichment Contract
 * @domain Inspections / Field Intelligence / Site-State Intelligence
 * @canonical true
 * @phase Phase 4 — Domain Intelligence Activation
 *
 * Defines typed contracts for LARI_SITEOPS domain enrichment outputs
 * that extend the base recognition packet with industrial/site/safety/insurance
 * domain-specific intelligence.
 *
 * HARD RULES:
 * - All enriched outputs remain observational/identification-supporting, not legal-final
 * - Visibility limits propagate through enriched outputs
 * - Unknowns and review-required states remain visible
 * - Insurance/risk emphasis is evidentiary, not compliance-final
 * - No domain enrichment may hide base recognition truth-state
 *
 * @see src/ai/flows/lari-siteops.ts
 * @see src/lib/constants/domain-awareness.ts
 */

import type { ConfidenceBand, InspectionDomainClass, VisibilityState } from '../constants/recognition-truth-states';

// ---------------------------------------------------------------------------
// SiteOps Observation Categories
// ---------------------------------------------------------------------------

export type SiteopsObservationCategory =
  | 'equipment_posture'
  | 'piping_valve'
  | 'corrosion_leak'
  | 'barrier_guard'
  | 'weld_structural'
  | 'access_egress'
  | 'debris_housekeeping'
  | 'barricade_staging'
  | 'weather_exposure'
  | 'ppe_presence'
  | 'fall_hazard'
  | 'blocked_exit'
  | 'unsafe_zone'
  | 'signage_control'
  | 'condition_documentation'
  | 'loss_risk_indicator'
  | 'readiness_affecting'
  | 'general_site_state';

export type SiteopsObservationSeverity = 'critical' | 'warning' | 'info' | 'observation_only';

// ---------------------------------------------------------------------------
// SiteOps Domain Observation
// ---------------------------------------------------------------------------

export interface SiteopsObservation {
  observation: string;
  category: SiteopsObservationCategory;
  severity: SiteopsObservationSeverity;
  confidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// SiteOps Domain Identification
// ---------------------------------------------------------------------------

export interface SiteopsIdentification {
  identification: string;
  category: string;
  confidence: ConfidenceBand;
  confidenceScore?: number;
}

// ---------------------------------------------------------------------------
// SiteOps Domain Visibility Limit
// ---------------------------------------------------------------------------

export interface SiteopsVisibilityLimit {
  targetDescription: string;
  visibilityState: VisibilityState;
  cause: 'physical_obstruction' | 'lighting' | 'angle' | 'weather' | 'equipment' | 'ppe' | 'unknown';
}

// ---------------------------------------------------------------------------
// SiteOps Domain Enrichment Record
// ---------------------------------------------------------------------------

/**
 * Complete LARI_SITEOPS enrichment record for a single analyzed media asset.
 * Stored alongside the base RecognitionPacket and linked via packetId.
 */
export interface SiteopsEnrichmentRecord {
  /** Unique enrichment record identifier */
  enrichmentId: string;
  /** Associated recognition packet */
  recognitionPacketId: string;
  /** Associated media asset */
  mediaAssetId: string;
  /** Associated inspection */
  inspectionId: string;

  // --- Domain Classification ---
  /** Refined domain classification after enrichment */
  enrichedDomain: InspectionDomainClass;
  domainConfidence: ConfidenceBand;

  // --- Industrial Equipment ---
  industrialEquipment: {
    equipmentObserved: boolean;
    observations: SiteopsObservation[];
    identifications: SiteopsIdentification[];
  };

  // --- Site State ---
  siteState: {
    accessEgressAssessed: boolean;
    accessObservations: SiteopsObservation[];
    debrisHousekeeping: SiteopsObservation[];
    barricadeStaging: SiteopsObservation[];
    weatherExposure: SiteopsObservation[];
    readinessAffecting: SiteopsObservation[];
  };

  // --- Safety Posture ---
  safetyPosture: {
    safetyAssessed: boolean;
    ppeObservations: SiteopsObservation[];
    fallHazards: SiteopsObservation[];
    blockedExits: SiteopsObservation[];
    unsafeZones: SiteopsObservation[];
    signageControl: SiteopsObservation[];
  };

  // --- Insurance / Risk ---
  insuranceEmphasis: {
    conditionDocumentation: SiteopsObservation[];
    lossRiskIndicators: SiteopsObservation[];
    claimSupportPosture: 'strong_evidence' | 'partial_evidence' | 'insufficient_evidence' | 'not_applicable';
  };

  // --- Visibility ---
  domainVisibilityLimits: SiteopsVisibilityLimit[];

  // --- Unknowns ---
  unresolvedElements: {
    description: string;
    reason: 'too_small' | 'occluded' | 'unfamiliar_class' | 'insufficient_detail' | 'lighting';
  }[];

  // --- Review Posture ---
  reviewRecommended: boolean;
  reviewReasons: string[];

  // --- Confidence ---
  overallConfidence: ConfidenceBand;

  // --- Engine Attribution ---
  producedByEngine: string;
  producedAt: string;
}

// ---------------------------------------------------------------------------
// Insurance Claim-Support Posture
// ---------------------------------------------------------------------------

export type InsuranceClaimSupportPosture =
  | 'strong_evidence'
  | 'partial_evidence'
  | 'insufficient_evidence'
  | 'not_applicable';

// ---------------------------------------------------------------------------
// Drawing-to-Field Comparison Readiness
// ---------------------------------------------------------------------------

/**
 * Links a drafting artifact profile to inspection evidence targets for
 * drawing-to-field comparison.
 *
 * HARD RULES:
 * - Readiness is NOT full discrepancy adjudication
 * - No autonomous final mismatch claim
 * - Comparison hints remain attributable and reviewable
 */
export interface DrawingToFieldComparisonLink {
  /** Drawing asset identifier */
  drawingAssetId: string;
  /** Field evidence asset identifier */
  fieldAssetId: string;
  /** Inspection associated */
  inspectionId: string;
  /** Sheet number from drawing (for cross-referencing) */
  sheetNumber?: string;
  /** Drawing revision level (for version alignment) */
  revisionLevel?: string;
  /** Whether comparison is ready (readiness, not result) */
  comparisonReady: boolean;
  /** Readiness score (0–1) */
  readinessScore: number;
  /** Limiting factors affecting comparison */
  limitingFactors: string[];
  /** Human-provided reference tags linking specific drawing areas to field observations */
  referenceTags: DrawingFieldReferenceTag[];
  /** Comparison posture — advisory only */
  comparisonPosture: 'ready' | 'partial_readiness' | 'not_ready';
  /** Created timestamp */
  createdAt: string;
  /** Attribution */
  createdBy: string;
}

export interface DrawingFieldReferenceTag {
  /** Tag identifier */
  tagId: string;
  /** Drawing-side label or reference (e.g., "Detail A/S-2") */
  drawingRef: string;
  /** Field-side observation summary */
  fieldObservation: string;
  /** Whether the field observation aligns with the drawing reference */
  alignmentPosture: 'aligned' | 'discrepancy_hint' | 'insufficient_data' | 'not_assessed';
  /** Confidence of alignment assessment */
  confidence: ConfidenceBand;
  /** Advisory flag — not final adjudication */
  advisory: true;
}
