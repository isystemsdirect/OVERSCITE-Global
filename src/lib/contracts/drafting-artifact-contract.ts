/**
 * @fileOverview Drafting Artifact Contract
 * @domain Inspections / Field Intelligence / Drafting & Design Intelligence
 * @canonical true
 * @phase Phase 1 — Foundation (LARI_DRAFTING engine in Phase 4)
 *
 * Defines the contracts governing the recognition and interpretation of
 * drawing/document artifacts within the Inspections Recognition Stack.
 *
 * Drafting and design engineering artifact recognition is a first-class
 * governed intelligence class. These contracts ensure structured artifact
 * handling rather than freeform prompt text.
 *
 * Supported reference classes:
 *   Architectural | Structural | MEP | Site Plans | Schematics | Detail Sheets
 *   Markups | Revision Artifacts | Drawing-to-Field Comparison Readiness
 *
 * HARD RULES:
 * - Drafting intelligence must bind to standards, not freeform guessing
 * - Partial-read states must not masquerade as complete interpretation
 * - CAD/BIM fidelity claims require validated source path; field-photo
 *   interpretation is always confidence-qualified
 * - GD&T and precision geometry must be modeled as structured artifacts
 *
 * @see src/lib/contracts/recognition-stack-contract.ts (DraftingArtifactProfile)
 * @see docs/architecture/DRAFTING_AND_DESIGN_INTELLIGENCE.md
 */

import type { ConfidenceBand, DraftingState } from '../constants/recognition-truth-states';
import type { BoundingRegion, EngineeringReferenceBinding } from './recognition-stack-contract';

// ---------------------------------------------------------------------------
// Drawing Symbol Detection
// ---------------------------------------------------------------------------

/** Categories of drawing symbols that may be recognized */
export type SymbolCategory =
  | 'architectural_annotation'
  | 'structural_member'
  | 'mep_device'
  | 'elevation_marker'
  | 'section_cut'
  | 'detail_reference'
  | 'north_arrow'
  | 'grid_line_marker'
  | 'revision_cloud'
  | 'gdt_feature_control_frame'
  | 'weld_symbol'
  | 'surface_finish_symbol'
  | 'datum_identifier'
  | 'tolerance_indicator'
  | 'door_swing'
  | 'window_type_tag'
  | 'room_tag'
  | 'equipment_tag'
  | 'unknown_symbol';

/** A detected symbol within a drawing */
export interface DetectedSymbol {
  /** Category of the detected symbol */
  symbolCategory: SymbolCategory;
  /** Specific symbol type within the category (best-effort from taxonomy) */
  symbolType?: string;
  /** Region where symbol was detected */
  regionHint?: BoundingRegion;
  /** Associated text or tag value extracted near the symbol */
  associatedText?: string;
  /** Confidence in symbol identification */
  confidence: ConfidenceBand;
  /** Whether this symbol type is recognized from the active symbol library */
  inActiveLibrary: boolean;
}

// ---------------------------------------------------------------------------
// Dimension & Annotation Extraction
// ---------------------------------------------------------------------------

/** A detected dimension annotation in a drawing */
export interface DrawingDimension {
  /** The raw dimension text as detected (e.g. "3'-6\"", "42mm", "Ø25 ±0.05") */
  rawText: string;
  /** Parsed numeric value if extractable */
  numericValue?: number;
  /** Detected unit */
  unit?: 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'ft_in' | 'unknown';
  /** Whether a tolerance was detected alongside the dimension */
  hasTolerance: boolean;
  /** Tolerance text if detected */
  toleranceText?: string;
  /** Dimension type */
  dimensionType?: 'linear' | 'angular' | 'radial' | 'diameter' | 'coordinate' | 'elevation';
  regionHint?: BoundingRegion;
  confidence: ConfidenceBand;
}

/** A detected text note or callout in a drawing */
export interface DrawingNote {
  /** Raw text content of the note */
  rawText: string;
  /** Whether this appears to be a specification note */
  isSpecNote: boolean;
  /** Whether this references an external standard or code */
  referencesStandard: boolean;
  /** Referenced standard text if detectable */
  standardRef?: string;
  regionHint?: BoundingRegion;
  confidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// GD&T Profile (Geometric Dimensioning & Tolerancing)
// ---------------------------------------------------------------------------

/**
 * GD&T feature control frame detection.
 * GD&T and precision geometry intelligence are first-class governed domain stacks
 * and must be modeled as structured artifacts, not loose prose.
 *
 * HARD RULE: GD&T interpretation must remain confidence-qualified.
 * Complete GD&T parsing requires LARI_DRAFTING Phase 4 activation.
 */
export interface GDTFeatureControlFrame {
  /** The geometric characteristic symbol detected */
  characteristicSymbol: string;
  /** Raw tolerance value text */
  toleranceValueText?: string;
  /** Datum references detected */
  datumRefs: string[];
  /** Material condition modifier if detected (MMC/LMC/RFS) */
  materialConditionModifier?: 'mmc' | 'lmc' | 'rfs';
  regionHint?: BoundingRegion;
  confidence: ConfidenceBand;
  /** Interpretation is confidence-qualified until LARI_DRAFTING Phase 4 */
  interpretationNote: string;
}

/** Summary of GD&T content detected in a drawing */
export interface GDTProfile {
  /** Whether any GD&T feature control frames were detected */
  frameDetected: boolean;
  /** Detected feature control frames */
  frames: GDTFeatureControlFrame[];
  /** Whether datum identifiers were detected */
  datumsDetected: boolean;
  /** Detected datum labels */
  datumLabels: string[];
  /** Overall GD&T recognition confidence */
  overallConfidence: ConfidenceBand;
}

// ---------------------------------------------------------------------------
// Drawing-to-Field Comparison Readiness
// ---------------------------------------------------------------------------

/**
 * Assessment of whether a detected drawing is suitable for field comparison.
 * Field comparison means cross-referencing the drawing against a field inspection photo.
 * LARI_DRAFTING (Phase 4) enables active comparison; this contract tracks readiness.
 */
export interface DrawingFieldComparisonReadiness {
  /** Whether this drawing has sufficient legibility for field comparison */
  isReadyForComparison: boolean;
  /** Readiness score (0–1) */
  readinessScore: number;
  /** Reasons limiting readiness */
  limitingFactors: DrawingComparisonLimitingFactor[];
  /** Sheet number if identified (for cross-referencing) */
  sheetNumber?: string;
  /** Revision level if identified */
  revisionLevel?: string;
  /** Drawing scale if identified */
  scale?: string;
}

export type DrawingComparisonLimitingFactor =
  | 'poor_image_quality'
  | 'partial_view'
  | 'glare_or_reflection'
  | 'folded_or_obscured'
  | 'small_scale_detail_unreadable'
  | 'revision_state_unknown'
  | 'no_title_block'
  | 'multiple_overlapping_drawings';

// ---------------------------------------------------------------------------
// Full Drafting Analysis Record (Master Record per Drawing Asset)
// ---------------------------------------------------------------------------

/**
 * Complete drafting intelligence record for a single analyzed drawing/document asset.
 * Populated by Pass 8 (Drafting & Design Intelligence) and optionally enriched
 * by LARI_DRAFTING (Phase 4).
 */
export interface DraftingAnalysisRecord {
  /** Unique record identifier */
  recordId: string;
  /** Associated media asset or document page */
  mediaAssetId: string;
  /** Associated inspection */
  inspectionId: string;
  /** Associated recognition packet */
  recognitionPacketId: string;

  // --- Document-Level Results ---
  /** Whether a drawing structure was detected */
  drawingDetected: boolean;
  /** Drafting state from Pass 8 */
  draftingState: DraftingState;
  /** Drawing type identified */
  drawingType?: string;
  /**
   * Fidelity warning: all field-photo interpretations are confidence-qualified.
   * Only 'validated_source' may claim higher fidelity.
   */
  fidelityWarning: 'field_photo_interpretation' | 'validated_source';

  // --- Symbol & Annotation Detection ---
  detectedSymbols: DetectedSymbol[];
  detectedDimensions: DrawingDimension[];
  detectedNotes: DrawingNote[];

  // --- GD&T (if applicable) ---
  gdtProfile?: GDTProfile;

  // --- Standards Binding ---
  engineeringRefs: EngineeringReferenceBinding[];

  // --- Field Comparison Readiness ---
  fieldComparisonReadiness: DrawingFieldComparisonReadiness;

  // --- Confidence ---
  /** Overall interpretation confidence for this drawing */
  overallConfidence: ConfidenceBand;

  // --- Timestamps ---
  /** When this record was produced (ISO 8601) */
  analyzedAt: string;
  /** Engine that produced this record */
  producedByEngine: string;
}
