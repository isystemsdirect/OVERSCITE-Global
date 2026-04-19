/**
 * DocuSCRIBE™ — Document Canvas
 *
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P1_FOUNDATION
 *
 * Central editing/viewing surface. Enforces authority class restrictions:
 * - draft_editable: full edit
 * - partial_edit: editable with locked-region visual indicator
 * - immutable_view_only: read-only display
 * - protected_log_view_only: read-only, never editable
 * - finalized_fork_only: read-only (placeholder — fork creates new draft)
 *
 * Design: Crisp text, high contrast, no glass/blur overlays on canvas.
 */

'use client';

import React, { useRef } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { canEdit } from '@/lib/docuscribe/types';
import { AuthoringToolbar } from './AuthoringToolbar';
import { PageRenderer } from './PageRenderer';

export function DocumentCanvas({ 
  document, 
  onContentChange,
  onOpenFormulas,
  onOpenElements,
  onOpenExport
}: DocumentCanvasProps) {
  const editable = canEdit(document.authority_class);

  // Execute rich text commands
  const handleCommand = (command: string, value?: string) => {
    if (!editable) return;
    document.execCommand(command, false, value);
    // Note: Modern browsers support document.execCommand for basic actions, 
    // even though it's deprecated. For a production SCINGULAR app, 
    // we would eventually move to a more robust state-based editor.
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative">
      {/* ─── Fixed Authoring Toolbar (P3.3A) ─── */}
      <AuthoringToolbar 
        onCommand={handleCommand}
        onOpenFormulas={onOpenFormulas}
        onOpenElements={onOpenElements}
        onOpenExport={onOpenExport}
      />

      {/* ─── Authority/Status Indicators ─── */}
      <div className="absolute top-24 right-8 flex flex-col gap-2 z-10 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        {!editable && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-400">
            <ShieldAlert className="w-3 h-3" />
            READ ONLY
          </div>
        )}
        {document.authority_class === 'partial_edit' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-400">
            <Lock className="w-3 h-3" />
            PARTIAL
          </div>
        )}
      </div>

      {/* ─── Page Rendering Surface (The Desk) ─── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide docuscribe-desk">
        <PageRenderer
          document={document}
          onContentChange={onContentChange}
          readOnly={!editable}
        />
      </div>
    </div>
  );
}

