---
description: Translate approved canon into code, docs, naming, and structure
---

# Implement From Canon Workflow

## Use When

- Turning doctrine or specification into code
- Aligning UI or documentation with architectural canon
- Enforcing naming or layer rules from canonical documents
- Implementing new protocol surfaces from approved specs (AIP, ISDC, ICB, MCB)
- Wiring BANE, SRT, or LARI integration per canonical definitions

## Steps

### 1. Read Relevant Canon
- Identify the canonical source documents for the work
- Read them in full, noting non-negotiable principles
- Common canon locations in this workspace:
  - `docs/SCINGULAR-AUTHORITY-MODEL.md`
  - `docs/SCINGULAR-ECOSYSTEM.md`
  - `docs/BANE-SECURITY.md`
  - `docs/AIP-PROTOCOL.md`
  - `docs/ISDC-PROTOCOL-2025.md`
  - `docs/SCING-INTERFACE.md`
  - `docs/ICB-*.md`, `docs/MCB-*.md`
  - `scing/canon/`

### 2. Extract Non-Negotiable Principles
- List the specific rules, boundaries, and naming requirements from the canon
- Note any architectural layering that must be preserved
- Note any forbidden patterns or behaviors

### 3. Map Principles to Target Files
- Identify which source files need to change to align with canon
- Map each canonical principle to a specific implementation surface
- Identify any new files that need to be created

### 4. Implement Smallest Valid Change Set
- Make only the changes required by the canon
- Do not add speculative features or anticipatory abstractions
- Prefer explicit, readable implementation over compressed cleverness

### 5. Check for Naming Drift
- Verify all canonical terms are used exactly as defined
- Check for accidental synonyms or simplifications
- Confirm casing, spacing, and trademark styling are correct

### 6. Check for Boundary Drift
- Verify architectural layers remain distinct
- Confirm no trust boundaries were collapsed
- Verify no forbidden patterns were introduced

### 7. Validate Runtime or Structure Where Possible
- Run build, lint, or type checks
- If applicable, verify affected routes or components load correctly
- Note any validation that could not be performed

### 8. Produce Structured Report
- Follow the format defined in `30-reporting.md`

## Output

The workflow must produce a report with:

- **Canon Source Used**: Which documents were referenced
- **Implementation Surfaces**: Files modified or created
- **Preserved Boundaries**: Architectural layers that were confirmed intact
- **Validation Result**: Build/lint/runtime outcomes
