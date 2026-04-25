/**
 * @fileOverview Sovereign Operational Tree UI — SCINGULAR™ Methodology Stack
 * @domain UIX / Methodology / Workflow
 * @canonical true
 * @status Phase 1 Implementation
 * 
 * Ultra-Grade hierarchical representation of a Method Graph.
 * Avoids decorative diagrams in favor of operational clarity.
 */

import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  PlayCircle, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  MethodGraph, 
  WorkflowInstance, 
  MethodNode, 
  MethodNodeState,
  MethodBlockReasonCode
} from '@/lib/inspections/methods/contracts';

interface SovereignOperationalTreeProps {
  graph: MethodGraph;
  instance: WorkflowInstance;
  onNodeSelect?: (nodeId: string) => void;
  activeNodeId?: string;
  className?: string;
}

export const SovereignOperationalTree: React.FC<SovereignOperationalTreeProps> = ({
  graph,
  instance,
  onNodeSelect,
  activeNodeId,
  className
}) => {
  
  // Build a display-friendly tree by walking the graph
  // For Phase 1, we use a simple list with indentation for branches
  const renderNode = (node: MethodNode, depth: number = 0) => {
    const nodeState = instance.nodeStates[node.nodeId];
    const isActive = activeNodeId === node.nodeId;
    const isEntry = graph.entryNodeIds.includes(node.nodeId);
    
    return (
      <div 
        key={node.nodeId}
        className={cn(
          "group relative flex flex-col gap-1 transition-all duration-300",
          depth > 0 && "ml-6 border-l border-primary/10 pl-4"
        )}
      >
        {/* Connection Line Visual */}
        {depth > 0 && (
          <div className="absolute top-4 -left-4 w-4 h-px bg-primary/10" />
        )}

        <div 
          onClick={() => nodeState.state !== 'blocked' && onNodeSelect?.(node.nodeId)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
            isActive ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5" : "bg-card/40 border-border/20 hover:border-primary/30",
            nodeState.state === 'blocked' ? "opacity-50 cursor-not-allowed grayscale" : "opacity-100"
          )}
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {renderStatusIcon(nodeState.state)}
          </div>

          {/* Node Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter opacity-40",
                isActive && "opacity-80 text-primary"
              )}>
                {node.nodeClass}
              </span>
              <h4 className="text-sm font-bold truncate tracking-tight">{node.title}</h4>
            </div>
            
            {isActive && (
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight animate-in fade-in slide-in-from-top-1">
                {node.description}
              </p>
            )}

            {nodeState.state === 'blocked' && (
              <div className="flex items-center gap-1.5 mt-1">
                <Lock className="h-3 w-3 text-destructive" />
                <span className="text-[10px] font-mono font-bold text-destructive/80 uppercase">
                  Blocked: {nodeState.reasonCode?.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          {/* Actions/Context */}
          {isActive && (
            <div className="flex-shrink-0 opacity-40 hover:opacity-100">
               <MoreVertical className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Render Downstream Nodes (Recursive) */}
        {renderDownstream(node.nodeId, depth + 1)}
      </div>
    );
  };

  const renderDownstream = (nodeId: string, depth: number) => {
    const nextEdges = graph.edges.filter(e => e.fromNodeId === nodeId);
    if (nextEdges.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-2">
        {nextEdges.map(edge => {
          const nextNode = graph.nodes.find(n => n.nodeId === edge.toNodeId);
          if (!nextNode) return null;
          return renderNode(nextNode, depth);
        })}
      </div>
    );
  };

  const renderStatusIcon = (state: MethodNodeState) => {
    switch (state) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'in_progress': return <PlayCircle className="h-5 w-5 text-primary animate-pulse" />;
      case 'ready': return <Circle className="h-5 w-5 text-primary" />;
      case 'blocked': return <Lock className="h-5 w-5 text-muted-foreground/40" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'skipped_by_rule': return <ChevronRight className="h-5 w-5 text-muted-foreground/30" />;
      default: return <Circle className="h-5 w-5 text-muted-foreground/20" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
            Active Workflow Instance: {instance.instanceId}
          </span>
        </div>
        <div className="flex gap-4">
           {/* Summary Stats */}
           <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-mono">{Object.values(instance.nodeStates).filter(s => s.state === 'completed').length}</span>
           </div>
           <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-destructive" />
              <span className="text-[10px] font-mono">{Object.values(instance.nodeStates).filter(s => s.state === 'blocked').length}</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {graph.entryNodeIds.map(nodeId => {
          const node = graph.nodes.find(n => n.nodeId === nodeId);
          if (!node) return null;
          return renderNode(node, 0);
        })}
      </div>
    </div>
  );
};
