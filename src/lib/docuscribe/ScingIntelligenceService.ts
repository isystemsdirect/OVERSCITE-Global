/**
 * DocuSCRIBE™ — Scing Intelligence Service
 * 
 * Provides governed, contextual intelligence transformations for 
 * document content.
 */

export type ScingAction = 
  | 'formalize' 
  | 'summarize' 
  | 'expand' 
  | 'clarify_technical' 
  | 'notes_to_report'
  | 'method_guidance'
  | 'missing_evidence_alert'
  | 'inhibitor_alert';

export interface ScingSuggestion {
  original: string;
  proposed: string;
  explanation: string;
  confidence: number;
}

const MOCK_TRANSFORMATIONS: Record<ScingAction, (text: string) => string> = {
  formalize: (text) => {
    return text
      .replace(/\bi\b/g, 'the inspector')
      .replace(/\bme\b/g, 'the investigative node')
      .replace(/\bsaw\b/g, 'observed and recorded')
      .replace(/\bbad\b/g, 'non-compliant with safety protocol')
      .replace(/(\w+)\s+is\s+good/g, 'Subject $1 demonstrates operational integrity');
  },
  summarize: (text) => {
    return `<strong>SUMMARY:</strong> ${text.slice(0, 100)}... <br> <em>Conclusion: Analytical validation required.</em>`;
  },
  expand: (text) => {
    return `<p>${text}</p><p>Further investigation revealed secondary characteristics consistent with the initial observation. The SCINGULAR alignment for this observation is estimated at 0.92 CARR.</p>`;
  },
  clarify_technical: (text) => {
    return text.replace(/([0-9]+\s?v)/g, '<em>$1 (Stabilized Voltage)</em>')
               .replace(/([0-9]+\s?psi)/g, '<strong>$1 (Calibrated Pressure)</strong>');
  },
  notes_to_report: (text) => {
    const lines = text.split('\n');
    return `
      <h2>Executive Technical Finding</h2>
      <p>Based on the raw navigational notes provided, the following structured assessment is presented:</p>
      <ul>
        ${lines.map(l => `<li><strong>OBSERVATION:</strong> ${l}</li>`).join('')}
      </ul>
      <p><em>Auto-generated via Scing Intelligence (Assisted)</em></p>
    `;
  },
  method_guidance: (text) => {
    return `<div class="bg-blue-900/20 p-4 border border-blue-500/50 rounded-md">
      <div class="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Methodology Guidance</div>
      <div class="text-sm text-blue-100/90 leading-relaxed">${text}</div>
    </div>`;
  },
  missing_evidence_alert: (text) => {
    return `<div class="bg-red-900/20 p-4 border border-red-500/50 rounded-md">
      <div class="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Missing Evidence</div>
      <div class="text-sm text-red-100/90 leading-relaxed">${text}</div>
    </div>`;
  },
  inhibitor_alert: (text: string) => {
    return `<div class="bg-amber-900/20 p-4 border border-amber-500/50 rounded-md">
      <div class="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Inhibitor / Obstruction Truth</div>
      <div class="text-xs text-amber-100/90 leading-relaxed">${text}</div>
      <div class="mt-2 text-[9px] font-bold text-amber-500/60 uppercase">Confidence reduced — Document limitation required.</div>
    </div>`;
  }
};

// ─── Methodology Guidance Integration (UTCB-S Phase 1) ────────────────

import { getMethodPack } from '../inspections/methods/registry';

/**
 * Returns methodology-bound guidance for a specific method and phase.
 */
export function getMethodGuidance(methodId: string, phaseId: string): string {
  const method = getMethodPack(methodId);
  const hooks = method.guidanceHooks.filter((h: any) => h.phaseId === phaseId);
  
  if (hooks.length > 0) {
    return hooks[0].prompt;
  }
  
  return `Standard protocol for ${method.methodName} phase ${phaseId}. No phase-specific scripts detected.`;
}

/**
 * Returns inhibitor and blocker truth for the active method.
 */
export function getInhibitorAlerts(methodId: string, context?: { obstructed?: boolean }): string {
  const method = getMethodPack(methodId);
  const inhibitors = context?.obstructed 
    ? [...method.blockerProfile.executionInhibitors, ...method.blockerProfile.obstructionInhibitors]
    : method.blockerProfile.executionInhibitors;

  if (inhibitors.length === 0) return '';
  
  return `The following factors may weaken analysis confidence or restrict coverage: ${inhibitors.join(', ')}.`;
}

/**
 * Checks for missing required evidence based on the active method and phase.
 */
export function getMissingEvidence(
  methodId: string, 
  phaseId: string, 
  capturedIds: string[]
): string[] {
  const method = getMethodPack(methodId);
  const phase = method.workflowPhases.find((p: any) => p.phaseId === phaseId);
  
  if (!phase) return [];
  
  return phase.requiredEvidenceRefs.filter((refId: string) => !capturedIds.includes(refId));
}

/**
 * Executes a simulated intelligence action on the provided text.
 */
export async function executeIntelligenceAction(
  action: ScingAction, 
  text: string
): Promise<ScingSuggestion> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const transformer = MOCK_TRANSFORMATIONS[action] || ((t) => t);
  const proposed = transformer(text);

  return {
    original: text,
    proposed,
    explanation: `Applied ${action.replace(/_/g, ' ')} transformation based on SCINGULAR linguistic canon.`,
    confidence: 0.85 + Math.random() * 0.1
  };
}
