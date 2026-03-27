---
name: Repo Stabilization
description: Stabilize a repo after migration, refactor, or broad edits via systematic git, config, build, and runtime inspection.
---

# Repo Stabilization Skill

## Purpose

Systematically stabilize a repository after migration, refactor, broad edits, or environment changes. This skill provides a structured checklist for identifying and resolving instability before further development proceeds.

## When to Use

- After migrating code from one environment to another
- After a large refactor affecting multiple files
- After dependency upgrades or framework version changes
- After restoring from backup or switching branches
- When the workspace state is unknown or uncertain
- Before preparing a release or merge

## Checklist

### 1. Inspect Git Status
- [ ] Run `git status` and note modified, untracked, and staged files
- [ ] Check for unexpected changes (files you didn't intend to modify)
- [ ] Verify `.gitignore` is not excluding important files
- [ ] Check for large binary files that shouldn't be committed

### 2. Inspect Config Files
- [ ] Verify `package.json` — dependencies, scripts, engines
- [ ] Verify `tsconfig.json` — paths, aliases, strictness settings
- [ ] Verify `next.config.js` — plugins, redirects, environment variables
- [ ] Verify `firebase.json` — hosting, functions, firestore, storage targets
- [ ] Verify `.env.example` — all expected variables documented
- [ ] Check for stale or orphaned config files

### 3. Inspect Build Surface
- [ ] Run `npm install` (or equivalent) — note errors
- [ ] Run `npm run build` — note compile errors
- [ ] Run linter (`npm run lint` or `npx eslint .`) — note issues
- [ ] Run type checker (`npx tsc --noEmit`) — note type errors
- [ ] Check for missing peer dependencies

### 4. Inspect Route/Runtime Health
- [ ] Start dev server (`npm run dev`)
- [ ] Load the root route (`/`)
- [ ] Load key application routes
- [ ] Check browser console for errors or warnings
- [ ] Check terminal output for runtime exceptions
- [ ] Test basic interactions (click, navigate, submit)

### 5. Identify Missing Assets
- [ ] Check for broken image or asset references
- [ ] Verify font loading
- [ ] Verify icon loading
- [ ] Check for missing environment variables at runtime

### 6. Summarize Stabilization State
- Produce a report using the format in `.agents/rules/30-reporting.md`
- Classify workspace health: Healthy | Degraded | Broken | Unknown
- List all issues found and their severity
- Recommend next actions
