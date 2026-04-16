# DRAFTING & DESIGN INTELLIGENCE — Architecture
## OVERSCITE Inspections Division — First-Class Domain

**Status:** Phase 4 Domain Intelligence — LARI_DRAFTING Active  
**Division:** Inspections / Field Intelligence  
**Authority:** Director Anderson | CDG: Scing  
**Governed by:** BANE enforcement | ArcHive™ Drawing Symbol Library Control  
**Batch Ref:** UTCB-S__20260415-150000Z__SCING__RECOG004

---

## Doctrine Statement

Drafting, drawing, diagram, plan, schematic, and design-engineering artifact recognition
are **first-class governed intelligence classes** inside the OVERSCITE Recognition Stack.

They are NOT a disconnected tool bolted onto Inspections. They are NOT implemented via
freeform prompt text. They are modeled as structured artifacts with explicit schematic
contracts, governed symbol libraries, and binding to precision engineering standards.

Drafting/Design intelligence lives inside Inspections as a first-class domain mode —
accessible as **Drafting / Design** in the domain mode selector alongside Residential,
Commercial, Industrial, Site, Insurance, and Safety.

---

## Supported Drawing Types

| Drawing Class | Description |
|--------------|-------------|
| Architectural | Floor plans, elevations, building sections, reflected ceiling plans |
| Structural | Foundation plans, framing plans, structural details |
| Mechanical | HVAC ductwork, equipment layouts, mechanical schedules |
| Electrical | Panel schedules, circuit plans, lighting plans |
| Plumbing | Sanitary, water supply, site utility plans |
| MEP Sheet | Combined mechanical, electrical, plumbing reference |
| Site Plan | Site layout, grading, civil infrastructure |
| Detail Sheet | Enlarged construction details and assemblies |
| Schematic | Electrical/process schematics, P&IDs |
| Assembly Drawing | Component assembly and exploded views |

---

## Recognition Capability Map

### Title Block Recognition
- Project name, sheet number, revision markers
- Drawn by, checked by, approved by fields
- Scale, date, issue status
- **Fidelity note:** Field-photo interpretation is always confidence-qualified

### Symbol Recognition
Powered by the active Drawing Symbol Library (governed in ArcHive™ Symbol Library Control):

**Architectural:** door swings, window type tags, room tags, north arrows, grid line markers, elevation markers, section cuts, detail references

**Structural:** structural member callouts, connection details, bearing symbols

**MEP / Electrical:** device symbols, equipment tags, conduit and duct markers, panel references

**GD&T (Geometric Dimensioning & Tolerancing):**
- Feature control frames (geometric characteristic symbol, tolerance value, datum refs)
- Datum identifiers and datum targets
- Material condition modifiers (MMC, LMC, RFS)
- Surface finish symbols
- Weld symbols (basic shape detection; full AWS interpretation in Phase 4)

**Revision Artifacts:** revision clouds, delta markers, addenda stamps

### Dimension & Annotation Recognition
- Linear, angular, radial, diameter, coordinate, elevation dimensions
- Tolerance annotations (±, min/max, bilateral)
- Specification notes and code references
- Detail bubble callouts

---

## Fidelity Posture

> **HARD RULE:** All field-photo interpretation of drawings is confidence-qualified.
> The `fidelityWarning` field on every `DraftingArtifactProfile` must be set to
> `field_photo_interpretation` for all field-captured drawing images.
> Only drawings delivered through a validated source path (e.g., verified PDF extraction)
> may use `validated_source`.

This distinction must be preserved in all UI surfaces and report outputs. Users must
understand the difference between "field-captured drawing interpretation" and
"validated digital source interpretation."

---

## Drawing-to-Field Comparison

Drawing-to-field comparison allows an accepted drawing to be cross-referenced against
a corresponding field inspection photo (e.g., confirming that installed locations match
the design intent shown in the plan).

**Phase 1:** Readiness assessment only (`DrawingFieldComparisonReadiness`).  
**Phase 4 (Current):** Active LARI_DRAFTING comparison readiness scoring and `DrawingToFieldComparisonLink` data structure. Advisory-only — no autonomous mismatch claim.

**Readiness factors:**
- Image legibility quality
- Presence and legibility of title block (sheet number identification)
- Readable scale if applicable
- Known revision level
- Absence of obstructions (folded drawing, glare, partial view)

---

## GD&T Posture

GD&T and precision geometry intelligence are first-class governed domain stacks.
They must be modeled as structured artifacts — never collapsed into loose descriptive prose.

**Phase 1 / Phase 2:** Basic feature control frame detection; confidence-qualified.  
**Phase 4 (Current):** Full structured GD&T parsing with `gdtFrames` schema — characteristicSymbol, toleranceValue, datumRefs, materialCondition. Interpretation remains confidence-qualified.

**Hard Rule:** GD&T interpretation outputs must include a `characteristicSymbol`, `toleranceValueText`,
`datumRefs`, and `interpretationNote` in every detected frame. No partial or assumed values
may be omitted without surfacing the partial-detection state.

---

## ArcHive™ Governance Integration

All symbol library updates, drawing type additions, GD&T parsing rule additions,
and standards binding expansions are governed authoring events:

| Item | Control Panel |
|------|--------------|
| Drawing symbols | Drawing Symbol Library Control |
| Domain pack additions | Domain Pack Manager |
| Confidence thresholds | Model Routing and Threshold Control |
| Verification rules | Verification Gate Policy Control |

Every expansion follows: Proposal → Review → Validate → Approve → Deploy → Monitor → Rollback

---

## LARI_DRAFTING Engine (Phase 4)

**Role:** Dedicated drawing/document recognition, sheet-structure parsing, symbol interpretation, and drawing-to-field mapping assistance.

**Scope (Phase 4):**
- Full 10-pass execution for drawing artifacts
- Complete GD&T parsing and tolerance interpretation
- Active drawing-to-field comparison execution
- Standards binding (ANSI Y14.5, IBC, NEC, ASHRAE references)
- Revision-aware interpretation

**Hard Rules:**
- Non-executive by default
- humanAssessment may not be populated by engine
- All standards bindings require confidence qualification and binding basis disclosure
- BANE gates all consequential transitions

---

## Phase 4 — Implementation File Manifest

| File | Purpose |
|------|---------|
| `src/ai/flows/lari-drafting.ts` | Bounded Genkit engine flow + prompt |
| `src/lib/contracts/drafting-artifact-contract.ts` | Symbol, dimension, GD&T contracts |
| `src/lib/contracts/siteops-enrichment-contract.ts` | DrawingToFieldComparisonLink |
| `src/components/inspections/drafting-artifact-panel.tsx` | Evidence lane drafting review surface |
| `src/lib/constants/domain-awareness.ts` | Domain activation metadata (`engineActivated: true`) |
| `src/lib/services/recognition-orchestration.ts` | Routing to LARI_DRAFTING after base analysis |
| `src/lib/hooks/recognition-output-hooks.ts` | Map/scheduler hook enrichment for drawing comparison |
