/**
 * @fileOverview Template Method Binder — Execution-Bound Artifact Generation
 * @domain DocuSCRIBE / Methodology / Artifact Generation
 * @canonical true
 * @status Phase 4 Implementation
 *
 * Generates sovereign DocuSCRIBE™ artifacts (.sgtx, .sggr, .sgta) from
 * method graph execution data. No artifact can exist without execution lineage.
 *
 * Doctrine:
 *   - Every artifact carries methodBinding, lineageRef, and truthState
 *   - Protected sections must not be removed from generated templates
 *   - All generated artifacts include scheduler context metadata
 *   - Artifacts are execution-bound, not freeform
 */

import type { MethodGraph, WorkflowInstance } from '../inspections/methods/contracts';
import type { InspectionMethod } from '../inspections/methods/contracts';
import type { DocuScribePage, DocumentFormatting } from './types';
import type { TruthState } from '@/lib/constants/truth-states';
import {
  createArtifactMetadata,
  type SovereignTextArtifact,
  type SovereignGraphArtifact,
  type SovereignTableArtifact,
  type SovereignArtifactRef,
  type MethodBinding,
  type OwnerBinding,
  type SectionNode,
  type GraphNodeDef,
  type GraphEdgeDef,
  type TableColumn,
  type TableRow,
  type CellValueType,
} from './sovereign-file-classes';
import type {
  SovereignProjectManagerArtifact,
  SovereignProjectPlanArtifact,
} from './sovereign-project-file-classes';
import type { ProjectExecutionContext } from '../contractor/project-manager-types';
import {
  generateProjectBriefingSGTX,
  generateSGPMFromContext,
  generateSGPLFromContext,
} from './project-state-binder';


// ═══════════════════════════════════════════════════════════════════════
// .sgtx Generation — Text Document from Execution
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgtx artifact from method execution data with phase-mapped
 * sections, protected regions, and evidence placements.
 */
export function generateSGTXFromExecution(
  method: InspectionMethod,
  instance: WorkflowInstance,
  graph: MethodGraph,
  ownerBinding: OwnerBinding,
): SovereignTextArtifact {
  const methodBinding: MethodBinding = {
    methodId: instance.methodId,
    workflowInstanceId: instance.instanceId,
  };

  const metadata = createArtifactMetadata('sgtx', methodBinding, 'DocuSCRIBE™', ownerBinding);

  // Build page structure from method phases and completed nodes
  const pages: DocuScribePage[] = [];
  const sectionHierarchy: SectionNode[] = [];

  // Cover page
  pages.push({
    page_id: `p-cover-${metadata.artifactId}`,
    status: 'draft',
    blocks: {},
    content: buildCoverPageContent(method, instance),
  });

  // Build sections from graph nodes
  let pageIndex = 1;
  for (const node of graph.nodes) {
    const nodeState = instance.nodeStates[node.nodeId];
    if (!nodeState) continue;

    const pageId = `p-${pageIndex}-${metadata.artifactId}`;
    const sectionContent = buildNodeSectionContent(node.title, node.description, nodeState.state, instance, node.nodeId);

    pages.push({
      page_id: pageId,
      status: nodeState.state === 'completed' ? 'draft' : 'draft',
      blocks: {},
      content: sectionContent,
    });

    sectionHierarchy.push({
      sectionId: node.nodeId,
      title: node.title,
      depth: 0,
      pageRef: pageId,
      isProtected: method.protectedSections.includes(node.nodeId),
      children: [],
    });

    pageIndex++;
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
    truthState: deriveTruthState(instance) as TruthState,
    textStructure: { pages, formatting },
    sectionHierarchy,
    typographyMetadata: { fontFamilies: ['Inter', 'JetBrains Mono'], baseFontSize: 12 },
    protectedMarkings: method.protectedSections.map(sid => ({
      sectionId: sid,
      markingType: 'methodology' as const,
    })),
  };
}

function buildCoverPageContent(method: InspectionMethod, instance: WorkflowInstance): string {
  return [
    `# ${method.methodName} — Inspection Report`,
    '',
    `**Method:** ${method.methodId} (v${method.version})`,
    `**Entity:** ${instance.linkedEntityType} — ${instance.linkedEntityId}`,
    `**Initiated:** ${instance.startedAt}`,
    `**Status:** ${instance.status}`,
    `**Inspector:** ${instance.startedBy}`,
    '',
    '---',
    '',
    '*This document was generated from governed method execution.*',
    `*Workflow Instance: ${instance.instanceId}*`,
  ].join('\n');
}

function buildNodeSectionContent(
  title: string,
  description: string,
  state: string,
  instance: WorkflowInstance,
  nodeId: string,
): string {
  const evidence = instance.evidenceCaptured[nodeId] || [];
  const evidenceNote = evidence.length > 0
    ? `\n\n**Captured Evidence:** ${evidence.join(', ')}`
    : '\n\n*No evidence captured for this step.*';

  return [
    `## ${title}`,
    '',
    description,
    '',
    `**Status:** ${state}`,
    evidenceNote,
  ].join('\n');
}

// ═══════════════════════════════════════════════════════════════════════
// .sggr Generation — Graph Artifact from Execution
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sggr artifact capturing the workflow graph execution
 * with node states, timing, and branch visualization data.
 */
export function generateSGGRFromGraphExecution(
  method: InspectionMethod,
  instance: WorkflowInstance,
  graph: MethodGraph,
  ownerBinding: OwnerBinding,
): SovereignGraphArtifact {
  const methodBinding: MethodBinding = {
    methodId: instance.methodId,
    workflowInstanceId: instance.instanceId,
  };

  const metadata = createArtifactMetadata('sggr', methodBinding, 'DocuSCRIBE™', ownerBinding);

  // Build node/edge model from graph execution
  const nodes: GraphNodeDef[] = graph.nodes.map(n => ({
    nodeId: n.nodeId,
    label: n.title,
    type: n.nodeClass,
    metadata: {
      state: instance.nodeStates[n.nodeId]?.state || 'unknown',
      updatedAt: instance.nodeStates[n.nodeId]?.updatedAt || '',
    },
  }));

  const edges: GraphEdgeDef[] = graph.edges.map(e => ({
    edgeId: e.edgeId,
    fromNodeId: e.fromNodeId,
    toNodeId: e.toNodeId,
    label: e.edgeType,
  }));

  return {
    ...metadata,
    artifactClass: 'sggr',
    truthState: deriveTruthState(instance) as TruthState,
    graphType: 'workflow',
    seriesModel: [],
    axisDefinitions: [],
    nodeEdgeModel: { nodes, edges },
    renderingRules: {
      colorScheme: 'SCINGULAR-dark',
      labelFormat: 'title-state',
      scaleType: 'categorical',
      legendPosition: 'bottom',
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// .sgta Generation — Table Artifact from Evidence
// ═══════════════════════════════════════════════════════════════════════

/**
 * Generates a .sgta artifact with structured evidence tables,
 * measurements, and observations from method execution.
 */
export function generateSGTAFromEvidence(
  method: InspectionMethod,
  instance: WorkflowInstance,
  graph: MethodGraph,
  ownerBinding: OwnerBinding,
  capturedData?: Record<string, { label: string; value: string | number; unit?: string }[]>,
): SovereignTableArtifact {
  const methodBinding: MethodBinding = {
    methodId: instance.methodId,
    workflowInstanceId: instance.instanceId,
  };

  const metadata = createArtifactMetadata('sgta', methodBinding, 'DocuSCRIBE™', ownerBinding);

  // Build column schema
  const columns: TableColumn[] = [
    { columnId: 'col-node', header: 'Step', valueType: 'string' as CellValueType },
    { columnId: 'col-evidence', header: 'Evidence ID', valueType: 'string' as CellValueType },
    { columnId: 'col-status', header: 'Status', valueType: 'string' as CellValueType },
    { columnId: 'col-captured-at', header: 'Captured At', valueType: 'date' as CellValueType },
  ];

  // Build rows from evidence captured per node
  const rows: TableRow[] = [];
  let rowIndex = 0;

  for (const node of graph.nodes) {
    const evidence = instance.evidenceCaptured[node.nodeId] || [];
    const nodeState = instance.nodeStates[node.nodeId];

    if (evidence.length === 0) {
      // Add a row showing the node with no evidence
      rows.push({
        rowId: `row-${rowIndex++}`,
        cells: [
          { columnId: 'col-node', value: node.title, valueType: 'string' },
          { columnId: 'col-evidence', value: 'None', valueType: 'string' },
          { columnId: 'col-status', value: nodeState?.state || 'unknown', valueType: 'string' },
          { columnId: 'col-captured-at', value: null, valueType: 'date' },
        ],
      });
    } else {
      for (const eid of evidence) {
        rows.push({
          rowId: `row-${rowIndex++}`,
          cells: [
            { columnId: 'col-node', value: node.title, valueType: 'string' },
            { columnId: 'col-evidence', value: eid, valueType: 'string' },
            { columnId: 'col-status', value: 'captured', valueType: 'string' },
            { columnId: 'col-captured-at', value: nodeState?.updatedAt || '', valueType: 'date' },
          ],
        });
      }
    }
  }

  return {
    ...metadata,
    artifactClass: 'sgta',
    truthState: deriveTruthState(instance) as TruthState,
    schema: { columns, rowCount: rows.length },
    rows,
    mergeRegions: [],
    headerRows: 1,
    footerRows: 0,
    computedCells: [],
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Template Completeness Validation
// ═══════════════════════════════════════════════════════════════════════

/**
 * Returns sections that must not be removed from templates.
 */
export function getProtectedSections(method: InspectionMethod): string[] {
  return method.protectedSections;
}

/**
 * Checks that all required template sections are filled based on method execution.
 */
export function validateTemplateCompleteness(
  method: InspectionMethod,
  instance: WorkflowInstance,
  graph: MethodGraph,
): { complete: boolean; missingSections: string[] } {
  const missingSections: string[] = [];

  for (const node of graph.nodes) {
    const nodeState = instance.nodeStates[node.nodeId];
    if (!nodeState) {
      missingSections.push(node.nodeId);
      continue;
    }

    // Required nodes that are not completed or skipped
    if (
      nodeState.state !== 'completed' &&
      nodeState.state !== 'skipped_by_rule' &&
      method.protectedSections.includes(node.nodeId)
    ) {
      missingSections.push(node.nodeId);
    }
  }

  return { complete: missingSections.length === 0, missingSections };
}

// ═══════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Derives a truth-state string from the workflow instance status.
 */
function deriveTruthState(instance: WorkflowInstance): string {
  switch (instance.status) {
    case 'completed': return 'candidate';
    case 'active': return 'draft';
    case 'suspended': return 'draft';
    case 'aborted': return 'mock';
    default: return 'draft';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Project-Specific Artifact Generation
// ═══════════════════════════════════════════════════════════════════════

/**

 * Generates a .sgtx project briefing from project execution context.
 * Delegates to LARI-ProjectManager™ engine for content generation.
 *
 * @see src/lib/services/lari-project-manager.ts — generateProjectBriefingSGTX
 */
export function generateProjectBriefingSGTXFromContext(
  projectId: string,
  projectName: string,
  ownerBinding: OwnerBinding,
): SovereignTextArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-ops-${projectId}`,
  };

  const metadata = createArtifactMetadata('sgtx', methodBinding, 'LARI-ProjectManager™', ownerBinding);

  const pages: DocuScribePage[] = [{
    page_id: `p-cover-${metadata.artifactId}`,
    status: 'draft',
    blocks: {},
    content: [
      `# Project Briefing — ${projectName}`,
      '',
      `**Project ID:** ${projectId}`,
      `**Generated:** ${new Date().toISOString()}`,
      '',
      '*Generated from governed project execution context by LARI-ProjectManager™.*',
    ].join('\n'),
  }];

  const formatting: DocumentFormatting = {
    pageSize: 'Letter',
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    lineSpacing: 1.5,
    fontFamily: 'Inter',
  };

  return {
    ...metadata,
    artifactClass: 'sgtx',
    truthState: 'draft' as import('@/lib/constants/truth-states').TruthState,
    textStructure: { pages, formatting },
    sectionHierarchy: [{
      sectionId: 'cover',
      title: 'Cover',
      depth: 0,
      pageRef: pages[0].page_id,
      isProtected: true,
      children: [],
    }],
    typographyMetadata: { fontFamilies: ['Inter'], baseFontSize: 12 },
    protectedMarkings: [{ sectionId: 'cover', markingType: 'methodology' as const }],
  };
}

/**
 * Generates a .sggr dependency map from project work packages.
 * Delegates to LARI-ProjectPlanner™ engine for graph construction.
 *
 * @see src/lib/services/lari-project-planner.ts — generateDependencyGraphSGGR
 */
export function generateDependencyMapSGGRFromContext(
  projectId: string,
  packageNodes: { id: string; label: string; status: string }[],
  dependencyEdges: { from: string; to: string; type: string }[],
  ownerBinding: OwnerBinding,
): SovereignGraphArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-plan-${projectId}`,
  };

  const metadata = createArtifactMetadata('sggr', methodBinding, 'LARI-ProjectPlanner™', ownerBinding);

  const nodes: GraphNodeDef[] = packageNodes.map(n => ({
    nodeId: n.id,
    label: n.label,
    type: 'work_package',
    metadata: { status: n.status },
  }));

  const edges: GraphEdgeDef[] = dependencyEdges.map((e, i) => ({
    edgeId: `dep-${i}`,
    fromNodeId: e.from,
    toNodeId: e.to,
    label: e.type,
  }));

  return {
    ...metadata,
    artifactClass: 'sggr',
    truthState: 'draft' as import('@/lib/constants/truth-states').TruthState,
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

/**
 * Generates a .sgta project schedule table from work packages.
 * Delegates to LARI-ProjectPlanner™ engine for tabular construction.
 *
 * @see src/lib/services/lari-project-planner.ts — generateScheduleTableSGTA
 */
export function generateProjectScheduleSGTAFromContext(
  projectId: string,
  packages: { title: string; phase: string; trade: string; status: string; posture: string; start: string; end: string }[],
  ownerBinding: OwnerBinding,
): SovereignTableArtifact {
  const methodBinding: MethodBinding = {
    methodId: `project-schedule-${projectId}`,
  };

  const metadata = createArtifactMetadata('sgta', methodBinding, 'LARI-ProjectPlanner™', ownerBinding);

  const columns: TableColumn[] = [
    { columnId: 'col-package', header: 'Work Package', valueType: 'string' as CellValueType },
    { columnId: 'col-phase', header: 'Phase', valueType: 'string' as CellValueType },
    { columnId: 'col-trade', header: 'Trade', valueType: 'string' as CellValueType },
    { columnId: 'col-status', header: 'Status', valueType: 'string' as CellValueType },
    { columnId: 'col-posture', header: 'Posture', valueType: 'string' as CellValueType },
    { columnId: 'col-start', header: 'Est. Start', valueType: 'date' as CellValueType },
    { columnId: 'col-end', header: 'Est. End', valueType: 'date' as CellValueType },
  ];

  const rows: TableRow[] = packages.map((p, i) => ({
    rowId: `row-${i}`,
    cells: [
      { columnId: 'col-package', value: p.title, valueType: 'string' },
      { columnId: 'col-phase', value: p.phase, valueType: 'string' },
      { columnId: 'col-trade', value: p.trade, valueType: 'string' },
      { columnId: 'col-status', value: p.status, valueType: 'string' },
      { columnId: 'col-posture', value: p.posture, valueType: 'string' },
      { columnId: 'col-start', value: p.start, valueType: 'date' },
      { columnId: 'col-end', value: p.end, valueType: 'date' },
    ],
  }));

  return {
    ...metadata,
    artifactClass: 'sgta',
    truthState: 'draft' as import('@/lib/constants/truth-states').TruthState,
    schema: { columns, rowCount: rows.length },
    rows,
    mergeRegions: [],
    headerRows: 1,
    footerRows: 0,
    computedCells: [],
  };
}

