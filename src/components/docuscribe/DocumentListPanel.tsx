/**
 * DocuSCRIBE™ — Document List Panel
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P1_FOUNDATION
 *
 * Left sidebar listing all documents with status, authority class badges,
 * and verification state indicators.
 */

'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Plus, FileText } from 'lucide-react';
import type { DocuScribeDocument, DocumentTemplate } from '@/lib/docuscribe/types';
import { getAuthorityClassLabel, getAuthorityClassColor } from '@/lib/docuscribe/types';
import { TemplateSelector } from './TemplateSelector';
import { cn } from '@/lib/utils';

interface DocumentListPanelProps {
  documents: DocuScribeDocument[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  templates: DocumentTemplate[];
  onCreateFromTemplate: (template: DocumentTemplate) => void;
}

export function DocumentListPanel({
  documents,
  activeDocumentId,
  onSelectDocument,
  templates,
  onCreateFromTemplate,
}: DocumentListPanelProps) {
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* ─── Compact Header ─── */}
      <div className="shrink-0 p-3 pt-4 border-b border-white/5">
        <button
          onClick={() => setTemplateSelectorOpen(true)}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all duration-300 shadow-lg shadow-primary/5"
        >
          <Plus className="w-3 h-3" />
          Create New Document
        </button>
      </div>

      {/* ─── Document List ─── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {documents.map((doc) => {
          const isActive = doc.document_id === activeDocumentId;
          return (
            <button
              key={doc.document_id}
              onClick={() => onSelectDocument(doc.document_id)}
              className={cn(
                "w-full text-left px-3 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 border border-primary/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)]"
                  : "bg-transparent border border-transparent hover:bg-white/[0.03] hover:border-white/5"
              )}
            >
              {/* Title Row */}
              <div className="flex items-start gap-2 mb-1.5">
                <FileText className={cn(
                  "w-3.5 h-3.5 mt-0.5 shrink-0",
                  isActive ? "text-primary" : "text-white/20"
                )} />
                <span className={cn(
                  "text-xs font-semibold leading-tight line-clamp-2",
                  isActive ? "text-white" : "text-white/70"
                )}>
                  {doc.title}
                </span>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-2 ml-5.5">
                {/* Authority Class Badge */}
                <span className={cn(
                  "inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                  getAuthorityClassColor(doc.authority_class)
                )}>
                  {doc.authority_class === 'draft_editable' ? 'Draft' :
                   doc.authority_class === 'partial_edit' ? 'Partial' :
                   doc.authority_class === 'immutable_view_only' ? 'Immutable' :
                   doc.authority_class === 'protected_log_view_only' ? 'Protected' :
                   'Finalized'}
                </span>

                {/* Verification Indicator */}
                {doc.is_verified ? (
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                )}

                {/* Version */}
                <span className="text-[9px] font-mono text-white/20 ml-auto">
                  v{doc.version}.{doc.sub_version}
                </span>
              </div>
            </button>
          );
        })}

        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-8 h-8 text-white/10 mb-3" />
            <p className="text-xs text-white/30">No documents yet</p>
          </div>
        )}
      </div>

      {/* ─── Template Selector ─── */}
      <TemplateSelector
        open={templateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        templates={templates}
        onSelect={onCreateFromTemplate}
      />
    </div>
  );
}
