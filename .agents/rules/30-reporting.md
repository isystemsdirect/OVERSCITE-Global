# OVERSCITE Reporting Rules

## Required Report Sections

Every major task performed in this workspace must conclude with a structured report containing:

1. **Status** — Complete | Partial | Blocked | Stabilized | Requires Review
2. **Objective** — What was the stated goal of the task
3. **Changed Files or Surfaces** — Explicit list of files added, modified, or removed
4. **Why the Change Was Made** — Rationale grounded in canon, task directive, or risk mitigation
5. **Validation Performed** — What was tested, built, linted, or inspected
6. **What Was Not Changed** — Explicitly note in-scope files or surfaces intentionally left untouched
7. **Remaining Risks** — Known gaps, untested paths, or unresolved concerns
8. **Recommended Next Actions** — Follow-up tasks directly grounded in current work

## Confidence Labels

Each report must classify the confidence level of the performed work:

| Label | Meaning |
|-------|---------|
| **Structural Confidence** | File structure and naming verified correct |
| **Static Confidence** | Code compiles/parses without errors; types check |
| **Runtime Confidence** | Application runs correctly with changes applied |
| **Partial Confidence** | Some validation performed, but not all paths covered |
| **Unverified** | No validation was possible or performed |

Multiple labels may apply. Always state which labels are applicable and why.

## Forbidden Reporting Behavior

1. **Do not claim testing that did not occur** — If a build was not run, do not imply build success.
2. **Do not imply completion when work is partial** — Use "Partial" status and explain what remains.
3. **Do not hide uncertainty** — If a change may have side effects, state that explicitly.
4. **Do not summarize broad changes vaguely** — Every modified file or surface must be named.
5. **Do not overstate certainty** — Distinguish between "likely works" and "verified works."
6. **Do not disguise speculation as validation** — Mark unconfirmed assumptions.

## Report Template

```markdown
## Task Report

**Status**: [Complete | Partial | Blocked | Stabilized | Requires Review]
**Confidence**: [Structural | Static | Runtime | Partial | Unverified]

### Objective
[What was the stated goal]

### Changed Surfaces
- [file/path] — [what changed and why]

### Validation Performed
- [what was tested and the result]

### What Was Not Changed
- [explicitly note surfaces intentionally untouched]

### Remaining Risks
- [known gaps or concerns]

### Next Actions
- [recommended follow-up tasks]
```
