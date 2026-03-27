# SCINGULAR Migration Matrix

> Last updated: 2026-03-20

## Migration Status by Asset

| Asset | Source Environment | Target Environment | Status | Completeness |
|-------|-------------------|-------------------|--------|-------------|
| **OVERSCITE** | Firebase Studio (IDX) | Local GitHub + VS Code + Antigravity | ✅ Migrated | ~95% |
| **C3** | TBD | TBD | ⬜ Not Started | 0% |
| **ArcHive™ DL** | TBD | TBD | ⬜ Not Started | 0% |
| **SpectroCAP** | TBD | TBD | ⬜ Not Started | 0% |
| **SpectroCAPSCING** | TBD | TBD | ⬜ Not Started | 0% |

## OVERSCITE Migration Details

### What Migrated Successfully
- Full source code and git history
- Firebase configuration (hosting, functions, firestore, storage)
- Documentation corpus (architecture, protocol, canon, legal, ICB/MCB)
- Scing canon directory
- Package configuration and dependencies

### What Requires Follow-Up
- `.idx/` directory cleanup (legacy Firebase Studio config)
- Environment variable audit (`.env.example` vs. actual requirements)
- Full build validation in local environment
- Firebase project binding verification

### External Dependencies (Not Migrated — Remain Cloud-Hosted)
- Firebase Auth, Firestore, Storage, Functions, Hosting
- AI providers (OpenAI, Anthropic, ElevenLabs, Picovoice)

## Migration Deployment Order

Per UDCB-S Section 13:

1. ✅ OVERSCITE (Active — proving ground)
2. ⬜ C3
3. ⬜ ArcHive™ DL
4. ⬜ SCINGULAR Governing Workspace
5. ⬜ SpectroCAP
6. ⬜ SpectroCAPSCING
