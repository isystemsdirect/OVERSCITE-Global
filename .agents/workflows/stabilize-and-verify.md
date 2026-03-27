---
description: Stabilize a workspace after migration, refactor, or broad edits
---

# Stabilize and Verify Workflow

## Use When

- After migration from one environment to another
- After large refactor or dependency changes
- After broad file edits across multiple surfaces
- Before commit freeze or merge preparation
- After restoring from backup or branch switch

## Steps

### 1. Inspect Git Status
- Run `git status` to identify modified, untracked, and staged files
- Note any unexpected changes or missing files

### 2. Inspect Changed Files
- Review the diff of all modified files
- Confirm changes align with the stated task objective
- Flag any unintended modifications

### 3. Run Relevant Build, Lint, or Tests
- Run the appropriate build command (e.g., `npm run build`)
- Run linter if configured (e.g., `npx eslint .`)
- Run any applicable test suites (e.g., `npm test`)
- Record pass/fail results

### 4. Inspect Console or Runtime Errors
- If the application can be started, run the dev server
- Check browser console for errors or warnings
- Check terminal output for runtime exceptions

### 5. Identify Broken Imports or Paths
- Search for import errors in build output
- Check for broken relative paths after file moves
- Verify that renamed files are referenced correctly everywhere

### 6. Check Major Routes or Affected Surfaces
- Load primary application routes in the browser
- Verify layout stability and core functionality
- Note any visual regressions or broken interactions

### 7. Summarize Current Health
- Categorize the workspace state:
  - **Healthy**: All checks pass, no known issues
  - **Degraded**: Some issues found, but core functionality works
  - **Broken**: Critical failures that block normal operation
  - **Unknown**: Unable to validate due to environment constraints

### 8. Recommend Freeze or Follow-Up
- If healthy: recommend commit/merge
- If degraded: list specific follow-up fixes needed
- If broken: recommend blocking merge until issues resolved
- If unknown: recommend manual validation before proceeding

## Output

The workflow must produce a report with:

- **Repo Health**: Healthy | Degraded | Broken | Unknown
- **Validation Performed**: List of checks run and their results
- **Broken Areas**: Specific files, routes, or features that are failing
- **Ready/Not Ready Assessment**: Whether the workspace is safe to commit or merge
