# PL / DL Terminology Clarification

## Purpose
This document resolves the terminology collision for PL and DL. PL is now formally defined as Physical Laboratory.

## SCIMEGA™ PL — Physical Laboratory
In all SCIMEGA™ hardware-embodiment contexts, **PL means Physical Laboratory**:
- The Physical Laboratory is the governed physical laboratory environment where hardware embodiment, device modeling, physical-system readiness, laboratory-state simulation, and future hardware validation are represented.
- It is broader than a simple physical interface layer and must not be reduced to policy or generic hardware boundary wording.
- In v0.1.2, the PL has **no execution capability**.

## ArcHive PL — Physical Laboratory Expression
**ArcHive PL** refers to the physical-world expression of an ArcHive™ witness record within the Physical Laboratory context:
- A hardware-embodied artifact (e.g., printed seal, embedded chip, physical manifest).
- Not an authority source; it is an expression of the ArcHive™ engine's governance.

## ArcHive DL — Digital Laboratory Expression
**ArcHive DL** refers to the digital laboratory expression of an ArcHive™ witness record within the Digital Laboratory context:
- A software-embodied manifest (e.g., JSON manifest, cryptographic hash, digital seal).
- The governed digital laboratory environment where software-side systems, simulations, manifests, validation flows, and lifecycle packages are created, tested, prepared, and governed.
- Distinct from "Dry-Link" and from generic "Data Link" usage.

## Dry-Link — Metadata-Only Synchronization
**Dry-Link** is a separate concept from DL:
- Dry-Link is an activation-aware, metadata-only synchronization boundary.
- The system knows physical hardware exists but does not transmit commands.
- Telemetry flows inward (read-only); no commands flow outward.
- Dry-Link does not imply a live connection.

## DOS — Drone Operating System
**DOS** means **Drone Operating System**:
- SCIMEGA™ DOS refers to the drone-side operating environment.
- It is the core runtime layer managing flight execution, sensor coordination, and resource allocation.
- Prohibited definition: "Disk Operating System".

## Policy Layer — Disambiguation
Where legacy documentation uses "Policy Layer" (also abbreviated PL), this refers to the **governance constraint surface** — the formal rules that BANE enforces. To avoid collision:
- Use "Governance Policy" or "BANE Policy" for governance constraints.
- Reserve "PL" for Physical Laboratory in SCIMEGA™/ArcHive™ hardware contexts.
- Do not use "Physical Layer" as an expansion for PL.

## Affected Documents
The following documents have been updated or created with corrected terminology:
- `docs/atg/SCIMEGA_MASTER_DEFINITION.md`
- `docs/atg/SCIMEGA_DEFINITIONS_INDEX.md`
- `docs/atg/SCINGULAR_CANONICAL_DEFINITIONS.md`
- `docs/scimega/SCIMEGA_ARCHITECTURE_INDEX.md`
- `docs/atg/SCINGULAR_FULL_DEV_DOSSIER_LAST_3_WEEKS.md`
- `docs/atg/CONTRACTOR_DIVISION_CURRENT_ARCHITECTURE.md`

