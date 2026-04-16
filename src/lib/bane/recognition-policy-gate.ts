/**
 * @fileOverview BANE Recognition Policy Gate
 * @domain Inspections / Field Intelligence / Evidence Pipeline
 * @classification BANE_ENFORCEMENT — recognition verification transitions
 * @phase Phase 2 — Baseline Recognition Activation
 *
 * Provides the BANE policy evaluation surface specifically for recognition
 * stack verification transitions. This gate enforces:
 *
 *   - Human authority requirement for verification_pending → verified_by_overscite
 *   - Role-based access control (INSPECTOR, ADMIN, director only)
 *   - State precondition validation
 *   - Audit reference generation for each policy decision
 *   - Fail-closed default — unrecognized transitions are denied
 *
 * HARD RULES:
 * - verified_by_overscite may NEVER be reached without a human-authority BANE decision
 * - Engine actors cannot trigger verification transitions
 * - Audit reference must be generated for EVERY policy evaluation, including denials
 * - Device posture must be HEALTHY or secure for verification transitions
 *
 * @see src/lib/bane/policyEngine.ts
 * @see src/lib/services/recognition-persistence-service.ts
 * @see docs/governance/RECOGNITION_STACK_GOVERNANCE.md
 */

import { nanoid } from 'nanoid';
import type { Context, UserRole, DevicePosture } from './context';
import type { Decision, DecisionType } from './decision';

// ---------------------------------------------------------------------------
// Recognition Policy Action Constants
// ---------------------------------------------------------------------------

/** Actions governed by the recognition policy gate */
export const RECOGNITION_POLICY_ACTIONS = {
  /** Request analysis on an accepted_unanalyzed media asset */
  REQUEST_ANALYSIS: 'recognition.request_analysis',
  /** Advance to verification_pending after analysis_complete */
  REQUEST_VERIFICATION: 'recognition.request_verification',
  /** Execute governed verification (human authority) */
  EXECUTE_VERIFICATION: 'recognition.execute_verification',
  /** Flag review_required on any asset */
  FLAG_REVIEW: 'recognition.flag_review',
  /** Re-analyze a previously analyzed asset */
  REQUEST_REANALYSIS: 'recognition.request_reanalysis',

  // --- Phase 5: ArcHive Control Plane Governance ---
  CONTROL_PROPOSAL_CREATE: 'recognition.control.proposal_create',
  CONTROL_PROPOSAL_REVIEW: 'recognition.control.proposal_review',
  CONTROL_PROPOSAL_APPROVE: 'recognition.control.proposal_approve',
  CONTROL_PROPOSAL_REJECT: 'recognition.control.proposal_reject',
  CONTROL_ACTIVATE_VERSION: 'recognition.control.activate_staged_version',
  CONTROL_ROLLBACK_VERSION: 'recognition.control.rollback_version',
} as const;

export type RecognitionPolicyAction = typeof RECOGNITION_POLICY_ACTIONS[keyof typeof RECOGNITION_POLICY_ACTIONS];

// ---------------------------------------------------------------------------
// Recognition Policy Decision
// ---------------------------------------------------------------------------

export interface RecognitionPolicyDecision {
  /** BANE decision type: ALLOW, DENY, QUARANTINE */
  type: DecisionType;
  /** Machine-readable reason code */
  reasonCode: string;
  /** Human-readable reason detail */
  reasonDetail?: string;
  /** Unique reference for audit linkage */
  policyRef: string;
  /** ISO 8601 timestamp of evaluation */
  evaluatedAt: string;
  /** Action evaluated */
  action: RecognitionPolicyAction;
  /** Actor evaluated */
  actorId: string;
  /** Mapped BANE mode */
  mode: 'NORMAL' | 'DEMON';
}

// ---------------------------------------------------------------------------
// Role Authorization Matrix
// ---------------------------------------------------------------------------

/** Roles authorized for each recognition policy action */
const ACTION_ROLE_MATRIX: Record<RecognitionPolicyAction, UserRole[]> = {
  [RECOGNITION_POLICY_ACTIONS.REQUEST_ANALYSIS]:      ['INSPECTOR', 'ADMIN', 'director'],
  [RECOGNITION_POLICY_ACTIONS.REQUEST_VERIFICATION]:  ['INSPECTOR', 'ADMIN', 'director'],
  [RECOGNITION_POLICY_ACTIONS.EXECUTE_VERIFICATION]:  ['INSPECTOR', 'ADMIN', 'director'],
  [RECOGNITION_POLICY_ACTIONS.FLAG_REVIEW]:            ['INSPECTOR', 'ADMIN', 'AUDITOR', 'director', 'reviewer'],
  [RECOGNITION_POLICY_ACTIONS.REQUEST_REANALYSIS]:    ['INSPECTOR', 'ADMIN', 'director'],

  // Phase 5 Control Plane
  [RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_CREATE]: ['INSPECTOR', 'ADMIN', 'AUDITOR', 'director', 'reviewer'],
  [RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_REVIEW]: ['ADMIN', 'director', 'reviewer'],
  [RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_APPROVE]: ['ADMIN', 'director'], // Strict
  [RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_REJECT]: ['ADMIN', 'director', 'reviewer'],
  [RECOGNITION_POLICY_ACTIONS.CONTROL_ACTIVATE_VERSION]: ['ADMIN', 'director'],
  [RECOGNITION_POLICY_ACTIONS.CONTROL_ROLLBACK_VERSION]: ['director'], // Absolute authority
};

/** Device postures that permit verification transitions */
const VERIFICATION_ALLOWED_POSTURES: DevicePosture[] = ['HEALTHY', 'secure'];

// ---------------------------------------------------------------------------
// Recognition Policy Gate
// ---------------------------------------------------------------------------

/**
 * Evaluates a recognition-domain BANE policy gate for a specific action.
 *
 * HARD RULES:
 * - EXECUTE_VERIFICATION requires human actor + healthy device posture
 * - ENGINE actors cannot pass the verification gate
 * - All evaluations generate an audit-linkable policyRef
 * - Fail-closed: unrecognized actions are denied
 *
 * @param action - The recognition policy action to evaluate
 * @param context - BANE context with actor identity, role, device posture
 * @param attributes - Recognition-specific attributes (current state, etc.)
 * @returns RecognitionPolicyDecision with ALLOW/DENY and audit reference
 */
export function evaluateRecognitionPolicy(
  action: RecognitionPolicyAction,
  context: Context,
  attributes?: {
    currentMediaState?: string;
    targetMediaState?: string;
    packetVerificationState?: string;
  }
): RecognitionPolicyDecision {
  const policyRef = `bane-reco-${nanoid(12)}`;
  const evaluatedAt = new Date().toISOString();
  const actorId = context.subject;

  // Helper: build a decision
  function decide(
    type: DecisionType,
    reasonCode: string,
    reasonDetail?: string
  ): RecognitionPolicyDecision {
    return {
      type,
      reasonCode,
      reasonDetail,
      policyRef,
      evaluatedAt,
      action,
      actorId,
      mode: 'NORMAL',
    };
  }

  // --- Gate 1: Device posture check ---
  if (context.devicePosture === 'ROOTED') {
    return decide('DENY', 'DEVICE_POSTURE_ROOTED', 'Rooted device cannot perform recognition policy actions');
  }

  // --- Gate 2: Role authorization ---
  const allowedRoles = ACTION_ROLE_MATRIX[action];
  if (!allowedRoles) {
    return decide('DENY', 'ACTION_NOT_DEFINED', `Unrecognized recognition policy action: ${action}`);
  }

  if (!allowedRoles.includes(context.userRole)) {
    return decide(
      'DENY',
      'INSUFFICIENT_ROLE',
      `Role '${context.userRole}' is not authorized for action '${action}'. Allowed: ${allowedRoles.join(', ')}`
    );
  }

  // --- Gate 3: Action-specific precondition checks ---
  switch (action) {
    case RECOGNITION_POLICY_ACTIONS.REQUEST_ANALYSIS: {
      // Analysis can only be requested on accepted_unanalyzed assets
      if (attributes?.currentMediaState && attributes.currentMediaState !== 'accepted_unanalyzed') {
        return decide(
          'DENY',
          'PRECONDITION_FAILED',
          `Analysis can only be requested from 'accepted_unanalyzed'. Current: '${attributes.currentMediaState}'`
        );
      }
      return decide('ALLOW', 'OK');
    }

    case RECOGNITION_POLICY_ACTIONS.REQUEST_VERIFICATION: {
      // Verification can only be requested after analysis_complete
      if (attributes?.currentMediaState && attributes.currentMediaState !== 'analysis_complete') {
        return decide(
          'DENY',
          'PRECONDITION_FAILED',
          `Verification can only be requested from 'analysis_complete'. Current: '${attributes.currentMediaState}'`
        );
      }
      return decide('ALLOW', 'OK');
    }

    case RECOGNITION_POLICY_ACTIONS.EXECUTE_VERIFICATION: {
      // HARD RULE: This is the most sensitive gate.
      // Requires: human actor, healthy device, verification_pending state

      // Device posture must be healthy/secure for verification
      if (!VERIFICATION_ALLOWED_POSTURES.includes(context.devicePosture)) {
        return decide(
          'DENY',
          'DEVICE_POSTURE_INSUFFICIENT',
          `Verification requires device posture: ${VERIFICATION_ALLOWED_POSTURES.join(', ')}. Current: '${context.devicePosture}'`
        );
      }

      // Current state must be verification_pending
      if (attributes?.currentMediaState !== 'verification_pending') {
        return decide(
          'DENY',
          'PRECONDITION_FAILED',
          `Verification execution requires 'verification_pending' state. Current: '${attributes?.currentMediaState}'`
        );
      }

      // HARD RULE: Engine subjects cannot execute verification
      if (context.subject.startsWith('lari_') || context.subject.startsWith('engine_') || context.subject === 'recognition_orchestrator') {
        return decide(
          'DENY',
          'ENGINE_VERIFICATION_BLOCKED',
          'Engine actors cannot execute verification transitions. Human authority required.'
        );
      }

      return decide('ALLOW', 'OK', 'Human authority verified. Verification transition permitted.');
    }

    case RECOGNITION_POLICY_ACTIONS.FLAG_REVIEW: {
      // Review flagging is always permitted for authorized roles — no state restriction
      return decide('ALLOW', 'OK');
    }

    case RECOGNITION_POLICY_ACTIONS.REQUEST_REANALYSIS: {
      // Re-analysis requires the prior analysis to be complete or review_required
      const validStates = ['analysis_complete', 'review_required', 'verified_by_overscite'];
      if (attributes?.currentMediaState && !validStates.includes(attributes.currentMediaState)) {
        return decide(
          'DENY',
          'PRECONDITION_FAILED',
          `Re-analysis requires state: ${validStates.join(', ')}. Current: '${attributes.currentMediaState}'`
        );
      }
      return decide('ALLOW', 'OK');
    }

    // --- Phase 5: ArcHive Control Plane Gates ---

    case RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_CREATE:
    case RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_REVIEW:
    case RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_REJECT:
      // Allowed if role checks passed (Gate 2). Engines blocked.
      if (context.subject.startsWith('lari_') || context.subject.startsWith('engine_')) {
        return decide('DENY', 'ENGINE_CONTROL_BLOCKED', 'Engines cannot participate in control surface lifecycle.');
      }
      return decide('ALLOW', 'OK');

    case RECOGNITION_POLICY_ACTIONS.CONTROL_PROPOSAL_APPROVE:
    case RECOGNITION_POLICY_ACTIONS.CONTROL_ACTIVATE_VERSION:
    case RECOGNITION_POLICY_ACTIONS.CONTROL_ROLLBACK_VERSION: {
      // High-consequence transitions: healthy/secure device required
      if (!['HEALTHY', 'secure'].includes(context.devicePosture)) {
        return decide(
          'DENY',
          'DEVICE_POSTURE_INSUFFICIENT',
          `Critical control actions require secure device posture. Current: '${context.devicePosture}'`
        );
      }
      
      // Strict engine block
      if (context.subject.startsWith('lari_') || context.subject.startsWith('engine_') || context.subject === 'recognition_orchestrator') {
        return decide('DENY', 'ENGINE_CONTROL_BLOCKED', 'Engine or service actors cannot approve or activate control plane versions.');
      }

      return decide('ALLOW', 'OK', 'Human authority verified for governance activation.');
    }

    default:
      // Fail closed
      return decide('DENY', 'ACTION_NOT_DEFINED', `Unrecognized recognition policy action: ${action}`);
  }
}

/**
 * Maps a RecognitionPolicyDecision to the persistence service's expected format.
 * Used by the orchestration layer when calling recordVerificationDecision().
 */
export function toVerificationDecision(
  decision: RecognitionPolicyDecision
): { baneDecision: 'allowed' | 'denied' | 'escalated'; banePolicyRef: string } {
  return {
    baneDecision: decision.type === 'ALLOW' ? 'allowed' : decision.type === 'QUARANTINE' ? 'escalated' : 'denied',
    banePolicyRef: decision.policyRef,
  };
}
