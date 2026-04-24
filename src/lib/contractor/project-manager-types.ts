/**
 * @fileOverview Project Operations Type System — Contractor Suite
 * @domain Contractor / Project Operations / LARI
 * @canonical true
 * @status Phase 1 — Contract Expansion
 *
 * Types for LARI-ProjectManager™ and LARI-ProjectPlanner™.
 * All types enforce projectId as required context.
 *
 * Doctrine:
 *   - No project operations without projectId
 *   - All advisory outputs include lineageRef and review posture
 *   - Inspector-lens axes are structural, not decorative
 *   - No autonomous mutation authority
 */

import type { SchedulePosture } from '@/lib/types';
import type { GateDecision } from '@/lib/bane/method-execution-gate';
import type { ArtifactClass } from '@/lib/docuscribe/sovereign-file-classes';

// ═══════════════════════════════════════════════════════════════════════
// Inspector-Lens Axes
// ═══════════════════════════════════════════════════════════════════════

/**
 * Structured assessment across the required interpretive axes.
 * Every advisory must evaluate risk through these lenses.
 */
export interface InspectorLensAxes {
  /** Is the recommendation achievable given actual site conditions? */
  siteConditionRealism: 'clear' | 'constrained' | 'impractical';
  /** Is the inspection sequence defensible and evidence-ready? */
  evidenceReadiness: 'complete' | 'partial' | 'insufficient';
  /** What regulatory/compliance exposure does this create? */
  complianceExposure: 'none' | 'low' | 'moderate' | 'high';
  /** Are weather and access conditions favorable? */
  weatherAccessConstraints: 'clear' | 'advisory' | 'restricted' | 'blocked';
  /** Is this practical for field execution? */
  fieldPracticality: 'high' | 'moderate' | 'low';
  /** Quality risk level */
  qualityRisk: 'none' | 'low' | 'moderate' | 'high';
  /** Verification burden on inspector/team */
  verificationBurden: 'light' | 'moderate' | 'heavy';
  /** Inspection sequence defensibility assessment */
  inspectionSequenceDefensibility: 'strong' | 'adequate' | 'weak';
}

// ═══════════════════════════════════════════════════════════════════════
// Evaluation and Mapping Results
// ═══════════════════════════════════════════════════════════════════════

/**
 * Health assessment produced by LARI-ProjectManager™.
 */
export interface ProjectStateEvaluation {
  projectId: string;
  overallHealth: 'healthy' | 'at_risk' | 'critical' | 'blocked';
  activePhaseCount: number;
  completedPhaseCount: number;
  blockedPackageCount: number;
  openIssueCount: number;
  criticalIssueCount: number;
  metrics: {
    budgetExposure: 'nominal' | 'low' | 'moderate' | 'high';
    resourcePressure: 'low' | 'moderate' | 'high';
    velocity: number;
  };
  schedulerPostureSummary: Record<SchedulePosture, number>;
  inspectorLens: InspectorLensAxes;
  timestamp: string;
}

/**
 * Dependency graph model produced by LARI-ProjectPlanner™.
 */
export interface DependencyMap {
  projectId: string;
  edges: DependencyEdge[];
  orphanedPackages: string[];
  circularDependencies: string[][];
  timestamp: string;
}

/**
 * Critical path analysis produced by LARI-ProjectPlanner™.
 */
export interface CriticalPathResult {
  projectId: string;
  criticalPathIds: string[];
  estimatedDurationDays: number;
  bottleneckPackageId?: string;
  timestamp: string;
}


// ═══════════════════════════════════════════════════════════════════════
// Project Execution Context
// ═══════════════════════════════════════════════════════════════════════

/**
 * Root context binding a project to its execution substrate.
 * Required for all engine operations.
 */
export interface ProjectExecutionContext {
  /** Required — no project operations without projectId */
  projectId: string;
  projectName: string;
  /** Contractor party ID from Contractor Division */
  contractorPartyId: string;
  /** Active workflow instance IDs bound to this project */
  workflowInstanceIds: string[];
  /** Active scheduler proposal IDs */
  schedulerProposalIds: string[];
  /** Project phases with work package assignments */
  phases: ProjectPhase[];
  /** All issues and risks */
  issues: ProjectIssuePacket[];
  /** Bound sovereign artifact references */
  artifactBindings: ProjectArtifactBinding[];
  /** Current project operating mode */
  operatingMode: 'planning' | 'active' | 'suspended' | 'completed';
  /** Active Scing guidance session ID */
  guidanceSessionId?: string;
  /** Project creation timestamp */
  createdAt: string;
  /** Last updated timestamp */
  updatedAt: string;
  /** Responsible human actor */
  managedBy: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Project Phases and Work Packages
// ═══════════════════════════════════════════════════════════════════════

export interface ProjectPhase {
  phaseId: string;
  projectId: string;
  phaseName: string;
  phaseOrder: number;
  status: 'not_started' | 'active' | 'completed' | 'blocked';
  workPackages: ProjectWorkPackage[];
  /** Linked method workflow phase IDs */
  methodPhaseRefs: string[];
}

export interface ProjectWorkPackage {
  packageId: string;
  projectId: string;
  phaseId: string;
  title: string;
  description: string;
  /** Trade/crew/vendor assignment */
  assignedTradeClass: string[];
  assignedSubcontractorId?: string;
  assignedVendorId?: string;
  /** Inspection and permit requirements */
  requiredInspections: string[];
  requiredPermits: string[];
  /** Dependencies on other packages */
  dependsOn: string[];
  /** Scheduler posture for this package */
  schedulerPosture: SchedulePosture;
  /** Package status */
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked' | 'deferred';
  /** Estimated and actual dates */
  estimatedStart?: string;
  estimatedEnd?: string;
  actualStart?: string;
  actualEnd?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Issues and Risks
// ═══════════════════════════════════════════════════════════════════════

export type IssueSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'informational';
export type IssueCategory =
  | 'schedule_conflict'
  | 'resource_shortage'
  | 'weather_impact'
  | 'permit_delay'
  | 'inspection_failure'
  | 'subcontractor_issue'
  | 'vendor_delay'
  | 'safety_concern'
  | 'compliance_gap'
  | 'quality_deficiency'
  | 'access_restriction'
  | 'scope_change';

/**
 * Issue/blocker/risk entry with inspector-lens assessment.
 */
export interface ProjectIssuePacket {
  issueId: string;
  projectId: string;
  /** Category classification */
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  /** Inspector-lens assessment */
  inspectorLens: InspectorLensAxes;
  /** Affected work packages */
  affectedPackageIds: string[];
  /** Attributable actor who raised this issue */
  raisedBy: string;
  raisedAt: string;
  /** Resolution state */
  status: 'open' | 'acknowledged' | 'mitigated' | 'resolved' | 'escalated';
  /** Resolution details (when resolved) */
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

/**
 * Grouped risk assessment with exposure rating.
 */
export interface ProjectRiskCluster {
  clusterId: string;
  projectId: string;
  clusterName: string;
  /** Issues grouped under this risk cluster */
  issueIds: string[];
  /** Dominant category */
  dominantCategory: IssueCategory;
  /** Highest severity in the cluster */
  peakSeverity: IssueSeverity;
  /** Inspector-lens composite assessment */
  compositeAssessment: InspectorLensAxes;
  /** Human-readable impact summary */
  impactSummary: string;
}

// ═══════════════════════════════════════════════════════════════════════
// Managerial Advisory
// ═══════════════════════════════════════════════════════════════════════

export type AdvisoryType =
  | 'state_summary'
  | 'risk_alert'
  | 'approval_required'
  | 'issue_escalation'
  | 'solution_suggestion'
  | 'resequencing_recommendation';

/**
 * Managerial advisory output from LARI-ProjectManager™.
 */
export interface ProjectManagerAdvisory {
  advisoryId: string;
  /** Required — all advisories trace to project */
  projectId: string;
  type: AdvisoryType;
  title: string;
  content: string;
  /** Inspector-lens assessment backing this advisory */
  inspectorLens: InspectorLensAxes;
  /** BANE review posture */
  baneReviewPosture: GateDecision;
  /** Affected work packages */
  affectedPackageIds: string[];
  /** Approval requirements if actionable */
  approvalRequired?: ProjectApprovalPosture;
  /** Impact summary */
  impactSummary: string;
  /** Lineage reference */
  lineageRef: {
    sourceEngineId: 'LARI-ProjectManager';
    generatedAt: string;
    basedOnContextSnapshot: string;
  };
  /** Is this advisory-only (always true) */
  isAdvisoryOnly: true;
}

// ═══════════════════════════════════════════════════════════════════════
// Planner Scenarios
// ═══════════════════════════════════════════════════════════════════════

/**
 * Sequencing scenario from LARI-ProjectPlanner™.
 */
export interface ProjectPlannerScenario {
  scenarioId: string;
  /** Required — scenario traces to project */
  projectId: string;
  scenarioName: string;
  /** Description of what this scenario explores */
  hypothesis: string;
  /** Dependency map for this scenario */
  dependencyMap: DependencyEdge[];
  /** Critical path node IDs */
  criticalPathIds: string[];
  /** Estimated project duration (days) */
  estimatedDurationDays: number;
  /** Scheduler posture impacts */
  schedulerImpacts: {
    packageId: string;
    proposedPosture: SchedulePosture;
    reason: string;
  }[];
  /** Resequencing proposals */
  resequencingProposals: ResequencingProposal[];
  /** Inspector-lens assessment */
  inspectorLens: InspectorLensAxes;
  /** Lineage reference */
  lineageRef: {
    sourceEngineId: 'LARI-ProjectPlanner';
    generatedAt: string;
    basedOnContextSnapshot: string;
    parentScenarioId?: string;
  };
  /** Publication state */
  publishState: 'draft' | 'under_review' | 'published';
}

export interface DependencyEdge {
  fromPackageId: string;
  toPackageId: string;
  dependencyType: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lagDays: number;
}

export interface ResequencingProposal {
  proposalId: string;
  packageId: string;
  originalSlot: { start: string; end: string };
  proposedSlot: { start: string; end: string };
  reason: string;
  /** Impact on downstream packages */
  downstreamImpact: string[];
}

// ═══════════════════════════════════════════════════════════════════════
// Approval Posture
// ═══════════════════════════════════════════════════════════════════════

/**
 * Approval state for project mutations.
 */
export interface ProjectApprovalPosture {
  /** What mutation is being proposed */
  mutationType: 'plan_change' | 'issue_escalation' | 'scenario_publish' | 'override' | 'artifact_publish';
  /** Required approval level */
  requiredLevel: 'human_acknowledgment' | 'director_approval';
  /** Current approval state */
  state: 'pending' | 'approved' | 'rejected';
  /** Who needs to approve */
  approverRole: string;
  /** Justification required */
  justificationRequired: boolean;
}

// ═══════════════════════════════════════════════════════════════════════
// Project Artifact Binding
// ═══════════════════════════════════════════════════════════════════════

/**
 * Links sovereign artifacts to project and originating scenario/workflow.
 */
export interface ProjectArtifactBinding {
  artifactId: string;
  artifactClass: ArtifactClass;
  /** Required — artifact traces to project */
  projectId: string;
  /** Source scenario or workflow instance */
  sourceType: 'workflow' | 'scenario' | 'advisory';
  sourceId: string;
  /** When this artifact was generated */
  generatedAt: string;
  /** Who triggered generation */
  generatedBy: string;
}
