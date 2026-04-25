# SCINGULAR™ Device Integration Guide

## SCIMEGA™ Physical Laboratory (PL)
The Physical Laboratory is the governed physical laboratory environment where hardware embodiment and device modeling are represented. In v0.1.2, PL has no execution capability.

## Dry-Link Contracts
Dry-Link contracts define the metadata-only synchronization boundary between SCIMEGA™ and physical hardware:
- Telemetry flows inward (read-only intake).
- No commands flow outward.
- The system is activation-aware but does not establish a live connection.

## Telemetry vs. C2 Distinction
- **Telemetry**: One-way data flow from hardware to software. Read-only. Always permitted in Dry-Link mode.
- **C2 (Command & Control)**: Two-way command flow enabling hardware mutation. Prohibited until future authorized phase.

## Reality Bridge
The Reality Bridge is the controlled boundary governing any future transition from Dry-Link to real-world execution. It requires:
- Director authorization.
- BANE phase gate approval.
- ARC identity binding to a certified operator.
- TEON envelope validation against real-world conditions.

## BANE/TEON Gating
All device interactions are gated by BANE (governance integrity) and TEON (kinetic safety). No device command can bypass these gates.

## Pilot Interrupt & Anchor Hold
- **Pilot Interrupt Protocol (PIP)**: Provides unconditional override from any autonomous mode.
- **Anchor Hold**: The stabilization state that PIP transitions to, maintaining a safe fixed position.

## No Live Connection Unless Future Authorized Phase
The current system posture prohibits live hardware connections. This restriction is enforced at the code, governance, and architectural levels. Activation requires explicit Director authorization and a formal BANE phase gate.
