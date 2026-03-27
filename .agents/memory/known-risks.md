# OVERSCITE Known Risks

> Last updated: 2026-03-20

## Technical Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Missing environment variables** | Medium | `.env.example` exists but runtime behavior depends on correct env setup. Missing vars could cause silent failures. |
| **Firebase dependency breadth** | Medium | Heavy reliance on Firebase (Auth, Firestore, Functions, Storage) creates platform coupling. Migration path documented but not exercised. |
| **Build complexity** | Low | Multiple config files (next.config.js, tailwind, postcss, eslint, tsconfig) increase maintenance surface. |

## Architectural Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Protocol-product boundary blur** | Medium | AIP and ISDC protocols are being implemented alongside product features. Boundary between protocol layer and product layer needs active monitoring. |
| **SRT capture scope creep** | Low | As sensor integrations expand (drone, camera, thermal, LiDAR), capture logic could leak outside SRT boundaries. |
| **BANE enforcement depth** | Medium | BANE is currently more documented than implemented. Risk of UI components that appear secure but lack backend enforcement. |

## Migration Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Firebase Studio residuals** | Low | Some config patterns may reflect Firebase Studio (IDX) era. See `migration-state.md`. |
| **Environment assumptions** | Low | Code may assume Firebase Studio runtime paths or environment variables no longer present. |

## Governance Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **No automated canon compliance checks** | Medium | CI/CD pipeline does not yet enforce canon naming or boundary rules automatically. |
| **Single workspace governing multiple concerns** | Low | OVERSCITE-Global currently acts as both asset workspace and governing workspace. Distinction should be maintained operationally even if physically co-located. |

## Operational Risks

| Risk | Severity | Description |
|------|----------|-------------|
| **Alpha maturity** | High | Application is v0.1.0 Alpha. Core features are incomplete. Not production-ready. |
| **No automated test coverage reporting** | Medium | Tests exist but coverage metrics are not tracked or gated. |
