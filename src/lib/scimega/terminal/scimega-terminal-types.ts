/**
 * @classification SCIMEGA_TERMINAL_TYPES
 * @authority SCIMEGA Terminal Emulation Layer
 * @purpose Defines types for simulated non-executing terminal output artifacts.
 * @warning ALL OUTPUTS ARE SIMULATED AND NON-EXECUTING.
 */

export type SCIMEGASimulationState = 
  | 'simulated'
  | 'approved_for_simulation'
  | 'blocked'
  | 'invalid';

export interface SCIMEGACommand {
  type: 'cli' | 'system' | 'param';
  commandLine: string;
  description: string;
  isSafetyCritical: boolean;
}

export interface SCIMEGACommandScript {
  id: string;
  proposalId: string;
  target: string;
  simulationState: SCIMEGASimulationState;
  commands: SCIMEGACommand[];
  rawScript: string;
  environmentHint: string;
  noExecutionFlag: true;
  generatedAt: string;
}

export interface SCIMEGATerminalSession {
  sessionId: string;
  activeScript: SCIMEGACommandScript | null;
  status: 'idle' | 'simulating' | 'completed' | 'blocked';
}
