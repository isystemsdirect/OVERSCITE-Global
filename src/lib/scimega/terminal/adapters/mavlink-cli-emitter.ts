/**
 * @classification MAVLINK_CLI_EMITTER
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Translates MAVLink adapter output into MAVProxy/QGC parameter-setting commands.
 * @warning SIMULATION ONLY. No MAVLink connection logic exists.
 */

import type { SCIMEGAExportArtifact } from '../../export/scimega-export-types';
import type { SCIMEGACommand } from '../scimega-terminal-types';

export class MavlinkCliEmitter {
  /**
   * Generates simulated MAVProxy parameter commands from a MAVLink export artifact.
   */
  static emit(artifact: SCIMEGAExportArtifact): SCIMEGACommand[] {
    const commands: SCIMEGACommand[] = [];
    let payload: any;

    try {
      payload = JSON.parse(artifact.payloadContent);
    } catch {
      return [{
        type: 'param',
        commandLine: '# ERROR: Failed to parse MAVLink payload for CLI emission.',
        description: 'Payload parse failure.',
        isSafetyCritical: false
      }];
    }

    // Frame class
    if (payload.frame_class !== undefined) {
      commands.push({
        type: 'param',
        commandLine: `param set FRAME_CLASS ${payload.frame_class}`,
        description: 'Set vehicle frame class.',
        isSafetyCritical: true
      });
    }

    // Frame type
    if (payload.frame_type !== undefined) {
      commands.push({
        type: 'param',
        commandLine: `param set FRAME_TYPE ${payload.frame_type}`,
        description: 'Set vehicle frame type.',
        isSafetyCritical: true
      });
    }

    // Arming check
    if (payload.arming_check !== undefined) {
      commands.push({
        type: 'param',
        commandLine: `param set ARMING_CHECK ${payload.arming_check}`,
        description: 'Set arming check bitmask.',
        isSafetyCritical: true
      });
    }

    // Failsafe
    if (payload.failsafe) {
      if (payload.failsafe.battery_voltage !== undefined) {
        commands.push({
          type: 'param',
          commandLine: `param set BATT_LOW_VOLT ${payload.failsafe.battery_voltage}`,
          description: 'Set battery low voltage failsafe threshold.',
          isSafetyCritical: true
        });
      }
      if (payload.failsafe.action !== undefined) {
        commands.push({
          type: 'param',
          commandLine: `param set FS_THR_ENABLE ${payload.failsafe.action}`,
          description: 'Set throttle failsafe action.',
          isSafetyCritical: true
        });
      }
    }

    // Geofence
    if (payload.geofence_radius_m !== undefined) {
      commands.push({
        type: 'param',
        commandLine: `param set FENCE_RADIUS ${payload.geofence_radius_m}`,
        description: 'Set geofence radius in meters.',
        isSafetyCritical: true
      });
      commands.push({
        type: 'param',
        commandLine: `param set FENCE_ENABLE 1`,
        description: 'Enable geofence.',
        isSafetyCritical: true
      });
    }

    // Save
    commands.push({
      type: 'param',
      commandLine: 'param save',
      description: 'Save all parameters to EEPROM.',
      isSafetyCritical: true
    });

    return commands;
  }
}
