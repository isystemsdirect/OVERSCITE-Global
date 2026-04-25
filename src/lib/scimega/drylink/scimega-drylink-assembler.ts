/**
 * @classification SCIMEGA_DRY_LINK_ASSEMBLER
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Collects dry-link contracts and produces a unified readiness profile.
 * @warning DRY-LINK ONLY.
 */

import { SCIMEGADryLinkProfile, SCIMEGADryLinkAdapterContract, SCIMEGADryLinkChannel } from './scimega-drylink-types';
import { MspDryLinkContract } from './adapters/msp-drylink-contract';
import { MavlinkDryLinkContract } from './adapters/mavlink-drylink-contract';
import { CompanionDryLinkContract } from './adapters/companion-drylink-contract';
import { PayloadSensorDryLinkContract } from './adapters/payload-sensor-drylink-contract';
import { PilotInputDryLinkContract } from './adapters/pilot-input-drylink-contract';
import { TeonPLSafetyChannel } from '../pl/teon-pl-safety-channel';
import { BanePLBoundaryGate } from '../pl/bane-pl-boundary-gate';
import { DeviceAdapterBoundary } from '../pl/device-adapter-boundary';
import { MockHardwareState } from '../pl/mock-hardware-state';

export class ScimegaDryLinkAssembler {
  /**
   * Assembles the Dry-Link profile from available contracts and PL state.
   */
  static assemble(profileId: string): SCIMEGADryLinkProfile {
    const contracts: SCIMEGADryLinkAdapterContract[] = [
      MspDryLinkContract.getContract(),
      MavlinkDryLinkContract.getContract(),
      CompanionDryLinkContract.getContract(),
      PayloadSensorDryLinkContract.getContract(),
      PilotInputDryLinkContract.getContract(),
      // TEON Safety Contract (Synthesized from PL)
      {
        adapterId: 'ADAPT-TEON-SAFETY-V1',
        type: 'teon_safety',
        description: 'Hard-enforcement safety signal path for SCIMEGA™.',
        commandFamilies: ['HARD_STOP', 'ANCHOR_HOLD', 'RTH', 'ABORT'],
        safetyLimitations: ['FORCE_ABORT_PRIORITY', 'ZTI_FAIL_CLOSED'],
        isExecutionDisabled: true
      }
    ];

    const channels: SCIMEGADryLinkChannel[] = contracts.map(c => ({
      channelId: `CH-${c.type.toUpperCase()}`,
      type: c.type,
      protocol: c.type === 'msp' ? 'MSP' : c.type === 'mavlink' ? 'MAVLINK' : 'TELEPORT',
      expectedStatus: 'dry_link_ready',
      capabilities: c.commandFamilies
    }));

    // Cross-reference with PL Boundary Gate
    const plProfile = DeviceAdapterBoundary.getProfile(profileId);
    const baneVerdict = BanePLBoundaryGate.evaluate(plProfile, { mode: 'DRY_LINK' });
    const hardwareStatus = MockHardwareState.getSnapshot();
    
    const isPlReady = baneVerdict.isAuthorized && 
                     hardwareStatus.fcOnline && 
                     hardwareStatus.teonSafetyChannelOnline;

    return {
      profileId,
      timestamp: new Date().toISOString(),
      contracts,
      channels,
      baneVerdict: baneVerdict.verdict,
      overallReadiness: isPlReady ? 'dry_link_ready' : 'blocked'
    };
  }
}
