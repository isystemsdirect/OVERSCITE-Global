# INSPECTIONS OVERHAUL SHELL — Architecture
## OVERSCITE Inspections Division — Command Environment

**Status:** Phase 1 Foundation — Shell scaffold active; Evidence mode wired in Phase 2  
**Division:** Inspections / Field Intelligence  
**Authority:** Director Anderson | CDG: Scing  
**Governed by:** BANE enforcement | ArcHive™ Shell Mutation Control  
**Batch Ref:** UTCB-G__20260414-190000Z__SCING__RECOG001

---

## Doctrine Statement

Inspections is **not a list page**. Inspections is the single sovereign OVERSCITE division for
field inspection, evidence review, site-state observation, incident and hazard documentation,
and governed recognition-driven analysis across all supported workflow domains.

The Inspections shell must feel and behave like a **command environment** — not a commodity
CRUD form. Every surface expresses authority, precision, and field-intelligence posture.

---

## Shell Lane Architecture

The Inspections shell is organized into 10 canonical lanes:

| Lane | Purpose |
|------|---------|
| **Command** | Division command surface — status overview, active assignments, quick-dispatch |
| **Queue** | Inspection queue — scheduled, pending, prioritized assignments |
| **Active** | In-progress inspections — live recording and field capture surface |
| **Types** | Inspection type catalog — residential, commercial, industrial, site, etc. |
| **Sites** | Site registry — property and location management |
| **Evidence** | Evidence management — recognition truth-state surface, analysis request, review |
| **Hazards** | Hazard registry — identified hazard tracking, escalation, remediation |
| **Incidents** | Incident documentation — timeline, evidence, reporting |
| **Reports** | Report management — draft, review, finalized, exported |
| **Audit** | Audit trail — immutable audit lineage for all inspection activity |

**Hard Rules:**
- Shell lanes may not be silently removed or renamed without an ArcHive™ proposal
- Each lane maintains its own contextual intelligence region
- Evidence lane owns the recognition truth-state surface — no other lane renders analysis states

---

## Domain Mode Selector

The domain mode selector is a persistent, visible control in the Inspections shell header.
It activates the appropriate recognition stack domain pack for new analysis requests.

| Domain Mode | Recognition Pack |
|-------------|-----------------|
| Residential | Residential taxonomy pack |
| Commercial | Commercial taxonomy pack |
| Industrial | Industrial taxonomy pack (LARI_SITEOPS Phase 3) |
| Site | Site operations pack (LARI_SITEOPS Phase 3) |
| Insurance | Insurance evidence pack |
| Safety | Safety assessment pack |
| Drafting / Design | Drafting intelligence pack (LARI_DRAFTING Phase 4) |

The domain mode does not restrict which inspections are visible. It sets the context
for new analysis requests and influences which domain packs are activated.

---

## Contextual Intelligence Region

Each lane includes a Contextual Intelligence Region — a panel that shows the
recognition-relevant truth state for the entity currently in focus.

**For the Evidence lane, the Contextual Intelligence Region shows:**
- Selected packet truth state (media analysis state)
- Visibility limit summary
- Recognized target classes
- Living entity / pest / obstruction notices when relevant
- Drawing reference profile when applicable
- Analysis state and verification state

**Hard Rules:**
- Analysis state must always be visible — never hide `accepted_unanalyzed` state
- `verified_by_overscite` state must only appear after the governed verification path
- Partial confidence must always be shown — never round up to certainty

---

## Shell Continuity & Anti-Drift Discipline

The Inspections shell must maintain visual and structural continuity with the overall
OVERSCITE shell posture:

- Shell surface class: `shell-surface` (canonical CSS class)
- Command header style: `command-header-compact`
- Typography: `text-command-title`, `text-command-description`
- Authority indicators: `TruthStateBadge` (canonical), `RecognitionTruthStateBadge` (new)
- No ad-hoc color overrides outside the design system

**Zero-drift doctrine applies:** Any shell-level visual change that departs from established
shell patterns requires explicit Director review.

---

## Evidence Lane — Recognition Truth State Surface

The Evidence lane is the primary surface where the recognition stack outputs are consumed
by human reviewers.

**Evidence lane displays:**
- Queue of all media assets for the active inspection
- Per-asset `MediaAnalysisState` badge (accepted_unanalyzed through verified_by_overscite)
- Per-asset confidence band if analyzed
- Per-asset flags: living entity occlusion, pest evidence, unknowns, visibility limits, drawing artifact
- Analysis request action (explicit — requires user initiation)
- Verification request action (requires analysis completion + BANE gate)

**Hard Rules:**
- `accepted_unanalyzed` assets MUST appear — never hidden from the queue
- Analysis request button is always explicit and visible — no "auto-analyze" toggle
- `verified_by_overscite` badge is not grantable by engine output alone

---

## Drafting Mode Integration

Drafting / Design mode lives inside Inspections as a first-class domain mode.
It is NOT a separate tool or disconnected page.

When Drafting / Design domain mode is active:
- Evidence lane shows drawing artifact detection state
- Contextual Intelligence Region shows `DraftingArtifactProfile` summary
- Drawing field comparison readiness indicator is visible
- GD&T detection summary is surfaced when present

---

## Phase Notes

| Phase | Shell State |
|-------|-------------|
| Phase 1 | Shell scaffold — lanes, domain mode selector, command header, evidence lane structure |
| Phase 2 | Evidence lane fully wired — live analysis state, recognition packet panels |
| Phase 3 | Industrial/Site/Safety domain mode packs wired |
| Phase 4 | Drafting / Design mode fully wired with LARI_DRAFTING |
| Phase 5 | Full monitoring surfaces, ArcHive control panels in Audit lane |
