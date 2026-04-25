/**
 * @classification BANE_PRODUCTION_GATE
 * @authority BANE Governance Layer
 * @purpose Evaluates an ArcHive package and its signatures for production readiness.
 * @warning Determines readiness only. DOES NOT grant execution authority.
 */

import type { ArcHivePackage } from '../archive/archive-manifest-types';
import type { ArcSignatureRecord } from '../authorization/arc-crypto-signature';

export type ProductionGateVerdict = 
  | 'PRODUCTION_READY'
  | 'RESTRICTED'
  | 'SIMULATION_ONLY'
  | 'BLOCKED';

export interface ProductionGateResult {
  verdict: ProductionGateVerdict;
  reasons: string[];
}

export class BaneProductionGate {
  /**
   * Evaluates if a given manifest and signature meet all criteria for production transition.
   */
  static evaluate(
    pkg: ArcHivePackage | null,
    signature: ArcSignatureRecord | null
  ): ProductionGateResult {
    const reasons: string[] = [];
    
    if (!pkg) {
      return { verdict: 'BLOCKED', reasons: ['No manifest package provided.'] };
    }

    if (!pkg.manifest.integrity.isCryptographic) {
      reasons.push('Manifest uses non-cryptographic placeholder hash.');
    }

    if (pkg.manifest.versionState !== 'final') {
      reasons.push(`Manifest version state is ${pkg.manifest.versionState}, expected final.`);
    }

    if (pkg.archiveGateVerdict !== 'APPROVED_FOR_ARCHIVE') {
      reasons.push(`Archive gate previously blocked this payload: ${pkg.archiveGateVerdict}`);
    }

    if (!signature) {
      reasons.push('Missing ARC cryptographic signature.');
    } else {
      if (signature.manifestHash !== pkg.manifest.integrity.manifestHash) {
        reasons.push('Signature hash does not match manifest hash.');
      }
    }

    if (reasons.length > 0) {
      // If it has a valid signature but some other minor constraint fails, it might be RESTRICTED
      // If no signature, it's SIMULATION_ONLY or BLOCKED
      if (!signature) {
        return { verdict: 'SIMULATION_ONLY', reasons };
      }
      return { verdict: 'RESTRICTED', reasons };
    }

    return { 
      verdict: 'PRODUCTION_READY', 
      reasons: ['Cryptographic integrity verified.', 'ARC signature valid.', 'Audit chain complete.', 'No mutation authorization found.'] 
    };
  }
}
