'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { repoService } from '@/lib/lari-repo/repo-service';
import { RepoNode } from '@/lib/types/repository';
import { Search, Filter, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RepoTree } from '../repo-tab/RepoTree';
import { RepoDetailPane } from '../repo-tab/RepoDetailPane';

export default function LariRepoPanel() {
  const { setArtifactId } = useOverHUD();
  const [nodes, setNodes] = useState<RepoNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<RepoNode | null>(null);

  useEffect(() => {
    repoService.getTree().then(tree => {
      setNodes(tree);
      setLoading(false);
    });
  }, []);

  const handleNodeSelect = (node: RepoNode) => {
    setSelectedNode(node);
    // If it's a file, we could sync it with the Lari viewer by mapping the artifact ID.
    // We treat id as artifactId for the legacy Lari Viewer hooks.
    if (node.node_kind === 'file') {
      setArtifactId(node.id, 'image'); // Defaulting type to image for legacy viewer support
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 overflow-hidden">
      
      {/* Search and Control Strip */}
      <div className="flex-shrink-0 flex items-center bg-black/60 border-b border-white/5 px-4 h-12">
        <div className="flex items-center flex-1 bg-white/5 rounded pl-3 pr-2 py-1.5 border border-white/5 focus-within:border-primary/50 transition-colors">
          <Search size={14} className="text-muted-foreground mr-2 shrink-0" />
          <input 
            placeholder="SEARCH REBEL REPOSITORY..." 
            className="bg-transparent border-none outline-none text-[11px] font-mono tracking-tight w-full text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
        
        {/* Governance Indicator */}
        <div className="ml-4 flex items-center gap-2 border-l border-white/10 pl-4">
           <Shield size={14} className="text-primary/70" />
           <span className="text-[9px] font-mono font-bold tracking-widest text-primary/70 uppercase">OCIT Mock Active</span>
        </div>
      </div>

      {/* Explorer Split */}
      <div className="flex flex-1 min-h-0">
        
        {/* Left: Hierarchical Tree Region */}
        <div className="flex-1 flex flex-col h-full bg-black/10">
          <div className="h-8 border-b border-white/5 flex items-center px-4 bg-white/[0.02]">
            <span className="text-[9px] font-mono font-bold tracking-widest text-muted-foreground uppercase opacity-80">
              OVERSCITE Operational Domain Tree
            </span>
          </div>
          
          <div className="flex-1 overflow-hidden relative p-2">
            {loading ? (
              <div className="flex h-full items-center justify-center text-[11px] font-mono text-muted-foreground animate-pulse">
                INITIALIZING CANONICAL REBEL BOUNDARIES...
              </div>
            ) : nodes.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[10px] font-mono text-muted-foreground italic">
                NO REPOSITORY ROOTS DETECTED
              </div>
            ) : (
              <RepoTree 
                nodes={nodes} 
                onNodeSelect={handleNodeSelect} 
              />
            )}
          </div>
        </div>

        {/* Right: Selected Node Detail Region */}
        <RepoDetailPane node={selectedNode} />
        
      </div>
    </div>
  );
}
