/**
 * @fileOverview Sovereign File-Class System — SCINGULAR™ / DocuSCRIBE™
 * @domain File Architecture / DocuSCRIBE / Governance
 * @canonical true
 * @status Phase 1 Implementation
 *
 * Establishes .sgtx, .sggr, and .sgta as sovereign DocuSCRIBE™ file classes
 * within the .sg* ecosystem. Defines schemas, metadata envelopes, validation
 * rules, and registry infrastructure.
 *
 * Doctrine:
 *   - Native sovereign artifacts are the source of truth
 *   - Exports (PDF/DOCX/HTML) are derivative representations only
 *   - All artifacts require execution lineage and metadata
 *   - Foreign export drift must not back-propagate into native truth
 */

import type { TruthState } from '@/lib/constants/truth-states';
import type { DocuScribePage, DocumentFormatting } from './types';

// ═══════════════════════════════════════════════════════════════════════
// File-Class Constants
// ═══════════════════════════════════════════════════════════════════════

/**
 * Canonical sovereign file-class extensions for DocuSCRIBE™.
 * Locked by UTCB SG-DOCUSCRIBE-FORMATS-001.
 */
export const SOVEREIGN_FILE_CLASSES = {
  SGTX: '.sgtx',
  SGGR: '.sggr',
  SGTA: '.sgta',
  SGPM: '.sgpm',
  SGPL: '.sgpl',
} as const;

export type SovereignFileExtension = typeof SOVEREIGN_FILE_CLASSES[keyof typeof SOVEREIGN_FILE_CLASSES];

/**
 * Artifact class identifiers (suffix without dot).
 */
export type ArtifactClass = 'sgtx' | 'sggr' | 'sgta' | 'sgpm' | 'sgpl';

/**
 * Deferred composite classes — recognized but not locked.
 */
export const DEFERRED_FILE_CLASSES = {
  SGDC: '.sgdc',  // SCINGULAR™ Governed DocuSCRIBE™ Composite
  SGDP: '.sgdp',  // SCINGULAR™ Governed DocuSCRIBE™ Package
} as const;

/**
 * Rejected extensions — not to be used.
 */
export const REJECTED_EXTENSIONS = ['.sgdoc', '.sgtext', '.sgtbl', '.sggraph'] as const;

// ═══════════════════════════════════════════════════════════════════════
// Common Metadata Envelope
// ═══════════════════════════════════════════════════════════════════════

export type RenderIntent = 'authored' | 'display' | 'export';
export type ApprovalState = 'draft' | 'pending_review' | 'approved' | 'rejected';
export type RetentionClass = 'standard' | 'legal_hold' | 'archive' | 'ephemeral';
export type ExportTargetFormat = 'html' | 'pdf' | 'docx' | 'csv' | 'png' | 'json';

/**
 * Lineage reference for version chain tracking.
 * Every sovereign artifact carries a full lineage trail.
 */
export interface LineageRef {
  parentId: string | null;
  versionChain: string[];
}

/**
 * Owner binding — workspace or user scope.
 */
export interface OwnerBinding {
  type: 'workspace' | 'user';
  id: string;
}

/**
 * Cryptographic signature block for artifact integrity.
 */
export interface ArtifactSignatureBlock {
  signer: string;
  timestamp: string;
  hash: string;
  algorithm: string;
}

/**
 * Method execution binding — every sovereign artifact
 * must reference its originating method context.
 */
export interface MethodBinding {
  methodId: string;
  phaseId?: string;
  nodeId?: string;
  workflowInstanceId?: string;
}

/**
 * Common metadata envelope for all sovereign DocuSCRIBE™ file classes.
 * Required fields enforced by UTCB SG-DOCUSCRIBE-FORMATS-001.
 */
export interface SovereignArtifactMetadata {
  /** Unique artifact identifier */
  artifactId: string;
  /** File-class discriminator */
  artifactClass: ArtifactClass;
  /** Schema version (SemVer) */
  formatVersion: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last modification */
  updatedAt: string;
  /** Authority that originated this artifact */
  originAuthority: string;
  /** Owner scope binding */
  ownerBinding: OwnerBinding;
  /** Current truth-state */
  truthState: TruthState;
  /** Version lineage trail */
  lineageRef: LineageRef;
  /** Layer intent marker */
  renderIntent: RenderIntent;
  /** Compatible foreign export targets */
  exportCompatibility: ExportTargetFormat[];
  /** Method execution binding (required for execution-bound artifacts) */
  methodBinding: MethodBinding;

  // ─── Optional but Expected ───────────────────────────────────────
  /** Cryptographic signature block */
  signatureBlock?: ArtifactSignatureBlock;
  /** TrustStamp reference ID */
  evidentiaryStamp?: string;
  /** Protected region IDs that must not be modified */
  protectedRegions?: string[];
  /** Approval state */
  approvalState?: ApprovalState;
  /** Retention class for lifecycle management */
  retentionClass?: RetentionClass;
}

// ═══════════════════════════════════════════════════════════════════════
// .sgtx — SCINGULAR™ Governed Text Artifact
// ═══════════════════════════════════════════════════════════════════════

/**
 * Section hierarchy node for structured document navigation.
 */
export interface SectionNode {
  sectionId: string;
  title: string;
  depth: number;
  pageRef: string;
  isProtected: boolean;
  children: SectionNode[];
}

/**
 * Protected marking on a specific section.
 */
export interface ProtectedMarking {
  sectionId: string;
  markingType: 'disclosure' | 'compliance' | 'safety' | 'legal' | 'methodology';
  content?: string;
}

/**
 * SCINGULAR™ Governed Text Artifact (.sgtx)
 *
 * Native DocuSCRIBE™ authored text document with page-aware structure,
 * typography metadata, section hierarchy, and method binding.
 */
export interface SovereignTextArtifact extends SovereignArtifactMetadata {
  artifactClass: 'sgtx';
  /** Authored page structure */
  textStructure: {
    pages: DocuScribePage[];
    formatting: DocumentFormatting;
  };
  /** Hierarchical section tree */
  sectionHierarchy: SectionNode[];
  /** Typography metadata */
  typographyMetadata: {
    fontFamilies: string[];
    baseFontSize: number;
  };
  /** Protected markings and required overlays */
  protectedMarkings: ProtectedMarking[];
}

// ═══════════════════════════════════════════════════════════════════════
// .sggr — SCINGULAR™ Governed Graph Artifact
// ═══════════════════════════════════════════════════════════════════════

export type GraphType = 'chart' | 'diagram' | 'network' | 'workflow';

/**
 * Data series for chart-type graphs.
 */
export interface GraphSeries {
  seriesId: string;
  label: string;
  dataPoints: { x: number | string; y: number }[];
  color?: string;
  type?: 'line' | 'bar' | 'scatter' | 'area';
}

/**
 * Axis definition for chart-type graphs.
 */
export interface AxisDefinition {
  axisId: string;
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  scaleType: 'linear' | 'logarithmic' | 'categorical' | 'time';
  min?: number;
  max?: number;
}

/**
 * Node for diagram/network graphs.
 */
export interface GraphNodeDef {
  nodeId: string;
  label: string;
  type: string;
  metadata?: Record<string, string>;
}

/**
 * Edge for diagram/network graphs.
 */
export interface GraphEdgeDef {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  weight?: number;
}

/**
 * Rendering rules for graph presentation.
 */
export interface GraphRenderingRules {
  colorScheme: string;
  labelFormat: string;
  scaleType: string;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right' | 'none';
}

/**
 * SCINGULAR™ Governed Graph Artifact (.sggr)
 *
 * Native graph/chart/diagram data artifact. Preserves structural
 * graph definition rather than flattened image output.
 */
export interface SovereignGraphArtifact extends SovereignArtifactMetadata {
  artifactClass: 'sggr';
  /** Graph classification */
  graphType: GraphType;
  /** Data series for charts */
  seriesModel: GraphSeries[];
  /** Axis definitions for charts */
  axisDefinitions: AxisDefinition[];
  /** Node/edge model for diagrams and networks */
  nodeEdgeModel?: {
    nodes: GraphNodeDef[];
    edges: GraphEdgeDef[];
  };
  /** Rendering rules */
  renderingRules: GraphRenderingRules;
}

// ═══════════════════════════════════════════════════════════════════════
// .sgta — SCINGULAR™ Governed Table Artifact
// ═══════════════════════════════════════════════════════════════════════

/**
 * Cell value typing for structured tables.
 */
export type CellValueType = 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage' | 'empty';

/**
 * Column definition for governed tables.
 */
export interface TableColumn {
  columnId: string;
  header: string;
  valueType: CellValueType;
  width?: number;
  isProtected?: boolean;
}

/**
 * Cell within a governed table.
 */
export interface TableCell {
  columnId: string;
  value: string | number | boolean | null;
  valueType: CellValueType;
  displayFormat?: string;
}

/**
 * Row within a governed table.
 */
export interface TableRow {
  rowId: string;
  cells: TableCell[];
  isHeaderRow?: boolean;
  isFooterRow?: boolean;
}

/**
 * Merge region for spanned cells.
 */
export interface MergeRegion {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

/**
 * Computed cell reference (deferred implementation).
 */
export interface ComputedCell {
  rowId: string;
  columnId: string;
  formula: string;
  dependencies: string[];
}

/**
 * SCINGULAR™ Governed Table Artifact (.sgta)
 *
 * Native table/spread matrix artifact with row/column schema,
 * cell typing, merge logic, and header/body/footer semantics.
 */
export interface SovereignTableArtifact extends SovereignArtifactMetadata {
  artifactClass: 'sgta';
  /** Column schema */
  schema: {
    columns: TableColumn[];
    rowCount: number;
  };
  /** Table data rows */
  rows: TableRow[];
  /** Merged cell regions */
  mergeRegions: MergeRegion[];
  /** Number of header rows */
  headerRows: number;
  /** Number of footer rows */
  footerRows: number;
  /** Computed cell references (deferred — formula engine not yet active) */
  computedCells: ComputedCell[];
}

// ═══════════════════════════════════════════════════════════════════════
// Sovereign Artifact Union
// ═══════════════════════════════════════════════════════════════════════

/**
 * Union type for any sovereign DocuSCRIBE™ artifact.
 */
export type SovereignArtifact =
  | SovereignTextArtifact
  | SovereignGraphArtifact
  | SovereignTableArtifact;

/**
 * Reference to a sovereign artifact (lightweight pointer for cross-referencing).
 */
export interface SovereignArtifactRef {
  artifactId: string;
  artifactClass: ArtifactClass;
  createdAt: string;
  nodeId?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// File-Class Registry
// ═══════════════════════════════════════════════════════════════════════

export interface FileClassInfo {
  extension: SovereignFileExtension;
  canonicalName: string;
  artifactClass: ArtifactClass;
  primaryRole: string;
  exportTargets: ExportTargetFormat[];
  engineOwner: string;
}

const FILE_CLASS_REGISTRY: Record<ArtifactClass, FileClassInfo> = {
  sgtx: {
    extension: '.sgtx',
    canonicalName: 'SCINGULAR™ Governed Text Artifact',
    artifactClass: 'sgtx',
    primaryRole: 'Native DocuSCRIBE™ authored text document with page-aware structure',
    exportTargets: ['html', 'pdf', 'docx'],
    engineOwner: 'DocuSCRIBE™',
  },
  sggr: {
    extension: '.sggr',
    canonicalName: 'SCINGULAR™ Governed Graph Artifact',
    artifactClass: 'sggr',
    primaryRole: 'Native graph/chart/diagram data artifact with recoverable structure',
    exportTargets: ['html', 'png', 'json'],
    engineOwner: 'DocuSCRIBE™',
  },
  sgta: {
    extension: '.sgta',
    canonicalName: 'SCINGULAR™ Governed Table Artifact',
    artifactClass: 'sgta',
    primaryRole: 'Native table/spread matrix artifact with cell-level semantics',
    exportTargets: ['html', 'csv', 'json'],
    engineOwner: 'DocuSCRIBE™',
  },
  sgpm: {
    extension: '.sgpm',
    canonicalName: 'SCINGULAR™ Governed Project Manager Artifact',
    artifactClass: 'sgpm',
    primaryRole: 'Governed project-state container for managerial and advisory state',
    exportTargets: ['html', 'pdf', 'json'],
    engineOwner: 'DocuSCRIBE™',
  },
  sgpl: {
    extension: '.sgpl',
    canonicalName: 'SCINGULAR™ Governed Project Plan Artifact',
    artifactClass: 'sgpl',
    primaryRole: 'Governed project-state container for planning and sequencing state',
    exportTargets: ['html', 'pdf', 'json'],
    engineOwner: 'DocuSCRIBE™',
  },
};

/**
 * Returns file-class info for a given artifact class.
 */
export function getFileClassInfo(artifactClass: ArtifactClass): FileClassInfo {
  return FILE_CLASS_REGISTRY[artifactClass];
}

/**
 * Returns file-class info by extension string.
 */
export function getFileClassByExtension(extension: string): FileClassInfo | undefined {
  return Object.values(FILE_CLASS_REGISTRY).find(fc => fc.extension === extension);
}

/**
 * Checks if an extension is a registered sovereign DocuSCRIBE™ class.
 */
export function isNativeSovereignClass(extension: string): boolean {
  return Object.values(SOVEREIGN_FILE_CLASSES).includes(extension as SovereignFileExtension);
}

/**
 * Returns supported export formats for a given artifact class.
 */
export function getSupportedExports(artifactClass: ArtifactClass): ExportTargetFormat[] {
  return FILE_CLASS_REGISTRY[artifactClass]?.exportTargets ?? [];
}

// ═══════════════════════════════════════════════════════════════════════
// Validation
// ═══════════════════════════════════════════════════════════════════════

export type ValidationRejectionCode =
  | 'MISSING_ARTIFACT_ID'
  | 'MISSING_ARTIFACT_CLASS'
  | 'INVALID_ARTIFACT_CLASS'
  | 'MISSING_FORMAT_VERSION'
  | 'INVALID_FORMAT_VERSION'
  | 'MISSING_CREATED_AT'
  | 'MISSING_UPDATED_AT'
  | 'MISSING_ORIGIN_AUTHORITY'
  | 'MISSING_OWNER_BINDING'
  | 'MISSING_TRUTH_STATE'
  | 'INVALID_TRUTH_STATE'
  | 'MISSING_LINEAGE_REF'
  | 'MISSING_RENDER_INTENT'
  | 'MISSING_EXPORT_COMPATIBILITY'
  | 'MISSING_METHOD_BINDING'
  | 'NO_METHOD_ID'
  | 'EMPTY_TEXT_STRUCTURE'
  | 'EMPTY_GRAPH_MODEL'
  | 'EMPTY_TABLE_SCHEMA';

export interface ValidationResult {
  valid: boolean;
  rejections: { code: ValidationRejectionCode; message: string }[];
}

/**
 * Validates the common metadata envelope shared by all sovereign artifacts.
 */
function validateMetadata(artifact: SovereignArtifactMetadata): ValidationResult {
  const rejections: ValidationResult['rejections'] = [];

  if (!artifact.artifactId) {
    rejections.push({ code: 'MISSING_ARTIFACT_ID', message: 'artifactId is required' });
  }
  if (!artifact.artifactClass) {
    rejections.push({ code: 'MISSING_ARTIFACT_CLASS', message: 'artifactClass is required' });
  } else if (!['sgtx', 'sggr', 'sgta', 'sgpm', 'sgpl'].includes(artifact.artifactClass)) {
    rejections.push({ code: 'INVALID_ARTIFACT_CLASS', message: `Unrecognized artifactClass: ${artifact.artifactClass}` });
  }
  if (!artifact.formatVersion) {
    rejections.push({ code: 'MISSING_FORMAT_VERSION', message: 'formatVersion is required' });
  } else if (!/^\d+\.\d+\.\d+$/.test(artifact.formatVersion)) {
    rejections.push({ code: 'INVALID_FORMAT_VERSION', message: 'formatVersion must be SemVer (e.g. 1.0.0)' });
  }
  if (!artifact.createdAt) {
    rejections.push({ code: 'MISSING_CREATED_AT', message: 'createdAt is required' });
  }
  if (!artifact.updatedAt) {
    rejections.push({ code: 'MISSING_UPDATED_AT', message: 'updatedAt is required' });
  }
  if (!artifact.originAuthority) {
    rejections.push({ code: 'MISSING_ORIGIN_AUTHORITY', message: 'originAuthority is required' });
  }
  if (!artifact.ownerBinding) {
    rejections.push({ code: 'MISSING_OWNER_BINDING', message: 'ownerBinding is required' });
  }
  if (!artifact.truthState) {
    rejections.push({ code: 'MISSING_TRUTH_STATE', message: 'truthState is required' });
  }
  if (!artifact.lineageRef) {
    rejections.push({ code: 'MISSING_LINEAGE_REF', message: 'lineageRef is required' });
  }
  if (!artifact.renderIntent) {
    rejections.push({ code: 'MISSING_RENDER_INTENT', message: 'renderIntent is required' });
  }
  if (!artifact.exportCompatibility) {
    rejections.push({ code: 'MISSING_EXPORT_COMPATIBILITY', message: 'exportCompatibility is required' });
  }
  if (!artifact.methodBinding) {
    rejections.push({ code: 'MISSING_METHOD_BINDING', message: 'methodBinding is required (execution-bound)' });
  } else if (!artifact.methodBinding.methodId) {
    rejections.push({ code: 'NO_METHOD_ID', message: 'methodBinding.methodId is required' });
  }

  return { valid: rejections.length === 0, rejections };
}

/**
 * Validates a .sgtx text artifact.
 */
export function validateSGTX(artifact: SovereignTextArtifact): ValidationResult {
  const result = validateMetadata(artifact);

  if (!artifact.textStructure || !artifact.textStructure.pages || artifact.textStructure.pages.length === 0) {
    result.rejections.push({ code: 'EMPTY_TEXT_STRUCTURE', message: 'textStructure must contain at least one page' });
    result.valid = false;
  }

  return result;
}

/**
 * Validates a .sggr graph artifact.
 */
export function validateSGGR(artifact: SovereignGraphArtifact): ValidationResult {
  const result = validateMetadata(artifact);

  const hasSeriesData = artifact.seriesModel && artifact.seriesModel.length > 0;
  const hasNodeEdgeData = artifact.nodeEdgeModel && artifact.nodeEdgeModel.nodes.length > 0;

  if (!hasSeriesData && !hasNodeEdgeData) {
    result.rejections.push({ code: 'EMPTY_GRAPH_MODEL', message: 'Graph must contain either series data or node/edge data' });
    result.valid = false;
  }

  return result;
}

/**
 * Validates a .sgta table artifact.
 */
export function validateSGTA(artifact: SovereignTableArtifact): ValidationResult {
  const result = validateMetadata(artifact);

  if (!artifact.schema || !artifact.schema.columns || artifact.schema.columns.length === 0) {
    result.rejections.push({ code: 'EMPTY_TABLE_SCHEMA', message: 'Table must define at least one column' });
    result.valid = false;
  }

  return result;
}

/**
 * Validates any sovereign artifact by dispatching to the class-specific validator.
 */
export function validateSovereignArtifact(artifact: SovereignArtifact): ValidationResult {
  switch (artifact.artifactClass) {
    case 'sgtx':
      return validateSGTX(artifact as SovereignTextArtifact);
    case 'sggr':
      return validateSGGR(artifact as SovereignGraphArtifact);
    case 'sgta':
      return validateSGTA(artifact as SovereignTableArtifact);
    default:
      return { valid: false, rejections: [{ code: 'INVALID_ARTIFACT_CLASS', message: 'Unknown artifact class' }] };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Factory Helpers
// ═══════════════════════════════════════════════════════════════════════

/**
 * Creates a fresh metadata envelope with default values.
 * Caller must populate class-specific fields.
 */
export function createArtifactMetadata(
  artifactClass: ArtifactClass,
  methodBinding: MethodBinding,
  originAuthority: string,
  ownerBinding: OwnerBinding,
): SovereignArtifactMetadata {
  const now = new Date().toISOString();
  return {
    artifactId: `${artifactClass}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    artifactClass,
    formatVersion: '1.0.0',
    createdAt: now,
    updatedAt: now,
    originAuthority,
    ownerBinding,
    truthState: 'draft' as TruthState,
    lineageRef: { parentId: null, versionChain: [] },
    renderIntent: 'authored',
    exportCompatibility: getSupportedExports(artifactClass),
    methodBinding,
    approvalState: 'draft',
    retentionClass: 'standard',
  };
}
