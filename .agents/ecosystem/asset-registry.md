# SCINGULAR Asset Registry

> Last updated: 2026-03-20

## Registered Assets

| Asset | Role | Repository | Status | Primary Domain |
|-------|------|-----------|--------|----------------|
| **OVERSCITE** | Operational inspection ecosystem platform | `OVERSCITE-Global` | Active (Alpha v0.1.0) | Inspection, compliance, field operations |
| **C3** | Governed application (distinct from OVERSCITE) | TBD | Planned | TBD |
| **ArcHive™ DL** | Governance-anchored witness/documentation layer | TBD | Planned | Archival, evidence, witness records |
| **SpectroCAP** | Spectral analysis and capture domain | TBD | Planned | Spectral data, sensor analysis |
| **SpectroCAPSCING** | Scing integration for SpectroCAP | TBD | Planned | Scing-guided spectral workflows |

## Asset Boundary Summary

Each asset maintains its own:
- Workspace rules (`.agents/rules/`)
- Domain boundaries (`.agents/rules/20-boundaries.md`)
- Memory context (`.agents/memory/`)
- Git history and branch discipline

## Notes

- Assets must not silently absorb each other's logic or naming
- Cross-asset coordination is handled through this governing workspace
- New assets require Director approval before registration
