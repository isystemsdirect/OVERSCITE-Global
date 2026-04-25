# BANE/TEON Autonomy Test Matrix

## Overview
This matrix defines the validation scenarios for BANE (governance integrity) and TEON (kinetic safety) autonomy constraints in v0.1.2.

## BANE: Automation Authority Gate Tests
| ID | Scenario | Expected Outcome | Truth-State |
| :--- | :--- | :--- | :--- |
| BANE-01 | Unauthorized state transition attempt | Blocked; Audit log entry created | SIMULATED |
| BANE-02 | Validated intent transition | Permitted; Audit log entry created | SIMULATED |
| BANE-03 | Missing ARC identity on authority call | Blocked; Authorization error | SIMULATED |
| BANE-04 | Conflicting mission parameters | Blocked; Integrity error | SIMULATED |

## TEON: Flight Safety Envelope Tests
| ID | Scenario | Expected Outcome | Truth-State |
| :--- | :--- | :--- | :--- |
| TEON-01 | Attempted move outside safety envelope | Command truncated or blocked | SIMULATED |
| TEON-02 | Wind conditions exceeding tolerance | Immediate transition to Anchor Hold | SIMULATED |
| TEON-03 | Low battery threshold reached | Auto-return protocol initiated | SIMULATED |
| TEON-04 | Collision risk detected (mock sensor) | Immediate kinetic avoidance or halt | SIMULATED |

## Multi-Intelligence Collision Tests
| ID | Scenario | Expected Outcome | Truth-State |
| :--- | :--- | :--- | :--- |
| MIX-01 | BANE and TEON disagree on transition | Most restrictive constraint wins (Halt) | SIMULATED |
| MIX-02 | Pilot Interrupt (PIP) during autonomy | PIP overrides all; transition to Anchor Hold | SIMULATED |
| MIX-03 | Scing advisory conflicts with TEON | TEON safety envelope outranks Scing advice | SIMULATED |

## Validation Protocol
All tests must return `PASS` with zero governance violations before a build is considered stable for simulation.
