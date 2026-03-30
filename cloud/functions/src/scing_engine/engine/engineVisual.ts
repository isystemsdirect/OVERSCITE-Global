import { EngineId, VisualChannel } from './engineTypes';

export type EngineVisualBinding = {
  id: EngineId;
  channel: VisualChannel;
  priority: number; // higher wins when multiple active
};

export const VISUAL_BINDINGS: Record<EngineId, EngineVisualBinding> = {
  SCING: { id: 'SCING', channel: 'scing-present', priority: 10 },
  LARI: { id: 'LARI', channel: 'lari-thinking', priority: 50 },
  BANE: { id: 'BANE', channel: 'bane-alert', priority: 100 }, // override dominance

  'LARI-VISION': { id: 'LARI-VISION', channel: 'lari-thinking', priority: 40 },
  'LARI-MAPPER': { id: 'LARI-MAPPER', channel: 'lari-thinking', priority: 40 },
  'LARI-DOSE': { id: 'LARI-DOSE', channel: 'lari-thinking', priority: 45 },
  'LARI-PRISM': { id: 'LARI-PRISM', channel: 'lari-thinking', priority: 45 },
  'LARI-ECHO': { id: 'LARI-ECHO', channel: 'lari-thinking', priority: 45 },

  'LARI-WEATHERBOT': { id: 'LARI-WEATHERBOT', channel: 'lari-thinking', priority: 35 },
  'LARI-GIS': { id: 'LARI-GIS', channel: 'lari-thinking', priority: 35 },
  'LARI-CONTROL': { id: 'LARI-CONTROL', channel: 'lari-thinking', priority: 60 }, // control is high importance

  'LARI-THERM': { id: 'LARI-THERM', channel: 'lari-thinking', priority: 45 },
  'LARI-NOSE': { id: 'LARI-NOSE', channel: 'lari-thinking', priority: 45 },
  'LARI-SONIC': { id: 'LARI-SONIC', channel: 'lari-thinking', priority: 45 },
  'LARI-GROUND': { id: 'LARI-GROUND', channel: 'lari-thinking', priority: 45 },
  'LARI-AEGIS': { id: 'LARI-AEGIS', channel: 'lari-thinking', priority: 55 },
  'LARI-EDDY': { id: 'LARI-EDDY', channel: 'lari-thinking', priority: 45 },

  // Orchestration family
  'SCING-ORCH': { id: 'SCING-ORCH', channel: 'scing-present', priority: 15 },
  'LARI-ORCH': { id: 'LARI-ORCH', channel: 'lari-thinking', priority: 30 },

  // LARI core reasoning family
  'LARI-PLANNER': { id: 'LARI-PLANNER', channel: 'lari-thinking', priority: 45 },
  'LARI-CRITIC': { id: 'LARI-CRITIC', channel: 'lari-thinking', priority: 45 },
  'LARI-SYNTHESIZER': { id: 'LARI-SYNTHESIZER', channel: 'lari-speaking', priority: 50 },
  'LARI-CONTEXT-ENGINE': { id: 'LARI-CONTEXT-ENGINE', channel: 'lari-thinking', priority: 35 },
  'LARI-ANALYST': { id: 'LARI-ANALYST', channel: 'lari-thinking', priority: 45 },
  'LARI-RETRIEVER': { id: 'LARI-RETRIEVER', channel: 'lari-thinking', priority: 35 },

  // BANE enforcement family
  'BANE-CORE': { id: 'BANE-CORE', channel: 'bane-alert', priority: 100 },
  'BANE-POLICY': { id: 'BANE-POLICY', channel: 'bane-alert', priority: 90 },
  'BANE-AUDIT': { id: 'BANE-AUDIT', channel: 'bane-alert', priority: 80 },
  'BANE-COMPLIANCE': { id: 'BANE-COMPLIANCE', channel: 'bane-alert', priority: 90 },

  // Truth / report / audit family
  'LARI-STANDARDS': { id: 'LARI-STANDARDS', channel: 'scing-present', priority: 25 },
  'SCING-REPORT': { id: 'SCING-REPORT', channel: 'scing-present', priority: 20 },
  'SCING-AUDIT': { id: 'SCING-AUDIT', channel: 'scing-present', priority: 10 },

  'LARI-CONTRACTOR': { id: 'LARI-CONTRACTOR', channel: 'lari-thinking', priority: 45 },
  'LARI-ENGINEER': { id: 'LARI-ENGINEER', channel: 'lari-thinking', priority: 55 },
};

export function resolveDominantChannel(active: EngineId[]): VisualChannel {
  let best: { ch: VisualChannel; p: number } = { ch: 'neutral', p: -1 };
  for (const id of active) {
    const b = VISUAL_BINDINGS[id];
    if (b && b.priority > best.p) best = { ch: b.channel, p: b.priority };
  }
  return best.ch;
}
