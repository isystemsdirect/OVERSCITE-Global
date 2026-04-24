# OVERSCITE Workspace Context

## What This Workspace Is

- **Name**: OVERSCITE
- **Repository**: `OVERSCITE-Global`
- **Domain**: Operational inspection ecosystem platform
- **Role**: The primary SCINGULAR application workspace for building the inspection-focused operating layer
- **Stack**: Next.js 14+ / TypeScript / Firebase (Auth, Firestore, Functions, Storage) / Tailwind CSS

## Intelligence Architecture (Four-Layer Model)

OVERSCITE operates a dual-layer intelligence model across two primary domains:

- **Client Domain**:
  - `CIP`: Accepted Client baseline truth (v[x].[x]).
  - `EECIP`: External Client enhancement candidates/proposals.
- **Property Domain**:
  - `PIP`: Accepted Property baseline truth (v[x].[x]).
  - `EEPIP`: External Property enhancement candidates/proposals.

### Geospatial Requirement
Every Property Intelligence Profile (PIP) MUST be spatially grounded via a mandatory, address-bound Google Maps viewport featuring:
- Satellite / Hybrid visual context.
- Photo attribution and Place integration.
- 3D View / Perspective support.

## What This Workspace Governs

- ScingOS client layer (voice-first UI, session management, inspection workflows)
- AIP protocol client-side integration (intent routing, task coordination)
- BANE security enforcement (client-side policy checks, audit logging hooks)
- SRT sensor/capture UI surfaces (camera, audio, thermal, LiDAR)
- LARI engine integration surfaces (LARI-Language, LARI-Vision, LARI-Mapper, etc.)
- ISDC protocol implementation (inspection data synchronization)
- ICB codex compliance (inspection governance rules 01–24)
- MCB codex compliance (map context and geospatial rules 01–07)
- Inspection domain workflows (property, electrical, safety, compliance)
- Firebase backend integration (Firestore collections, cloud functions, storage rules)

## What This Workspace Must Not Be Confused With

| This Workspace Is NOT | Why It Matters |
|----------------------|----------------|
| **ARC** | ARC is accountable human identity. OVERSCITE is workspace/organizational environment. |
| **Scingular totality** | Scingular is the broader sovereign system. OVERSCITE is one asset within it. |
| **A generic app sandbox** | OVERSCITE is a governed inspection ecosystem, not an unstructured playground. |
| **An autonomous AI platform** | OVERSCITE augments human capability. It does not replace accountable humans. |
| **C3** | C3 is a distinct governed app with its own boundaries. |
| **ArcHive™ DL** | ArcHive™ is governance-anchored and witness-oriented with its own domain. |
| **SpectroCAP / SpectroCAPSCING** | Distinct domain surfaces for spectral analysis and Scing integration. |

## Non-Negotiables

1. **Preserve SRT boundaries** — All capture belongs to SRT service boundaries.
2. **Preserve BANE enforcement role** — BANE is enforcement, not decoration.
3. **Preserve human authority** — Director and Scing authority are final.
4. **Preserve auditability** — All changes, decisions, and actions must remain inspectable.
5. **Preserve canonical naming** — SCINGULAR terms must be used exactly as defined.
6. **Preserve architectural layering** — Scing (interface) ≠ ScingOS (OS layer) ≠ SCINGULAR AI (backend).
