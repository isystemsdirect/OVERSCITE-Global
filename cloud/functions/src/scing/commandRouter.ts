import { ScingCommandPayload, ScingCommandResult, ScingCommandInterpretation } from '../types/scing-command';


/**
 * Parses raw natural language input and simulates determining intent within the governed shell.
 * It enforces BANE gating rules (checking permissions for actions that mute systems, dispatch teams, etc.)
 */
export async function routeCommand(payload: ScingCommandPayload): Promise<ScingCommandResult> {
  const raw = payload.raw_input.toLowerCase();
  
  // 1. Hardened Gating: If the prompt requests a destructive/mutation action, mark governance_required.
  let intentType: ScingCommandInterpretation['command_type'] = 'Search';
  let governanceRequired = false;
  let requiredPerm = undefined;
  let intent = 'General Inquiry';
  let actionTaken = 'No action';
  
  if (raw.includes('go to') || raw.includes('navigate') || raw.includes('open')) {
    intentType = 'Navigate';
    intent = 'Route Navigation';
    actionTaken = 'Suggest route change to frontend Shell';
  } else if (raw.includes('approve') || raw.includes('sign off') || raw.includes('dispatch') || raw.includes('update')) {
    intentType = 'Act';
    intent = 'Mutation Requested';
    governanceRequired = true;
    requiredPerm = 'BANE_WRITE_ACCESS';
    actionTaken = 'Queue confirmation. Awaiting Human Authority.';
  } else if (raw.includes('summarize') || raw.includes('report') || raw.includes('brief')) {
    intentType = 'Summarize';
    intent = 'Synthesize Information';
    actionTaken = 'Retrieve context and summarize for Thread';
  } else if (raw.includes('analyze') || raw.includes('inspect data')) {
    intentType = 'Analyze';
    intent = 'Data Analytics';
    actionTaken = 'Perform read-only query and return metrics';
  }

  // Enforce the rule: Scing does not grant autonomous capability for destructive acts.
  if (governanceRequired) {
    return {
      ok: false,
      error: 'BANE Governance Gate: Critical action requested via Scing. Human approval required.',
      action_taken: actionTaken,
      interpretation: {
        command_type: intentType,
        intent,
        parameters: { text: raw },
        governance_required: governanceRequired,
        required_permission: requiredPerm
      }
    };
  }

  return {
    ok: true,
    action_taken: actionTaken,
    data: { response: `Scing processed interpretation for: ${intent}` },
    interpretation: {
      command_type: intentType,
      intent,
      parameters: { text: raw },
      governance_required: governanceRequired
    }
  };
}
