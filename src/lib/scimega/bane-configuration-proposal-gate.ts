/**
 * @classification BANE_CONFIG_PROPOSAL_GATE
 * @authority BANE Governance Unit
 * @purpose Evaluates readiness and governance limits for exporting SCIMEGA configuration proposals.
 */

import type { MethodCompatibilityResult } from './method-compatibility';
import type { SchedulePosture } from '@/lib/types';
import type { BaneDeploymentGateResult } from './bane-drone-deployment-gate';
import type { SCIMEGAExportTarget, SCIMEGAConfigurationDiff } from './export/scimega-export-types';

export type ConfigProposalGateVerdict = 'APPROVED_FOR_DRAFT_EXPORT' | 'REVIEW_REQUIRED' | 'RESTRICTED' | 'BLOCKED';

export interface ConfigProposalGateResult {
  verdict: ConfigProposalGateVerdict;
  reasons: string[];
}

export class BaneConfigurationProposalGate {
  /**
   * Validates if the configuration artifact can be safely proposed.
   */
  static evaluate(
    target: SCIMEGAExportTarget,
    isTargetSupported: boolean,
    hasHardwareWriteIntent: boolean,
    compatibility: MethodCompatibilityResult | null,
    schedulerPosture: SchedulePosture,
    deploymentGate: BaneDeploymentGateResult | null,
    diff: SCIMEGAConfigurationDiff | null
  ): ConfigProposalGateResult {
    const result: ConfigProposalGateResult = {
      verdict: 'APPROVED_FOR_DRAFT_EXPORT',
      reasons: []
    };

    let isBlocked = false;
    let isRestricted = false;
    let needsReview = false;

    // Hard Rules
    if (hasHardwareWriteIntent) {
      result.reasons.push('FATAL: Hardware write intent detected. SCIMEGA Phase 3 operates strictly in NO-FLASH bounds.');
      return { verdict: 'BLOCKED', reasons: result.reasons };
    }

    if (!isTargetSupported) {
      result.reasons.push(`Export target '${target}' is currently unsupported.`);
      isBlocked = true;
    }

    if (!diff) {
      result.reasons.push('Configuration diff metadata is missing.');
      needsReview = true;
    } else if (diff.classification === 'safety_relevant' || diff.classification === 'firmware_adjacent') {
      result.reasons.push(`Diff classification '${diff.classification}' requires manual review.`);
      needsReview = true;
    }

    // Contextual Rules
    if (compatibility && compatibility.status === 'blocked') {
      result.reasons.push('Method compatibility is BLOCKED.');
      isBlocked = true;
    }

    if (deploymentGate && deploymentGate.verdict === 'BLOCKED') {
      result.reasons.push('BANE Deployment Gate is BLOCKED. Configuration export aborted.');
      isBlocked = true;
    }

    if (schedulerPosture === 'blocked') {
      result.reasons.push('Scheduler posture is BLOCKED.');
      isRestricted = true;
    }

    if (isBlocked) {
      result.verdict = 'BLOCKED';
    } else if (isRestricted) {
      result.verdict = 'RESTRICTED';
    } else if (needsReview) {
      result.verdict = 'REVIEW_REQUIRED';
    }

    return result;
  }
}
