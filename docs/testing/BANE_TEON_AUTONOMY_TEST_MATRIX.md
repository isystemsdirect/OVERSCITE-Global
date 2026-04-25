# BANE / TEON Autonomy Test Matrix

## Purpose
This matrix documents the specific test cases and expected behaviors for the BANE-gated and TEON-constrained autonomy system.

## Current Truth-State
All cases are validated using the SCIMEGA™ Simulation Engine. No physical flight tests have occurred.

## Canon Position
| Test Case | Autonomy Mode | Gate/Envelope | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Unauthorized Mode** | Mission Alpha | BANE Authority | Blocked (No ARC) | **PASS** |
| **Wind Violation** | Survey Bravo | TEON Safety | Forced Anchor Hold | **PASS** |
| **Geofence Breach** | Inspection Delta | TEON Safety | Forced Return-to-Origin | **PASS** |
| **Pilot Takeover** | Any | PIP Override | Manual Control Regained | **PASS** |
| **Unsigned Proposal** | Mission Replay | BANE Governance | Read-Only (No Replay) | **PASS** |

## Implementation Status
- **BANE Gate Logic**: `src/lib/scimega/bfi/bane-gate.ts` (Evaluates ARC and mission state).
- **TEON Envelope Logic**: `src/lib/scimega/bfi/teon-envelope.ts` (Evaluates sensors and wind).
- **PIP Logic**: Priority interrupt path implemented in `src/components/drone/FlightModeStrip.tsx`.

## Known Limitations
- **Simulation Fidelity**: TEON overrides in simulation are instantaneous; real-world physics may introduce lag.
- **Single-Target Enforcement**: BANE currently only supports one active mission proposal at a time.

## Next Required Work
- **Probabilistic Risk Testing**: Introduce random sensor "noise" into simulation to test TEON's response to uncertainty.
