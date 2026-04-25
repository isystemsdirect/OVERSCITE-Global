/**
 * @classification BANE_TERMINAL_SIMULATION_GATE
 * @authority BANE Governance Layer
 * @purpose Governs whether a terminal simulation session is permitted based on ARC authorization and proposal state.
 * @warning Blocks simulation if any hardware mutation intent is detected.
 */

import type { SCIMEGAConfigurationProposal } from '../export/scimega-export-types';

export type TerminalSimulationVerdict = 'ALLOWED_FOR_SIMULATION' | 'BLOCKED';

export interface TerminalSimulationGateResult {
  verdict: TerminalSimulationVerdict;
  reasons: string[];
}

export class BaneTerminalSimulationGate {
  static evaluate(
    proposal: SCIMEGAConfigurationProposal,
    arcAuthorized: boolean,
    hardwareMutationAuthorized: boolean
  ): TerminalSimulationGateResult {
    const reasons: string[] = [];

    // Absolute block: hardware mutation intent
    if (hardwareMutationAuthorized) {
      return {
        verdict: 'BLOCKED',
        reasons: ['FATAL: hardwareMutationAuthorized is TRUE. Terminal simulation refused. No execution path authorized.']
      };
    }

    // Verify ARC authorization
    if (!arcAuthorized) {
      return {
        verdict: 'BLOCKED',
        reasons: ['ARC authorization required before terminal simulation can proceed.']
      };
    }

    // Verify proposal is not blocked
    if (proposal.overallStatus === 'blocked') {
      return {
        verdict: 'BLOCKED',
        reasons: ['Proposal is in BLOCKED state. Terminal simulation refused.']
      };
    }

    // Verify proposal authorization state
    if (proposal.authorizationState !== 'approved' && proposal.authorizationState !== 'pending') {
      reasons.push(`Proposal authorization state '${proposal.authorizationState}' is not eligible for simulation.`);
      return { verdict: 'BLOCKED', reasons };
    }

    // Check artifact integrity
    const hasUnsafeArtifact = proposal.artifacts.some(a => a.hardwareMutationAuthorized !== false);
    if (hasUnsafeArtifact) {
      return {
        verdict: 'BLOCKED',
        reasons: ['One or more artifacts lack the hardwareMutationAuthorized:false constraint. Simulation blocked.']
      };
    }

    return {
      verdict: 'ALLOWED_FOR_SIMULATION',
      reasons: ['All gates passed. Simulation output is non-executing and for review only.']
    };
  }
}
