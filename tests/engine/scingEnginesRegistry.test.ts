/**
 * SCING_ENGINES Registry Lock — Integrity Test
 *
 * Validates that the canonical engine registry satisfies all Track C requirements:
 * - Every EngineId has a corresponding EngineRecord, EngineContract, and risk profile.
 * - All 6 mandatory engine families are represented.
 * - All 6 execution classes are used.
 * - No engine has ambiguous authority (e.g., reasoning + enforcement on same engine).
 * - validateRegistry() returns ok: true.
 * - No layer collapse: SCING ≠ LARI ≠ BANE.
 *
 * Authority: UTCB Track C (BFI Imprint) — Director Anderson, 2026-03-23
 */

import { ENGINE_REGISTRY, REGISTRY_VERSION } from '../../scing/engine/engineRegistry';
import { CONTRACTS } from '../../scing/engine/engineContracts';
import { RISK } from '../../scing/engine/engineRisk';
import { validateRegistry } from '../../scing/engine/engineValidate';
import { EXECUTION_CLASS_DESCRIPTORS } from '../../scing/engine/executionClass';
import type { EngineId, ExecutionClass } from '../../scing/engine/engineTypes';

// ---------------------------------------------------------------------------
// Required engine families from UTCB
// ---------------------------------------------------------------------------

const MANDATORY_FAMILIES = [
  'scing-orch',     // SCING_ORCH
  'lari-orch',      // LARI_ORCH
  'lari-reasoning', // LARI core reasoning family
  'lari-key',       // LARI domain/sensor family
  'bane-enforcement', // BANE family
  'truth-audit',    // Truth/report/audit family
] as const;

const ALL_EXECUTION_CLASSES: ExecutionClass[] = [
  'coordination',
  'reasoning',
  'sensing',
  'enforcement',
  'reporting',
  'audit',
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SCING_ENGINES Registry Lock', () => {
  const ids = Object.keys(ENGINE_REGISTRY) as EngineId[];

  test('registry version is 1.0.0-canon', () => {
    expect(REGISTRY_VERSION).toBe('1.0.0-canon');
  });

  test('registry has at least 32 engines', () => {
    expect(ids.length).toBeGreaterThanOrEqual(32);
  });

  test('every EngineId has a corresponding EngineRecord', () => {
    for (const id of ids) {
      expect(ENGINE_REGISTRY[id]).toBeDefined();
      expect(ENGINE_REGISTRY[id].id).toBe(id);
    }
  });

  test('every EngineId has a corresponding EngineContract', () => {
    for (const id of ids) {
      expect(CONTRACTS[id]).toBeDefined();
      expect(CONTRACTS[id].id).toBe(id);
    }
  });

  test('every EngineId has a corresponding risk profile', () => {
    for (const id of ids) {
      expect(RISK[id]).toBeDefined();
      expect(RISK[id].id).toBe(id);
    }
  });

  test('every engine has a valid executionClass', () => {
    for (const id of ids) {
      const cls = ENGINE_REGISTRY[id].executionClass;
      expect(cls).toBeDefined();
      expect(EXECUTION_CLASS_DESCRIPTORS[cls]).toBeDefined();
    }
  });

  test('every engine has required authority metadata', () => {
    for (const id of ids) {
      const e = ENGINE_REGISTRY[id];
      expect(e.authorityScope).toBeTruthy();
      expect(e.permittedInputs).toBeDefined();
      expect(e.permittedOutputs).toBeDefined();
      expect(e.executionRestrictions).toBeDefined();
      expect(e.auditRequirements).toBeDefined();
    }
  });

  test('all 6 mandatory families are represented', () => {
    const presentFamilies = new Set(ids.map((id) => ENGINE_REGISTRY[id].family));
    for (const family of MANDATORY_FAMILIES) {
      expect(presentFamilies.has(family)).toBe(true);
    }
  });

  test('all 6 execution classes are used', () => {
    const usedClasses = new Set(ids.map((id) => ENGINE_REGISTRY[id].executionClass));
    for (const cls of ALL_EXECUTION_CLASSES) {
      expect(usedClasses.has(cls)).toBe(true);
    }
  });

  test('no engine has conflicting authority (reasoning + enforcement)', () => {
    for (const id of ids) {
      const e = ENGINE_REGISTRY[id];
      const caps = e.capabilities;
      // An engine with 'analyze' or 'classify' should not also have 'enforce'
      // unless it is a platform engine in 'sensing' class (which may have safety-gate enforcement)
      if (e.executionClass === 'reasoning') {
        expect(caps).not.toContain('enforce');
      }
      if (e.executionClass === 'enforcement') {
        expect(caps).not.toContain('analyze');
        expect(caps).not.toContain('classify');
        expect(caps).not.toContain('synthesize');
      }
    }
  });

  test('no layer collapse: SCING, LARI, BANE have distinct execution classes', () => {
    const scing = ENGINE_REGISTRY['SCING'];
    const lari = ENGINE_REGISTRY['LARI'];
    const bane = ENGINE_REGISTRY['BANE'];

    // All three must exist
    expect(scing).toBeDefined();
    expect(lari).toBeDefined();
    expect(bane).toBeDefined();

    // Layer separation: no two core engines share the same execution class
    const classes = new Set([scing.executionClass, lari.executionClass, bane.executionClass]);
    expect(classes.size).toBe(3);
  });

  test('validateRegistry() returns ok:true with zero errors', () => {
    const result = validateRegistry();
    if (!result.ok) {
      console.error('Registry validation errors:', result.errors);
    }
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.totalEngines).toBeGreaterThanOrEqual(32);
    expect(result.executionClassCoverage).toHaveLength(ALL_EXECUTION_CLASSES.length);
  });

  test('topo sort includes all engines without cycles', () => {
    const result = validateRegistry();
    expect(result.topo.length).toBe(ids.length);
    // Every engine should be in the topo sort
    const topoSet = new Set(result.topo);
    for (const id of ids) {
      expect(topoSet.has(id)).toBe(true);
    }
  });
});

describe('SCING_ENGINES — Track C Specific Engines', () => {
  test('SCING-ORCH exists with coordination class', () => {
    const e = ENGINE_REGISTRY['SCING-ORCH'];
    expect(e).toBeDefined();
    expect(e.executionClass).toBe('coordination');
    expect(e.family).toBe('scing-orch');
  });

  test('LARI-ORCH exists with coordination class', () => {
    const e = ENGINE_REGISTRY['LARI-ORCH'];
    expect(e).toBeDefined();
    expect(e.executionClass).toBe('coordination');
    expect(e.family).toBe('lari-orch');
  });

  test('LARI reasoning engines exist with reasoning class', () => {
    for (const id of ['LARI-PLANNER', 'LARI-CRITIC', 'LARI-SYNTHESIZER', 'LARI-CONTEXT-ENGINE', 'LARI-ANALYST', 'LARI-RETRIEVER'] as EngineId[]) {
      const e = ENGINE_REGISTRY[id];
      expect(e).toBeDefined();
      expect(e.executionClass).toBe('reasoning');
      expect(e.family).toBe('lari-reasoning');
    }
  });

  test('BANE enforcement engines exist with enforcement or audit class', () => {
    for (const id of ['BANE-CORE', 'BANE-POLICY', 'BANE-COMPLIANCE'] as EngineId[]) {
      const e = ENGINE_REGISTRY[id];
      expect(e).toBeDefined();
      expect(e.executionClass).toBe('enforcement');
      expect(e.family).toBe('bane-enforcement');
    }
    
    const eAudit = ENGINE_REGISTRY['BANE-AUDIT'];
    expect(eAudit).toBeDefined();
    expect(eAudit.executionClass).toBe('audit');
    expect(eAudit.family).toBe('bane-enforcement');
  });

  test('SCING-REPORT and LARI-STANDARDS exist with reporting class', () => {
    for (const id of ['SCING-REPORT', 'LARI-STANDARDS'] as EngineId[]) {
      const e = ENGINE_REGISTRY[id];
      expect(e).toBeDefined();
      expect(e.executionClass).toBe('reporting');
      expect(e.family).toBe('truth-audit');
    }
  });

  test('SCING-AUDIT exists with audit class', () => {
    const e = ENGINE_REGISTRY['SCING-AUDIT'];
    expect(e).toBeDefined();
    expect(e.executionClass).toBe('audit');
    expect(e.family).toBe('truth-audit');
  });
});
