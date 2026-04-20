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

import { useDocuScribe } from '@/lib/docuscribe/context';
import { SectionTruthState, type DocuScribeDocument } from '@/lib/docuscribe/types';

interface PagePaneProps {
  children: React.ReactNode;
  document: DocuScribeDocument;
  pageNumber: number;
  totalPages: number;
  onHeaderChange?: (payload: { header?: string; status?: SectionTruthState }) => void;
  onFooterChange?: (payload: { footer?: string; status?: SectionTruthState }) => void;
  readOnly?: boolean;
}

export function PagePane({ 
  children, 
  document, 
  pageNumber, 
  totalPages,
  onHeaderChange,
  onFooterChange,
  readOnly 
}: PagePaneProps) {
  const { is_verified, formatting, pages } = document;
  const { margins } = formatting;
  const currentPage = pages[pageNumber - 1];

  // Governance Enforcement: If page is locked or reviewed, treat as readOnly
  const isLocked = currentPage?.status === 'locked' || currentPage?.status === 'reviewed';
  const effectiveReadOnly = readOnly || isLocked;

  return (
    <div 
      className={cn(
        "relative mx-auto bg-[#fafafa] border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
        "w-[816px] aspect-[8.5/11]", // Letter size at 96 DPI
        "mb-12 transition-all duration-500",
        "flex flex-col overflow-hidden",
        isLocked && !readOnly && "ring-1 ring-primary/20"
      )}
      data-page={pageNumber}
    >
      {/* ─── Governance Overlay (Locked) ─── */}
      {isLocked && !readOnly && (
        <div className="absolute top-2 right-4 z-10 flex items-center gap-2">
           <div className="bg-primary/10 backdrop-blur-md border border-primary/20 px-2 py-0.5 rounded flex items-center gap-1.5 shadow-sm">
             <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
             <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Governed Section</span>
           </div>
        </div>
      )}

      {/* ─── Page Header Slot ─── */}
      <div 
        className={cn(
          "shrink-0 px-[1in] pt-6 text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] outline-none",
          effectiveReadOnly ? "cursor-default" : "cursor-text"
        )}
        contentEditable={!effectiveReadOnly}
        onBlur={(e) => onHeaderChange?.({ header: e.currentTarget.innerHTML })}
        dangerouslySetInnerHTML={{ __html: currentPage?.header_override || formatting.defaultHeader || 'Header Region' }}
      />

      {/* ─── Content Area ─── */}
      <div 
        className="flex-1 overflow-hidden text-[#1a1a1a]"
        style={{
          paddingTop: `${margins.top * 0.5}in`, // Offset for header
          paddingBottom: `${margins.bottom * 0.5}in`, // Offset for footer
          paddingLeft: `${margins.left}in`,
          paddingRight: `${margins.right}in`,
        }}
      >
        {children}
      </div>

      {/* ─── Page Footer ─── */}
      <div className="shrink-0 px-[1in] pb-8 flex flex-col gap-2">
        <div 
          className={cn(
            "text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] mb-4 outline-none border-t border-black/5 pt-4",
            effectiveReadOnly ? "cursor-default" : "cursor-text"
          )}
          contentEditable={!effectiveReadOnly}
          onBlur={(e) => onFooterChange?.({ footer: e.currentTarget.innerHTML })}
          dangerouslySetInnerHTML={{ __html: currentPage?.footer_override || formatting.defaultFooter || 'Footer Region' }}
        />
        
        <TruthStateDisclosureFooter isVerified={is_verified} />
        
        {/* Page counter */}
        <div className="flex justify-center mt-2">
          <span className="text-[10px] font-mono text-black/20 uppercase tracking-widest">
            Page {pageNumber} of {totalPages}
          </span>
        </div>
      </div>

      {/* ─── Edge Definition Line ─── */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-30" />
    </div>
  );
}
