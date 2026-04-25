# SCIMEGA™ Test Plan

## Purpose
Defines the testing strategy and validation protocols for the SCIMEGA™ operating system and its supporting infrastructure.

## Current Truth-State
Testing is currently focused on **Architectural Integrity** and **UIX Regression**. Since there is no live hardware path, physical flight testing is substituted with high-fidelity simulation.

## Canon Position
### Mandatory Test Domains
1. **BANE Gate Validation**: Ensuring all state transitions are authorized and safe.
2. **TEON Safety Envelope**: Verifying that kinetic boundaries are enforced in simulation.
3. **Manifest Integrity**: Validating that `.sgarch` files are correctly packaged and hashed.
4. **Dry-Link Metadata**: Verifying that inbound telemetry does not trigger command execution.

## Implementation Status
- **Unit Testing**: Jest-based testing for LARI-ArcHive™ and BANE logic.
- **UIX Regression**: Manual verification of unified command surface and authority rails.
- **Simulation Validation**: Scenario-based testing in the SCIMEGA™ mission builder.

## Known Limitations
- **No Automated Hardware Testing**: Hardware interaction is mocked; no automated HIL (Hardware-in-the-Loop) suite is active.
- **Manual Gate Verification**: Some BANE gate transitions still require manual status inspection.

## Next Required Work
- **Automated Replay Regression**: Implement a tool to automatically re-run historical manifests through the current BANE engine to detect logic drift.
- **UIX Component Library Tests**: Expand Playwright/Cypress coverage for high-stakes UI components.
