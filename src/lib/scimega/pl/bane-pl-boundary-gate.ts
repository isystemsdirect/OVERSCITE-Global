/**
 * @classification BANE_PL_BOUNDARY_GATE
 * @authority BANE Governance Layer
 * @purpose Enforces the hardware boundary and prevents unauthorized mutation-capable adapters.
 * @warning Any adapter exposing write/execute/connect behavior is blocked.
 */

import { SCIMEGAPhysicalLayerProfile, SCIMEGADeviceAdapterStatus } from './scimega-pl-types';

export type BanePLVerdict = 'PL_READY_FOR_SIMULATION' | 'PL_READY_FOR_DRY_LINK' | 'REVIEW_REQUIRED' | 'BLOCKED';

export class BanePLBoundaryGate {
  /**
   * Evaluates if a physical layer profile is safe for governed simulation or dry-link.
   */
  static evaluate(profile: SCIMEGAPhysicalLayerProfile, context?: { mode: 'SIMULATION' | 'DRY_LINK' | string }): { verdict: BanePLVerdict; reasons: string[]; isAuthorized: boolean } {
    const reasons: string[] = [];
    const mode = context?.mode || 'SIMULATION';
    let verdict: BanePLVerdict = mode === 'DRY_LINK' ? 'PL_READY_FOR_DRY_LINK' : 'PL_READY_FOR_SIMULATION';

    // Rule 0: Environment Validation (Fail-Closed)
    if (mode !== 'SIMULATION' && mode !== 'DRY_LINK') {
      verdict = 'BLOCKED';
      reasons.push(`CRITICAL: Unauthorized SCIMEGA operational mode [${mode}]. Boundary enforcement requires SIMULATION or DRY_LINK.`);
    }

    // Rule 1: Adapter status must be simulated or dry_link_only
    const allowedStates: SCIMEGADeviceAdapterStatus[] = ['simulated', 'dry_link_only'];
    if (!allowedStates.includes(profile.adapterStatus)) {
      verdict = 'BLOCKED';
      reasons.push(`CRITICAL: Adapter status [${profile.adapterStatus}] is unauthorized. FAIL-CLOSED.`);
    }

    // Rule 2: Pilot Input Channel presence
    const hasPilotInput = profile.pilotInputs.length > 0 && profile.pilotInputs.some(p => p.isAvailable);
    if (!hasPilotInput) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: No active pilot input channel detected. Autonomy requires human-in-the-loop readiness.');
    }

    // Rule 3: TEON Safety Channel presence
    const hasSafetyChannel = profile.safetyChannels.length > 0 && profile.safetyChannels.some(s => s.isReady);
    if (!hasSafetyChannel) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: No active TEON safety channel detected. Autonomy requires hardware enforcement path modeling.');
    }

    // Rule 4: Protocol enforcement (Strict No-Mutation)
    const mutationCapableProtocols = ['SERIAL_RAW', 'UDP_RAW', 'TCP_RAW'];
    profile.channels.forEach(ch => {
      if (mutationCapableProtocols.includes(ch.protocol)) {
        verdict = 'BLOCKED';
        reasons.push(`CRITICAL: Mutation-capable protocol [${ch.protocol}] detected on channel [${ch.channelId}].`);
      }
    });

    // Rule 5: Capability Detection (Anti-Drift)
    const adapter = profile as any;
    const forbiddenCapabilities = ['connect', 'send', 'write', 'execute', 'flash', 'transmit', 'command'];
    forbiddenCapabilities.forEach(cap => {
      if (typeof adapter[cap] !== 'undefined') {
        verdict = 'BLOCKED';
        reasons.push(`CRITICAL: Adapter drift detected. Forbidden capability [${cap}] is present in PL model.`);
      }
    });

    const isAuthorized = verdict === 'PL_READY_FOR_SIMULATION' || verdict === 'PL_READY_FOR_DRY_LINK';

    if (isAuthorized) {
      reasons.push(`BANE PL GATE: Hardware boundary verified as [${verdict}].`);
    } else {
      reasons.push('BANE PL GATE: Physical layer rejected due to boundary violations.');
    }

    return { verdict, reasons, isAuthorized };
  }
}
