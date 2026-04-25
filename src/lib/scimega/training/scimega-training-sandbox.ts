/**
 * @classification SCIMEGA_TRAINING_SANDBOX
 * @authority SCIMEGA Training Unit
 * @purpose Defines training scenarios for operator familiarization with the SCIMEGA proposal lifecycle.
 * @warning Sandbox is separate from production proposal authority. No execution paths exist.
 */

export interface SCIMEGATrainingScenario {
  id: string;
  name: string;
  description: string;
  expectedOutcome: string;
  learningObjectives: string[];
  simulatedConditions: {
    proposalStatus: string;
    baneVerdict: string;
    arcAuthorized: boolean;
    telemetryTrustState: string;
    exportTarget: string;
    hasMutationIntent: boolean;
  };
}

export const SCIMEGA_TRAINING_SCENARIOS: SCIMEGATrainingScenario[] = [
  {
    id: 'TRAIN-001',
    name: 'Safe Proposal Review',
    description: 'A fully compliant proposal with ARC authorization and clean BANE verdict.',
    expectedOutcome: 'Operator approves after reviewing all checklist items.',
    learningObjectives: ['Understand proposal lifecycle', 'Verify ARC authorization', 'Review terminal output'],
    simulatedConditions: { proposalStatus: 'approved_for_export', baneVerdict: 'APPROVED', arcAuthorized: true, telemetryTrustState: 'observed', exportTarget: 'betaflight_msp', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-002',
    name: 'Blocked Mutation Intent',
    description: 'A proposal flagged with hardware mutation intent that BANE must block.',
    expectedOutcome: 'Operator observes BLOCKED verdict and understands why simulation is refused.',
    learningObjectives: ['Recognize mutation boundaries', 'Understand BANE blocking logic'],
    simulatedConditions: { proposalStatus: 'review_required', baneVerdict: 'BLOCKED', arcAuthorized: true, telemetryTrustState: 'simulated', exportTarget: 'ardupilot_mavlink', hasMutationIntent: true }
  },
  {
    id: 'TRAIN-003',
    name: 'Stale Telemetry Observation',
    description: 'Telemetry bridge reports stale data exceeding freshness threshold.',
    expectedOutcome: 'Operator identifies degraded trust state and defers action.',
    learningObjectives: ['Interpret telemetry trust states', 'Recognize stale data risk'],
    simulatedConditions: { proposalStatus: 'approved_for_export', baneVerdict: 'APPROVED', arcAuthorized: true, telemetryTrustState: 'stale', exportTarget: 'companion_raspberry_pi', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-004',
    name: 'Missing ARC Authorization',
    description: 'A proposal generated without ARC identity verification.',
    expectedOutcome: 'Operator observes signing gate rejection and understands identity requirement.',
    learningObjectives: ['Understand ARC identity gate', 'Recognize authorization dependency'],
    simulatedConditions: { proposalStatus: 'review_required', baneVerdict: 'RESTRICTED', arcAuthorized: false, telemetryTrustState: 'simulated', exportTarget: 'betaflight_msp', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-005',
    name: 'Manual Review Required',
    description: 'A proposal with environmental warnings requiring human judgment.',
    expectedOutcome: 'Operator reviews warnings, applies judgment, and documents decision.',
    learningObjectives: ['Exercise human-in-the-loop authority', 'Document review rationale'],
    simulatedConditions: { proposalStatus: 'review_required', baneVerdict: 'MANUAL_REVIEW', arcAuthorized: true, telemetryTrustState: 'degraded', exportTarget: 'scimega_dos_manifest', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-006',
    name: 'Replay: Safe Proposal Timeline',
    description: 'Review a complete replay timeline from a safe proposal with observed telemetry.',
    expectedOutcome: 'Operator reviews chronological events and confirms trust state continuity.',
    learningObjectives: ['Navigate replay timeline', 'Verify trust state across frames', 'Review audit chain'],
    simulatedConditions: { proposalStatus: 'approved_for_export', baneVerdict: 'APPROVED', arcAuthorized: true, telemetryTrustState: 'observed', exportTarget: 'betaflight_msp', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-007',
    name: 'Replay: Stale Telemetry Detection',
    description: 'Replay a session where telemetry degrades from observed to stale mid-timeline.',
    expectedOutcome: 'Operator identifies stale frames and risk annotations in the replay.',
    learningObjectives: ['Detect telemetry degradation in replay', 'Interpret risk annotations'],
    simulatedConditions: { proposalStatus: 'approved_for_export', baneVerdict: 'APPROVED', arcAuthorized: true, telemetryTrustState: 'stale', exportTarget: 'companion_raspberry_pi', hasMutationIntent: false }
  },
  {
    id: 'TRAIN-008',
    name: 'Replay: Blocked Deployment Review',
    description: 'Replay a blocked deployment timeline and review BANE rejection events.',
    expectedOutcome: 'Operator traces BANE block event in timeline and reviews rationale.',
    learningObjectives: ['Trace BANE events in replay', 'Understand deployment gate failure'],
    simulatedConditions: { proposalStatus: 'review_required', baneVerdict: 'BLOCKED', arcAuthorized: true, telemetryTrustState: 'simulated', exportTarget: 'ardupilot_mavlink', hasMutationIntent: true }
  },
  {
    id: 'TRAIN-009',
    name: 'Replay: Missing ARC in Timeline',
    description: 'Replay a timeline where ARC authorization was absent during proposal signing.',
    expectedOutcome: 'Operator identifies missing ARC event and understands authorization gap.',
    learningObjectives: ['Detect ARC gaps in replay', 'Correlate authorization events with proposals'],
    simulatedConditions: { proposalStatus: 'review_required', baneVerdict: 'RESTRICTED', arcAuthorized: false, telemetryTrustState: 'simulated', exportTarget: 'betaflight_msp', hasMutationIntent: false }
  }
];
