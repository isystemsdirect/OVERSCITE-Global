/**
 * SCINGULAR Engine Registry — Static Proxy
 * 
 * This file acts as a compatibility layer and strict proxy for the canonical
 * 32-engine registry defined in the /engine subdirectory.
 * 
 * Registry Version: 1.0.0-canon (UTCB-S Locked)
 * Canonical Count: 32
 */

import { ENGINE_REGISTRY } from './engine/engineRegistry';
import type { EngineRecord } from './engine/engineRegistry';
import type { EngineId, EngineFamily } from './engine/engineTypes';

// Re-export canonical types
export type { EngineId, EngineFamily, EngineRecord as EngineConfig };

/**
 * Legacy Compatibility Map
 * Reconciles architectural drift by mapping old snake-case or lowercase IDs
 * to their locked canonical counterparts.
 */
export const ENGINE_COMPAT_MAP: Record<string, EngineId> = {
  'scing-orchestrator': 'SCING-ORCH',
  'lari-core': 'LARI',
  'lari-ops': 'LARI-ORCH',
  'lari-security': 'BANE-CORE',
  'lari-edl': 'LARI-SYNTHESIZER',
  'bane-core': 'BANE-CORE',
  'system-metrics': 'SCING-AUDIT',
};

/**
 * Canonical Engines Registry
 * Strictly locked to 32 engines.
 */
export const ENGINES = ENGINE_REGISTRY;

export default ENGINES;
