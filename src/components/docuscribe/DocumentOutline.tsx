/**
 * DocuSCRIBE™ — Document Outline
 * 
 * Dynamically extracts H-tags from the document pages to build a 
 * navigable table of contents Rail.
 */

'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Hash, ChevronRight } from 'lucide-react';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';

interface OutlineItem {
  id: string;
  text: string;
  level: number;
  pageIndex: number;
}

interface DocumentOutlineProps {
  document: DocuScribeDocument;
  onNavigate: (pageIndex: number, elementId: string) => void;
}

export function DocumentOutline({ document, onNavigate }: DocumentOutlineProps) {
  const outline = useMemo(() => {
    const items: OutlineItem[] = [];
    
    document.pages.forEach((page, pageIdx) => {
      // Simple regex parser for H tags in HTML content
      const regex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
      let match;
      
      while ((match = regex.exec(page.content)) !== null) {
        const level = parseInt(match[1]);
        const text = match[2].replace(/<[^>]*>/g, ''); // Strip inner tags
        items.push({
          id: `h-${pageIdx}-${items.length}`,
          text,
          level,
          pageIndex: pageIdx
        });
      }
    });
    
    return items;
  }, [document.pages]);

  if (outline.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full text-white/10 text-center">
        <Hash className="w-8 h-8 mb-2 opacity-5" />
        <span className="text-[10px] uppercase tracking-widest font-black">No Structure Detected</span>
        <p className="text-[9px] mt-2 leading-relaxed opacity-40">Add headings (H1–H6) to build an outline.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black/20">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
          <Hash className="w-3 h-3 text-primary" />
          Document Outline
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {outline.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.pageIndex, item.id)}
            className={cn(
              "w-full text-left p-2 rounded-lg transition-all duration-200 group flex items-start gap-2",
              "hover:bg-white/5",
              item.level === 1 ? "mt-4 first:mt-0" : ""
            )}
            style={{ paddingLeft: `${(item.level - 1) * 0.75 + 0.5}rem` }}
          >
            <ChevronRight className="w-2.5 h-2.5 mt-1 text-white/10 group-hover:text-primary transition-colors" />
            <span className={cn(
              "text-[11px] leading-tight transition-colors",
              item.level === 1 ? "font-black text-white/80 uppercase tracking-wider" : 
              item.level === 2 ? "font-bold text-white/60" : "font-medium text-white/40"
            )}>
              {item.text}
            </span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/10">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
          <span>Sections: {outline.length}</span>
          <span>Depth: H{Math.max(...outline.map(o => o.level))}</span>
        </div>
      </div>
    </div>
  );
}
