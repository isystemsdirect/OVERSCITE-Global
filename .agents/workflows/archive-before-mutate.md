---
description: Preserve existing state before modifying architectural or governance-sensitive files
---

# Archive Before Mutate Workflow

## Use When

- Touching architectural files (e.g., `ARCHITECTURE.md`, protocol specs)
- Replacing old structures with new implementations
- Revising canon-sensitive areas (naming, authority, boundary definitions)
- Changing governance or trust logic (auth, permissions, BANE policies)
- Modifying Scing canon (`scing/canon/`)
- Editing legal or compliance documents

## Steps

### 1. Inspect Current State
- Read the target file(s) in their entirety
- Understand the existing structure, dependencies, and intent
- Note any governance comments, boundary markers, or lineage indicators

### 2. Identify Existing Meaning and Dependencies
- Determine what the current implementation expresses architecturally
- Identify other files or systems that depend on the current structure
- Map import chains, reference chains, and naming dependencies

### 3. Mark Structure Status
- Classify the current state as one of:
  - **Implemented**: Currently active and production-relevant
  - **Provisional**: Accepted for now, subject to future revision
  - **Experimental**: Not yet approved for production use
  - **Legacy**: Superseded but still present in codebase
  - **Archived**: Formally deprecated and marked for removal

### 4. Preserve Old Intent Before Replacement
- Document what the existing implementation was designed to achieve
- If the structure is being removed, note what it did and why it existed
- Ensure the replacement explicitly accounts for all superseded functionality
- If applicable, add archival comments or move to a deprecated location

### 5. Apply Narrowly Scoped Changes
- Implement the minimum necessary change to achieve the stated objective
- Do not opportunistically rewrite adjacent code
- Do not merge multiple concerns into one change
- Keep diffs narrow and reviewable

### 6. Summarize What Was Superseded and What Replaced It
- In the report, clearly state:
  - What was the old structure or behavior
  - What is the new structure or behavior
  - Why the change was made
  - What was preserved from the original

### 7. Validate No Silent Boundary Damage Occurred
- Check that architectural distinctions remain intact
- Verify naming consistency with canon
- Confirm no trust boundaries were collapsed or broadened
- Run relevant validation (build, lint, runtime) if possible

## Output

The workflow must produce a report with:

- **Changed Surfaces**: Files modified or replaced
- **Archived Meaning**: What the old structure expressed
- **Replacement Rationale**: Why the new structure is better or required
- **Risk Summary**: Any boundary, naming, or governance concerns from the change
