/**
 * DocuSCRIBE™ — Write Workspace (Primary Authoring Surface)
 *
 * @classification PAGE
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 * @route /docuscribe
 *
 * The Write workspace is the primary authoring surface.
 * Three-column layout:
 *   Left: Document list with authority class badges and verification indicators
 *   Center: Document canvas (edit/view based on authority class)
 *   Right: Metadata + stamp + CARR + audit + formal report gate
 * Bottom: Lineage placeholder region
 *
 * Phase 2 additions:
 *   - Trust Stamp issuance with password gating
 *   - CARR calculation from findings
 *   - Stamp audit log with hash chain
 *   - Formal report generation gate
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DocumentListPanel } from '@/components/docuscribe/DocumentListPanel';
import { DocumentCanvas } from '@/components/docuscribe/DocumentCanvas';
import { MetadataPanel } from '@/components/docuscribe/MetadataPanel';
import { LineagePlaceholder } from '@/components/docuscribe/LineagePlaceholder';
import { TrustStampDialog } from '@/components/docuscribe/TrustStampDialog';
import { FormulaInsertDialog } from '@/components/docuscribe/FormulaInsertDialog';
import { ElementLibraryDialog } from '@/components/docuscribe/ElementLibraryDialog';
import { ExportDialog } from '@/components/docuscribe/ExportDialog';
import { MOCK_DOCUMENTS, MOCK_TEMPLATES, MOCK_AUDIT_LOG } from '@/lib/docuscribe/mock-data';
import {
  seedAuditChain,
  recordStampAction,
  getAuditLog,
  getFullAuditChain,
} from '@/lib/docuscribe/stamp-audit';
import {
  calculateCARR,
  hashContent,
} from '@/lib/docuscribe/types';
import type {
  DocuScribeDocument,
  DocumentTemplate,
  StampAuditEntry,
  TrustStamp,
} from '@/lib/docuscribe/types';

import { useDocuScribe } from '@/lib/docuscribe/context';

export default function DocuScribeWritePage() {
  const { 
    documents, 
    activeDocument, 
    updatePageContent, 
    createDocument,
    issueStamp,
    templates
  } = useDocuScribe();
  
  // Dialog State
  const [stampDialogOpen, setStampDialogOpen] = useState(false);
  const [formulaDialogOpen, setFormulaDialogOpen] = useState(false);
  const [elementDialogOpen, setElementDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const [auditRefreshKey, setAuditRefreshKey] = useState(0);

  // ─── Get Audit Log for Active Document ─────────────────────────────
  const activeAuditLog: StampAuditEntry[] = activeDocument
    ? getAuditLog(activeDocument.document_id)
    : [];

  // ─── Dialog Handlers ──────────────────────────────────────────────
  const handleApplyStamp = useCallback(() => {
    if (activeDocument) {
      setStampDialogOpen(true);
    }
  }, [activeDocument]);

  const handleOpenFormulas = useCallback(() => setFormulaDialogOpen(true), []);
  const handleOpenElements = useCallback(() => setElementDialogOpen(true), []);
  const handleOpenExport = useCallback(() => setExportDialogOpen(true), []);

  const handleInsertText = (text: string) => {
    // For rich text, we append or use execCommand in the active editor
    // The editor now handles this directly via internal range selection or execCommand.
  };

  // ─── Formal Report Generation ─────────────────────────────────────
  const handleGenerateReport = useCallback(async () => {
    if (!activeDocument) return;

    if (!activeDocument.trust_stamp?.is_valid) {
      await recordStampAction(
        'generation_blocked',
        'none',
        activeDocument.document_id,
        'Guest Inspector',
        `Formal report generation blocked. No valid Trust Stamp on "${activeDocument.title}".`
      );
      setAuditRefreshKey(prev => prev + 1);
      return;
    }

    await recordStampAction(
      'generation_authorized',
      activeDocument.trust_stamp.stamp_id,
      activeDocument.document_id,
      'Guest Inspector',
      `Formal report generation authorized. Trust Stamp ${activeDocument.trust_stamp.stamp_id} is valid.`
    );
    setAuditRefreshKey(prev => prev + 1);
  }, [activeDocument]);

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      {/* ─── Page Header ─── */}
      <div className="p-6 md:p-8 lg:p-10 pb-0">
        <PageHeader
          title="Write Workspace"
          status="live"
          guidanceId="docuscribe-write"
          description="Governed authoring surface with deterministic page-based rendering and full authoring toolset."
        />
      </div>

      {/* ─── Main Workspace (Page-Centric) ─── */}
      <div className="flex-1 flex min-h-0 px-6 md:px-8 lg:px-10 pb-4 gap-0">

        {/* Center: Document Canvas (The Desk) */}
        <div className="flex-1 flex flex-col min-w-[900px] flex-shrink-0 bg-transparent overflow-hidden">
          {activeDocument ? (
            <div className="flex-1 min-h-0">
              <DocumentCanvas
                document={activeDocument}
                onOpenFormulas={handleOpenFormulas}
                onOpenElements={handleOpenElements}
                onOpenExport={handleOpenExport}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[10px] text-white/10 uppercase tracking-[0.3em] font-black">
                Select a document to begin
              </p>
            </div>
          )}
        </div>

        {/* Right: Metadata Panel */}
        <div className="w-[300px] shrink-0 border-l border-white/5 bg-black/10 overflow-hidden">
          {activeDocument ? (
            <MetadataPanel
              document={activeDocument}
              stampAuditLog={activeAuditLog}
              onApplyStamp={handleApplyStamp}
              onGenerateReport={handleGenerateReport}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[10px] text-white/10 uppercase tracking-widest font-black">
                No active metadata
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Dialogs ─── */}
      {activeDocument && (
        <>
          <TrustStampDialog
            open={stampDialogOpen}
            onOpenChange={setStampDialogOpen}
            document={activeDocument}
            onStampIssued={issueStamp}
          />
          <FormulaInsertDialog 
            open={formulaDialogOpen}
            onOpenChange={setFormulaDialogOpen}
            onInsert={handleInsertText}
          />
          <ElementLibraryDialog
            open={elementDialogOpen}
            onOpenChange={setElementDialogOpen}
            onInsert={handleInsertText}
          />
          <ExportDialog
            open={exportDialogOpen}
            onOpenChange={setExportDialogOpen}
            document={activeDocument}
          />
        </>
      )}
    </div>
  );
}

