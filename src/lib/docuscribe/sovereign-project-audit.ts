/**
 * @fileOverview Sovereign Project Audit — SGPM / SGPL Integrity Verification
 * @domain DocuSCRIBE / Project Operations / Governance
 * @canonical true
 * @status Implemented
 *
 * Provides audit utilities for verifying the structural integrity and
 * execution lineage of project-state containers.
 */

import type {
  SovereignProjectManagerArtifact,
  SovereignProjectPlanArtifact,
} from './sovereign-project-file-classes';
import { getArtifactHistory, diffArtifactVersions } from './sovereign-artifact-versioning';

export interface AuditRecord {
  artifactId: string;
  artifactClass: 'sgpm' | 'sgpl';
  integrityStatus: 'nominal' | 'corrupted' | 'tampered' | 'unverified';
  lineageDepth: number;
  lastVerifiedAt: string;
  issues: string[];
}

/**
 * Performs a deep audit of a project container's integrity.
 * Verifies lineage consistency and linkage validity.
 */
export async function auditProjectContainer(
  container: SovereignProjectManagerArtifact | SovereignProjectPlanArtifact,
): Promise<AuditRecord> {
  const issues: string[] = [];
  const now = new Date().toISOString();

  // 1. Basic linkage check
  if (!container.projectId) {
    issues.push('Missing projectId binding');
  }
  if (!container.lineageRef) {
    issues.push('Missing lineageRef envelope');
  }

  // 2. Version chain verification
  const history = getArtifactHistory(container.artifactId);
  if (history.length === 0 && container.lineageRef.versionChain.length > 0) {
    issues.push('ArcHive™ history mismatch (recorded chain exists but history store is empty)');
  }

  // 3. Artifact link validation
  if (container.linkedArtifacts.length === 0) {
    // Advisory only
    console.warn(`[Audit] Project container ${container.artifactId} has no atomic artifact links.`);
  }

  // 4. Class-specific logic
  if (container.artifactClass === 'sgpm') {
    const sgpm = container as SovereignProjectManagerArtifact;
    if (sgpm.issuePackets.length > 0 && sgpm.riskClusters.length === 0) {
      issues.push('Issues present but no risk clusters generated (potential logic drift)');
    }
  }

  return {
    artifactId: container.artifactId,
    artifactClass: container.artifactClass,
    integrityStatus: issues.length === 0 ? 'nominal' : 'corrupted',
    lineageDepth: container.lineageRef.versionChain.length,
    lastVerifiedAt: now,
    issues,
  };
}

/**
 * Summarizes the changes between two project-state container versions.
 */
export function summarizeContainerMutation(
  versionIdA: string,
  versionIdB: string,
  artifactId: string,
): string {
  const history = getArtifactHistory(artifactId);
  const vA = history.find(v => v.versionId === versionIdA);
  const vB = history.find(v => v.versionId === versionIdB);

  if (!vA || !vB) return 'Cannot summarize: one or both versions not found in ArcHive™';

  const diffs = diffArtifactVersions(vA, vB);
  if (diffs.length === 0) return 'No structural changes detected between versions.';

  return diffs
    .map(d => `[${d.field}] modified`)
    .slice(0, 10)
    .join(', ') + (diffs.length > 10 ? ` (+${diffs.length - 10} more)` : '');
}
