# OVERSCITE Migration State

> Last updated: 2026-03-20

## Migration Summary

The OVERSCITE codebase originated in Firebase Studio (Project IDX) and has been migrated to a local GitHub-centered development environment managed through VS Code with Antigravity.

## What Moved

| Asset | Status | Notes |
|-------|--------|-------|
| **Source code** (`src/`) | ✅ Migrated | Full Next.js application source present |
| **OVERSCITE submodule** (`OVERSCITE/`) | ✅ Migrated | Contains cloud, docs, scripts, and src subdirectories |
| **Documentation** (`docs/`) | ✅ Migrated | ICB, MCB, protocol docs, architecture, ecosystem docs |
| **Legal docs** (`legal/`) | ✅ Migrated | Full legal framework present |
| **Firebase config** (`firebase.json`, rules, indexes) | ✅ Migrated | Hosting, functions, firestore, storage configured |
| **Cloud functions** (`cloud/`) | ✅ Migrated | Backend functions present |
| **Scing canon** (`scing/`) | ✅ Migrated | Canon and avatar env present |
| **Package config** (`package.json`, lock, tsconfig) | ✅ Migrated | Dependencies and build config present |
| **Git history** | ✅ Migrated | Full commit history preserved |

## What Did Not Move

| Asset | Status | Notes |
|-------|--------|-------|
| **Firebase Studio environment** | ❌ Not applicable | Firebase Studio runtime was cloud-hosted; local dev environment replaces it |
| **IDX-specific configs** (`.idx/`) | ⚠️ Residual | `.idx/` directory may contain legacy configuration; review for cleanup |
| **Cloud-hosted dev server** | ❌ Not applicable | Now running locally via `npm run dev` |

## What Was Replaced

| Old | New | Rationale |
|-----|-----|-----------|
| Firebase Studio IDE | VS Code + Antigravity | Local, governed development environment with rule enforcement |
| Cloud-hosted dev runtime | Local Node.js runtime | Direct control, faster iteration, no cloud dependency |
| Implicit environment config | Explicit `.env.example` + local `.env` | Portable, auditable configuration |

## What Remains External

| Service | Status | Notes |
|---------|--------|-------|
| **Firebase Auth** | Active | Authentication remains cloud-hosted via Firebase |
| **Firebase Firestore** | Active | Database remains cloud-hosted |
| **Firebase Storage** | Active | File storage remains cloud-hosted |
| **Firebase Functions** | Active | Backend functions deploy to Firebase |
| **Firebase Hosting** | Active | Production hosting via Firebase |
| **AI service providers** | Active | OpenAI, Anthropic, ElevenLabs, Picovoice remain external |

## Post-Migration Actions

- [x] Verify dev server runs locally
- [x] Verify git history is intact
- [ ] Audit `.idx/` directory for cleanup eligibility
- [ ] Verify all environment variables are documented in `.env.example`
- [ ] Confirm Firebase project bindings are correct for local development
- [ ] Run full build to confirm no broken imports from migration
