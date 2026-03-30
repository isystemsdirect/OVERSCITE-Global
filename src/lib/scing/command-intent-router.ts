import { ExecutionTriggerAudit, detectExecutionTrigger } from './execution-trigger';

export type CommandTier = 'TIER_1_ANALYTICAL' | 'TIER_2_PREPARATORY' | 'TIER_3_EXECUTION';

export interface CommandIntent {
  raw_command: string;
  inferred_tier: CommandTier;
  trigger_audit: ExecutionTriggerAudit;
  target_route?: string;
  staged_data?: Record<string, string>;
}

/**
 * Mocks an intelligence layer routing decision.
 * Determines if a string requires Execution (Tier 3) or is just Prep/Analytical.
 */
export function routeCommandIntent(command: string): CommandIntent {
  const triggerAudit = detectExecutionTrigger(command);
  
  // Basic heuristic for demonstration purposes as per documentation rules.
  let tier: CommandTier = 'TIER_1_ANALYTICAL';
  
  const normalized = command.toLowerCase();

  // If there's an explicit trigger word, it escalates to Tier 3 intent
  if (triggerAudit.detected) {
    tier = 'TIER_3_EXECUTION';
  } else if (
    normalized.includes('prepare') || 
    normalized.includes('stage') || 
    normalized.includes('draft') || 
    normalized.includes('line up')
  ) {
    tier = 'TIER_2_PREPARATORY';
  }

  return {
    raw_command: command,
    inferred_tier: tier,
    trigger_audit: triggerAudit,
  };
}
