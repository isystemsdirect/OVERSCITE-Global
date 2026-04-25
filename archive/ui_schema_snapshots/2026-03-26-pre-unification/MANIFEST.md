# Archive Manifest: Pre-Unification State (2026-03-26)

## Archival Identification
- **Batch ID**: UTCB-S-2026-03-26-UNIF
- **Status**: Captured
- **HEAD**: Pre-unification calibration

## UI Screenshots
- `dashboard_pre.png`: Captures the Initializing SCINGULAR state (Static 404 observed).
- `workstation_pre.png`: Captures the Initializing SCINGULAR state.
- `library_pre.png`: Captures the Initializing SCINGULAR state.

## Truth-State Vocabulary Drift (Observed)
| Concept | Current (Drift) | Canonical (Required) |
| --- | --- | --- |
| Completed Work | `'completed'` | `accepted` |
| Draft/Proposed | `'pending'` | `candidate` |
| Historical | `'archived'` | `archived` |
| Partial Data | N/A | `partial` |
| Mock Data | N/A | `mock` |
| Error State | N/A | `blocked` |

## Layout Fragmentation
- **Root**: `src/app/layout.tsx` (Barebones)
- **Workstation**: `src/app/workstation/page.tsx` (Inline `AppShell` import)
- **Dashboard**: `src/app/dashboard/page.tsx` (No shell, inline GreetingBar)
- **Contractor**: `src/app/contractor/layout.tsx` (Independent sibling shell)

## Technical Debt Observations
- `ignoreBuildErrors: true` masking ~200+ type errors.
- Ad-hoc spacing in `Workstation` (`p-4 md:p-6 lg:p-8`).
- Duplicate type definitions for `Finding`, `Inspection`, and `AuditEntry`.
