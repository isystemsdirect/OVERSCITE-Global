/**
 * @fileOverview Inspection Methodology Contracts — OVERSCITE™ Methodology Stack
 * @domain Inspections / Methodology
 * @canonical true
 * @status Phase 1 Implementation
 *
 * Defines the core interfaces for the governed inspection methodology stack.
 * Every supported inspection must map to a canonical InspectionMethod object.
 */

import type { InspectionDomainClass } from '@/lib/constants/recognition-truth-states';

/**
 * Unique Identifier for an Inspection Method.
 * Strict literal type to prevent runtime drift.
 */
export type MethodID =
  | 'general-property'
  | 'roof-inspection'
  | 'exterior-envelope'
  | 'interior-condition'
  | 'moisture-leak'
  | 'drone-exterior-survey'
  | 'environment-safety'
  | 'forensic-photo-doc';

/** Valid method version string (SemVer-compatible) */
export type MethodVersion = string;

/**
 * Canonical Inspection Method Pack.
 * Binds phases, evidence, templates, and guidance into one object.
 */
export interface InspectionMethod {
  methodId: MethodID;
  methodName: string;
  methodClass: InspectionDomainClass;
  version: MethodVersion;
  purpose: string;
  useCases: string[];
  requiredTools: string[];
  /** Standard phases this method must progress through */
  workflowPhases: MethodPhase[];
  /** Specific evidence that must be captured */
  requiredEvidence: EvidenceRequirement[];
  /** Binding to DocuSCRIBE templates */
  templateBindings: TemplateBinding[];
  /** QA acceptance criteria for this method outcome */
  qaAcceptanceCriteria: QA_AcceptanceProfile;
  /** Bounded analysis profile for LARI support */
  analysisProfile: AnalysisProfile;
  /** Execution validity profile (Inhibitors/Blockers) */
  blockerProfile: BlockerProfile;
  /** SmartSCHEDULER™ Integration */
  schedulingConstraints: MethodSchedulingConstraints;
  /** Scing guidance hooks for phase-aware assistance */
  guidanceHooks: GuidanceScript[];
  /** Rules for truth-state handling in this method */
  truthStateRules?: Record<string, any>;
  /** Protected sections that must not be removed from templates */
  protectedSections: string[];
  /** Phase 1: Governed Workflow Graph */
  workflowGraph?: MethodGraph;
}

/**
 * Node Classification for Graph Execution.
 */
export type MethodNodeClass = 
  | 'intake' 
  | 'setup' 
  | 'capture' 
  | 'analysis' 
  | 'verification' 
  | 'decision_gate' 
  | 'report_binding' 
  | 'completion';

/**
 * Deterministic State of a Method Node.
 */
export type MethodNodeState = 
  | 'not_started' 
  | 'ready' 
  | 'in_progress' 
  | 'completed' 
  | 'blocked' 
  | 'skipped_by_rule' 
  | 'failed';

/**
 * Machine-readable reason for blocked or restricted states.
 */
export type MethodBlockReasonCode =
  | 'prerequisite_incomplete'
  | 'environmental_constraint'
  | 'required_evidence_missing'
  | 'human_review_required'
  | 'resource_unavailable'
  | 'method_policy_restriction';

/**
 * Edge Semantics for Workflow Branching.
 */
export type MethodEdgeType = 
  | 'hard_dependency'   // Prevents downstream activation until complete
  | 'soft_dependency'   // Warns/flags but permits activation
  | 'parallel_branch'   // Explicit fork into concurrent paths
  | 'conditional_branch' // Path opens/closes based on data/truth-state
  | 'completion_gate';   // Mandatory for phase closure

/**
 * A discrete executable unit within a Method Graph.
 */
export interface MethodNode {
  nodeId: string;
  nodeClass: MethodNodeClass;
  title: string;
  description: string;
  requiredEvidenceIds: string[];
  requiredResources: string[];
  /** Hook for phase-aware Scing guidance */
  guidanceHookId?: string;
  /** Metadata for scheduling prioritization */
  weight?: number; 
}

/**
 * Sequential or logical connection between nodes.
 */
export interface MethodEdge {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  edgeType: MethodEdgeType;
  /** Logic or threshold for conditional edges */
  conditionExpr?: string; 
}

/**
 * Canonical Workflow Graph for a Methodology.
 */
export interface MethodGraph {
  graphId: string;
  methodId: string;
  version: string;
  entryNodeIds: string[];
  nodes: MethodNode[];
  edges: MethodEdge[];
}

/**
 * Runtime instance of a Method Graph execution.
 */
export interface WorkflowInstance {
  instanceId: string;
  methodId: string;
  graphVersion: string;
  linkedEntityType: 'PIP' | 'CIP' | 'Project';
  linkedEntityId: string;
  /** Active work frontier nodes */
  currentNodeIds: string[];
  /** Map of nodeId -> nodeState */
  nodeStates: Record<string, {
    state: MethodNodeState;
    reasonCode?: MethodBlockReasonCode;
    updatedAt: string;
    updatedBy: string;
    auditEventId?: string;
  }>;
  startedAt: string;
  updatedAt: string;
  startedBy: string;
  status: 'active' | 'completed' | 'suspended' | 'aborted';
  blockedReasonSummary?: string;
  lastAuditEventId: string;

  // ─── Execution-Time Tracking (Phase 2) ──────────────────────────
  /** Maps nodeId → captured evidence IDs */
  evidenceCaptured: Record<string, string[]>;
  /** Tracks phase completion events */
  phaseCompletions: Record<string, {
    completedAt: string;
    completedBy: string;
  }>;
  /** Links to active SmartSCHEDULER™ proposal */
  schedulerBinding?: {
    proposalId: string;
    posture: import('@/lib/types').SchedulePosture;
    boundAt: string;
  };
  /** Links to active Scing guidance session */
  guidanceSessionId?: string;
  /** Maps nodeId → generated sovereign artifact references */
  artifactBindings: Record<string, SovereignArtifactRef[]>;

  // ─── Project Operations Binding ─────────────────────────────────
  /** Optional project-level binding for Contractor suite workflows */
  projectBinding?: {
    projectId: string;
    workPackageId?: string;
  };
}

/**
 * Lightweight reference to a sovereign DocuSCRIBE™ artifact
 * for cross-referencing within workflow instances.
 */
export interface SovereignArtifactRef {
  artifactId: string;
  artifactClass: 'sgtx' | 'sggr' | 'sgta';
  createdAt: string;
  nodeId?: string;
}

/**
 * A discrete phase in an inspection workflow.
 */
export interface MethodPhase {
  phaseId: string;
  phaseName: string;
  phaseOrder: number;
  phasePurpose: string;
  requiredSteps: MethodStep[];
  /** References to requiredEvidence IDs that must be captured in this phase */
  requiredEvidenceRefs: string[];
  /** Rules for phase completion */
  completionRules: string[];
}

/**
 * An individual step within a phase.
 */
export interface MethodStep {
  stepId: string;
  label: string;
  instruction: string;
  required: boolean;
}

/**
 * Definition of a required piece of evidence.
 */
export interface EvidenceRequirement {
  evidenceId: string;
  evidenceType: 'photo' | 'video' | 'lidar' | 'measurement' | 'thermal';
  label: string;
  description: string;
  required: boolean;
  /** Rule ID or logic for validating this evidence */
  validationRule?: string;
  /** Link to where this appears in the final report template */
  templatePlacementId?: string;
}

/**
 * Binding rule for DocuSCRIBE template sections.
 */
export interface TemplateBinding {
  templateSectionId: string;
  sectionName: string;
  required: boolean;
  /** Whether this section is protected (non-deletable) */
  isProtected: boolean;
  /** Method-required disclosures or markings */
  fixedContent?: string;
}

/**
 * Guidance scripts for Scing integration.
 */
export interface GuidanceScript {
  triggerType: 'phase_entry' | 'phase_exit' | 'missing_evidence' | 'step_prompt';
  phaseId: string;
  stepId?: string;
  prompt: string;
  /** Bound constraints on Scing behavior for this hook */
  authorityBounds?: string;
}

/**
 * Bounded Analysis Profile for LARI support.
 * Binds analysis reasoning to the methodology.
 */
export interface AnalysisProfile {
  analysisObjectives: string[];
  expectedEvidencePatterns: string[];
  contradictionRules: string[];
  confidenceConstraints: string[];
  escalationTriggers: string[];
  qaFlags: string[];
  reportMappingHints: string[];
}

/**
 * Execution Validity Profile (Inhibitors/Blockers).
 * Defines what limits or stops method execution.
 */
export interface BlockerProfile {
  executionBlockers: string[];
  executionInhibitors: string[];
  evidenceInhibitors: string[];
  confidenceReducers: string[];
  safetyStops: string[];
  rescheduleTriggers: string[];
  partialCompletionRules: string[];
  overrideRequirements: string[];
  qaFailureFlags: string[];
  obstructionInhibitors: string[];
}

/**
 * QA Acceptance Profile for method outcome scoring.
 */
export interface QA_AcceptanceProfile {
  minimumEvidenceCount: number;
  criticalPhotoRequirements: string[];
  mandatorySectionsFilled: boolean;
  /** Score (0-100) threshold for auto-approval candidacy */
  autoApprovalThreshold?: number;
}

/**
 * Scheduling constraints for a specific inspection method.
 * Consumed by SmartSCHEDULER™ to propose optimal execution windows.
 */
export interface MethodSchedulingConstraints {
  estimatedDurationMinutes: number;
  /** Max 100, safety bound. Beyond this, method is Restricted/Blocked. */
  requiredIRIThreshold: number; 
  daylightRequirement: 'mandatory' | 'preferred' | 'optional';
  environmentalRestrictions: string[];
  requiredResources: string[]; // e.g., 'drone_kit_v2', 'ladder_20ft'
  crewRequirements: number; // Minimum personnel
}
