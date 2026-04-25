/**
 * @classification COMPANION_CLI_EMITTER
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Generates simulated shell commands for Raspberry Pi / Jetson companion setup.
 * @warning NON-EXECUTING. No SSH, no shell exec, no child_process usage.
 */

import type { SCIMEGAExportArtifact } from '../../export/scimega-export-types';
import type { SCIMEGACommand } from '../scimega-terminal-types';

export class CompanionCliEmitter {
  /**
   * Generates simulated companion computer setup commands from a Companion export artifact.
   */
  static emit(artifact: SCIMEGAExportArtifact): SCIMEGACommand[] {
    const commands: SCIMEGACommand[] = [];
    let payload: any;

    try {
      payload = JSON.parse(artifact.payloadContent);
    } catch {
      return [{
        type: 'system',
        commandLine: '# ERROR: Failed to parse Companion payload for CLI emission.',
        description: 'Payload parse failure.',
        isSafetyCritical: false
      }];
    }

    // System update
    commands.push({
      type: 'system',
      commandLine: 'sudo apt-get update && sudo apt-get upgrade -y',
      description: 'Update system packages.',
      isSafetyCritical: false
    });

    // Service installations from hardware map
    if (payload.services && Array.isArray(payload.services)) {
      for (const service of payload.services) {
        if (service.name) {
          commands.push({
            type: 'system',
            commandLine: `sudo apt-get install -y ${service.name.toLowerCase().replace(/\s/g, '-')}`,
            description: `Install service: ${service.name}.`,
            isSafetyCritical: false
          });

          commands.push({
            type: 'system',
            commandLine: `sudo systemctl enable ${service.name.toLowerCase().replace(/\s/g, '-')}`,
            description: `Enable service: ${service.name} on boot.`,
            isSafetyCritical: false
          });

          commands.push({
            type: 'system',
            commandLine: `sudo systemctl start ${service.name.toLowerCase().replace(/\s/g, '-')}`,
            description: `Start service: ${service.name}.`,
            isSafetyCritical: false
          });
        }
      }
    }

    // TelePort bridge setup
    commands.push({
      type: 'system',
      commandLine: '# --- TelePort Bridge Setup ---',
      description: 'Begin TelePort companion bridge configuration.',
      isSafetyCritical: false
    });

    commands.push({
      type: 'system',
      commandLine: 'pip install teleport-bridge-client',
      description: 'Install TelePort bridge client library.',
      isSafetyCritical: false
    });

    commands.push({
      type: 'system',
      commandLine: 'sudo cp teleport-bridge.service /etc/systemd/system/',
      description: 'Install TelePort bridge systemd unit.',
      isSafetyCritical: false
    });

    commands.push({
      type: 'system',
      commandLine: 'sudo systemctl daemon-reload',
      description: 'Reload systemd daemon.',
      isSafetyCritical: false
    });

    commands.push({
      type: 'system',
      commandLine: 'sudo systemctl enable teleport-bridge && sudo systemctl start teleport-bridge',
      description: 'Enable and start TelePort bridge service.',
      isSafetyCritical: true
    });

    // Python vision/lidar services
    if (payload.services?.some((s: any) => s.name?.toLowerCase().includes('vision'))) {
      commands.push({
        type: 'system',
        commandLine: 'pip install opencv-python-headless numpy',
        description: 'Install vision processing dependencies.',
        isSafetyCritical: false
      });
    }

    return commands;
  }
}
