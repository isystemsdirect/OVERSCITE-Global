import { ENGINE_REGISTRY, REGISTRY_VERSION } from './engineRegistry';
import { CONTRACTS } from './engineContracts';
import { RISK } from './engineRisk';
import { VISUAL_BINDINGS } from './engineVisual';
import { topoSort } from './engineGraph';
import { EngineId } from './engineTypes';
import { EXECUTION_CLASS_DESCRIPTORS, type ExecutionClass } from './executionClass';

export type RegistryValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  registryVersion: string;
  topo: EngineId[];
  executionClassCoverage: ExecutionClass[];
  totalEngines: number;
};

export function validateRegistry(): RegistryValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const ids = Object.keys(ENGINE_REGISTRY) as EngineId[];
  const seenClasses = new Set<ExecutionClass>();

  // 1) Basic presence checks
  for (const id of ids) {
    if (!CONTRACTS[id]) errors.push(`Missing contract for ${id}`);
    if (!RISK[id]) errors.push(`Missing risk profile for ${id}`);
    if (!VISUAL_BINDINGS[id])
      warnings.push(`Missing visual binding for ${id} (will default to neutral in UI logic)`);
  }

  // 2) Dependency existence checks
  for (const id of ids) {
    for (const dep of ENGINE_REGISTRY[id].dependsOn) {
      if (!ENGINE_REGISTRY[dep]) errors.push(`Engine ${id} depends on missing engine ${dep}`);
    }
  }

  // 3) Stage/key sanity
  for (const id of ids) {
    const e = ENGINE_REGISTRY[id];
    if (e.tier === 'key' || e.tier === 'roadmap') {
      if (!e.providesKeys || e.providesKeys.length === 0)
        warnings.push(`${id} is ${e.tier} but providesKeys is empty`);
    }
  }

  // 4) Execution class validation
  for (const id of ids) {
    const e = ENGINE_REGISTRY[id];

    // 4a) Every engine must have a valid execution class
    if (!e.executionClass) {
      errors.push(`Engine ${id} is missing executionClass`);
    } else if (!EXECUTION_CLASS_DESCRIPTORS[e.executionClass]) {
      errors.push(`Engine ${id} has unknown executionClass '${e.executionClass}'`);
    } else {
      seenClasses.add(e.executionClass);
    }

    // 4b) Every engine must have authority metadata
    if (!e.authorityScope) errors.push(`Engine ${id} is missing authorityScope`);
    if (!e.permittedInputs || e.permittedInputs.length === 0)
      warnings.push(`Engine ${id} has empty permittedInputs`);
    if (!e.permittedOutputs || e.permittedOutputs.length === 0)
      warnings.push(`Engine ${id} has empty permittedOutputs`);
    if (!e.executionRestrictions || e.executionRestrictions.length === 0)
      warnings.push(`Engine ${id} has empty executionRestrictions`);
    if (!e.auditRequirements || e.auditRequirements.length === 0)
      warnings.push(`Engine ${id} has empty auditRequirements`);
  }

  // 4c) Coverage: all six execution classes must be represented
  const allClasses: ExecutionClass[] = Object.keys(EXECUTION_CLASS_DESCRIPTORS) as ExecutionClass[];
  for (const cls of allClasses) {
    if (!seenClasses.has(cls)) {
      errors.push(`Execution class '${cls}' has no engines assigned in the registry`);
    }
  }

  // 5) Deterministic ordering
  let topo: EngineId[] = [];
  try {
    topo = topoSort();
  } catch (err: any) {
    errors.push(String(err?.message ?? err));
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    registryVersion: REGISTRY_VERSION,
    topo,
    executionClassCoverage: Array.from(seenClasses),
    totalEngines: ids.length,
  };
}
