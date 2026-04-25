/**
 * @classification ARCHIVE_MANIFEST_TYPES
 * @authority ArcHive™ Packaging Layer
 * @purpose Defines types for ArcHive™ manifest packages and operational lineage records.
 * @warning Archived artifacts are evidence only. They do not confer execution or operational authority.
 */

export type ArcHiveVersionState = 'draft' | 'review' | 'final';

export interface ArcHiveComponentSection {
  sectionId: string;
  sectionName: string;
  included: boolean;
  contentSummary: string;
  artifactCount: number;
}

export interface ArcHiveIntegrityBlock {
  manifestHash: string;
  auditChainRoot: string;
  auditChainTip: string;
  eventCount: number;
  isCryptographic: boolean;
  placeholderNotice: string;
}

export interface ArcHiveManifest {
  manifestId: string;
  version: string;
  versionState: ArcHiveVersionState;
  proposalId: string;
  buildId: string;
  arcId: string;
  aircraftClass: string;
  createdAt: string;
  sections: ArcHiveComponentSection[];
  integrity: ArcHiveIntegrityBlock;
  boundaryDeclarations: string[];
  metadata: Record<string, string>;
}

export interface ArcHivePackage {
  manifest: ArcHiveManifest;
  serializedContent: string;
  archiveGateVerdict: string;
  archiveGateReasons: string[];
}
