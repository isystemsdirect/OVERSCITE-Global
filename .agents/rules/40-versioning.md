# 40-VERSIONING — PIP / EEPIP / CIP / EECIP Versioning System Lock


**STATUS:** LOCKED / AUTHORITATIVE / NON-OPTIONAL
**CB_ID:** L-UTCB-S__20260420-000000Z__SCING__PIP-EEPIP-VERSIONING-002

---

## 1. FOUNDATIONAL FORMAT

The foundational versioning format for Property Intelligence Profiles (PIP/EEPIP) and Client Intelligence Profiles (CIP/EECIP) SHALL be:

**v[x].[x]**


- The prefix `v` is mandatory.
- The first `[x]` is the **Major** version number.
- The second `[x]` is the **Minor** version number.
- No alternative punctuation (e.g., `,`, `-`, `_`) is permitted within the version string.

## 2. VERSION LINEAGE DECOUPLING

PIP, EEPIP, CIP, and EECIP SHALL maintain strictly separate version lineages. 

- **PIP/CIP Versioning**: Tracks accepted internal baseline status only.
- **EEPIP/EECIP Versioning**: Tracks external enhancement, evidence expansion, and candidate/proposal evolution.

- PIP and EEPIP numbers MUST NOT be collapsed into a single identifier. 

## 3. INCREMENT RULES

### 3.1 Major Increment (v[X].x)
Triggered by materially new profile generations, structural shifts, or major accepted baseline replacements.
- **PIP/CIP**: New accepted baseline generation after formal review.
- **EEPIP/EECIP**: New major external-intelligence dive or materially broader enhancement scope.

### 3.2 Minor Increment (vx.[X])
Triggered by refinements, corrections, or supplements within the same major generation.
- **PIP/CIP**: Accepted refinement of non-structural profile details.
- **EEPIP/EECIP**: Additional evidence packets, minor source retrievals, or contact refinements.


## 4. TRUST CLASS SEPARATION

Version identity DOES NOT imply authority. 
- A higher EEPIP version (e.g., EEPIP v9.0) DOES NOT outrank a lower PIP version (e.g., PIP v1.0).
- PIP remains the **Governing Truth Anchor** until an explicit version-applied mutation occurs.

## 5. NO SILENT MUTATION

No profile change SHALL occur without a visible version increment. 
- If the content changes, the version MUST change.
- If no version changed, the profile MUST be treated as unchanged.
- Agents SHALL NOT edit profile content while preserving the same version label.

## 6. AGENT & SCHEMA ALIGNMENT

- All repo-tied LLMs, agents, and schema units MUST interpret these labels identically.
- No schema MAY omit version fields for mutation-bearing profile objects.
- Prompt instructions SHALL NOT treat EEPIP version changes as accepted PIP mutations.

---
*End of 40-VERSIONING*
