# SCIMEGA™ Workstation Access Model

## Overview
The SCIMEGA™ Workstation is a dedicated control domain integrated within the XSCITE™ Controller interface. Access to workstation modules is governed by BANE and TEON to ensure absolute flight safety and execution stability.

## Access States
Access is dynamically evaluated based on flight mode, operator role, and safety envelopes.

| State | Condition | Capabilities |
|-------|-----------|--------------|
| `FULL_ACCESS` | Grounded / Standby | Full mutation, build, mission, and firmware capabilities. |
| `CALIBRATION_ONLY` | Active Flight / Pilot Mode | Only whitelisted flight-safe calibration/diagnostic modules. |
| `READ_ONLY` | Observer Mode | Telemetry and status monitoring without adjustment. |
| `LOCKED` | Safety Violation | Access suspended to prioritize flight-critical systems. |
| `BLOCKED` | Security Override | Total lockout by Director/BANE mandate. |

## Pilot Mode Lockout
During active flight or manual pilot control, the workstation automatically transitions to **Restricted Mode**.

### Blocked Mutations
- Build profile changes
- Firmware export/reflash
- Mission plan restructuring
- Dry-Link contract edits
- PL/DL package mutation
- Autonomy rule edits

### Whitelisted Flight-Safe Modules
- Sensor health monitoring
- Telemetry calibration view
- Camera/Gimbal trim
- Non-disruptive payload calibration
- Compass/GPS status
- Battery/Thermal envelope
- TEON safety envelope visualization

## Governance Layers
- **BANE**: Enforces the access gate and validates module safety signatures.
- **TEON**: May trigger a total workstation lockout if kinetic instability is detected.
- **Scing**: Provides real-time advisory on lockout status and safety rationale.
