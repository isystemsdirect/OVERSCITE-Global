/**
 * @fileOverview Project State Binder — .sgpm / .sgpl Generation
 * @domain DocuSCRIBE / Project Operations / Integration
 * @canonical true
 * @status Implemented
 *
 * Handles the generation of governed project-state containers (.sgpm and .sgpl)
 * by binding operational context and engine outputs.
 */

import {
  createArtifactMetadata,
  type SovereignArtifactRef,
  type OwnerBinding,
} from './sovereign-file-classes';
import type {
  SovereignProjectManagerArtifact,
  SovereignProjectPlanArtifact,
} from './sovereign-project-file-classes';
import type {
  ProjectExecutionContext,
  ProjectStateEvaluation,
  ProjectRiskCluster,
  ProjectManagerAdvisory,
  ProjectApprovalPosture,
  DependencyEdge,
  ProjectPlannerScenario,
} from '@/lib/contractor/project-manager-types';
import {
  evaluateProjectState,
  clusterIssuesAndRisks,
  generateManagerialAdvisory,
  evaluateApprovalPath,
  generateProjectBriefingSGTX,
} from '@/lib/services/lari-project-manager';
import {
  buildDependencyMap,
  evaluateCriticalPath,
} from '@/lib/services/lari-project-planner';

// ═══════════════════════════════════════════════════════════════════════
// SGPM Generation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgpm project manager container from context.
 */
export function generateSGPMFromContext(
  ctx: ProjectExecutionContext,
  ownerBinding: OwnerBinding,
  linkedArtifacts: SovereignArtifactRef[] = [],
): SovereignProjectManagerArtifact {
  // Execute managerial logic
  const stateEval = evaluateProjectState(ctx);
  const riskClusters = clusterIssuesAndRisks(ctx);
  const advisories = generateManagerialAdvisory(ctx, stateEval, riskClusters);
  const approvalPath = evaluateApprovalPath(ctx, 'plan_change');


  const methodBinding = {
    methodId: `project-manager-${ctx.projectId}`,
    workflowInstanceId: ctx.workflowInstanceIds[0],
  };

  const metadata = createArtifactMetadata('sgpm', methodBinding, 'LARI-ProjectManager™', ownerBinding);

  return {
    ...metadata,
    artifactClass: 'sgpm',
    projectId: ctx.projectId,
    truthState: 'mock', // Pre-validation posture
    managerState: {
      overallHealth: stateEval.overallHealth,
      metrics: stateEval.metrics,
      evaluationTimestamp: stateEval.timestamp,
    },
    issuePackets: ctx.issues,
    riskClusters,
    managerAdvisories: advisories,
    approvalRequirements: [approvalPath],
    inspectorLens: stateEval.inspectorLens,
    linkedArtifacts,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// SGPL Generation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgpl project plan container from context.
 */
export function generateSGPLFromContext(
  ctx: ProjectExecutionContext,
  ownerBinding: OwnerBinding,
  linkedArtifacts: SovereignArtifactRef[] = [],
): SovereignProjectPlanArtifact {
  // Execute planning logic
  const depMap = buildDependencyMap(ctx);
  const criticalPath = evaluateCriticalPath(ctx, depMap);
  const allPackages = ctx.phases.flatMap(p => p.workPackages);

  const methodBinding = {
    methodId: `project-plan-${ctx.projectId}`,
    workflowInstanceId: ctx.workflowInstanceIds[0],
  };

  const metadata = createArtifactMetadata('sgpl', methodBinding, 'LARI-ProjectPlanner™', ownerBinding);

  return {
    ...metadata,
    artifactClass: 'sgpl',
    projectId: ctx.projectId,
    truthState: 'mock', // Pre-validation posture
    planState: {
      packageCount: allPackages.length,
      dependencyCount: depMap.edges.length,
      orphanedPackageCount: depMap.orphanedPackages.length,
      estimatedDurationDays: criticalPath.estimatedDurationDays,
    },
    dependencyMap: {
      edges: depMap.edges,
      timestamp: depMap.timestamp,
    },
    criticalPath: {
      criticalPathIds: criticalPath.criticalPathIds,
      bottleneckPackageId: criticalPath.bottleneckPackageId,
    },
    scenarioSet: [], // Scenarios are user-driven or engine-proposed follow-ons
    schedulerPostures: allPackages.map(wp => ({
      packageId: wp.packageId,
      currentPosture: wp.schedulerPosture,
    })),
    environmentalConstraints: {
      weatherExposure: 'advisory',
      routingPressure: 'normal',
      impactLevel: 'low',
    },
    linkedArtifacts,
  };
}

/**
 * Re-exporting project briefing generator for unified binder access.
 */
export { generateProjectBriefingSGTX };

