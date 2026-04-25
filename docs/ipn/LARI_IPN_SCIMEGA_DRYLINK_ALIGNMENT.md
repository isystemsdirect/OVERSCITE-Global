# LARI-IPN / SCIMEGA™ Dry-Link Alignment

## LARI-IPN vs. Dry-Link
- **LARI-IPN (Inter-Process Network)**: The internal communication fabric for LARI engine coordination.
- **Dry-Link**: The external metadata-only boundary between SCIMEGA™ and physical hardware.

These are distinct layers. LARI-IPN operates internally; Dry-Link operates at the hardware boundary.

## Telemetry-Only Allowed States
In the current posture, only telemetry intake is permitted:
- Telemetry flows from hardware → Dry-Link → SCIMEGA™ → OVERSCITE™.
- No reverse flow (commands) is permitted.

## No Autonomous Routing
LARI-IPN does not autonomously route commands to physical hardware. All routing decisions require Scing context and BANE approval.

## No C2 Until Future BANE Phase
Command-and-Control (C2) capability is gated behind a future BANE phase authorization. This is not a software limitation — it is a governance decision.

## ARC-Bound Transport
All transport events (even telemetry intake) are attributed to an ARC identity. Anonymous telemetry is rejected.

## BANE Audit Linkage
All LARI-IPN events that touch the Dry-Link boundary are audited by BANE and recorded in ArcHive™.
