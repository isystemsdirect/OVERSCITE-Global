# SCINGULAR Cross-Project Risks

> Last updated: 2026-03-20

## Active Risks

### Risk 1: Governing Workspace Co-Location
- **Severity**: Low
- **Description**: The governing workspace ecosystem files are co-located within `OVERSCITE-Global` rather than in a separate dedicated repository. This is by design during the initial proving phase, but creates a risk that OVERSCITE-specific engineering noise could leak into ecosystem-level governance files.
- **Mitigation**: Maintain clear separation between `.agents/memory/` (OVERSCITE-specific) and `.agents/ecosystem/` (portfolio-wide). Consider extracting the governing workspace to its own repo once multiple asset workspaces are operational.

### Risk 2: Shared Firebase Project
- **Severity**: Medium
- **Description**: If C3 or other assets share the same Firebase project as OVERSCITE, Firestore security rules and auth configurations could become entangled. Changes to rules for one asset could affect another.
- **Mitigation**: Evaluate per-asset Firebase projects vs. shared project with strict collection-level isolation. Document the decision in `dependency-map.md`.

### Risk 3: Canon Propagation Lag
- **Severity**: Low
- **Description**: As immutable canon evolves (new ICBs, MCBs, protocol revisions), there is a risk that asset workspaces receive canon updates at different times, creating temporary inconsistencies.
- **Mitigation**: Track distribution via `canon-sync-status.md`. Apply canon updates in deployment order.

### Risk 4: Naming Drift Between Assets
- **Severity**: Medium
- **Description**: As multiple teams or sessions work across different assets, canonical terms may be used inconsistently (e.g., "BANE" described differently in OVERSCITE docs vs. C3 docs).
- **Mitigation**: Use the boundary audit skill periodically. Canon injection skill ensures new implementations reference canonical definitions.

### Risk 5: No Automated Cross-Project Checks
- **Severity**: Medium
- **Description**: Currently no CI/CD pipeline validates cross-project boundary integrity, naming consistency, or dependency compatibility.
- **Mitigation**: Manual governance via this file and boundary audit skill until automated checks are implemented.

## Retired Risks

None yet.
