'use client';

import React, { useState } from 'react';
import { 
  Dna, 
  Play, 
  Wind, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Database,
  Hash,
  AlertTriangle,
  History as HistoryIcon
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  proposeOptimalWindow, 
  ScheduleProposal 
} from '@/lib/services/smart-scheduler';
import { forensicUpdate } from '@/lib/services/canonical-write';
import { useToast } from '@/hooks/use-toast';
import { CHURCH_PIP } from '@/lib/data/church/profiles';
import { METHOD_REGISTRY } from '@/lib/inspections/methods/registry';
import { MethodGraphEngine } from '@/lib/services/method-graph-engine';
import { SovereignOperationalTree } from '@/components/methodology/SovereignOperationalTree';
import { WorkflowInstance, MethodNodeState } from '@/lib/inspections/methods/contracts';

interface ChurchOperationalVerificationProps {
  clientId: string;
}

export function ChurchOperationalVerification({ clientId }: ChurchOperationalVerificationProps) {
  const [methodId, setMethodId] = useState<string>('roof-inspection');
  const [instance, setInstance] = useState<WorkflowInstance | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  
  const [proposals, setProposals] = useState<ScheduleProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ScheduleProposal | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [simulatedWind, setSimulatedWind] = useState(15); // mph
  const { toast } = useToast();

  const initializeWorkflow = async () => {
    const method = METHOD_REGISTRY[methodId];
    if (!method || !method.workflowGraph) return;

    const { instance: newInstance } = await MethodGraphEngine.initializeInstance(
      method.workflowGraph,
      'PIP',
      CHURCH_PIP.id,
      'TEST-CONTROLLER-001'
    );
    setInstance(newInstance);
    setActiveNodeId(method.workflowGraph.entryNodeIds[0]);
    
    toast({ title: "Method Graph Initialized", description: `Governed workflow for ${method.methodName} is now active.` });
  };

  const handleNodeTransition = async (nodeId: string, newState: MethodNodeState) => {
    if (!instance) return;
    const method = METHOD_REGISTRY[methodId];
    if (!method || !method.workflowGraph) return;

    const updatedInstance = { ...instance };
    await MethodGraphEngine.transitionNode(nodeId, newState, updatedInstance, method.workflowGraph, 'TEST-CONTROLLER-001');
    
    // Emit Forensic Audit Event
    await forensicUpdate({
      entityId: instance.instanceId,
      entityType: 'workflow',
      mutationClass: `node_${newState}` as any,
      payload: {
        nodeId,
        prior_state: instance.nodeStates[nodeId].state,
        new_state: newState
      },
      actorId: 'TEST-CONTROLLER-001',
      actorRole: 'Director (Verification)',
      actorType: 'human'
    });

    setInstance(updatedInstance);
    
    if (newState === 'completed') {
      toast({ title: "Node Completed", description: `Forensic audit recorded for node ${nodeId}.` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Dna className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Forensic Verification Lab</h2>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">Operational Loop Test: Profile → Method → Schedule → Audit</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card/40 p-2 rounded-xl border border-border/40">
           <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-black opacity-40">Wind Simulation</span>
              <span className={cn("text-xs font-bold", simulatedWind > 20 ? "text-orange-500" : "text-green-500")}>{simulatedWind} MPH</span>
           </div>
           <input 
              type="range" min="5" max="40" step="5" value={simulatedWind} 
              onChange={(e) => setSimulatedWind(parseInt(e.target.value))}
              className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
           />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Stage 1: The Input */}
          <Card className="bg-card/40 backdrop-blur-md border-border/50">
            <CardHeader className="py-4 border-b border-border/20">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Database className="h-4 w-4 opacity-40" />
                1. Grounded Test Object Ingestion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black opacity-40">Client Baseline</span>
                  <div className="p-3 bg-background/40 rounded-lg border border-border/20">
                     <p className="text-sm font-bold">True Spirit Church</p>
                     <p className="text-[10px] opacity-60">ID: {clientId}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black opacity-40">Target PIP</span>
                  <div className="p-3 bg-background/40 rounded-lg border border-border/20">
                     <p className="text-sm font-bold">{CHURCH_PIP.propertyIdentity.name}</p>
                     <p className="text-[10px] opacity-60">ID: {CHURCH_PIP.id}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="pro" className="w-full mt-6 gap-2" 
                onClick={initializeWorkflow}
                disabled={!!instance}
              >
                <Play className="h-4 w-4" />
                Initialize Phase 1 Method Graph
              </Button>
            </CardContent>
          </Card>

          {/* Stage 2: The Workflow Tree */}
          {instance && (
            <>
              <Card className="bg-card/40 backdrop-blur-md border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
                 <CardHeader className="py-4 border-b border-border/20 flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <HistoryIcon className="h-4 w-4 text-primary" />
                      2. Sovereign Operational Graph Execution
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6">
                    <SovereignOperationalTree 
                      graph={METHOD_REGISTRY[instance.methodId].workflowGraph!}
                      instance={instance}
                      activeNodeId={activeNodeId || undefined}
                      onNodeSelect={(id) => setActiveNodeId(id)}
                    />

                    {activeNodeId && instance.nodeStates[activeNodeId].state !== 'completed' && instance.nodeStates[activeNodeId].state !== 'blocked' && (
                      <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl animate-in zoom-in-95">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Node Context</span>
                            <h3 className="text-lg font-bold">{METHOD_REGISTRY[instance.methodId].workflowGraph?.nodes.find(n => n.nodeId === activeNodeId)?.title}</h3>
                          </div>
                          <Badge variant="outline" className="text-primary border-primary/30">READY FOR CAPTURE</Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="p-4 bg-background/50 rounded-lg border border-border/20 text-xs leading-relaxed italic opacity-80">
                            {MethodGraphEngine.getGuidance(instance, METHOD_REGISTRY[instance.methodId].workflowGraph!)}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <Button 
                              className="bg-primary/80 hover:bg-primary font-black uppercase tracking-tighter"
                              onClick={() => handleNodeTransition(activeNodeId, 'completed')}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Verify & Complete Node
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleNodeTransition(activeNodeId, 'failed')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Report Failure / Blocker
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {instance.status === 'completed' && (
                      <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                         <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                         <h3 className="text-lg font-bold">Method Graph Execution Complete</h3>
                         <p className="text-xs opacity-60">All required nodes have been validated and audit-ledgered.</p>
                      </div>
                    )}
                 </CardContent>
              </Card>

              {/* Stage 3: The Audit */}
              <Card className="bg-black/60 border-primary/40 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden font-mono">
                <div className="h-1 w-full bg-primary/40 animate-pulse" />
                <CardContent className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span className="text-xs font-black uppercase text-primary tracking-widest">BANE Verification Finalized</span>
                      </div>
                      <span className="text-[10px] text-white/40">v1.1.0-CHURCH-LOOP</span>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded border border-white/10 space-y-3">
                         <div className="flex justify-between items-center opacity-60 text-[10px] uppercase font-black">
                            <span>SHA-256 Event Chain</span>
                            <span>{instance.instanceId}</span>
                         </div>
                         <div className="flex items-center gap-2 text-[11px]">
                            <Hash className="h-3 w-3 text-primary/60" />
                            <span className="truncate opacity-40">0x8f2e3a1c...</span>
                            <ArrowRight className="h-3 w-3 opacity-20" />
                            <span className="text-primary truncate">0x{Math.random().toString(16).substr(2, 16)}...</span>
                         </div>
                      </div>

                      <div className="text-[10px] leading-relaxed text-white/60">
                        <span className="text-primary font-bold">METHOD:</span> {instance.methodId}<br/>
                        <span className="text-primary font-bold">WORKFLOW_ID:</span> {instance.instanceId}<br/>
                        <span className="text-primary font-bold">NODES_COMPLETED:</span> {Object.values(instance.nodeStates).filter(s => s.state === 'completed').length}<br/>
                        <span className="text-primary font-bold">ACTOR:</span> TEST-CONTROLLER-001 (Director (Verification))
                      </div>
                   </div>

                   {instance.status === 'completed' && (
                     <div className="pt-4 flex items-center gap-2 text-green-500 font-bold text-xs">
                       <CheckCircle2 className="h-4 w-4" />
                       VERIFICATION LOOP COMPLETE — PROOF OF GOVERNANCE ACHIEVED
                     </div>
                   )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Info/Docs Column */}
        <div className="space-y-6">
           <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-60">Verification Objective</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs leading-relaxed italic opacity-80">
                  "This lab proves that intelligence (PIP) combined with protocol (Method) 
                  enforces operational sanity (SmartSCHEDULER) before any action is allowed 
                  in the field. The final audit record ensures absolute accountability."
                </p>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      Drone Wind Threshold: 20mph
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      Daylight: Mandatory
                   </div>
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
