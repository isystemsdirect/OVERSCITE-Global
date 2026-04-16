# INSPECTIONS RECOGNITION STACK — Architecture
## OVERSCITE Field Intelligence Division

**Status:** Phase 5 Governance Hardening — Active  
**Division:** Inspections / Field Intelligence  
**Authority:** Director Anderson | CDG: Scing  
**Governed by:** BANE enforcement layer | ArcHive™ authoring lifecycle  
**Batch Refs:**  
- UTCB-G__20260414-190000Z__SCING__RECOG001 (Phase 1 — Foundation)  
- UTCB-S__20260414-201500Z__SCING__RECOG002 (Phase 2 — Baseline Recognition)  
- UTCB-S__20260414-203500Z__SCING__RECOG003 (Phase 3 — Live Evidence Governance)  
- UTCB-S__20260415-150000Z__SCING__RECOG004 (Phase 4 — Domain Intelligence Activation)
- UTCB-S__20260415-161500Z__SCING__RECOG005 (Phase 5 — ArcHive Control Plane Activation)

---

## Overview

The OVERSCITE Recognition Stack is the multi-pass analysis infrastructure that powers
Inspections as the unified field-intelligence division. It transforms raw SRT-captured
media into governed, auditable, human-reviewable findings across residential, commercial,
industrial, site, insurance, safety, and drafting/design contexts.

Every element of this stack operates within bounded scope. No engine self-authorizes
a conclusion. Human authority remains final for all consequential determinations.

---

## Stack Architecture — 12-Layer Model

```
Layer 0   SRT Capture & Ingestion
Layer 1   Scene Interrogation
Layer 2   Object & Component Recognition
Layer 3   Living Entity Recognition
Layer 4   Inspection Target Recognition
Layer 5   Pest & Bio-Condition Recognition
Layer 6   Condition & Anomaly Recognition
Layer 7   Occlusion & Visibility Recognition
Layer 8   Drafting & Design Intelligence
Layer 9   Standards & Context Reasoning
Layer 10  Truth State Assembly
Layer 11  Report & Workflow Handoff
```

---

## Layer Descriptions

### Layer 0 — SRT Capture & Ingestion

**Role:** Media ingestion substrate. All capture inside the OVERSCITE ecosystem is SRT-routed.
Perception enters the system through SRT as the common substrate. This layer is upstream of
all engine activity.

**Inputs:**
- Camera photos (field capture and file upload)
- Video frames
- LiDAR-linked imagery where applicable
- Thermal-linked imagery where applicable
- Uploaded drawing and plan PDFs/images

**Hard Rules:**
- No capture path bypasses SRT routing
- All ingested media receives `accepted_unanalyzed` as its initial state
- Indexing and placement of accepted media does not imply analysis

---

### Layer 1 — Scene Interrogation (Pass 1)

**Role:** Determine top-level domain posture and environmental context.

**Output:** `SceneContextProfile`

**Domain Classes:** residential | commercial | industrial | site | insurance | safety | drafting_design | indeterminate

**Scene Posture:** interior | exterior | mixed | indeterminate

**Pass ID:** `pass_1_scene`

**Hard Rules:**
- Domain class drives which domain packs are activated for subsequent passes
- `isDrawingArtifact` flag must be set if the media is a drawing rather than a field photo
- Imaging quality must be assessed and reported

---

### Layer 2 — Object & Component Recognition (Pass 2)

**Role:** Recognize visible scene objects, structural elements, installed systems, and equipment.

**Pass ID:** `pass_2_object`

**Residential Scope:** rooms, walls, ceilings, floors, windows, doors, trim, stairs, rails, fixtures, appliances, outlets, panels, HVAC visible components, furniture, decor, belongings, temporary obstructions

**Commercial Scope:** tenant spaces, lobbies, corridors, storage areas, common elements, commercial fixtures, equipment, signage, accessibility cues

**Industrial Scope:** machinery, motors, pumps, piping, valves, tanks, gauges, panels, conduits, welds, supports, anchors, insulation, corrosion, leaks, residue, process-area hazards, barriers, guard systems

**Site Scope:** access/egress, housekeeping, debris, barricades, ladders, scaffold, staging, material placement, equipment placement

---

### Layer 3 — Living Entity Recognition (Pass 3)

**Role:** Recognize humans, animals, plant/vegetation presence, and occupancy-sensitive entities.

**Pass ID:** `pass_3_living_entity`

**Entity Classes:**
- human_adult | human_child | service_animal | domestic_pet | wildlife | vegetation | indeterminate_living

**Hard Rules:**
- Living entities causing occlusion MUST trigger `LivingEntityPresence.causesOcclusion = true`
- Occlusion caused by living entities must update the OcclusionMap
- Vegetation in deteriorated condition is an inspection-relevant finding
- Human presence in industrial safety-sensitive zones is a safety-relevant context indicator

---

### Layer 4 — Inspection Target Recognition (Pass 4)

**Role:** Recognize systems, components, surfaces, assemblies, fixtures, and equipment that are the
primary subject of the inspection.

**Pass ID:** `pass_4_target_component`

This pass operates within the domain class selected by Pass 1 and activates the appropriate
domain taxonomy pack.

---

### Layer 5 — Pest & Bio-Condition Recognition (Pass 5)

**Role:** Recognize pest evidence, infestation indicators, organic intrusion, and related damage patterns.

**Pass ID:** `pass_5_pest_bio`

**Evidence Classes:**
- pest_droppings | pest_frass | mud_tubes | webbing | nest | chew_pattern | infestation_signature
- mold_growth | organic_intrusion | bio_staining | indeterminate_bio_evidence

**Hard Rules:**
- Pest evidence is a standard inspection class — not an optional premium feature
- Mold and organic staining are valid bio-condition classes regardless of domain
- Infestation signatures must be flagged for review even at low confidence

---

### Layer 6 — Condition & Anomaly Recognition (Pass 7)

**Role:** Recognize defects, irregularities, deterioration, and safety-affecting conditions.

**Pass ID:** `pass_7_condition_anomaly`

**Applies across all domains:**
- Residential: finishes, structural, MEP, pest damage
- Commercial: damage, wear, safety, maintenance conditions
- Industrial: corrosion, leaks, process hazards, structural concerns
- Site: incident context, debris, weather exposure, inadequate controls
- Safety: PPE absence, fall hazards, blocked exits, warning signage failures

---

### Layer 7 — Occlusion & Visibility Assessment (Pass 6)

**Role:** Determine blocked, partially visible, non-visible, and obstruction-limited areas.

**Pass ID:** `pass_6_occlusion`

**Output:** `OcclusionMap`

**Hard Rules:**
- Occlusion results MUST propagate into downstream confidence scoring
- Every finding must have an explicit `visibilityState` — empty not permitted
- Obstruction by living entities triggers `livingEntityOcclusion = true`
- Physical obstruction triggers `physicalObstruction = true`
- `overallVisibilityScore` (0–1) must be computed

**Visibility States:** visible | partially_visible | occluded | non_assessable | lighting_limited | angle_limited

---

### Layer 8 — Drafting & Design Intelligence (Pass 8)

**Role:** Recognition of drawing/document structure, symbols, dimensions, notes, and reference-model content.

**Pass ID:** `pass_8_drafting`

**Supported Drawing Types:** architectural | structural | mechanical | electrical | plumbing | site_plan | detail_sheet | schematic | mep_sheet | assembly_drawing

**Elements Recognized:**
- Title blocks (project name, sheet number, revision, scale, date, drawn by, checked by)
- Drawing symbols (per active symbol library)
- Dimension annotations (linear, angular, radial, diameter, coordinate, elevation)
- Notes and callouts (specification notes, standard references)
- Revision clouds and delta markers
- GD&T feature control frames (Phase 4 depth; partial recognition in Pass 8)

**Hard Rules:**
- Field-photo interpretation of drawings is always confidence-qualified
- `fidelityWarning` must always be set to `field_photo_interpretation` for field photos
- CAD/BIM fidelity claims require `validated_source` — not available from field photos
- Drawing partial-read states must not masquerade as complete interpretation
- GD&T must be modeled as structured artifacts (`GDTProfile`), not loose prose

---

### Layer 9 — Standards & Context Reasoning (Pass 9)

**Role:** Binding of recognized content to codes, standards, engineering logic, and reporting context.

**Pass ID:** `pass_9_standards_context`

**Binding Basis:** symbol_match | note_text | title_block | context_inference

**Hard Rules:**
- Standards binding is bounded reasoning — not authoritative legal interpretation
- Must disclose binding basis and confidence for every engineering reference
- Human authority governs compliance determination

---

### Layer 10 — Truth State Assembly (Pass 10)

**Role:** Assembly of the final governed recognition output.

**Pass ID:** `pass_10_truth_state`

**Output layers:**
1. `observedFindings` — deterministic, direct language only
2. `identifiedCandidates` — probabilistic, confidence-qualified
3. `unknowns` — unresolved elements, MUST be first-class
4. `visibilityLimits` — all constraints aggregated from all passes
5. `confidenceProfile` — per-pass and overall
6. `reviewPosture` — human review recommendation

**Hard Rules:**
- No pass may silently erase prior uncertainty
- Occlusion from Pass 6 must affect confidence in Pass 10
- Unknown is a first-class state — never silently skip
- Visibility-limited must appear in reporting
- No jump from pattern recognition to authoritative claim

---

### Layer 11 — Report & Workflow Handoff

**Role:** Handoff into findings, evidence review, scheduler impacts, contractor workflows, insurance packets, and audit lineage.

**Downstream consumers:**
- Inspections Evidence UI
- Findings and report generation (LARI_REPORT)
- SmartSCHEDULER™ readiness hooks
- Contractor workflow triggers
- Insurance packet assembly
- ArcHive™ audit trail

---

## Engine Assignments

| Engine | Role | Status |
|--------|------|--------|
| LARI_VISION | Multi-pass image recognition; scene and object passes | Active (extended in RECOG001 Phase 1) |
| LARI_EVIDENCE | Evidence truth-state orchestration; full lifecycle management | Active (created in RECOG001 Phase 1) |
| LARI_ANALYST | Cross-inspection pattern analysis | Reused |
| LARI_CRITIC | Self-review of analytical outputs | Reused |
| LARI_RETRIEVER | Standards and code retrieval | Reused |
| LARI_STANDARDS | Standards binding and cross-reference | Reused |
| LARI_REPORT | Report generation and formatting | Reused |
| LARI_MAPPER | Spatial mapping and site plan support | Reused |
| LARI_SITEOPS | Site-state, hazard, readiness, field-operations recognition | Phase 4 — Active |
| LARI_DRAFTING | Drawing/document recognition, symbol interpretation | Phase 4 — Active |

**Hard Rules:**
- Each engine has bounded scope — no engine zoo
- All engines are non-executive by default
- BANE gates all consequential transitions

---

## Data Model — Core Entities

| Entity | Purpose |
|--------|---------|
| `InspectionRecognitionPacket` | Master recognition record per analyzed media asset |
| `RecognitionPassResult` | Typed output of a single named recognition pass |
| `SceneContextProfile` | Domain posture and environmental context (Pass 1) |
| `OcclusionMap` | Visibility and obstruction map (Pass 6) |
| `LivingEntityPresence` | Living entity detection records (Pass 3) |
| `PestEvidenceRecord` | Pest and bio-condition evidence (Pass 5) |
| `DraftingArtifactProfile` | Drawing structure and symbol summary (Pass 8) |
| `DrawingSheetStructure` | Title block, symbols, dimensions, notes detail |
| `SiteopsEnrichmentRecord` | LARI_SITEOPS domain enrichment per media asset |
| `DrawingToFieldComparisonLink` | Drawing-field comparison readiness link |
| `EngineeringReferenceBinding` | Standards binding (Pass 9) |
| `EvidenceAnalysisState` | Full lifecycle state machine for a media asset |
| `RecognitionTaxonomyVersion` | Taxonomy version audit anchor |

---

## Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Foundation — contracts, truth states, engine scaffold, UI shell | ✅ Complete |
| 2 | Baseline Recognition — LARI_EVIDENCE activation, Evidence mode UI | ✅ Complete |
| 3 | Live Evidence Governance — verification UI, real-time state, audit surface, domain hooks | ✅ Complete |
| 4 | Domain Intelligence Activation — LARI_DRAFTING + LARI_SITEOPS engines, comparison readiness, UI panels, hook enrichment | ✅ Complete |
| 5 | Governance & Optimization — ArcHive controls, BANE hardening, monitoring | ✅ Complete |
