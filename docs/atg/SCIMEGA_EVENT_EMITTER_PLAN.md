# SCIMEGA™ Event Emitter Plan

## Objective
Transition the SCIMEGA™ authority flow from static/mock events to a real-time `ControlArbitrationEngine` event-emitter for v0.1.3 readiness.

## Current State [v0.1.2]
- Authority events (BANE transitions, ARC authorizations, TEON violations) are currently static or seeded via mock data.
- The UI listens for these events but receives them from a simulated source.

## Target State [v0.1.3]
- A real `ControlArbitrationEngine` class implements a standard event-emitter pattern.
- The engine emits real-time events based on actual system state changes, sensor data, and human commands.
- BANE and TEON logic is integrated into the emission pipeline to ensure all events are pre-governed.

## Proposed Event Schema
| Event Type | Description | Payload |
| :--- | :--- | :--- |
| `AUTHORITY_REQUEST` | IU or System requesting a state change | `requestor_id`, `target_state`, `reason` |
| `BANE_DECISION` | BANE approving or blocking a request | `decision_id`, `status` (APPROVED/BLOCKED), `audit_ref` |
| `TEON_ENVELOPE_UPDATE` | Flight safety boundaries have shifted | `envelope_params`, `weather_signal_ref` |
| `ARC_SIGNATURE_APPLIED` | Human authority has been cryptographically bound | `signer_id`, `hash`, `event_ref` |
| `PIP_TRIGGERED` | Pilot Interrupt Protocol has been activated | `operator_id`, `timestamp`, `anchor_point` |
| `TRUTH_STATE_SHIFT` | System truth-state has been promoted or demoted | `prev_state`, `new_state`, `authority_ref` |

## Implementation Roadmap
1. **Define Core Emitter Class**: Create the `ControlArbitrationEngine` in `src/engines/`.
2. **Wire BANE/TEON Gates**: Integrate governance logic into the `emit()` method.
3. **Refactor UI Listeners**: Update components to listen for real engine events.
4. **Validate with Playback**: Use LARI-ArcHive™ witness records to replay historical event sequences through the new emitter.
