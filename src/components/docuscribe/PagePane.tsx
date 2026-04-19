/**
 * DocuSCRIBE™ — Page Pane
 * 
 * Represents a discrete physical page (Letter default) in the document.
 * Enforces fixed dimensions and aspect ratio.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TruthStateDisclosureFooter } from './TruthStateDisclosureFooter';

interface PagePaneProps {
  children: React.ReactNode;
  isVerified: boolean;
  pageNumber: number;
  totalPages: number;
}

export function PagePane({ children, isVerified, pageNumber, totalPages }: PagePaneProps) {
  return (
    <div 
      className={cn(
        "relative mx-auto bg-[#0a0a0f] border border-white/5 shadow-2xl",
        "w-[816px] aspect-[8.5/11]", // Letter size at 96 DPI
        "mb-12 transition-all duration-500",
        "flex flex-col overflow-hidden"
      )}
      data-page={pageNumber}
    >
      {/* ─── Content Area ─── */}
      <div className="flex-1 p-[1in] overflow-hidden text-white/90">
        {children}
      </div>

      {/* ─── Page Footer ─── */}
      <div className="shrink-0 px-[1in] py-6 flex flex-col gap-2">
        <TruthStateDisclosureFooter isVerified={isVerified} />
        
        {/* Page counter */}
        <div className="flex justify-center mt-2">
          <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      </div>

      {/* ─── Edge Definition Line ─── */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-30" />
    </div>
  );
}
