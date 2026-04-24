/**
 * @fileOverview LARI-ProjectManager™ — Bounded Project-State Reasoning Engine
 * @domain LARI / Contractor / Project Management
 * @canonical true
 * @status Implemented
 *
 * Handles project-state interpretation, issue/risk coordination,
 * approval posture, and inspector-lens solution generation.
 *
 * Doctrine:
 *   - Advisory-only outputs — no autonomous mutation
 *   - No self-approval of overrides
 *   - Must produce options, advisories, and impact summaries
 *   - Inspector-lens required on all outputs
 *   - All functions require ProjectExecutionContext
 */

import type {
  ProjectExecutionContext,
  ProjectIssuePacket,
  ProjectRiskCluster,
  ProjectManagerAdvisory,
  ProjectApprovalPosture,
  InspectorLensAxes,
  IssueSeverity,
  IssueCategory,
  AdvisoryType,
  ProjectStateEvaluation,
} from '@/lib/contractor/project-manager-types';
import type { WorkflowInstance } from '@/lib/inspections/methods/contracts';
import type { SchedulePosture } from '@/lib/types';
import {
  createArtifactMetadata,
  type SovereignTextArtifact,
  type MethodBinding,
  type OwnerBinding,
} from '@/lib/docuscribe/sovereign-file-classes';
import type { DocuScribePage, DocumentFormatting } from '@/lib/docuscribe/types';

// ═══════════════════════════════════════════════════════════════════════
// Project State Evaluation
// ═══════════════════════════════════════════════════════════════════════

// Evaluation logic moved to project-manager-types.ts


/**
 * Evaluates the current project state from execution context.
 * Produces a health assessment with inspector-lens interpretation.
 */
export function evaluateProjectState(
  ctx: ProjectExecutionContext,
): ProjectStateEvaluation {
  const activePhases = ctx.phases.filter(p => p.status === 'active');
  const completedPhases = ctx.phases.filter(p => p.status === 'completed');
  const allPackages = ctx.phases.flatMap(p => p.workPackages);
  const blockedPackages = allPackages.filter(wp => wp.status === 'blocked');
  const openIssues = ctx.issues.filter(i => i.status === 'open' || i.status === 'acknowledged');
  const criticalIssues = openIssues.filter(i => i.severity === 'critical');

  // Aggregate scheduler postures
  const postureSummary: Record<SchedulePosture, number> = {
    approved_candidate: 0,
    advisory_candidate: 0,
    restricted: 0,
    blocked: 0,
    manual_review_required: 0,
  };
  for (const wp of allPackages) {
    postureSummary[wp.schedulerPosture]++;
  }

  // Derive health
  let overallHealth: ProjectStateEvaluation['overallHealth'] = 'healthy';
  if (criticalIssues.length > 0 || blockedPackages.length > allPackages.length * 0.5) {
    overallHealth = 'critical';
  } else if (blockedPackages.length > 0 || postureSummary.blocked > 0) {
    overallHealth = 'at_risk';
  } else if (openIssues.length > 5 || postureSummary.restricted > 0) {
    overallHealth = 'at_risk';
  }

  // Build inspector-lens assessment
  const inspectorLens = deriveInspectorLens(ctx, openIssues, blockedPackages.length);

  return {
    projectId: ctx.projectId,
    overallHealth,
    activePhaseCount: activePhases.length,
    completedPhaseCount: completedPhases.length,
    blockedPackageCount: blockedPackages.length,
    openIssueCount: openIssues.length,
    criticalIssueCount: criticalIssues.length,
    metrics: {
      budgetExposure: 'nominal',
      resourcePressure: 'low',
      velocity: 0,
    },
    schedulerPostureSummary: postureSummary,
    inspectorLens,
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Issue and Risk Clustering
// ═══════════════════════════════════════════════════════════════════════

/**
 * Groups issues by category/severity and applies inspector-lens interpretation.
 */
export function clusterIssuesAndRisks(
  ctx: ProjectExecutionContext,
): ProjectRiskCluster[] {
  const clusters: ProjectRiskCluster[] = [];
  const categoryGroups = new Map<IssueCategory, ProjectIssuePacket[]>();

  // Group open issues by category
  const openIssues = ctx.issues.filter(
    i => i.status === 'open' || i.status === 'acknowledged' || i.status === 'escalated'
  );

  for (const issue of openIssues) {
    const existing = categoryGroups.get(issue.category) || [];
    existing.push(issue);
    categoryGroups.set(issue.category, existing);
  }

  // Build clusters
  for (const [category, issues] of categoryGroups) {
    if (issues.length === 0) continue;

    const peakSeverity = issues.reduce<IssueSeverity>((peak, issue) => {
      const order: IssueSeverity[] = ['informational', 'low', 'moderate', 'high', 'critical'];
      return order.indexOf(issue.severity) > order.indexOf(peak) ? issue.severity : peak;
    }, 'informational');

    const compositeAssessment = mergeInspectorLens(issues.map(i => i.inspectorLens));

    clusters.push({
      clusterId: `rc-${category}-${Date.now()}`,
      projectId: ctx.projectId,
      clusterName: formatCategoryLabel(category),
      issueIds: issues.map(i => i.issueId),
      dominantCategory: category,
      peakSeverity,
      compositeAssessment,
      impactSummary: `${issues.length} ${category.replace(/_/g, ' ')} issue(s) — peak severity: ${peakSeverity}`,
    });
  }

  return clusters.sort((a, b) => {
    const order: IssueSeverity[] = ['informational', 'low', 'moderate', 'high', 'critical'];
    return order.indexOf(b.peakSeverity) - order.indexOf(a.peakSeverity);
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Managerial Advisory Generation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Produces advisory packets with impact summaries, approval requirements,
 * and inspector-lens solution suggestions.
 */
export function generateManagerialAdvisory(
  ctx: ProjectExecutionContext,
  stateEval: ProjectStateEvaluation,
  riskClusters: ProjectRiskCluster[],
): ProjectManagerAdvisory[] {
  const advisories: ProjectManagerAdvisory[] = [];
  const timestamp = new Date().toISOString();
  const contextSnapshot = `${ctx.projectId}:${timestamp}`;

  // State summary advisory
  advisories.push({
    advisoryId: `adv-state-${Date.now()}`,
    projectId: ctx.projectId,
    type: 'state_summary',
    title: `Project Health: ${stateEval.overallHealth.toUpperCase()}`,
    content: buildStateSummaryContent(stateEval),
    inspectorLens: stateEval.inspectorLens,
    baneReviewPosture: 'ALLOW',
    affectedPackageIds: [],
    impactSummary: `${stateEval.activePhaseCount} active phase(s), ${stateEval.openIssueCount} open issue(s), ${stateEval.blockedPackageCount} blocked package(s)`,
    lineageRef: {
      sourceEngineId: 'LARI-ProjectManager',
      generatedAt: timestamp,
      basedOnContextSnapshot: contextSnapshot,
    },
    isAdvisoryOnly: true,
  });

  // Risk alert advisories for critical clusters
  for (const cluster of riskClusters) {
    if (cluster.peakSeverity === 'critical' || cluster.peakSeverity === 'high') {
      advisories.push({
        advisoryId: `adv-risk-${cluster.clusterId}`,
        projectId: ctx.projectId,
        type: 'risk_alert',
        title: `Risk: ${cluster.clusterName}`,
        content: `${cluster.impactSummary}. Inspector-lens assessment: site conditions are ${cluster.compositeAssessment.siteConditionRealism}, evidence readiness is ${cluster.compositeAssessment.evidenceReadiness}, compliance exposure is ${cluster.compositeAssessment.complianceExposure}.`,
        inspectorLens: cluster.compositeAssessment,
        baneReviewPosture: cluster.peakSeverity === 'critical' ? 'REQUIRE_OVERRIDE' : 'ALLOW',
        affectedPackageIds: findAffectedPackages(ctx, cluster.issueIds),
        approvalRequired: cluster.peakSeverity === 'critical' ? {
          mutationType: 'issue_escalation',
          requiredLevel: 'human_acknowledgment',
          state: 'pending',
          approverRole: 'project_manager',
          justificationRequired: true,
        } : undefined,
        impactSummary: cluster.impactSummary,
        lineageRef: {
          sourceEngineId: 'LARI-ProjectManager',
          generatedAt: timestamp,
          basedOnContextSnapshot: contextSnapshot,
        },
        isAdvisoryOnly: true,
      });
    }
  }

  // Approval-required advisory if blocked packages exist
  if (stateEval.blockedPackageCount > 0) {
    advisories.push({
      advisoryId: `adv-approval-${Date.now()}`,
      projectId: ctx.projectId,
      type: 'approval_required',
      title: 'Blocked Packages Require Attention',
      content: `${stateEval.blockedPackageCount} work package(s) are blocked. Review and resolve blocking conditions before project can advance.`,
      inspectorLens: stateEval.inspectorLens,
      baneReviewPosture: 'REQUIRE_OVERRIDE',
      affectedPackageIds: ctx.phases
        .flatMap(p => p.workPackages)
        .filter(wp => wp.status === 'blocked')
        .map(wp => wp.packageId),
      approvalRequired: {
        mutationType: 'plan_change',
        requiredLevel: 'human_acknowledgment',
        state: 'pending',
        approverRole: 'project_manager',
        justificationRequired: true,
      },
      impactSummary: `${stateEval.blockedPackageCount} blocked package(s) preventing project progression`,
      lineageRef: {
        sourceEngineId: 'LARI-ProjectManager',
        generatedAt: timestamp,
        basedOnContextSnapshot: contextSnapshot,
      },
      isAdvisoryOnly: true,
    });
  }

  return advisories;
}

// ═══════════════════════════════════════════════════════════════════════
// Approval Path Evaluation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Determines what approvals are needed for a proposed project change.
 */
export function evaluateApprovalPath(
  ctx: ProjectExecutionContext,
  mutationType: ProjectApprovalPosture['mutationType'],
): ProjectApprovalPosture {
  switch (mutationType) {
    case 'plan_change':
      return {
        mutationType,
        requiredLevel: 'human_acknowledgment',
        state: 'pending',
        approverRole: 'project_manager',
        justificationRequired: true,
      };
    case 'issue_escalation':
      return {
        mutationType,
        requiredLevel: 'human_acknowledgment',
        state: 'pending',
        approverRole: 'project_manager',
        justificationRequired: true,
      };
    case 'scenario_publish':
      return {
        mutationType,
        requiredLevel: 'human_acknowledgment',
        state: 'pending',
        approverRole: 'project_manager',
        justificationRequired: false,
      };
    case 'override':
      return {
        mutationType,
        requiredLevel: 'director_approval',
        state: 'pending',
        approverRole: 'director',
        justificationRequired: true,
      };
    case 'artifact_publish':
      return {
        mutationType,
        requiredLevel: 'human_acknowledgment',
        state: 'pending',
        approverRole: 'project_manager',
        justificationRequired: false,
      };
    default:
      return {
        mutationType: 'plan_change',
        requiredLevel: 'director_approval',
        state: 'pending',
        approverRole: 'director',
        justificationRequired: true,
      };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Project Briefing Artifact (.sgtx)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgtx project briefing artifact from project state.
 */
export function generateProjectBriefingSGTX(
  ctx: ProjectExecutionContext,
  stateEval: ProjectStateEvaluation,
  advisories: ProjectManagerAdvisory[],
  ownerBinding: OwnerBinding,
): SovereignTextArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-ops-${ctx.projectId}`,
    workflowInstanceId: ctx.workflowInstanceIds[0] || 'none',
  };

  const metadata = createArtifactMetadata('sgtx', methodBinding, 'LARI-ProjectManager™', ownerBinding);

  const pages: DocuScribePage[] = [];

  // Cover page
  pages.push({
    page_id: `p-cover-${metadata.artifactId}`,
    status: 'draft',
    blocks: {},
    content: [
      `# Project Briefing — ${ctx.projectName}`,
      '',
      `**Project ID:** ${ctx.projectId}`,
      `**Status:** ${ctx.operatingMode}`,
      `**Health:** ${stateEval.overallHealth}`,
      `**Managed By:** ${ctx.managedBy}`,
      `**Generated:** ${new Date().toISOString()}`,
      '',
      '---',
      '',
      '*This briefing was generated by LARI-ProjectManager™ from governed project execution context.*',
    ].join('\n'),
  });

  // State summary page
  pages.push({
    page_id: `p-state-${metadata.artifactId}`,
    status: 'draft',
    blocks: {},
    content: [
      '## Project State Summary',
      '',
      `- **Active Phases:** ${stateEval.activePhaseCount}`,
      `- **Completed Phases:** ${stateEval.completedPhaseCount}`,
      `- **Open Issues:** ${stateEval.openIssueCount}`,
      `- **Critical Issues:** ${stateEval.criticalIssueCount}`,
      `- **Blocked Packages:** ${stateEval.blockedPackageCount}`,
      '',
      '### Inspector-Lens Assessment',
      '',
      `- Site Conditions: ${stateEval.inspectorLens.siteConditionRealism}`,
      `- Evidence Readiness: ${stateEval.inspectorLens.evidenceReadiness}`,
      `- Compliance Exposure: ${stateEval.inspectorLens.complianceExposure}`,
      `- Weather/Access: ${stateEval.inspectorLens.weatherAccessConstraints}`,
      `- Field Practicality: ${stateEval.inspectorLens.fieldPracticality}`,
      `- Quality Risk: ${stateEval.inspectorLens.qualityRisk}`,
    ].join('\n'),
  });

  // Advisories page
  if (advisories.length > 0) {
    const advisoryContent = advisories.map(a =>
      `### ${a.title}\n\n${a.content}\n\n**Impact:** ${a.impactSummary}\n**Review Posture:** ${a.baneReviewPosture}`
    ).join('\n\n---\n\n');

    pages.push({
      page_id: `p-advisories-${metadata.artifactId}`,
      status: 'draft',
      blocks: {},
      content: `## Active Advisories\n\n${advisoryContent}`,
    });
  }

  const formatting: DocumentFormatting = {
    pageSize: 'Letter',
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    lineSpacing: 1.5,
    fontFamily: 'Inter',
  };

  return {
    ...metadata,
    artifactClass: 'sgtx',
    truthState: 'mock',
    textStructure: { pages, formatting },
    sectionHierarchy: [
      { sectionId: 'cover', title: 'Cover', depth: 0, pageRef: pages[0].page_id, isProtected: true, children: [] },
      { sectionId: 'state', title: 'Project State', depth: 0, pageRef: pages[1].page_id, isProtected: false, children: [] },
    ],
    typographyMetadata: { fontFamilies: ['Inter'], baseFontSize: 12 },
    protectedMarkings: [{ sectionId: 'cover', markingType: 'methodology' }],
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function deriveInspectorLens(
  ctx: ProjectExecutionContext,
  openIssues: ProjectIssuePacket[],
  blockedCount: number,
): InspectorLensAxes {
  const hasWeatherIssues = openIssues.some(i => i.category === 'weather_impact');
  const hasAccessIssues = openIssues.some(i => i.category === 'access_restriction');
  const hasComplianceIssues = openIssues.some(i => i.category === 'compliance_gap');
  const hasQualityIssues = openIssues.some(i => i.category === 'quality_deficiency');
  const hasInspectionFailures = openIssues.some(i => i.category === 'inspection_failure');

  return {
    siteConditionRealism: hasAccessIssues ? 'constrained' : (blockedCount > 0 ? 'constrained' : 'clear'),
    evidenceReadiness: hasInspectionFailures ? 'insufficient' : (openIssues.length > 3 ? 'partial' : 'complete'),
    complianceExposure: hasComplianceIssues ? 'high' : (openIssues.length > 5 ? 'moderate' : 'none'),
    weatherAccessConstraints: hasWeatherIssues ? 'restricted' : (hasAccessIssues ? 'advisory' : 'clear'),
    fieldPracticality: blockedCount > 2 ? 'low' : (blockedCount > 0 ? 'moderate' : 'high'),
    qualityRisk: hasQualityIssues ? 'high' : (hasInspectionFailures ? 'moderate' : 'none'),
    verificationBurden: openIssues.length > 5 ? 'heavy' : (openIssues.length > 2 ? 'moderate' : 'light'),
    inspectionSequenceDefensibility: hasInspectionFailures ? 'weak' : (blockedCount > 0 ? 'adequate' : 'strong'),
  };
}

function mergeInspectorLens(lenses: InspectorLensAxes[]): InspectorLensAxes {
  if (lenses.length === 0) {
    return {
      siteConditionRealism: 'clear', evidenceReadiness: 'complete', complianceExposure: 'none',
      weatherAccessConstraints: 'clear', fieldPracticality: 'high', qualityRisk: 'none',
      verificationBurden: 'light', inspectionSequenceDefensibility: 'strong',
    };
  }
  // Take worst-case across all lenses
  const worst = <T extends string>(values: T[], order: T[]): T =>
    values.reduce((w, v) => order.indexOf(v) > order.indexOf(w) ? v : w, values[0]);

  return {
    siteConditionRealism: worst(lenses.map(l => l.siteConditionRealism), ['clear', 'constrained', 'impractical']),
    evidenceReadiness: worst(lenses.map(l => l.evidenceReadiness), ['complete', 'partial', 'insufficient']),
    complianceExposure: worst(lenses.map(l => l.complianceExposure), ['none', 'low', 'moderate', 'high']),
    weatherAccessConstraints: worst(lenses.map(l => l.weatherAccessConstraints), ['clear', 'advisory', 'restricted', 'blocked']),
    fieldPracticality: worst(lenses.map(l => l.fieldPracticality), ['high', 'moderate', 'low']),
    qualityRisk: worst(lenses.map(l => l.qualityRisk), ['none', 'low', 'moderate', 'high']),
    verificationBurden: worst(lenses.map(l => l.verificationBurden), ['light', 'moderate', 'heavy']),
    inspectionSequenceDefensibility: worst(lenses.map(l => l.inspectionSequenceDefensibility), ['strong', 'adequate', 'weak']),
  };
}

function buildStateSummaryContent(eval_: ProjectStateEvaluation): string {
  return `Project is currently ${eval_.overallHealth}. ` +
    `${eval_.activePhaseCount} phase(s) active, ${eval_.completedPhaseCount} completed. ` +
    `${eval_.openIssueCount} open issue(s) (${eval_.criticalIssueCount} critical). ` +
    `${eval_.blockedPackageCount} work package(s) blocked.`;
}

function findAffectedPackages(ctx: ProjectExecutionContext, issueIds: string[]): string[] {
  return ctx.issues
    .filter(i => issueIds.includes(i.issueId))
    .flatMap(i => i.affectedPackageIds);
}

function formatCategoryLabel(category: IssueCategory): string {
  return category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
