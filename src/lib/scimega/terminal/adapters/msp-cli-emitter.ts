/**
 * @classification MSP_CLI_EMITTER
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Translates MSP adapter output into Betaflight CLI-like command sequences.
 * @warning SIMULATION ONLY. No serial connection logic exists.
 */

import type { SCIMEGAExportArtifact } from '../../export/scimega-export-types';
import type { SCIMEGACommand } from '../scimega-terminal-types';

export class MspCliEmitter {
  /**
   * Generates simulated Betaflight CLI commands from an MSP export artifact.
   */
  static emit(artifact: SCIMEGAExportArtifact): SCIMEGACommand[] {
    const commands: SCIMEGACommand[] = [];
    let payload: any;

    try {
      payload = JSON.parse(artifact.payloadContent);
    } catch {
      return [{
        type: 'cli',
        commandLine: '# ERROR: Failed to parse MSP payload for CLI emission.',
        description: 'Payload parse failure.',
        isSafetyCritical: false
      }];
    }

    // Profile selection
    commands.push({
      type: 'cli',
      commandLine: `profile ${payload.pid_profile || 0}`,
      description: 'Select PID profile.',
      isSafetyCritical: false
    });

    // Rate profile
    commands.push({
      type: 'cli',
      commandLine: `rateprofile ${payload.rate_profile || 0}`,
      description: 'Select rate profile.',
      isSafetyCritical: false
    });

    // PID tuning (if present)
    if (payload.pids) {
      for (const [axis, values] of Object.entries(payload.pids as Record<string, any>)) {
        if (values.p !== undefined) {
          commands.push({
            type: 'cli',
            commandLine: `set p_${axis} = ${values.p}`,
            description: `Set P gain for ${axis} axis.`,
            isSafetyCritical: true
          });
        }
        if (values.i !== undefined) {
          commands.push({
            type: 'cli',
            commandLine: `set i_${axis} = ${values.i}`,
            description: `Set I gain for ${axis} axis.`,
            isSafetyCritical: true
          });
        }
        if (values.d !== undefined) {
          commands.push({
            type: 'cli',
            commandLine: `set d_${axis} = ${values.d}`,
            description: `Set D gain for ${axis} axis.`,
            isSafetyCritical: true
          });
        }
      }
    }

    // Receiver mapping
    if (payload.receiver_map) {
      commands.push({
        type: 'cli',
        commandLine: `map ${payload.receiver_map}`,
        description: 'Set receiver channel mapping.',
        isSafetyCritical: false
      });
    }

    // Arming
    if (payload.arming_flags !== undefined) {
      commands.push({
        type: 'cli',
        commandLine: `set small_angle = ${payload.arming_flags.small_angle || 25}`,
        description: 'Set arming angle limit.',
        isSafetyCritical: true
      });
    }

    // Save
    commands.push({
      type: 'cli',
      commandLine: 'save',
      description: 'Save configuration and reboot flight controller.',
      isSafetyCritical: true
    });

    return commands;
  }
}
