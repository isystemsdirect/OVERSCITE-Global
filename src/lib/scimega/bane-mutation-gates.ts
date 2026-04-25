/**
 * @classification BANE_MUTATION_GATES
 * @authority BANE Governance Unit
 * @purpose Defines the SCIMEGA™ DOS BANE-governed mutation model and gating rules.
 */

const generateSovereignId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export type SCIMEGAMutationGateLevel = 'LOW_RISK' | 'BANE_REVIEW_REQUIRED' | 'HIGH_RISK_CONFIRMATION' | 'ARC_BOUND' | 'GUARDED_STATE';

export interface SCIMEGAMutationRule {
  operation: string;
  gate: SCIMEGAMutationGateLevel;
  requiresSnapshot: boolean;
  requiresDiff: boolean;
  requiresRollbackPath: boolean;
}

export interface SCIMEGAMutationProposal {
  id: string;
  operationType: string;
  targetComponent: string;
  proposedState: any;
  currentState: any;
  diffSummary: string;
  gateLevel: SCIMEGAMutationGateLevel;
  snapshotIdBefore?: string;
  rollbackPathAvailable: boolean;
  operatorArcId?: string;
  baneApprovalHash?: string;
  timestamp: string;
}

export const SCIMEGA_MUTATION_GATES: Record<string, SCIMEGAMutationRule> = {
  'CONFIG_READ': {
    operation: 'Read Configuration',
    gate: 'LOW_RISK',
    requiresSnapshot: false,
    requiresDiff: false,
    requiresRollbackPath: false
  },
  'CONFIG_WRITE': {
    operation: 'Write Configuration',
    gate: 'BANE_REVIEW_REQUIRED',
    requiresSnapshot: true,
    requiresDiff: true,
    requiresRollbackPath: true
  },
  'FIRMWARE_FLASH': {
    operation: 'Flash Firmware',
    gate: 'HIGH_RISK_CONFIRMATION',
    requiresSnapshot: true,
    requiresDiff: true,
    requiresRollbackPath: true
  },
  'MOTOR_TEST': {
    operation: 'Motor Test Spin',
    gate: 'GUARDED_STATE',
    requiresSnapshot: false,
    requiresDiff: false,
    requiresRollbackPath: false
  },
  'ESC_CALIBRATION': {
    operation: 'ESC Calibration',
    gate: 'GUARDED_STATE',
    requiresSnapshot: true,
    requiresDiff: false,
    requiresRollbackPath: true
  },
  'PI_PROVISIONING': {
    operation: 'Raspberry Pi Provisioning',
    gate: 'ARC_BOUND',
    requiresSnapshot: true,
    requiresDiff: true,
    requiresRollbackPath: true
  }
};

export class BaneMutationGate {
  /**
   * Proposes a mutation to the SCIMEGA system.
   * "No silent write" - every write must pass through a proposal.
   */
  static createProposal(
    operationType: keyof typeof SCIMEGA_MUTATION_GATES,
    targetComponent: string,
    currentState: any,
    proposedState: any,
    operatorArcId?: string
  ): SCIMEGAMutationProposal {
    const rule = SCIMEGA_MUTATION_GATES[operationType];
    if (!rule) {
      throw new Error(`[BANE] Unrecognized mutation operation: ${operationType}`);
    }

    if (rule.gate === 'ARC_BOUND' && !operatorArcId) {
      throw new Error(`[BANE] Operation ${operationType} requires ARC-bound operator identity.`);
    }

    return {
      id: `MUT-${generateSovereignId()}`,
      operationType,
      targetComponent,
      currentState,
      proposedState,
      diffSummary: `Diff generated for ${targetComponent} [${operationType}]`,
      gateLevel: rule.gate,
      rollbackPathAvailable: rule.requiresRollbackPath,
      operatorArcId,
      timestamp: new Date().toISOString()
    };
  }

  static approveProposal(proposal: SCIMEGAMutationProposal, authorityHash: string): SCIMEGAMutationProposal {
    return {
      ...proposal,
      baneApprovalHash: authorityHash
    };
  }
}
