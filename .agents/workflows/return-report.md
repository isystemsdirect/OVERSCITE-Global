---
description: Standardized task completion report
---

# Return Report Workflow

## Use When

- Completing any major engineering task
- Concluding a multi-step workflow
- Preparing a summary for Director review
- Closing out a UDCB-directed action
- Reporting back after a calibration, migration, or stabilization

## Steps

### 1. State Objective
- What was the stated goal of the task
- Reference the originating directive (UDCB, task prompt, Director instruction)

### 2. State Outcome Status
- **Complete** — All stated objectives met and validated
- **Partial** — Some objectives met; remaining work documented
- **Blocked** — Unable to proceed; blocking conditions documented
- **Stabilized** — Core function restored; follow-up optimization needed
- **Requires Review** — Work done, but Director approval needed before merge/deploy

### 3. List Changed Files or Surfaces
- Enumerate every file added, modified, or removed
- Group by component or domain area
- Note the nature of each change (added, modified, fixed, removed, moved, deprecated)

### 4. List Validations Performed
- What was tested: build, lint, type check, runtime, browser, manual inspection
- Result of each validation
- Note any validation that was attempted but failed
- Note any validation that could not be performed and why

### 5. List Known Risks
- Technical risks: untested paths, fragile dependencies, edge cases
- Architectural risks: boundary drift, naming drift, layer collapse
- Operational risks: deployment concerns, environment assumptions
- Governance risks: compliance gaps, unresolved escalation items

### 6. List Next Actions
- Recommended follow-up tasks directly grounded in current work
- Distinguish between required follow-ups and optional improvements
- Include any deferred cleanup items

### 7. Classify Confidence Level
- Apply one or more labels from `30-reporting.md`:
  - Structural Confidence
  - Static Confidence
  - Runtime Confidence
  - Partial Confidence
  - Unverified
- Justify the classification

## Output Template

```markdown
## Return Report

**Objective**: [stated goal]
**Status**: [Complete | Partial | Blocked | Stabilized | Requires Review]
**Confidence**: [label(s) with justification]

### Changed Surfaces
- [file/path] — [nature of change]

### Validation Performed
- [check] — [result]

### Known Risks
- [risk description]

### Next Actions
- [required | optional] — [action description]
```
