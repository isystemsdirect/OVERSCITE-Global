# SGCB Protocol Specification

## Purpose
Defines the SCINGULAR™ Command Block (SGCB) protocol, which governs how instructions are packaged, verified, and (eventually) transmitted between Scing and SCIMEGA™.

## Current Truth-State
SGCB is a non-executing protocol used for mission rehearsal and terminal simulation. It provides a structured way to review "what would happen" if commands were executed.

## Canon Position
An SGCB block must pass three gates before it is considered "Clear for Simulation":
1. **BANE Gate**: Validates the block against truth-state governance and authority (ARC).
2. **TEON Gate**: Validates the block against physical safety envelopes and timing constraints.
3. **IU Acknowledgment**: Requires the operator to explicitly sign the "No Execution" boundary.

## Implementation Status
- **Block Structure**: JSON-based blocks containing command sequences, metadata, and audit fields.
- **Terminal Simulation**: Implemented in SCIMEGA™ UI to show predicted output from SGCB sequences.
- **Enforcement**: Blocks without BANE/TEON clearance are marked "BLOCKED" and cannot be rehearsed.

## Known Limitations
- **No Hardware Driver**: There is no driver to translate SGCB to physical protocols (MAVLink/MSP) in v0.1.2.
- **Stateless Rehearsal**: Simulation does not currently track persistent hardware state between blocks.

## Next Required Work
- **Sequence Verification**: Implement logic to detect conflicting commands within a single SGCB block.
- **Protocol Bridge (MAVLink)**: Design-phase only mapping of SGCB instructions to MAVLink counterparts.
