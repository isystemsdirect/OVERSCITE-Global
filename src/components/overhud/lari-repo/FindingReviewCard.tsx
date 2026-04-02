// src/components/overhud/lari-repo/FindingReviewCard.tsx
'use client';

import React from 'react';
import { FindingOverlay, ReviewStatus } from '@/lib/lari-repo/types';
import { cn } from '@/lib/utils';
import { Check, X, Edit3, MessageSquare, AlertCircle } from 'lucide-react';
import { findingReviewService } from '@/lib/lari-repo/finding-review-service';
import { useAuthStore } from '@/lib/auth/auth-service';
import GlobalDisclosure from '@/components/reporting/GlobalDisclosure';

interface FindingReviewCardProps {
  finding: FindingOverlay;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FindingReviewCard({ finding, isSelected, onSelect }: FindingReviewCardProps) {
  const [reportIsSealed, setReportIsSealed] = React.useState(false);

  React.useEffect(() => {
    import('@/lib/lari-repo/repo-service').then(({ repoService }) => {
        repoService.getFile(finding.sourceFileId).then(f => {
            setReportIsSealed(f?.metadata?.isSealed === true);
        });
    });
  }, [finding.sourceFileId]);

  const handleAction = async (status: ReviewStatus) => {
    if (reportIsSealed) {
        alert('READ-ONLY: Mutation blocked for sealed report truth.');
        return;
    }
    await findingReviewService.updateFindingStatus(finding.id, status, 'system-user');
    // In a real app, we'd trigger a re-fetch or use state management
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div 
        onClick={onSelect}
        className={cn(
            "p-3 border transition-all cursor-pointer group",
            isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border/20 bg-black/40 hover:border-border/50"
        )}
    >
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-muted-foreground">FINDING #{finding.findingNumber}</span>
            <div className="flex items-center gap-2">
                <span className={cn("text-[9px] font-bold font-mono uppercase", getSeverityColor(finding.severity))}>
                    {finding.severity}
                </span>
                {reportIsSealed && (
                    <span className="text-[8px] font-mono px-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded uppercase">SEALED</span>
                )}
            </div>
        </div>

        <div className="flex gap-1 mb-2">
            <div className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 rounded-sm border uppercase",
                finding.review.status === 'accepted' || finding.review.status === 'corrected' 
                    ? "border-primary/40 text-primary bg-primary/5" 
                    : "border-muted-foreground/40 text-muted-foreground bg-transparent"
            )}>
                {finding.review.status === 'accepted' || finding.review.status === 'corrected' ? 'REPORT ELIGIBLE' : 'REPORT EXCLUDED'}
            </div>
            <div className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 rounded-sm border uppercase",
                finding.review.status === 'pending' ? "border-amber-500/40 text-amber-500 bg-amber-500/5" : "hidden"
            )}>
                UNREVIEWED
            </div>
            <div className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 rounded-sm border uppercase",
                finding.review.reportEligibility === 'ineligible' && finding.review.status === 'corrected' 
                    ? "border-orange-500/40 text-orange-500 bg-orange-500/5"
                    : "hidden"
            )}>
                ESCALATED
            </div>
        </div>

        <div className="text-[11px] font-bold text-foreground mb-2">{finding.title}</div>
        
        {/* Layer 1: Deterministic Capture */}
        <div className="space-y-1 mb-2">
            <span className="text-[8px] font-mono font-bold uppercase text-primary/80 block">LAYER 1: OBSERVED [DETERMINISTIC]</span>
            <p className="text-[10px] text-foreground leading-relaxed">
                {finding.observedCondition || "No deterministic observation recorded."}
            </p>
        </div>

        {/* Layer 2: Probabilistic Identification */}
        <div className="space-y-1 mb-2 bg-white/5 p-1.5 rounded-sm border border-white/5">
            <span className="text-[8px] font-mono font-bold uppercase text-amber-500/80 block">LAYER 2: IDENTIFIED AS [PROBABILISTIC]</span>
            <p className="text-[10px] text-amber-100/90 italic leading-relaxed">
                {finding.systemIdentification || `Possible ${finding.category} formation detected based on visual pattern recognition.`}
            </p>
        </div>

        {/* Layer 3: Human Authority */}
        <div className="space-y-1 mb-3">
            <span className="text-[8px] font-mono font-bold uppercase text-muted-foreground block">LAYER 3: ASSESSMENT [HUMAN AUTHORITY]</span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
                {finding.recommendation || "Final determination is reserved for human evaluation."}
            </p>
        </div>

        <div className="flex gap-1">
            <button 
                disabled={reportIsSealed}
                onClick={(e) => { e.stopPropagation(); handleAction('accepted'); }}
                className={cn(
                    "flex-1 bg-green-500/80 hover:bg-green-500 text-black p-1 transition-colors flex justify-center",
                    reportIsSealed && "opacity-50 cursor-not-allowed"
                )}
            >
                <Check size={12} />
            </button>
            <button 
                disabled={reportIsSealed}
                onClick={(e) => { e.stopPropagation(); handleAction('rejected'); }}
                className={cn(
                    "flex-1 bg-red-500/80 hover:bg-red-500 text-black p-1 transition-colors flex justify-center",
                    reportIsSealed && "opacity-50 cursor-not-allowed"
                )}
            >
                <X size={12} />
            </button>
            <button 
                disabled={reportIsSealed}
                onClick={(e) => { e.stopPropagation(); handleAction('corrected'); }}
                className={cn(
                    "flex-1 bg-blue-500/80 hover:bg-blue-500 text-black p-1 transition-colors flex justify-center",
                    reportIsSealed && "opacity-50 cursor-not-allowed"
                )}
            >
                <Edit3 size={12} />
            </button>
            <button 
                className="flex-1 bg-white/10 hover:bg-white/20 text-foreground p-1 transition-colors flex justify-center"
            >
                <MessageSquare size={12} />
            </button>
        </div>

        {finding.review.status === 'corrected' && (
            <div className="mt-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-sm">
                <div className="text-[8px] font-mono text-blue-400 uppercase mb-1">CORRECTION LINEAGE / DELTA</div>
                <div className="text-[10px] text-foreground/70 italic">"{finding.review.correctionText || 'Manual audit correction'}"</div>
            </div>
        )}

        {finding.review.status !== 'pending' && (
            <div className="mt-2 pt-2 border-t border-border/10 flex items-center justify-between text-[9px] font-mono uppercase text-muted-foreground">
                <span>Status: <span className="text-primary">{finding.review.status}</span></span>
                <span>{finding.review.reviewedBy}</span>
            </div>
        )}

        {/* Global Disclosure Surface (Enforces reporting doctrine) */}
        {isSelected && (
            <div className="mt-4 pt-4 border-t border-border/10">
                <GlobalDisclosure 
                    isUnverified={useAuthStore.getState().user?.professionalCredentialStatus === 'unverified'} 
                    className="border-none bg-black/0 p-0" 
                />
            </div>
        )}
    </div>
  );
}
