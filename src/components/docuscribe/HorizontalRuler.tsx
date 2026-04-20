/**
 * DocuSCRIBE™ — Horizontal Ruler
 * 
 * Provides spatial context and interactive margin control for the
 * document authoring surface. 
 * Scale: 1 inch = 96 pixels (8.5" = 816px)
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDocuScribe } from '@/lib/docuscribe/context';

export function HorizontalRuler() {
  const { activeDocument, updateFormatting } = useDocuScribe();
  const rulerRef = useRef<HTMLDivElement>(null);
  
  if (!activeDocument) return null;

  const margins = activeDocument.formatting.margins;
  
  // 1 inch = 96px
  const INCH_PX = 96;
  const TOTAL_WIDTH = 816; // 8.5 inches
  
  const handleMarginChange = (type: 'left' | 'right', e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    
    const startX = e.clientX;
    const startMargin = type === 'left' ? margins.left : margins.right;
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaPx = moveEvent.clientX - startX;
      const deltaInches = deltaPx / INCH_PX;
      let newMargin = startMargin + (type === 'left' ? deltaInches : -deltaInches);
      
      // Constraints: Min 0.25", Max halfway
      newMargin = Math.max(0.25, Math.min(newMargin, 4));
      
      updateFormatting({
        margins: {
          ...margins,
          [type]: parseFloat(newMargin.toFixed(2))
        }
      });
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="max-w-[816px] w-full h-8 bg-black/40 backdrop-blur-md border-b border-white/5 z-20 flex justify-center select-none overflow-hidden group">
      <div 
        ref={rulerRef}
        className="relative h-full bg-zinc-900/50" 
        style={{ width: `${TOTAL_WIDTH}px` }}
      >
        {/* ─── Metric Markers ─── */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${i * INCH_PX}px` }}
          >
            <div className="w-px h-3 bg-white/20" />
            <span className="text-[9px] text-white/40 mt-1 font-mono">
              {i}
            </span>
            
            {/* 1/2 inch marker */}
            {i < 8 && (
              <div 
                className="absolute top-0 w-px h-1.5 bg-white/10"
                style={{ left: `${INCH_PX / 2}px` }}
              />
            )}
            
            {/* 1/4 inch markers */}
            {i < 8 && (
              <>
                <div 
                  className="absolute top-0 w-px h-1 bg-white/5"
                  style={{ left: `${INCH_PX / 4}px` }}
                />
                <div 
                  className="absolute top-0 w-px h-1 bg-white/5"
                  style={{ left: `${(INCH_PX * 3) / 4}px` }}
                />
              </>
            )}
          </div>
        ))}

        {/* ─── Margin Indicators ─── */}
        
        {/* Left Margin Handle */}
        <div 
          className="absolute top-0 bottom-0 bg-primary/5 border-r border-primary/40 group/m1 cursor-col-resize transition-colors hover:bg-primary/10"
          style={{ width: `${margins.left * INCH_PX}px`, left: 0 }}
          onMouseDown={(e) => handleMarginChange('left', e)}
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 flex items-center justify-center opacity-0 group-hover/m1:opacity-100">
            <div className="w-0.5 h-4 bg-primary/60 rounded-full" />
          </div>
        </div>

        {/* Right Margin Handle */}
        <div 
          className="absolute top-0 bottom-0 bg-primary/5 border-l border-primary/40 group/m2 cursor-col-resize right-0 transition-colors hover:bg-primary/10"
          style={{ width: `${margins.right * INCH_PX}px` }}
          onMouseDown={(e) => handleMarginChange('right', e)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 flex items-center justify-center opacity-0 group-hover/m2:opacity-100">
            <div className="w-0.5 h-4 bg-primary/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
