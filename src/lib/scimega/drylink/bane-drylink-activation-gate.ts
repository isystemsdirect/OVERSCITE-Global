/**
 * @classification BANE_DRY_LINK_ACTIVATION_GATE
 * @authority BANE Governance Layer
 * @purpose Evaluates if a dry-link activation intent is safe and authorized.
 * @warning DRY-LINK ONLY. Live connections and command transmissions are STRICTLY BLOCKED.
 */

import { SCIMEGADryLinkReadiness, SCIMEGADryLinkActivationIntent, SCIMEGADryLinkProfile } from './scimega-drylink-types';
import { BanePLBoundaryGate } from '../pl/bane-pl-boundary-gate';

export class BaneDryLinkActivationGate {
  /**
   * Evaluates a dry-link profile and intent for activation readiness.
   */
  static evaluate(profile: SCIMEGADryLinkProfile, intent?: SCIMEGADryLinkActivationIntent): SCIMEGADryLinkReadiness {
    const reasons: string[] = [];
    let isReady = true;

    // Rule 1: BANE PL Boundary Gate must pass
    if (profile.baneVerdict !== 'PL_READY_FOR_SIMULATION' && profile.baneVerdict !== 'PL_READY_FOR_DRY_LINK') {
      isReady = false;
      reasons.push(`CRITICAL: BANE PL Boundary Gate rejected the profile [${profile.baneVerdict}].`);
    }

    // Rule 2: Mandatory Contracts Check
    const mandatoryTypes = ['teon_safety', 'pilot_input'];
    mandatoryTypes.forEach(type => {
      const hasContract = profile.contracts.some(c => c.type === type);
      if (!hasContract) {
        isReady = false;
        reasons.push(`CRITICAL: Missing mandatory [${type}] contract. FAIL-CLOSED.`);
      }
    });

    // Rule 3: Execution Disability Check (Anti-Drift)
    profile.contracts.forEach(contract => {
      if (!contract.isExecutionDisabled) {
        isReady = false;
        reasons.push(`CRITICAL: Contract [${contract.adapterId}] has execution enabled. DRY-LINK VIOLATION.`);
      }
    });

    // Rule 4: Intent Validation
    if (intent) {
      const forbiddenStates = ['connect', 'transmit'];
      if (forbiddenStates.includes(intent.requestedState)) {
        isReady = false;
        reasons.push(`CRITICAL: Intent [${intent.requestedState}] violates DRY-LINK boundary. ACTIVATION BLOCKED.`);
      }
    }

    // Rule 5: Overall Status Check
    if (profile.overallReadiness === 'blocked' || profile.overallReadiness === 'restricted') {
      isReady = false;
      reasons.push(`CRITICAL: Profile readiness is [${profile.overallReadiness}].`);
    }

    const verdict = isReady ? 'dry_link_ready' : 'blocked';
    
    if (isReady) {
      reasons.push('BANE DRY-LINK GATE: Activation readiness verified (CONTRACT_ONLY).');
    } else {
      reasons.push('BANE DRY-LINK GATE: Activation blocked due to governance violations.');
    }

    return { isReady, verdict, reasons };
  }
}
