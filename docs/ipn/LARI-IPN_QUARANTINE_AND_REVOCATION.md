# LARI-IPN Quarantine & Revocation Strategy

## Containment Architecture
Quarantine operates as a governed boundary, strictly disabling consequential channels on nodes marked as structurally comprised, degraded beyond acceptable boundaries, or issuing repeated authorization failures.

### Revocation Depth
- **Session Revocation**: Local kill of transit capability without revoking device key authentication.
- **Device Revocation**: Terminates identity mapping. Device enters `BLOCKED` trust state.
- **Global Revocation**: Kills all nodes tied to an ARC operator ID across the workspace boundary. Requires Director-level role context mapping via BANE.

## Operator Review
Devices housed inside `QUARANTINED` bounds can only access Read-Mostly Telemetry and BANE configuration loops. Returning a device to `TRUSTED` mandates explicitly elevated human-in-loop verification documented immutably in ScingOS Core.
