/**
 * @fileOverview Sovereign Project File-Classes — .sgpm / .sgpl
 * @domain DocuSCRIBE / Project Operations / Governance
 * @canonical true
 * @status Formalized
 *
 * Implements .sgpm (Governed Project Manager Artifact) and .sgpl (Governed
 * Project Plan Artifact) as project-state encapsulation containers.
 */

import type {
  SovereignArtifactMetadata,
  SovereignArtifactRef,
} from './sovereign-file-classes';
import type {
  ProjectStateEvaluation,
  ProjectRiskCluster,
  ProjectManagerAdvisory,
  ProjectApprovalPosture,
  ProjectIssuePacket,
  DependencyEdge,
  ProjectPlannerScenario,
  InspectorLensAxes,
} from '@/lib/contractor/project-manager-types';
import type { SchedulePosture } from '@/lib/types';

// ═══════════════════════════════════════════════════════════════════════
// .sgpm — Governed Project Manager Artifact
// ═══════════════════════════════════════════════════════════════════════

/**
 * Encapsulates managerial state, risk clusters, and advisories.
 */
export interface SovereignProjectManagerArtifact extends SovereignArtifactMetadata {
  artifactClass: 'sgpm';
  projectId: string;
  
  /** Managerial state snapshot */
  managerState: {
    overallHealth: ProjectStateEvaluation['overallHealth'];
    metrics: ProjectStateEvaluation['metrics'];
    evaluationTimestamp: string;
  };

  /** Issue and risk encapsulation */
  issuePackets: ProjectIssuePacket[];
  riskClusters: ProjectRiskCluster[];

  /** Managerial advisories and logic */
  managerAdvisories: ProjectManagerAdvisory[];

  /** Approval and governance posture */
  approvalRequirements: ProjectApprovalPosture[];

  /** Inspector-lens axis ratings for the project state */
  inspectorLens: InspectorLensAxes;

  /** References to linked atomic artifacts (.sgtx briefs, etc.) */
  linkedArtifacts: SovereignArtifactRef[];
}

// ═══════════════════════════════════════════════════════════════════════
// .sgpl — Governed Project Plan Artifact
// ═══════════════════════════════════════════════════════════════════════

/**
 * Encapsulates planning state, dependencies, scenarios, and scheduler posture.
 */
export interface SovereignProjectPlanArtifact extends SovereignArtifactMetadata {
  artifactClass: 'sgpl';
  projectId: string;

  /** Planning and dependency state */
  planState: {
    packageCount: number;
    dependencyCount: number;
    orphanedPackageCount: number;
    estimatedDurationDays: number;
  };

  /** Dependency graph definition */
  dependencyMap: {
    edges: DependencyEdge[];
    timestamp: string;
  };

  /** Critical path definition */
  criticalPath: {
    criticalPathIds: string[];
    bottleneckPackageId?: string;
  };

  /** Governed sequencing scenarios */
  scenarioSet: ProjectPlannerScenario[];

  /** SmartSCHEDULER™ posture bindings */
  schedulerPostures: {
    packageId: string;
    currentPosture: SchedulePosture;
    reason?: string;
  }[];

  /** Environmental and routing constraints */
  environmentalConstraints: {
    weatherExposure: string;
    routingPressure: string;
    impactLevel: 'low' | 'moderate' | 'high';
  };

  /** References to linked atomic artifacts (.sggr maps, .sgta tables) */
  linkedArtifacts: SovereignArtifactRef[];
}

// ═══════════════════════════════════════════════════════════════════════
// Type Guards
// ═══════════════════════════════════════════════════════════════════════

export function isSGPM(artifact: any): artifact is SovereignProjectManagerArtifact {
  return artifact?.artifactClass === 'sgpm';
}

export function isSGPL(artifact: any): artifact is SovereignProjectPlanArtifact {
  return artifact?.artifactClass === 'sgpl';
}
