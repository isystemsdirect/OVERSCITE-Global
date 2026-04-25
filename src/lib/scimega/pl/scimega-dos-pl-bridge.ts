/**
 * @classification SCIMEGA_DOS_PL_BRIDGE
 * @authority SCIMEGA™ PL Boundary Unit
 * @purpose Bridges the SCIMEGA™ DOS intelligence layers with the Physical Laboratory boundary models.
 * @warning No hardware execution logic. Modeling only.
 */

import { DeviceAdapterBoundary } from './device-adapter-boundary';
import { MockHardwareState, SCIMEGAMockHardwareStatus } from './mock-hardware-state';
import { BanePLBoundaryGate, BanePLVerdict } from './bane-pl-boundary-gate';
import { TeonPLSafetyChannel } from './teon-pl-safety-channel';
import { PilotInputChannel } from './pilot-input-channel';
import { SCIMEGAPhysicalLayerProfile } from './scimega-pl-types';

import { ScimegaDryLinkAssembler } from '../drylink/scimega-drylink-assembler';
import { BaneDryLinkActivationGate } from '../drylink/bane-drylink-activation-gate';
import { SCIMEGADryLinkProfile, SCIMEGADryLinkReadiness } from '../drylink/scimega-drylink-types';

export interface PLReadinessSummary {
  profile: SCIMEGAPhysicalLayerProfile;
  hardwareStatus: SCIMEGAMockHardwareStatus;
  baneVerdict: { verdict: BanePLVerdict; reasons: string[]; isAuthorized: boolean };
  safetyStatus: string[];
  pilotInputStatus: string[];
  isPlReadyForAutonomy: boolean;
  dryLinkProfile: SCIMEGADryLinkProfile;
  dryLinkReadiness: SCIMEGADryLinkReadiness;
}

export class ScimegaDosPlBridge {
  /**
   * Generates a comprehensive summary of the physical laboratory readiness.
   */
  static getReadinessSummary(profileId: string = 'DEFAULT_PROFILE'): PLReadinessSummary {
    const profile = DeviceAdapterBoundary.getProfile(profileId);
    const hardwareStatus = MockHardwareState.getSnapshot();
    const baneVerdict = BanePLBoundaryGate.evaluate(profile);
    const safetyStatus = TeonPLSafetyChannel.getStatusReport();
    const pilotInputStatus = PilotInputChannel.getDiagnosticReport();

    // Overall readiness depends on BANE authorization and hardware mock availability
    const isPlReadyForAutonomy = baneVerdict.isAuthorized && 
                                hardwareStatus.fcOnline && 
                                hardwareStatus.teonSafetyChannelOnline &&
                                hardwareStatus.pilotInputAvailable;

    // Phase 12: Dry-Link Readiness
    const dryLinkProfile = ScimegaDryLinkAssembler.assemble(profileId);
    const dryLinkReadiness = BaneDryLinkActivationGate.evaluate(dryLinkProfile);

    return {
      profile,
      hardwareStatus,
      baneVerdict,
      safetyStatus,
      pilotInputStatus,
      isPlReadyForAutonomy,
      dryLinkProfile,
      dryLinkReadiness
    };
  }
}
