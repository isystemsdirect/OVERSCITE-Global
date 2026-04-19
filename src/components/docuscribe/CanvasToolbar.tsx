/**
 * DocuSCRIBE™ — Canvas Toolbar
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Action bar above the document canvas.
 * Houses tools for Formula injection, Element Library access, and Export.
 */

'use client';

import React from 'react';
import { Sigma, Hexagon, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { canEdit } from '@/lib/docuscribe/types';

interface CanvasToolbarProps {
  document: DocuScribeDocument;
  onOpenFormulas: () => void;
  onOpenElements: () => void;
  onOpenExport: () => void;
}

export function CanvasToolbar({ document, onOpenFormulas, onOpenElements, onOpenExport }: CanvasToolbarProps) {
  const editable = canEdit(document.authority_class);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.01]">
      <div className="flex gap-2">
        {/* Editor Tools (Only shown if document is editable) */}
        {editable ? (
          <>
            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 text-white/50 hover:text-primary transition-colors border border-transparent hover:border-white/10"
              title="Insert Formula"
            >
              <Sigma className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Formulas</span>
            </button>
            <button
              onClick={onOpenElements}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 text-white/50 hover:text-indigo-400 transition-colors border border-transparent hover:border-white/10"
              title="Insert Element Data"
            >
              <Hexagon className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Elements</span>
            </button>
          </>
        ) : (
          <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold py-1.5">
            Read Only Canvas
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {/* Document Action Tools (Always accessible) */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/5 text-white/50 hover:text-white transition-colors border border-transparent hover:border-white/10"
          title="Export Document"
        >
          <FileDown className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
