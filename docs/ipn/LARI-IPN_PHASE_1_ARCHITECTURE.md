# LARI-IPN Phase 1 Architecture
**Status**: Executed (Governed Relay MVP)

## Overview
LARI-IPN (Intelligent Private Network) Phase 1 establishes the baseline transport substrate for OVERSCITE. This phase provisions a **Governed Relay MVP**, ensuring identity-bound session admission, BANE-gated transport authorization, relay-mediated channel flow, and audit-grade event lineage.

## Constraints & Boundaries
- **No Autonomous Routing**: The network relies strictly on BANE authorization. Mesh/peer routing is explicitly disabled in Phase 1.
- **Safety Core Locking**: Base safety protocols cannot be suspended under any posture state.
- **Identity Enforcement**: Every session is bound to an accountable ARC identity prior to issuance.
- **Traceable Mutability**: All consequential posture shifts and session assignments leave an immutable audit trail.

## Components
1. **Device Registry**: (`src/lib/ipn/registry.ts`) Bounds devices to an ARC identity and establishes a persistent baseline posture.
2. **Session Matrix**: (`src/lib/ipn/session.ts`) Governs the issuance, lifecycle, and revocation of IPN tunnels.
3. **BANE Gate**: (`src/lib/bane/ipn/*`) Intercepts transport requests and restricts routing strictly to authorized capability scopes (e.g. `READ_TELEMETRY`).
4. **Governed Relay**: (`src/lib/ipn/relay.ts`) Acts as a pass-through node for sanctioned IPN requests.
5. **Audit Path**: (`src/lib/ipn/audit.ts`) Enforces cryptographic hashing for event lineage.

## Next Phases
Future expansions will progressively ungate BANE for wider control topologies, autonomous routing, and deep hardware integration, maintaining the strict governance prerequisites established herein.
