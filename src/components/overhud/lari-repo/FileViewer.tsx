// src/components/overhud/lari-repo/FileViewer.tsx
'use client';

import React from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Info, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FileViewer() {
  const { currentArtifactId, currentArtifactType } = useOverHUD();
  const [isSealed, setIsSealed] = React.useState(false);

  React.useEffect(() => {
    if (currentArtifactId) {
        import('@/lib/lari-repo/repo-service').then(({ repoService }) => {
            repoService.getFile(currentArtifactId).then(f => {
                setIsSealed(f?.metadata?.isSealed === true);
            });
        });
    }
  }, [currentArtifactId]);

  if (!currentArtifactId) {
    return (
      <div className="flex items-center justify-center h-full text-[10px] font-mono text-muted-foreground uppercase tracking-widest p-12 text-center">
        NO ARTIFACT SELECTED FROM REPO
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/60">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border/20 bg-black/40">
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-primary uppercase">{currentArtifactType} VIEWER</span>
            <span className="text-[9px] font-mono text-muted-foreground">{currentArtifactId}</span>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-white/10 rounded text-muted-foreground"><ZoomIn size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-muted-foreground"><ZoomOut size={14} /></button>
            <button className="p-1 hover:bg-white/10 rounded text-muted-foreground"><RotateCcw size={14} /></button>
            <div className="w-[1px] h-4 bg-border/20 mx-1"></div>
            <button className="p-1 hover:bg-white/10 rounded text-muted-foreground"><Maximize2 size={14} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-auto flex items-center justify-center p-4">
        {currentArtifactType === 'image' && (
            <div className="relative border border-primary/20 shadow-2xl max-w-full max-h-full">
                {/* Placeholder for actual image rendering */}
                <div className="w-[512px] h-[300px] bg-muted/20 flex flex-col items-center justify-center gap-4">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">IMAGE RENDERING ACTIVE</div>
                    <div className="text-[8px] font-mono text-primary/40 text-center px-8">
                        LARI LAYERS LOADED // GEOMETRY SYNC PENDING
                    </div>
                </div>
            </div>
        )}

        {currentArtifactType === 'pdf' && (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                <div className="text-[10px] font-mono text-muted-foreground">PDF ENGINE INITIALIZING...</div>
            </div>
        )}

        {currentArtifactType === 'structured_json' && (
            <div className="w-full h-full p-4 font-mono text-[10px] overflow-auto">
                <pre className="text-primary/70">
                    {`{\n  "status": "LOADED",\n  "artifact": "${currentArtifactId}",\n  "type": "REPORT_OBJECT"\n}`}
                </pre>
            </div>
        )}
      </div>

      {/* Metadata Panel */}
      <div className="p-3 border-t border-border/20 bg-black/40">
        <div className="flex items-start gap-3">
            <Info size={12} className="text-primary mt-0.5" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 flex-1">
                <div>
                    <div className="text-[8px] text-muted-foreground uppercase">ID</div>
                    <div className="text-[9px] font-mono truncate">{currentArtifactId}</div>
                </div>
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] font-bold text-foreground">v{currentArtifactId ? '1.2.0' : '--'}</div>
                            <div className="flex gap-1">
                                <span className={cn(
                                    "text-[8px] font-mono px-1 rounded border uppercase",
                                    isSealed ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border/20"
                                )}>
                                    {isSealed ? 'SEAL_VERIFIED' : 'TRUTH_OPEN'}
                                </span>
                                <span className="text-[8px] font-mono px-1 rounded bg-primary/10 text-primary border border-primary/20 uppercase">
                                    MODE: STANDARD
                                </span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-border/20" />
                        <button className="p-2 hover:bg-white/5 rounded transition-colors text-muted-foreground hover:text-primary">
                            <Info size={18} />
                        </button>
                    </div>
                </div>
                <div className="mt-1 col-span-2">
                    <div className="text-[8px] text-muted-foreground uppercase">GOVERNANCE LINEAGE</div>
                    <div className="text-[9px] font-mono text-muted-foreground italic flex items-center gap-1">
                        <ShieldCheck size={10} className="text-green-500/50" /> 
                        TRUTH GATE ACTIVE // NO CORRECTIONS DETECTED
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
