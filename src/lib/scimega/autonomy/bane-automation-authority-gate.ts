/**
 * @classification BANE_AUTOMATION_AUTHORITY_GATE
 * @authority BANE Governance Layer
 * @purpose Evaluates constraints and grants or blocks automation authority.
 * @warning Simulation only. Approval does not authorize live hardware control in this phase.
 */

export type BaneAutomationVerdict = 'APPROVED_FOR_SIMULATION' | 'REVIEW_REQUIRED' | 'RESTRICTED' | 'BLOCKED';

export class BaneAutomationAuthorityGate {
  /**
   * Evaluates if full mission automation is permitted.
   * Deterministic Governance: All conditions must be met for approval.
   */
  static evaluate(
    iuArcAuthorized: boolean,
    missionPlanValid: boolean,
    teonEnvelopeActive: boolean,
    pilotInterruptActive: boolean,
    returnToOriginAvailable: boolean,
    obstacleAvoidanceActive: boolean
  ): { verdict: BaneAutomationVerdict; reasons: string[]; isAuthorized: boolean } {
    
    const reasons: string[] = [];
    let verdict: BaneAutomationVerdict = 'APPROVED_FOR_SIMULATION';

    // HARD RULES (BLOCKED)
    if (!pilotInterruptActive) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: Pilot interrupt protocol unavailable. Full automation blocked.');
    }
    
    if (!teonEnvelopeActive) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: TEON safety envelope inactive. Automation blocked.');
    }

    if (!returnToOriginAvailable) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: Return-to-origin unavailable. Full automation blocked.');
    }

    if (!iuArcAuthorized) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: ARC Identity authorization missing.');
    }

    if (!missionPlanValid) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: Mission plan is invalid or contains unsafe steps.');
    }

    if (!obstacleAvoidanceActive) {
      verdict = 'BLOCKED';
      reasons.push('CRITICAL: Obstacle avoidance inactive. Autonomous flight requires active sensing.');
    }

    const isAuthorized = verdict === 'APPROVED_FOR_SIMULATION';

    if (isAuthorized) {
      reasons.push('BANE GOVERNANCE LOCK: All pre-activation constraints satisfied.');
    } else {
      reasons.push('BANE GOVERNANCE LOCK: Automation rejected due to missing safety constraints.');
    }

    return { verdict, reasons, isAuthorized };
  }
}
