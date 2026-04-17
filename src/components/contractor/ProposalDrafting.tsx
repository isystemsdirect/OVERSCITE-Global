'use client';

import type { ProposalProfile, DivisionMode } from '../../lib/contractor/types';
import { evaluateContractMutationGate } from '@/lib/bane/scing-execution-gate';
import { toast } from '@/components/ui/use-toast';
import { emitUiAudit } from '@/lib/audit/ui-audit-bridge';

interface ProposalDraftingProps {
  proposals: ProposalProfile[];
  mode: DivisionMode;
}

export const ProposalDrafting: React.FC<ProposalDraftingProps> = ({ proposals, mode }) => {
  const isAssistOnly = mode === 'DRAFT_ASSIST_ONLY' || mode === 'SETUP_REQUIRED';

  return (
    <div className="flex flex-col h-full bg-white/[0.01] border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl shadow-black/30">
      {/* Recalibrated Assist Banner */}
      {isAssistOnly && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 flex items-center gap-3 backdrop-blur-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="text-xs text-amber-100/60 leading-tight">
            <span className="font-bold text-amber-400 uppercase tracking-tight mr-1">Draft Assist Mode Active:</span> This surface is limited to structural scaffolding and clause recommendations. 
            Full contract-ready issuance is blocked until governance prerequisites and jurisdiction rule-resolution (Phase 2) are satisfied.
          </div>
        </div>
      )}

      {!isAssistOnly && mode !== 'CONTRACT_READY' && (
        <div className="bg-indigo-500/10 border-b border-indigo-500/20 p-3 flex items-center gap-3 backdrop-blur-sm">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <div className="text-xs text-indigo-100/60 leading-tight">
            <span className="font-bold text-indigo-400 uppercase tracking-tight mr-1">Compliance Review Ready:</span> All mandatory rules are resolved. Human-sovereign review and Seal application are now enabled for this proposal set.
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 gap-6">
          {proposals.map(p => (
            <div key={p.id} className="bg-white/[0.02] border border-white/10 rounded-xl shadow-xl shadow-black/20 overflow-hidden flex flex-col md:flex-row min-h-[400px]">
              {/* Draft Editor Pane */}
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white/90">{p.title}</h3>
                    <p className="text-xs text-white/20">ID: {p.id} • Created {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/5 text-white/40 text-[10px] font-bold uppercase rounded border border-white/10">
                      {p.seal_status}
                    </span>
                  </div>
                </div>
                
                <textarea 
                  className="w-full h-[300px] p-4 text-sm font-mono text-white/70 bg-black/20 border border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none"
                  value={p.draft_text}
                  readOnly
                />
              </div>

              {/* LARI Compliance & Audit Pane */}
              <div className="w-full md:w-[350px] bg-white/[0.01] p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6 text-white/80">
                  <FileCheck className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-sm tracking-tight uppercase">Compliance Audit</h4>
                </div>

                <div className="space-y-4 flex-1">
                  {/* Score removed as per UTCB-S */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-white/30 mb-1">Decision Result</div>
                    <div className="flex items-center gap-2 text-white/80">
                      <div className={`w-2 h-2 rounded-full ${p.compliance_audit.decision_result === 'compliant' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-bold uppercase">{p.compliance_audit.decision_result.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex-1 overflow-auto">
                    <div className="text-[10px] uppercase font-bold text-white/30 mb-2">Reason Chain</div>
                    <ul className="space-y-2">
                      {p.compliance_audit.reason_chain.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 text-[10px] text-white/40 leading-normal border-l-2 border-white/10 pl-2 italic">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-[10px] uppercase font-bold text-white/30 mb-1 leading-none">Status Flags</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.compliance_audit.unresolved_flags.map(flag => (
                        <span key={flag} className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[8px] font-bold uppercase rounded border border-red-500/20">
                          {flag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    disabled={isAssistOnly}
                    onClick={async () => {
                      const actorId = 'human-reviewer-1';
                      
                      // Phase 1: Audit Intent
                      const auditId = await emitUiAudit({
                        type: 'UI_MUTATION_REQUESTED',
                        actorId,
                        action: 'APPLY_HUMAN_SEAL',
                        targetId: p.id
                      });

                      const decision = await evaluateContractMutationGate({
                        actorId,
                        actionType: 'APPLY_HUMAN_SEAL',
                        targetId: p.id
                      });

                      if (!decision.permitted) {
                        toast({
                          title: "BANE ENFORCEMENT - BLOCKED",
                          description: `Proposal Finalization Rejected. Classification: ${decision.classification}`,
                          variant: 'destructive',
                        });
                        
                        await emitUiAudit({
                          type: 'UI_MUTATION_BLOCKED',
                          actorId,
                          action: 'APPLY_HUMAN_SEAL',
                          targetId: p.id,
                          traceId: decision.sdrId,
                          metadata: { reason: 'Governance Refusal', auditRef: auditId }
                        });
                      } else {
                        toast({
                          title: "Human Seal Applied",
                          description: `SDR Logged: ${decision.sdrId} | Classification: ${decision.classification}`,
                        });

                        await emitUiAudit({
                          type: 'UI_MUTATION_APPROVED',
                          actorId,
                          action: 'APPLY_HUMAN_SEAL',
                          targetId: p.id,
                          traceId: decision.sdrId,
                          metadata: { auditRef: auditId }
                        });
                      }
                    }}
                    className={`shrink-0 w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                      isAssistOnly 
                      ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-900/20 border border-indigo-500/30'
                    }`}
                  >
                    Apply Human Seal
                  </button>
                  {isAssistOnly && (
                    <p className="mt-2 text-[9px] text-amber-500/60 text-center italic">
                      Seal authority blocked in Draft Assist mode.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalDrafting;
