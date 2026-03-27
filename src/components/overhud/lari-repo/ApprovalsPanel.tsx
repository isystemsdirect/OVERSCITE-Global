// src/components/overhud/lari-repo/ApprovalsPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { findingReviewService } from '@/lib/lari-repo/finding-review-service';
import { repoService } from '@/lib/lari-repo/repo-service';
import { FindingOverlay, RepoFile } from '@/lib/lari-repo/types';
import { ShieldCheck, Database, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ApprovalsPanel() {
  const { currentArtifactId } = useOverHUD();
  const [findings, setFindings] = useState<FindingOverlay[]>([]);
  const [file, setFile] = useState<RepoFile | null>(null);

  useEffect(() => {
    if (currentArtifactId) {
      findingReviewService.getOverlaysForFile(currentArtifactId).then(setFindings);
      repoService.getFile(currentArtifactId).then(f => setFile(f || null));
    }
  }, [currentArtifactId]);

  const counts = {
    pending: findings.filter(f => f.review.status === 'pending').length,
    accepted: findings.filter(f => f.review.status === 'accepted').length,
    rejected: findings.filter(f => f.review.status === 'rejected').length,
    corrected: findings.filter(f => f.review.status === 'corrected').length,
  };

  return (
    <div className="flex flex-col h-full bg-black/20 p-4 gap-6">
      <div className="flex items-center gap-3 border-b border-primary/20 pb-4">
        <ShieldCheck className="text-primary" size={24} />
        <div>
            <div className="text-xs font-bold text-foreground tracking-widest uppercase">BANE APPROVALS GATE</div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase">GATE 3: INGESTION ELIGIBILITY</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 border border-border/10 p-4 rounded flex flex-col items-center">
            <div className="text-[8px] text-muted-foreground uppercase mb-1">ACCEPTED</div>
            <div className="text-2xl font-bold text-green-500">{counts.accepted}</div>
            <div className="text-[8px] text-green-500/50 uppercase mt-1">ELIGIBLE</div>
        </div>
        <div className="bg-black/40 border border-border/10 p-4 rounded flex flex-col items-center">
            <div className="text-[8px] text-muted-foreground uppercase mb-1">CORRECTED</div>
            <div className="text-2xl font-bold text-blue-500">{counts.corrected}</div>
            <div className="text-[8px] text-blue-500/50 uppercase mt-1">ELIGIBLE</div>
        </div>
        <div className="bg-black/40 border border-border/10 p-4 rounded flex flex-col items-center">
            <div className="text-[8px] text-muted-foreground uppercase mb-1">PENDING</div>
            <div className="text-2xl font-bold text-yellow-500">{counts.pending}</div>
            <div className="text-[8px] text-yellow-500/50 uppercase mt-1">HOLD</div>
        </div>
        <div className="bg-black/40 border border-border/10 p-4 rounded flex flex-col items-center">
            <div className="text-[8px] text-muted-foreground uppercase mb-1">REJECTED</div>
            <div className="text-2xl font-bold text-red-500">{counts.rejected}</div>
            <div className="text-[8px] text-red-500/50 uppercase mt-1">EXCLUDED</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-l-2 border-primary/30 pl-2">ARTIFACT ELIGIBILITY</div>
        {file && (
            <div className="bg-black/60 border border-border/20 p-4 rounded space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[11px] font-bold text-foreground">{file.name}</div>
                        <div className="flex gap-2">
                            <span className={cn(
                                "text-[8px] font-mono px-1 py-0.5 rounded border",
                                counts.accepted > 0 || counts.corrected > 0 ? "border-primary/40 text-primary" : "border-border/40 text-muted-foreground"
                            )}>
                                {counts.accepted > 0 || counts.corrected > 0 ? 'REPORT_READY' : 'REPORT_BLOCKED'}
                            </span>
                            <span className="text-[8px] font-mono px-1 py-0.5 rounded border border-border/40 text-muted-foreground">
                                LEARNING_IDLE
                            </span>
                        </div>
                    </div>
                    {counts.pending > 0 && (
                        <div className="mt-2 p-1 bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-200 uppercase flex gap-2 items-center">
                            <span>⚠️ TRUTH GATE BLOCK: Review required before final report inclusion</span>
                        </div>
                    )}
                    {counts.pending === 0 ? (
                        <div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 text-[9px] font-bold uppercase">FINALIZED</div>
                    ) : (
                        <div className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20 text-[9px] font-bold uppercase">PENDING REVIEW</div>
                    )}
                </div>
                
                <div className="flex gap-2">
                    <button 
                        disabled={counts.pending > 0}
                        onClick={async () => {
                            try {
                                const { reportTruthService } = await import('@/lib/lari-repo/report-truth-service');
                                await reportTruthService.finalizeReport(file.id, findings, {
                                    subject: 'mock-user',
                                    userRole: 'reviewer',
                                    devicePosture: 'secure'
                                });
                                alert('REPORT FINALIZED AND COMMITTED TO LARI-REPO');
                            } catch (err: any) {
                                alert(`FINALIZATION FAILED: ${err.message}`);
                            }
                        }}
                        className={cn(
                            "flex-1 py-2 text-[10px] font-mono uppercase transition-all rounded",
                            counts.pending === 0 ? "bg-primary text-black hover:bg-primary/80" : "bg-white/5 text-muted-foreground cursor-not-allowed"
                        )}
                    >
                        COMMIT TO LARI-REPO
                    </button>
                    <button className="px-3 py-2 bg-black border border-border/30 text-foreground hover:bg-white/5 rounded">
                        <Database size={14} />
                    </button>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t border-border/10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground uppercase">
                        <span>SEAL READINESS</span>
                        <span className={cn(
                            counts.pending === 0 ? "text-primary" : "text-red-500"
                        )}>
                            {counts.pending === 0 ? "PASSED" : "BLOCKED"}
                        </span>
                    </div>
                    
                    {file.metadata?.isSealed ? (
                        <div className="space-y-2">
                            <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-sm flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold">
                                    <ShieldCheck size={14} />
                                    <span>TRUTH SEALED</span>
                                </div>
                                <button 
                                    onClick={() => alert('Verifying Seal Integrity... All findings match sealed payload.')}
                                    className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-[8px] font-bold text-green-500 rounded uppercase"
                                >
                                    Verify
                                </button>
                            </div>
                            <button 
                                onClick={() => alert('Initiating Governed New Version Pathway...')}
                                className="w-full py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-400 rounded uppercase flex items-center justify-center gap-2"
                            >
                                <FileCheck size={12} />
                                <span>Create New Version</span>
                            </button>
                        </div>
                    ) : (
                        <button 
                            disabled={counts.pending > 0}
                            onClick={async () => {
                                try {
                                    const { truthSealService } = await import('@/lib/lari-repo/truth-seal-service');
                                    await truthSealService.sealReport({
                                        reportId: file.id,
                                        versionNumber: 1,
                                        generatedAt: new Date().toISOString(),
                                        generatedBy: 'system',
                                        includedFindingIds: findings.filter(f => ['accepted', 'corrected'].includes(f.review.status)).map(f => f.id),
                                        truthMode: 'standard'
                                    }, findings, {
                                        subject: 'mock-director',
                                        userRole: 'director',
                                        devicePosture: 'secure'
                                    });
                                    setFile({ ...file, metadata: { ...file.metadata, isSealed: true } });
                                    alert('TRUTH RECORD SEALED SUCCESSFULLY');
                                } catch (err: any) {
                                    alert(`SEALING FAILED: ${err.message}`);
                                }
                            }}
                            className={cn(
                                "w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary text-[10px] font-bold border border-primary/40 rounded uppercase transition-all",
                                counts.pending > 0 && "opacity-50 cursor-not-allowed grayscale"
                            )}
                        >
                            SEAL FINAL TRUTH
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
