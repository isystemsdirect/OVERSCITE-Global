# SCIMEGA™ Production Readiness Boundary

## Current State: NOT PRODUCTION-READY for Live Hardware
SCIMEGA™ v0.1.2 is production-ready for **simulation and dry-link environments only**. It is explicitly NOT production-ready for live hardware execution.

## Known Limitations
- **ArcHive™ Storage**: Uses localStorage (development-only). Requires persistent backend vault for production.
- **ARC Signatures**: Uses hash-binding (not cryptographically secure). Requires KMS-backed keypair signing.
- **Authority Flow Events**: Uses mock/seeded events. Requires real ControlArbitrationEngine emitter.
- **Domain Panels**: Require further UI polish for production operator use.

## Requirements for Live Hardware Readiness
1. Persistent ArcHive™ vault with WORM behavior.
2. Real ARC cryptographic signatures (KMS-backed).
3. Real authority flow event emitter.
4. Automated BANE/TEON state transition tests.
5. UI regression test baseline.
6. Director authorization and formal BANE phase gate.
