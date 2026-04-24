/**
 * @fileOverview Recognition Contracts — OVERSCITE™ Phase 3 Preparation
 * @domain Inspections / Recognition
 * @canonical true
 * @status SEED / ARCHITECTURAL_PREP
 * 
 * Foundational contracts for field-specific recognition and defect typing.
 * Every defect identified by LARI or a Human Inspector must eventually 
 * map to these domain-bounded profiles.
 * 
 * [UxCB]-[2]
 */

/**
 * Initial 10 Field Families for governed recognition.
 * Prevents "generic" cross-field defect logic.
 */
export type FieldFamily =
  | 'roofing'
  | 'exterior-envelope'
  | 'interior-condition'
  | 'moisture-leak'
  | 'hvac'
  | 'electrical'
  | 'plumbing'
  | 'structural'
  | 'forensic-photo-doc'
  | 'environment-safety';

/**
 * Defect Type Profile.
 * Defines the signature and evidence requirements for a specific defect family.
 */
export interface DefectTypeProfile {
  fieldId: FieldFamily;
  defectTypeId: string;
  defectName: string;
  defectCategory: 'critical' | 'priority' | 'maintenance' | 'informational';
  
  /** Visual indicators that trigger recognition */
  observedIndicators: string[];
  
  /** Types of evidence required to confirm this defect */
  supportingEvidencePatterns: string[];
  
  /** Evidence that explicitly contradicts this defect type */
  contradictingEvidencePatterns: string[];
  
  /** Minimum confidence threshold for auto-flagging */
  confidenceConstraints: {
    minConfidence: number;
    requireHumanReview: boolean;
  };
  
  /** Severity levels (0-1.0) and their qualitative descriptions */
  severityBands: Record<string, { min: number; max: number; label: string }>;
  
  /** Rules for escalation (e.g., call Director, notify tenant) */
  escalationRules: string[];
  
  /** Instructions for report mapping */
  reportMapping: {
    sectionId: string;
    labelTemplate: string;
    descriptionTemplate: string;
  };
}

/**
 * Recognition Profile.
 * Governs the LARI recognition engine behavior for a specific field.
 */
export interface RecognitionProfile {
  fieldId: FieldFamily;
  
  /** Primary systems or components to target for recognition */
  recognitionTargets: string[];
  
  /** Required sensor inputs (e.g., Thermal + RGB) */
  requiredInputs: string[];
  
  /** Mathematical or visual signal patterns for this domain */
  signalPatterns: string[];
  
  /** Conditions that disqualify recognition in this field */
  disqualifiers: string[];
  
  /** Known domain-specific risks */
  risks: {
    falsePositiveRisks: string[];
    falseNegativeRisks: string[];
  };
  
  /** Specific prompts for human oversight review */
  humanReviewTriggers: string[];
}

/**
 * Note: These contracts are for Phase 3 architecture preparation.
 * No live recognition engines are implemented using these types in Phase 2.
 */
