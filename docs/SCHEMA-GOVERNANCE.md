# OVERSCITE Global Schema Governance Contract (v1.0)

## 0. Objective
Define a single, authoritative vocabulary for data states and a unified policy for TypeScript interface management.

## 1. Canonical Truth-State Vocabulary
All UI and service states MUST map to one of these 11 canonical enums:

| Status | Code | Logic |
| --- | --- | --- |
| **LIVE** | `live` | Sourced from production database (Firestore) with full audit trail. |
| **PARTIAL** | `partial` | Sourced from live data but missing critical fields or integrations. |
| **MOCK** | `mock` | Local development data; no connection to live services. |
| **PLACEHOLDER** | `placeholder` | Pure UI shell with no backing data. |
| **CANDIDATE** | `candidate` | Change proposed but not yet accepted into the ledger. |
| **ACCEPTED** | `accepted` | State committed to the BANE/ledger record. |
| **REVIEW_REQUIRED** | `review_required` | Awaiting human arbiter oversight. |
| **DEPRECATED** | `deprecated` | Legacy data scheduled for removal. |
| **ARCHIVED** | `archived` | Long-term historical data, immutable. |
| **BLOCKED** | `blocked` | Action failed due to BANE policy or system error. |
| **EXPERIMENTAL** | `experimental` | Feature-flagged or sandbox-only logic. |

## 2. Type Placement Policy
- **Global Primitives**: `src/lib/types.ts`.
- **Domain Entities**: `src/lib/schema/[domain].ts`.
- **UI-Only Types**: Local to component or `src/types/ui.ts`.
- **NO Layer Collapse**: Do not merge Firestore `DocumentData` directly into UI `Props`. Use adapter functions.

## 3. Truth-State Identification Rules
- **UI Labeling**: Every major data-bearing surface must display its TruthState.
- **Visual Cues**:
    - `live`: Green/Emerald accents.
    - `mock`: Amber/Yellow accents + "MOCK" label.
    - `candidate`: Indigo/Purple (Proposed).
    - `accepted`: Solid Primary (Committed).

## 4. Drift Prevention Checklist
- [ ] Does this type duplicate an existing interface in `src/lib/types.ts`?
- [ ] Does this status label use non-canonical wording (e.g., "ready", "done", "pending")?
- [ ] Is the data source accurately declared in the UI?
