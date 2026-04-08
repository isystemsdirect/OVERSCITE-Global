/**
 * SRT Pipeline State Machine
 *
 * Defines the canonical transitions an accepted item may undergo
 * across the Edge Function Orchestration spine.
 */

export type AcceptedPipelineState = 
  | "accepted_pending_queue"
  | "intake_in_progress"
  | "stored_source"
  | "derivative_generation_pending"
  | "derivative_generation_complete"
  | "accepted_unanalyzed"            // CB-005 resting state
  | "accepted_analysis_requested"    // CB-005 compute trigger
  | "analysis_pending"
  | "analysis_in_progress"
  | "analysis_complete"
  | "findings_recorded"
  | "verification_pending"
  | "verification_bound"
  | "export_ready"
  | "export_generated"
  | "quarantined_failure"
  | "retry_scheduled"
  | "terminal_failure";

const VALID_TRANSITIONS: Record<AcceptedPipelineState, AcceptedPipelineState[]> = {
  accepted_pending_queue: ['intake_in_progress', 'quarantined_failure', 'terminal_failure'],
  intake_in_progress: ['stored_source', 'quarantined_failure', 'terminal_failure'],
  stored_source: ['derivative_generation_pending', 'accepted_unanalyzed', 'quarantined_failure', 'terminal_failure'],
  derivative_generation_pending: ['derivative_generation_complete', 'accepted_unanalyzed', 'quarantined_failure'],
  derivative_generation_complete: ['accepted_unanalyzed'],
  
  // CB-005: Resting & Trigger path
  accepted_unanalyzed: ['accepted_analysis_requested', 'quarantined_failure'],
  accepted_analysis_requested: ['analysis_pending', 'quarantined_failure', 'terminal_failure'],

  analysis_pending: ['analysis_in_progress', 'quarantined_failure'],
  analysis_in_progress: ['analysis_complete', 'quarantined_failure', 'terminal_failure'],
  analysis_complete: ['findings_recorded', 'quarantined_failure'],
  findings_recorded: ['verification_pending', 'quarantined_failure'],
  verification_pending: ['verification_bound', 'quarantined_failure'],
  verification_bound: ['export_ready'],
  export_ready: ['export_generated'],
  export_generated: [],
  quarantined_failure: ['retry_scheduled', 'terminal_failure'],
  retry_scheduled: ['accepted_pending_queue', 'derivative_generation_pending', 'accepted_analysis_requested', 'analysis_pending', 'verification_pending'],
  terminal_failure: []
};

export function isValidPipelineTransition(from: AcceptedPipelineState, to: AcceptedPipelineState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
