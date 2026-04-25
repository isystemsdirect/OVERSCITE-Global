/**
 * @classification BANE_ARCHIVE_GATE
 * @authority BANE Governance Layer
 * @purpose Validates ArcHive™ packages before archive creation.
 * @warning Blocks archiving if mutation intent or authorization gaps are detected.
 */

import type { ArcHiveManifest } from './archive-manifest-types';

export type ArchiveGateVerdict = 'APPROVED_FOR_ARCHIVE' | 'REVIEW_REQUIRED' | 'BLOCKED';

export interface BaneArchiveGateResult {
  verdict: ArchiveGateVerdict;
  reasons: string[];
}

export class BaneArchiveGate {
  static evaluate(
    manifest: ArcHiveManifest,
    arcAuthorized: boolean,
    hardwareMutationAuthorized: boolean,
    auditChainComplete: boolean
  ): BaneArchiveGateResult {
    const reasons: string[] = [];
    let blocked = false;
    let needsReview = false;

    if (hardwareMutationAuthorized) {
      reasons.push('BLOCKED: hardwareMutationAuthorized is TRUE. Archive cannot include mutation-authorized artifacts.');
      blocked = true;
    }

    if (!arcAuthorized) {
      reasons.push('ARC authorization missing. Archive requires human identity verification.');
      needsReview = true;
    }

    if (!auditChainComplete) {
      reasons.push('Audit chain is incomplete. Some lifecycle events may be missing.');
      needsReview = true;
    }

    if (manifest.integrity.isCryptographic === false) {
      reasons.push('Integrity block uses placeholder hashes. Non-cryptographic archive.');
    }

    const allSectionsIncluded = manifest.sections.every(s => s.included);
    if (!allSectionsIncluded) {
      const missing = manifest.sections.filter(s => !s.included).map(s => s.sectionName);
      reasons.push(`Missing sections: ${missing.join(', ')}.`);
      needsReview = true;
    }

    if (manifest.versionState === 'draft') {
      reasons.push('Manifest is in DRAFT state. Review recommended before finalization.');
      needsReview = true;
    }

    const verdict: ArchiveGateVerdict = blocked ? 'BLOCKED' : needsReview ? 'REVIEW_REQUIRED' : 'APPROVED_FOR_ARCHIVE';
    return { verdict, reasons };
  }
}
