// src/components/overhud/lari-repo/ImageFindingOverlay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useOverHUD } from '../context/OverHUDContextProvider';
import { findingReviewService } from '@/lib/lari-repo/finding-review-service';
import { FindingOverlay } from '@/lib/lari-repo/types';
import { cn } from '@/lib/utils';

export default function ImageFindingOverlay() {
  const { currentArtifactId, setFindingId, currentFindingId, currentOverlayVisible } = useOverHUD();
  const [overlays, setOverlays] = useState<FindingOverlay[]>([]);

  useEffect(() => {
    if (currentArtifactId) {
      findingReviewService.getOverlaysForFile(currentArtifactId).then(setOverlays);
    }
  }, [currentArtifactId]);

  if (!currentArtifactId) return null;
  if (!currentOverlayVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {overlays.map((overlay) => {
        const isSelected = currentFindingId === overlay.id;
        const color = overlay.review.status === 'rejected' ? 'text-red-500' : 'text-primary';
        
        return (
          <div
            key={overlay.id}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{
              left: `${overlay.geometry.x}%`,
              top: `${overlay.geometry.y}%`,
              width: `${overlay.geometry.width}%`,
              height: `${overlay.geometry.height}%`,
            }}
            onClick={() => setFindingId(overlay.id)}
          >
            {/* Outline */}
            <div className={cn(
              "absolute inset-0 border-2 transition-all duration-300",
              isSelected ? "border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" : "border-primary/40 group-hover:border-primary/70"
            )} />

            {/* Tag */}
            <div 
                className={cn(
                    "absolute -top-6 left-0 px-1.5 py-0.5 text-[9px] font-bold font-mono border transition-all",
                    isSelected ? "bg-primary text-black border-primary" : "bg-black/80 text-primary border-primary/40"
                )}
            >
                #{overlay.findingNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}
