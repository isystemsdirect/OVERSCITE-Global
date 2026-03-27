---
name: Docs Sync Check
description: Check whether key docs still reflect current implementation after changes.
---

# Docs Sync Check Skill

## Purpose

Verify that key documentation files still accurately reflect the current implementation state after code changes. Identify stale, misleading, or missing documentation that could cause governance confusion, architectural drift, or onboarding errors.

## When to Use

- After major code changes that affect architecture or flow
- After renaming components, modules, or canonical terms
- After migration or platform transitions
- After adding or removing features, routes, or integrations
- Before releases or milestone assessments
- When suspecting docs have drifted from implementation

## Focus Areas

### 1. Architecture Docs
- [ ] `docs/ARCHITECTURE.md` — Does it still describe the actual component structure?
- [ ] `ARCHITECTURE.md` (root) — Does it still describe the file/packaging layer accurately?
- [ ] `docs/SCINGULAR-ECOSYSTEM.md` — Does it reflect the current component inventory?
- [ ] `docs/SCINGULAR-AUTHORITY-MODEL.md` — Immutable; verify no unauthorized modifications

### 2. Naming Docs
- [ ] `ScingRundown.md` — Does it reflect the current ScingOS state?
- [ ] `docs/SCING-INTERFACE.md` — Does it match the current Scing implementation?
- [ ] `docs/SCING-EMBODIMENT-POSITIONING-CANON.md` — Still aligned with UI implementation?

### 3. Protocol Docs
- [ ] `docs/AIP-PROTOCOL.md` — Does it reflect the current AIP implementation?
- [ ] `docs/ISDC-PROTOCOL-2025.md` — Does it reflect the current inspection data flows?
- [ ] `docs/BANE-SECURITY.md` — Does it match the current security implementation?

### 4. Workflow Docs
- [ ] `docs/DEVELOPMENT.md` — Setup instructions still accurate?
- [ ] `docs/QUICK-START.md` — Quick start steps still valid?
- [ ] `docs/TESTING.md` — Test commands and patterns still current?

### 5. Migration Records
- [ ] `.agents/memory/migration-state.md` — Reflects current migration status?
- [ ] Any migration notes in `docs/` — Still relevant or need archiving?

### 6. Legal/Compliance References
- [ ] Only check if changes touched legal, auth, identity, or compliance surfaces
- [ ] `legal/` directory — Terms, privacy, EULA still aligned with implementation?
- [ ] `LEGAL.md`, `TRADEMARK.md` — Still current?

## Steps

1. **Identify changed code surfaces** — List the files modified in the recent change
2. **Map to documentation** — Identify which doc files describe the changed surfaces
3. **Compare code to docs** — Check whether the docs still accurately describe the implementation
4. **Catalog discrepancies** — List specific mismatches with file locations
5. **Classify severity** — Low (minor wording), Medium (misleading description), High (wrong architecture)
6. **Recommend updates** — Specific doc changes needed, or flag for Director review if canon-sensitive

## Deliverables

- **Sync status matrix** — Table of doc files with their alignment status (Aligned | Drifted | Stale)
- **Discrepancy catalog** — Specific mismatches between docs and implementation
- **Update recommendations** — Priority-ordered documentation fixes
