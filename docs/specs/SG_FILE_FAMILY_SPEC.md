# .sg* File Family Specification

## Purpose
Defines the directory structure, schema, and purpose of the specialized SCINGULAR™ (.sg*) file family used for data persistence, archival, and intelligence exchange.

## Current Truth-State
The ecosystem utilizes several proprietary file extensions to distinguish governed artifacts from generic data. These files are typically JSON-based with cryptographic headers.

## Canon Position
### Supported Extensions
- **.sgdoc**: DocuSCRIBE™ Witness Report (Inspection data + Audit trail).
- **.sgarch**: ArcHive™ Mission Manifest (Drone flight logs + Witness records).
- **.sgcb**: SCINGULAR™ Command Block (BANE-gated instruction sets).
- **.sgmeth**: Inspection Methodology Pack (Rules + Blocker profiles).
- **.sgconf**: Governed System Configuration (Signed system state).

## Implementation Status
- **.sgdoc / .sgarch**: Primary data structures defined and used in export boundaries.
- **.sgmeth**: Registry system active; file-based distribution in development.
- **.sgcb**: Modeled for terminal simulation; no live execution path.

## Known Limitations
- **Binary Compatibility**: Files are currently plain-text JSON; no optimized binary representation exists.
- **Cross-Platform Parsers**: Parsers are currently restricted to the ScingOS/web environment.

## Next Required Work
- **Schema Validation**: Implement JSON Schema validation for all .sg* types to prevent drift.
- **Binary Envelope**: Transition to a more efficient binary-wrapped JSON for large `.sgarch` files.
