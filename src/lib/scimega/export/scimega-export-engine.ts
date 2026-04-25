/**
 * @classification SCIMEGA_EXPORT_ENGINE
 * @authority SCIMEGA Export Boundary Unit
 * @purpose Generates proposal-grade configuration artifacts strictly adhering to the no-flash boundary.
 */

import type { SCIMEGAConfigurationProposal, SCIMEGAExportTarget, SCIMEGAExportArtifact } from './scimega-export-types';
import type { SCIMEGA_Capabilities } from '../capability-map';
import type { MethodCompatibilityResult } from '../method-compatibility';
import type { SchedulePosture } from '@/lib/types';
import type { BaneDeploymentGateResult } from '../bane-drone-deployment-gate';
import { BaneConfigurationProposalGate } from '../bane-configuration-proposal-gate';
import { ScimegaConfigDiffEngine } from './scimega-config-diff';

import { MspAdapter } from './adapters/msp-adapter';
import { MavlinkAdapter } from './adapters/mavlink-adapter';
import { CompanionAdapter } from './adapters/companion-adapter';
import { ScimegaDosManifestAdapter } from './adapters/scimega-dos-manifest-adapter';

export class ScimegaExportEngine {
  /**
   * Generates a SCIMEGA Configuration Proposal.
   * This is a non-mutative dry-run of what would be written to the drone.
   */
  static generateProposal(
    buildId: string,
    target: SCIMEGAExportTarget,
    capabilities: SCIMEGA_Capabilities,
    compatibility: MethodCompatibilityResult | null,
    schedulerPosture: SchedulePosture,
    deploymentGate: BaneDeploymentGateResult | null
  ): SCIMEGAConfigurationProposal {
    
    // Check if target is supported
    const isTargetSupported = [
      'betaflight_msp', 
      'ardupilot_mavlink', 
      'companion_raspberry_pi', 
      'scimega_dos_manifest'
    ].includes(target);

    // Initial Gate Check (before diff)
    const initialGate = BaneConfigurationProposalGate.evaluate(
      target,
      isTargetSupported,
      false, // NO HARDWARE WRITE INTENT
      compatibility,
      schedulerPosture,
      deploymentGate,
      null // No diff yet
    );

    if (initialGate.verdict === 'BLOCKED') {
      return {
        proposalId: `PROP-${Date.now()}`,
        buildId,
        artifacts: [],
        diff: {
          hasChanges: false,
          classification: 'blocked',
          humanReadableSummary: [],
          machineReadableChanges: []
        },
        overallStatus: 'blocked',
        blockers: initialGate.reasons,
        authorizationState: 'pending'
      };
    }

    // Generate Proposal Artifact
    let artifact: SCIMEGAExportArtifact;
    
    switch (target) {
      case 'betaflight_msp':
        artifact = MspAdapter.generateProposal('betaflight_msp', capabilities, buildId);
        break;
      case 'ardupilot_mavlink':
        artifact = MavlinkAdapter.generateProposal('ardupilot_mavlink', capabilities, buildId);
        break;
      case 'companion_raspberry_pi':
        artifact = CompanionAdapter.generateProposal('companion_raspberry_pi', capabilities, buildId);
        break;
      case 'scimega_dos_manifest':
        artifact = ScimegaDosManifestAdapter.generateProposal(buildId, capabilities, []);
        break;
      default:
        throw new Error(`Unsupported export target during generation: ${target}`);
    }

    // Generate Diff
    const diff = ScimegaConfigDiffEngine.generateDiff(buildId, artifact);

    // Final Gate Check (with diff)
    const finalGate = BaneConfigurationProposalGate.evaluate(
      target,
      isTargetSupported,
      false,
      compatibility,
      schedulerPosture,
      deploymentGate,
      diff
    );

    return {
      proposalId: `PROP-${Date.now()}`,
      buildId,
      artifacts: [artifact],
      diff,
      overallStatus: finalGate.verdict === 'REVIEW_REQUIRED' ? 'review_required' :
                     finalGate.verdict === 'APPROVED_FOR_DRAFT_EXPORT' ? 'approved_for_export' : 
                     finalGate.verdict === 'RESTRICTED' ? 'review_required' : 'blocked',
      blockers: finalGate.reasons,
      authorizationState: 'pending'
    };
  }
}
