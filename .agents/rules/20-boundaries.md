# OVERSCITE Domain Boundaries

## Boundary Locks

These architectural boundaries are non-negotiable within the OVERSCITE workspace:

1. **OVERSCITE workspace logic must remain distinct from OVERSCITE Global marketplace logic** where canon separates them.
2. **ARC identity authority must not be merged with OVERSCITE organizational authority** — ARC represents accountable human identity; OVERSCITE represents workspace/organizational environment.
3. **SRT capture boundaries must remain explicit** — All capture in the ecosystem belongs to SRT service boundaries. Do not create shadow capture systems outside approved SRT patterns.
4. **BANE is enforcement, not decoration** — BANE is a constraint and integrity enforcement layer. Do not reduce it to a cosmetic or branding element.
5. **LARI is bounded intelligence, not unrestricted autonomy** — LARI engines operate within declared capability surfaces. Do not silently broaden reach.
6. **Scing is interface presence, not system-total naming replacement** — Scing is the human-facing interface presence and UI protocol; Scingular is the broader sovereign system/architecture.
7. **Firebase is infrastructure, not development authority** — Firebase provides the data fabric; it does not govern architectural decisions.
8. **AIP is the communication protocol, not a product** — AIP defines how intent, tasks, and results flow; it is not a standalone product or feature.
9. **ISDC is the inspection data protocol, not a generic data layer** — ISDC governs inspection-specific data management; do not repurpose for unrelated data flows.
10. **TEON is kinetic constraint arbitration, not autonomous will** — Do not describe or implement TEON as free agency.
11. **WIRM™ is downstream governed actuation, not free agency.**
12. **D-STORE, STORB, ORB, ORE, EAB, GALAX-E, Stores, Orbs, and Scavatar must remain distinct** where canon separates them.

## Cross-Project Separation Rules

- OVERSCITE and C3 are distinct governed apps even when sharing common infrastructure.
- ArcHive™ DL has its own governance and witness-oriented boundaries.
- SpectroCAP and SpectroCAPSCING are distinct domain surfaces.
- No project may silently absorb another project's logic or naming.

## Shared Package Boundary Rules

- Shared packages (if any) must have explicit version contracts.
- Changes to shared code must be coordinated across affected workspaces via the governing workspace.

## Sensitive Surfaces

Changes to these paths require elevated caution, explicit traceability, and may require Director escalation:

| Surface | Path | Sensitivity Reason |
|---------|------|--------------------|
| Scing interface | `src/scing/` | Core interface logic, authority boundaries |
| AI services | `src/ai/` | Intelligence layer, LARI integration |
| Data layer | `src/data/` | State management, schema, persistence |
| Cloud functions | `cloud/functions/` | Backend logic, AIP endpoints, BANE enforcement |
| Canon docs | `docs/` | Architectural and protocol canon |
| Legal docs | `legal/` | Compliance, licensing, regulatory |
| Auth config | Firebase auth surfaces | Identity, trust boundaries |
| Storage rules | `storage.rules` | Data access governance |
| Firestore rules | `firestore.rules` | Data access governance |
| Firestore indexes | `firestore.indexes.json` | Query structure |
| Scing canon | `scing/canon/` | FEI canon, engineering rules |

## Escalation Surfaces

The following domains require Director-level awareness or approval before changes:

- **Identity** — User identity, ARC, Firebase Auth, custom claims
- **Auth** — Authentication flows, token handling, session management
- **Permissions** — Firestore rules, storage rules, role-based access
- **Evidence** — Audit logging, SDR records, WORM storage, chain of custody
- **Audit logging** — BANE audit trail, append-only records
- **Sensor ingestion** — SRT capture, camera, audio, LiDAR, thermal
- **Marketplace trust boundaries** — Billing, subscriptions, entitlements (LARI-Fi)
- **Legal or compliance docs** — Terms, privacy, EULA, DPA, patent, trademark
