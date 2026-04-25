/**
 * @fileOverview LARI-ProjectPlanner™ — Bounded Project Sequencing and Planning Engine
 * @domain LARI / Contractor / Project Planning
 * @canonical true
 * @status Implemented
 *
 * Handles work package planning, dependency mapping, critical path modeling,
 * scenario generation, and resequencing advisories.
 *
 * Doctrine:
 *   - May propose but may not commit schedule mutation
 *   - Must route all timing logic through SmartSCHEDULER™ posture layer
 *   - Must preserve project-specific constraints and method dependencies
 *   - All functions require ProjectExecutionContext
 *   - Inspector-lens required on all scenario outputs
 */

import type {
  ProjectExecutionContext,
  ProjectPlannerScenario,
  ProjectWorkPackage,
  DependencyEdge,
  ResequencingProposal,
  InspectorLensAxes,
  DependencyMap,
  CriticalPathResult,
} from '@/lib/contractor/project-manager-types';
import type { SchedulePosture } from '@/lib/types';
import {
  createArtifactMetadata,
  type SovereignGraphArtifact,
  type SovereignTableArtifact,
  type MethodBinding,
  type OwnerBinding,
  type GraphNodeDef,
  type GraphEdgeDef,
  type TableColumn,
  type TableRow,
  type CellValueType,
} from '@/lib/docuscribe/sovereign-file-classes';

// ═══════════════════════════════════════════════════════════════════════
// Dependency Mapping
// ═══════════════════════════════════════════════════════════════════════

// Mapping logic moved to project-manager-types.ts


/**
 * Creates a dependency graph from work packages.
 * Identifies orphaned packages and circular dependencies.
 */
export function buildDependencyMap(
  ctx: ProjectExecutionContext,
): DependencyMap {
  const allPackages = ctx.phases.flatMap(p => p.workPackages);
  const packageIds = new Set(allPackages.map(wp => wp.packageId));
  const edges: DependencyEdge[] = [];
  const referencedIds = new Set<string>();

  for (const wp of allPackages) {
    for (const depId of wp.dependsOn) {
      if (packageIds.has(depId)) {
        edges.push({
          fromPackageId: depId,
          toPackageId: wp.packageId,
          dependencyType: 'finish_to_start',
          lagDays: 0,
        });
        referencedIds.add(depId);
        referencedIds.add(wp.packageId);
      }
    }
  }

  // Identify orphaned packages (no dependencies in or out)
  const orphanedPackages = allPackages
    .filter(wp => !referencedIds.has(wp.packageId) && wp.dependsOn.length === 0)
    .map(wp => wp.packageId);

  // Detect circular dependencies (simple DFS-based detection)
  const circularDependencies = detectCircularDependencies(edges, packageIds);

  return {
    projectId: ctx.projectId,
    edges,
    orphanedPackages,
    circularDependencies,
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Critical Path Evaluation
// ═══════════════════════════════════════════════════════════════════════

// Analysis logic moved to project-manager-types.ts


/**
 * Identifies the critical path through the dependency graph.
 * Uses longest-path analysis on package duration estimates.
 */
export function evaluateCriticalPath(
  ctx: ProjectExecutionContext,
  depMap: DependencyMap,
): CriticalPathResult {
  const allPackages = ctx.phases.flatMap(p => p.workPackages);
  const packageMap = new Map(allPackages.map(wp => [wp.packageId, wp]));

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  for (const wp of allPackages) {
    adjacency.set(wp.packageId, []);
    inDegree.set(wp.packageId, 0);
  }
  for (const edge of depMap.edges) {
    const existing = adjacency.get(edge.fromPackageId) || [];
    existing.push(edge.toPackageId);
    adjacency.set(edge.fromPackageId, existing);
    inDegree.set(edge.toPackageId, (inDegree.get(edge.toPackageId) || 0) + 1);
  }

  // Topological sort with longest-path calculation
  const dist = new Map<string, number>();
  const predecessor = new Map<string, string | null>();
  for (const wp of allPackages) {
    dist.set(wp.packageId, 0);
    predecessor.set(wp.packageId, null);
  }

  // Process in topological order
  const queue = [...inDegree.entries()]
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);

  const processed: string[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    processed.push(current);

    const wp = packageMap.get(current);
    const duration = estimatePackageDuration(wp);
    const currentDist = (dist.get(current) || 0) + duration;

    for (const next of (adjacency.get(current) || [])) {
      if (currentDist > (dist.get(next) || 0)) {
        dist.set(next, currentDist);
        predecessor.set(next, current);
      }
      const newDeg = (inDegree.get(next) || 1) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }

  // Find the endpoint with maximum distance
  let maxDist = 0;
  let endNode = '';
  for (const [id, d] of dist) {
    if (d > maxDist) {
      maxDist = d;
      endNode = id;
    }
  }

  // Trace back critical path
  const criticalPath: string[] = [];
  let current: string | null = endNode;
  while (current) {
    criticalPath.unshift(current);
    current = predecessor.get(current) || null;
  }

  return {
    projectId: ctx.projectId,
    criticalPathIds: criticalPath,
    estimatedDurationDays: maxDist,
    bottleneckPackageId: criticalPath.length > 0 ? criticalPath[Math.floor(criticalPath.length / 2)] : undefined,
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Scenario Generation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a what-if sequencing scenario with SmartSCHEDULER™ integration.
 * Does NOT commit any schedule mutation — advisory only.
 */
export function generateSequencingScenario(
  ctx: ProjectExecutionContext,
  depMap: DependencyMap,
  criticalPath: CriticalPathResult,
  scenarioName: string,
  hypothesis: string,
  resequencingPackageIds?: string[],
): ProjectPlannerScenario {
  const timestamp = new Date().toISOString();
  const allPackages = ctx.phases.flatMap(p => p.workPackages);

  // Build resequencing proposals for specified packages
  const resequencingProposals: ResequencingProposal[] = [];
  if (resequencingPackageIds) {
    for (const pkgId of resequencingPackageIds) {
      const wp = allPackages.find(p => p.packageId === pkgId);
      if (wp && wp.estimatedStart && wp.estimatedEnd) {
        // Propose shifting forward by package duration
        const duration = estimatePackageDuration(wp);
        const proposedStart = shiftDateString(wp.estimatedStart, duration);
        const proposedEnd = shiftDateString(wp.estimatedEnd, duration);

        resequencingProposals.push({
          proposalId: `rp-${pkgId}-${Date.now()}`,
          packageId: pkgId,
          originalSlot: { start: wp.estimatedStart, end: wp.estimatedEnd },
          proposedSlot: { start: proposedStart, end: proposedEnd },
          reason: `Scenario resequencing: ${hypothesis}`,
          downstreamImpact: findDownstreamPackages(pkgId, depMap),
        });
      }
    }
  }

  // Evaluate scheduler posture impacts
  const schedulerImpacts = allPackages
    .filter(wp => resequencingPackageIds?.includes(wp.packageId))
    .map(wp => ({
      packageId: wp.packageId,
      proposedPosture: 'advisory_candidate' as SchedulePosture,
      reason: `Resequenced in scenario: ${scenarioName}`,
    }));

  // Inspector-lens assessment for this scenario
  const inspectorLens = assessScenarioLens(ctx, resequencingProposals, criticalPath);

  return {
    scenarioId: `scn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    projectId: ctx.projectId,
    scenarioName,
    hypothesis,
    dependencyMap: depMap.edges,
    criticalPathIds: criticalPath.criticalPathIds,
    estimatedDurationDays: criticalPath.estimatedDurationDays,
    schedulerImpacts,
    resequencingProposals,
    inspectorLens,
    lineageRef: {
      sourceEngineId: 'LARI-ProjectPlanner',
      generatedAt: timestamp,
      basedOnContextSnapshot: `${ctx.projectId}:${timestamp}`,
    },
    publishState: 'draft',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Resequencing Impact Evaluation
// ═══════════════════════════════════════════════════════════════════════

export interface ResequencingImpact {
  proposalId: string;
  affectedDownstream: string[];
  estimatedDelayDays: number;
  schedulerPostureChanges: { packageId: string; from: SchedulePosture; to: SchedulePosture }[];
  inspectorLens: InspectorLensAxes;
}

/**
 * Assesses the impact of a proposed resequencing on downstream dependencies.
 */
export function evaluateResequencingImpact(
  ctx: ProjectExecutionContext,
  proposal: ResequencingProposal,
  depMap: DependencyMap,
): ResequencingImpact {
  const downstream = findDownstreamPackages(proposal.packageId, depMap);
  const allPackages = ctx.phases.flatMap(p => p.workPackages);

  // Calculate delay propagation
  const originalDuration = daysBetween(proposal.originalSlot.start, proposal.originalSlot.end);
  const proposedDuration = daysBetween(proposal.proposedSlot.start, proposal.proposedSlot.end);
  const shift = daysBetween(proposal.originalSlot.start, proposal.proposedSlot.start);

  // Identify posture changes
  const postureChanges = downstream.map(pkgId => {
    const wp = allPackages.find(p => p.packageId === pkgId);
    return {
      packageId: pkgId,
      from: wp?.schedulerPosture || ('approved_candidate' as SchedulePosture),
      to: (shift > 5 ? 'manual_review_required' : 'advisory_candidate') as SchedulePosture,
    };
  });

  return {
    proposalId: proposal.proposalId,
    affectedDownstream: downstream,
    estimatedDelayDays: shift,
    schedulerPostureChanges: postureChanges,
    inspectorLens: {
      siteConditionRealism: shift > 10 ? 'constrained' : 'clear',
      evidenceReadiness: 'partial',
      complianceExposure: shift > 14 ? 'moderate' : 'low',
      weatherAccessConstraints: 'advisory',
      fieldPracticality: shift > 7 ? 'moderate' : 'high',
      qualityRisk: 'low',
      verificationBurden: downstream.length > 3 ? 'heavy' : 'moderate',
      inspectionSequenceDefensibility: downstream.length > 5 ? 'weak' : 'adequate',
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Dependency Graph Artifact (.sggr)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sggr dependency graph visualization artifact.
 */
export function generateDependencyGraphSGGR(
  ctx: ProjectExecutionContext,
  depMap: DependencyMap,
  criticalPath: CriticalPathResult,
  ownerBinding: OwnerBinding,
): SovereignGraphArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-plan-${ctx.projectId}`,
    workflowInstanceId: ctx.workflowInstanceIds[0] || 'none',
  };

  const metadata = createArtifactMetadata('sggr', methodBinding, 'LARI-ProjectPlanner™', ownerBinding);
  const allPackages = ctx.phases.flatMap(p => p.workPackages);
  const criticalSet = new Set(criticalPath.criticalPathIds);

  // Build graph nodes from work packages
  const nodes: GraphNodeDef[] = allPackages.map(wp => ({
    nodeId: wp.packageId,
    label: wp.title,
    type: criticalSet.has(wp.packageId) ? 'critical' : 'standard',
    metadata: {
      status: wp.status,
      trade: wp.assignedTradeClass.join(', '),
      posture: wp.schedulerPosture,
    },
  }));

  // Build edges from dependency map
  const edges: GraphEdgeDef[] = depMap.edges.map((e, i) => ({
    edgeId: `dep-${i}`,
    fromNodeId: e.fromPackageId,
    toNodeId: e.toPackageId,
    label: e.dependencyType,
  }));

  return {
    ...metadata,
    artifactClass: 'sggr',
    truthState: 'mock',
    graphType: 'network',
    seriesModel: [],
    axisDefinitions: [],
    nodeEdgeModel: { nodes, edges },
    renderingRules: {
      colorScheme: 'SCINGULAR-dark',
      labelFormat: 'title-status',
      scaleType: 'categorical',
      legendPosition: 'bottom',
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Schedule Table Artifact (.sgta)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgta schedule/package table artifact.
 */
export function generateScheduleTableSGTA(
  ctx: ProjectExecutionContext,
  ownerBinding: OwnerBinding,
): SovereignTableArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-schedule-${ctx.projectId}`,
    workflowInstanceId: ctx.workflowInstanceIds[0] || 'none',
  };

  const metadata = createArtifactMetadata('sgta', methodBinding, 'LARI-ProjectPlanner™', ownerBinding);
  const allPackages = ctx.phases.flatMap(p => p.workPackages);

  const columns: TableColumn[] = [
    { columnId: 'col-package', header: 'Work Package', valueType: 'string' as CellValueType },
    { columnId: 'col-phase', header: 'Phase', valueType: 'string' as CellValueType },
    { columnId: 'col-trade', header: 'Trade', valueType: 'string' as CellValueType },
    { columnId: 'col-status', header: 'Status', valueType: 'string' as CellValueType },
    { columnId: 'col-posture', header: 'Scheduler Posture', valueType: 'string' as CellValueType },
    { columnId: 'col-est-start', header: 'Est. Start', valueType: 'date' as CellValueType },
    { columnId: 'col-est-end', header: 'Est. End', valueType: 'date' as CellValueType },
    { columnId: 'col-deps', header: 'Dependencies', valueType: 'string' as CellValueType },
  ];

  const rows: TableRow[] = allPackages.map((wp, i) => {
    const phase = ctx.phases.find(p => p.phaseId === wp.phaseId);
    return {
      rowId: `row-${i}`,
      cells: [
        { columnId: 'col-package', value: wp.title, valueType: 'string' },
        { columnId: 'col-phase', value: phase?.phaseName || wp.phaseId, valueType: 'string' },
        { columnId: 'col-trade', value: wp.assignedTradeClass.join(', '), valueType: 'string' },
        { columnId: 'col-status', value: wp.status, valueType: 'string' },
        { columnId: 'col-posture', value: wp.schedulerPosture, valueType: 'string' },
        { columnId: 'col-est-start', value: wp.estimatedStart || '', valueType: 'date' },
        { columnId: 'col-est-end', value: wp.estimatedEnd || '', valueType: 'date' },
        { columnId: 'col-deps', value: wp.dependsOn.join(', ') || 'None', valueType: 'string' },
      ],
    };
  });

  return {
    ...metadata,
    artifactClass: 'sgta',
    truthState: 'mock',
    schema: { columns, rowCount: rows.length },
    rows,
    mergeRegions: [],
    headerRows: 1,
    footerRows: 0,
    computedCells: [],
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function estimatePackageDuration(wp?: ProjectWorkPackage): number {
  if (!wp || !wp.estimatedStart || !wp.estimatedEnd) return 7; // Default 7 days
  return Math.max(1, daysBetween(wp.estimatedStart, wp.estimatedEnd));
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function shiftDateString(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function findDownstreamPackages(packageId: string, depMap: DependencyMap): string[] {
  const downstream: string[] = [];
  const visited = new Set<string>();
  const queue = [packageId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of depMap.edges) {
      if (edge.fromPackageId === current && !visited.has(edge.toPackageId)) {
        visited.add(edge.toPackageId);
        downstream.push(edge.toPackageId);
        queue.push(edge.toPackageId);
      }
    }
  }

  return downstream;
}

function detectCircularDependencies(
  edges: DependencyEdge[],
  nodeIds: Set<string>,
): string[][] {
  const adjacency = new Map<string, string[]>();
  for (const id of nodeIds) adjacency.set(id, []);
  for (const e of edges) {
    const existing = adjacency.get(e.fromPackageId) || [];
    existing.push(e.toPackageId);
    adjacency.set(e.fromPackageId, existing);
  }

  const cycles: string[][] = [];
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): void {
    if (inStack.has(node)) {
      const cycleStart = path.indexOf(node);
      if (cycleStart >= 0) {
        cycles.push(path.slice(cycleStart));
      }
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);
    path.push(node);

    for (const neighbor of (adjacency.get(node) || [])) {
      dfs(neighbor);
    }

    path.pop();
    inStack.delete(node);
  }

  for (const id of nodeIds) {
    if (!visited.has(id)) dfs(id);
  }

  return cycles;
}

function assessScenarioLens(
  ctx: ProjectExecutionContext,
  proposals: ResequencingProposal[],
  criticalPath: CriticalPathResult,
): InspectorLensAxes {
  const hasMajorShifts = proposals.some(p =>
    daysBetween(p.originalSlot.start, p.proposedSlot.start) > 7
  );
  const touchesCritical = proposals.some(p =>
    criticalPath.criticalPathIds.includes(p.packageId)
  );

  return {
    siteConditionRealism: hasMajorShifts ? 'constrained' : 'clear',
    evidenceReadiness: 'partial',
    complianceExposure: touchesCritical ? 'moderate' : 'low',
    weatherAccessConstraints: 'advisory',
    fieldPracticality: hasMajorShifts ? 'moderate' : 'high',
    qualityRisk: touchesCritical ? 'moderate' : 'low',
    verificationBurden: proposals.length > 3 ? 'heavy' : 'moderate',
    inspectionSequenceDefensibility: touchesCritical ? 'adequate' : 'strong',
  };
}
