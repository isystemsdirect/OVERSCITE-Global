# LARI-IPN Phase 2 Operational Hardening Doctrine

## Overview
Phase 2 transforms the Phase 1 relay substrate into a hardened operational fabric. Device trust, session validity, conflict posture, quarantine behavior, and revocation become first-class governed controls.

## Enforcement Core
The IPN operates with strict defaults:
- **No trust is granted by default.**
- **Posture may adapt; safety may not.**
- **No autonomous escalation or silent trust widening** is permitted.

## Heartbeat Integrity
All transport sessions endure under active heartbeat supervision. Sessions demonstrating staleness exceeding `HEARTBEAT_STALE_THRESHOLD_MS` map sequentially into degraded trust profiles, restricting channel access prior to offline containment limit.

## Component Boundary Validation
- BANE guarantees no degraded device elevates privileges without governed review.
- Conflicts observed (Double NAT, VPN overlays) gracefully pivot transit constraints while upholding the `Safety Core`.

## Traceability
All modifications, containment enforcements, and channel failures generate cryptographic entries mapping cleanly through the OVERSCITE audit substrate.
