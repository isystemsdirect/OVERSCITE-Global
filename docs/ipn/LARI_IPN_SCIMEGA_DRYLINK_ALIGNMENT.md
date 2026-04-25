# LARI-IPN / SCIMEGA™ Dry-Link Alignment

## Purpose
Defines the alignment between the LARI-IPN (Intelligence Processing Node) and the SCIMEGA™ Dry-Link interface to ensure consistent metadata synchronization.

## Current Truth-State
LARI-IPN provides the reasoning and configuration intent; Dry-Link provides the metadata-only synchronization boundary. The alignment ensures that LARI's "intent" matches the hardware's "readiness."

## Canon Position
Alignment requires:
1. **Activation Awareness**: LARI-IPN must be aware of the hardware node's presence via the Dry-Link contract.
2. **Metadata-Only Sync**: No command intent from LARI-IPN may be transmitted to Dry-Link until the Reality Bridge is unlocked.
3. **Telemetry-Informed Reasoning**: LARI-IPN reasoning should be informed by inbound Dry-Link telemetry (e.g., battery state, GPS lock) even if execution is blocked.

## Implementation Status
- **LARI-IPN Reasoning**: Specialized logic in `src/lib/lari/scimega/lari-scimega.ts`.
- **Dry-Link Bridge**: WebSocket-based telemetry intake active.
- **BANE Evaluation**: The `BaneDryLinkActivationGate` evaluates whether LARI intent aligns with the Dry-Link profile.

## Known Limitations
- **Unidirectional Feedback**: LARI reasoning is not yet fully dynamically updated by real-time Dry-Link telemetry changes.
- **Manual Sync**: Some contract updates still require manual re-triggering.

## Next Required Work
- **Dynamic Reasoning Loop**: Implement a feedback loop where Dry-Link telemetry updates the LARI-IPN reasoning notes in real-time.
- **Contract Versioning**: Implement version-aware Dry-Link contracts to ensure compatibility between hardware and LARI engines.
