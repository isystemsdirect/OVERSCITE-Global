/**
 * @classification SCIMEGA_TERMINAL_ENGINE
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Orchestrates the generation of simulated, non-executing command scripts from ARC-approved proposals.
 * @warning NO EXECUTION. NO CHILD PROCESS. NO SHELL SPAWN. NO NETWORK/SERIAL CONNECTION.
 */

import type { SCIMEGAConfigurationProposal } from '../export/scimega-export-types';
import type { SCIMEGACommandScript, SCIMEGACommand } from './scimega-terminal-types';
import { BaneTerminalSimulationGate } from './bane-terminal-simulation-gate';
import { ScriptAnnotation } from './script-annotation';
import { MspCliEmitter } from './adapters/msp-cli-emitter';
import { MavlinkCliEmitter } from './adapters/mavlink-cli-emitter';
import { CompanionCliEmitter } from './adapters/companion-cli-emitter';

export class ScimegaTerminalEngine {
  /**
   * Generates a non-executing command script from an ARC-approved configuration proposal.
   */
  static generateScript(
    proposal: SCIMEGAConfigurationProposal,
    arcAuthorized: boolean
  ): SCIMEGACommandScript {
    // BANE gate check
    const gateResult = BaneTerminalSimulationGate.evaluate(proposal, arcAuthorized, false);

    if (gateResult.verdict === 'BLOCKED') {
      return {
        id: `TERM-${Date.now()}`,
        proposalId: proposal.proposalId,
        target: proposal.artifacts[0]?.target || 'unknown',
        simulationState: 'blocked',
        commands: [],
        rawScript: `# BLOCKED: ${gateResult.reasons.join(' | ')}`,
        environmentHint: 'N/A',
        noExecutionFlag: true,
        generatedAt: new Date().toISOString()
      };
    }

    // Determine the primary artifact and delegate to appropriate emitter
    const artifact = proposal.artifacts[0];
    if (!artifact) {
      return {
        id: `TERM-${Date.now()}`,
        proposalId: proposal.proposalId,
        target: 'unknown',
        simulationState: 'invalid',
        commands: [],
        rawScript: '# ERROR: No artifacts found in proposal.',
        environmentHint: 'N/A',
        noExecutionFlag: true,
        generatedAt: new Date().toISOString()
      };
    }

    let commands: SCIMEGACommand[] = [];
    let environmentHint = '';

    switch (artifact.target) {
      case 'betaflight_msp':
        commands = MspCliEmitter.emit(artifact);
        environmentHint = 'Betaflight Configurator CLI Tab';
        break;
      case 'ardupilot_mavlink':
        commands = MavlinkCliEmitter.emit(artifact);
        environmentHint = 'MAVProxy Console or QGroundControl Parameter Panel';
        break;
      case 'companion_raspberry_pi':
        commands = CompanionCliEmitter.emit(artifact);
        environmentHint = 'SSH Terminal (Raspberry Pi / Jetson)';
        break;
      default:
        commands = [{
          type: 'cli',
          commandLine: `# No terminal emitter available for target: ${artifact.target}`,
          description: 'Unsupported target for terminal emulation.',
          isSafetyCritical: false
        }];
        environmentHint = 'N/A';
    }

    // Build raw script text with annotations
    const header = ScriptAnnotation.generateHeader(proposal);
    const footer = ScriptAnnotation.generateFooter();
    const body = commands.map(cmd => {
      const safetyTag = cmd.isSafetyCritical ? ' # ⚠ SAFETY-CRITICAL' : '';
      return `${cmd.commandLine}${safetyTag}`;
    }).join('\n');

    const rawScript = header + body + '\n\n' + footer;

    return {
      id: `TERM-${Date.now()}`,
      proposalId: proposal.proposalId,
      target: artifact.target,
      simulationState: 'simulated',
      commands,
      rawScript,
      environmentHint,
      noExecutionFlag: true,
      generatedAt: new Date().toISOString()
    };
  }
}
