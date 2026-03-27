---
description: Audit migration completeness and identify residual dependencies
---

# Migration Audit Workflow

## Use When

- Code has been moved between environments (e.g., Firebase Studio → GitHub/local)
- Backend services have been detached or reattached
- Platform transition has occurred (e.g., cloud provider change, framework upgrade)
- New workspace has been initialized from migrated sources
- Deployment targets have changed

## Steps

### 1. Identify Migrated Assets
- List all files, modules, and configurations that have been successfully migrated
- Confirm they are present in the target repository and structurally intact

### 2. Identify Non-Migrated Assets
- List all files, modules, or configurations that were not migrated
- Determine whether they were intentionally omitted or accidentally missed
- Note any assets that exist only in the source environment

### 3. Identify Replaced Dependencies
- List dependencies that were replaced during migration
- Note the old dependency, the new replacement, and the rationale
- Check for version compatibility and feature parity

### 4. Identify Environment Assumptions
- List assumptions the codebase makes about the runtime environment
- Check for hardcoded paths, environment-specific configurations, or platform-specific APIs
- Flag assumptions that are no longer valid in the target environment

### 5. Identify Leftover Platform-Specific Bindings
- Search for references to the old platform (e.g., Firebase Studio-specific configs, IDX configs)
- Identify orphaned configuration files, scripts, or metadata
- Determine whether these can be safely removed or need to be replaced

### 6. Confirm Local Operability
- Verify the application can be built in the target environment
- Verify the application can be started and basic routes load
- Note any environment setup steps required

### 7. Confirm Repo Materialization
- Verify git history is intact and attributable
- Verify branch structure is correct
- Verify no unintended files were committed (secrets, build artifacts, etc.)

### 8. Record Risks and Replacement Needs
- Document all identified gaps, risks, and required follow-up actions
- Prioritize by impact (blocking vs. cosmetic)

## Output

The workflow must produce a report with:

- **Migration Completeness**: Percentage or categorical assessment of what was migrated
- **Residual Platform Dependencies**: Old-environment references still present
- **Missing Assets**: Files or configurations that need to be recreated
- **Post-Migration Priority List**: Ordered list of follow-up actions
