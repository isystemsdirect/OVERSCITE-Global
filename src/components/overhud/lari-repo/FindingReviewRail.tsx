// src/components/overhud/lari-repo/FindingReviewRail.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { findingReviewService } from '@/lib/lari-repo/finding-review-service';
import { FindingOverlay, ReviewStatus } from '@/lib/lari-repo/types';
import FindingReviewCard from './FindingReviewCard';
import { Filter } from 'lucide-react';

export default function FindingReviewRail() {
  const { currentArtifactId, currentFindingId, setFindingId } = useOverHUD();
  const [findings, setFindings] = useState<FindingOverlay[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | 'all'>('all');

  useEffect(() => {
    if (currentArtifactId) {
      findingReviewService.getOverlaysForFile(currentArtifactId).then(setFindings);
    }
  }, [currentArtifactId]);

  const filteredFindings = findings.filter(f => filter === 'all' || f.review.status === filter);

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-3 border-b border-border/20 flex justify-between items-center bg-black/40">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">FINDINGS: {filteredFindings.length}</span>
        <div className="flex gap-2">
            {['pending', 'accepted', 'rejected', 'corrected'].map(status => (
                <button 
                    key={status}
                    onClick={() => setFilter(status as any)}
                    className={`w-2 h-2 rounded-full ${filter === status ? 'bg-primary' : 'bg-white/10'}`}
                    title={status.toUpperCase()}
                />
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredFindings.map((finding) => (
          <FindingReviewCard
            key={finding.id}
            finding={finding}
            isSelected={currentFindingId === finding.id}
            onSelect={() => setFindingId(finding.id)}
          />
        ))}
      </div>
    </div>
  );
}
