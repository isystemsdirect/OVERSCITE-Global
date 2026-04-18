# Dependency & Type Graph Stabilization: Pre-State (UTCB [12])

## Baseline Context
- **Date/Time**: 2026-04-18 (Current Session)
- **Branch**: `recovery/portability-canon-reconcile`
- **HEAD**: `9a3b6416ac74a999ad7e349e3c951f695a55e1dd`

## Diagnostic State (Pre-Mutation)
The root repository was in a non-deterministic TypeScript state with thirteen (13) critical compiler errors pointing to the `tsconfig.json` implicit type library discovery system.

### Observed Symptoms:
- `Cannot find type definition file for 'babel__core'.`
- `Cannot find type definition file for 'istanbul-lib-coverage'.`
- `Cannot find type definition file for 'jest'.`
- Error source: `Entry point for implicit type library '...'`

### Manifest State (Pre-Mutation):
```json
{
  "devDependencies": {
    "jest": "^30.3.0",
    "@types/jest": "^30.0.0",
    "ts-jest": "^29.4.6"
  }
}
```
- **Conflict**: `ts-jest` v29 was paired with Jest v30, creating a broken type graph.
- **Config**: `tsconfig.json` lacked explicit `types` constraints, allowing failing implicit types to flood the compilation surface.

## Preservation Action
- Pre-mutation `package-lock.json` noted for deletion (purged).
- `package-lock.json.bak` exists as a reference for pre-mutation state if legacy audit is required.

## Stabilization Strategy (Approved UTCB-S [12])
- Realign root Jest to stable v29 ecosystem.
- Constrain `compilerOptions.types` in `tsconfig.json`.
- Execute recursive purge of `node_modules`.
- Execute clean reinstallation.
