// src/components/overhud/lari-repo/LariRepoPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { repoService } from '@/lib/lari-repo/repo-service';
import { RepoFile } from '@/lib/lari-repo/types';
import { Search, Filter, FileText, Image as ImageIcon, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LariRepoPanel() {
  const { setArtifactId, currentArtifactId } = useOverHUD();
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    repoService.listFiles({}).then(data => {
      setFiles(data);
      setLoading(false);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={14} />;
      case 'pdf': return <FileText size={14} />;
      case 'structured_json': return <FileJson size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex-shrink-0 flex items-center bg-black/40 border border-white/10 rounded-md px-3 py-2">
        <Search size={14} className="text-muted-foreground mr-2" />
        <input 
          placeholder="SEARCH REPO..." 
          className="bg-transparent border-none outline-none text-[10px] font-mono w-full text-foreground placeholder:text-muted-foreground/50"
        />
        <Filter size={14} className="text-muted-foreground ml-2" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="text-[10px] font-mono text-muted-foreground animate-pulse">LOADING LARI-REPO...</div>
        ) : files.length === 0 ? (
          <div className="text-[10px] font-mono text-muted-foreground italic">NO ARTIFACTS FILED</div>
        ) : (
          files.map(file => (
            <button
              key={file.id}
              onClick={() => setArtifactId(file.id, file.type)}
              className={cn(
                "w-full text-left p-2 rounded-sm border border-transparent transition-all hover:bg-white/5 group",
                currentArtifactId === file.id ? "bg-primary/10 border-primary/30" : "bg-black/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("text-muted-foreground group-hover:text-primary", currentArtifactId === file.id && "text-primary")}>
                    {getIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono truncate text-foreground">{file.name}</div>
                  <div className="text-[9px] font-mono text-muted-foreground flex gap-2">
                    <span>{file.jobId}</span>
                    <span className="opacity-30">|</span>
                    <span className="uppercase">{file.reviewStatus}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
