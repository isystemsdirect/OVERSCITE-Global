# SCINGULAR Dependency Map

> Last updated: 2026-03-20

## Shared Infrastructure

| Dependency | Used By | Type | Notes |
|-----------|---------|------|-------|
| **Firebase Auth** | OVERSCITE, C3 (planned) | Identity | Shared identity provider; custom claims may differ per asset |
| **Firebase Firestore** | OVERSCITE, C3 (planned) | Database | Collections are asset-scoped; shared rules file |
| **Firebase Storage** | OVERSCITE | File storage | Asset-specific bucket paths |
| **Firebase Functions** | OVERSCITE | Backend logic | Cloud Functions v2 |
| **Firebase Hosting** | OVERSCITE | Deployment | App Hosting via `apphosting.yaml` |

## Shared Canon

| Canon Document | Applies To | Location |
|---------------|-----------|----------|
| SCINGULAR Authority Model | All assets | `docs/SCINGULAR-AUTHORITY-MODEL.md` |
| SCINGULAR Ecosystem | All assets | `docs/SCINGULAR-ECOSYSTEM.md` |
| BFI Philosophy | All assets | Embedded in ecosystem docs |
| AIP Protocol | OVERSCITE, C3 | `docs/AIP-PROTOCOL.md` |
| BANE Security | All assets | `docs/BANE-SECURITY.md` |
| FEI Canon | All assets | `scing/canon/` |

## Shared Packages

| Package | Used By | Version Strategy | Notes |
|---------|---------|-----------------|-------|
| None currently | — | — | No shared npm packages between assets yet |

## Technical Coupling Points

| Coupling | Assets | Risk Level | Notes |
|----------|--------|-----------|-------|
| Firebase project binding | OVERSCITE, C3 (if shared) | Medium | Must decide: shared Firebase project or separate projects |
| Auth token format | All Firebase-backed assets | Low | Standard Firebase JWT; custom claims asset-specific |
| Firestore security rules | All Firestore users | Medium | Single rules file governs all collections |

## Version Sync Discipline

- Shared dependencies must be tracked here when they exist
- Version bumps that affect multiple assets require coordinated testing
- Breaking changes in shared infrastructure require governing workspace review
