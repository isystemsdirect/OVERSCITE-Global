/**
 * @classification AUTHORITY_PRIORITY
 * @authority Flight Autonomy Architecture Unit
 * @purpose Defines the explicit, deterministic precedence of control authority.
 * @warning Simulation only. Lower number = higher priority.
 */

export enum AuthorityPriority {
  TEON_SAFETY = 0,
  PILOT_INTERRUPT = 1,
  SECURITY_OVERRIDE = 2,
  BANE_HOLD = 3,
  SCING_AUTONOMY = 4,
  ASSISTED_MODE = 5
}
