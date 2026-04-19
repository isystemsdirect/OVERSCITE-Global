import { CommandIntent } from '../scing/command-intent-router';

export interface BANEExecutionDecision {
  permitted: boolean;
  reason?: string;
  audit_signature: {
    timestamp: string;
    action_type: string;
    detected_trigger_word: string | null;
  };
}

/**
 * Gatekeeper enforcing the Explicit Execution Trigger Doctrine.
 * If Scing attempts to mutate the UI or execute a transaction without an approved lexicon trigger,
 * BANE formally halts it.
 */
export function evaluateBANEExecutionGate(intent: CommandIntent): BANEExecutionDecision {
  const isExecutionAttempt = intent.inferred_tier === 'TIER_3_EXECUTION';
  
  const signature = {
    timestamp: new Date().toISOString(),
    action_type: intent.inferred_tier,
    detected_trigger_word: intent.trigger_audit.word || null,
  };

  if (!isExecutionAttempt) {
    // Prep/Analytical actions are always permitted
    return {
      permitted: true,
      audit_signature: signature
    };
  }

  // Execution attempts MUST have a trigger word
  if (!intent.trigger_audit.detected) {
    return {
      permitted: false,
      reason: "BANE BLOCK: Scing attempted to execute a Tier 3 action without an explicit human execution trigger.",
      audit_signature: signature
    };
  }

  return {
    permitted: true,
    audit_signature: signature
  };
}

/**
 * Gatekeeper alias for contract-specific mutations.
 */
export function evaluateContractMutationGate(intent: CommandIntent): BANEExecutionDecision {
  return evaluateBANEExecutionGate(intent);
}
