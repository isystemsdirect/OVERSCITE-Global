/**
 * DocuSCRIBE™ — Export Dialog
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Handles document export flow. Displays gated options for unconfigured formats
 * to maintain strict compliance with SCINGULAR integration architecture.
 */

'use client';

import React, { useState } from 'react';
import { Download, FileText, FileBadge, Code, ShieldAlert, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import {
  exportAsHTML,
  downloadBlob,
  getExportCapability,
  ExportFormat
} from '@/lib/docuscribe/export-service';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocuScribeDocument;
}

export function ExportDialog({ open, onOpenChange, document }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html');

  const handleExport = () => {
    const capability = getExportCapability(selectedFormat, document);
    if (!capability.allowed) return;

    if (selectedFormat === 'html') {
      const blob = exportAsHTML(document);
      const filename = `${document.document_id}_${document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      downloadBlob(blob, filename);
      onOpenChange(false);
    }
  };

  const htmlCap = getExportCapability('html', document);
  const pdfCap = getExportCapability('pdf', document);
  const wordCap = getExportCapability('docx', document);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Download className="w-5 h-5 text-white" />
              <DialogTitle className="text-sm font-black uppercase tracking-tight">
                Export Document
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Download the current document structure. Formal reports require Trust Stamps to export.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Format Selection */}
          <div className="space-y-3">
            <FormatOption
              format="html"
              title="HTML Document"
              description="Print-ready structure. Includes SCINGULAR branding and valid Trust Stamps."
              icon={<Code className="w-5 h-5" />}
              selected={selectedFormat === 'html'}
              allowed={htmlCap.allowed}
              reason={htmlCap.reason}
              onClick={() => setSelectedFormat('html')}
            />
            <FormatOption
              format="pdf"
              title="Portable Document Format (PDF)"
              description="High-fidelity static document package."
              icon={<FileBadge className="w-5 h-5" />}
              selected={selectedFormat === 'pdf'}
              allowed={pdfCap.allowed}
              reason={pdfCap.reason}
              onClick={() => setSelectedFormat('pdf')}
            />
            <FormatOption
              format="docx"
              title="Microsoft Word (DOCX)"
              description="Editable document layout compatible with external suites."
              icon={<FileText className="w-5 h-5" />}
              selected={selectedFormat === 'docx'}
              allowed={wordCap.allowed}
              reason={wordCap.reason}
              onClick={() => setSelectedFormat('docx')}
            />
          </div>

          {/* Trust Stamp Inclusion Notice */}
          <div className="mt-6 bg-black/40 border border-white/5 rounded-lg p-4 flex items-start gap-3">
            {document.trust_stamp?.is_valid ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">Trust Stamp Included</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    This document possesses a valid SCINGULAR Trust Stamp. The stamp metadata, CARR score, and cryptographic signature will be embedded in the exported artifact.
                  </p>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-1">Unverified Export Notice</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    This document is exporting in an unverified state without a Trust Stamp. Truth-state disclosures will be visibly watermarked on the resulting artifact.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleExport}
            disabled={!getExportCapability(selectedFormat, document).allowed}
            className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-30 disabled:hover:bg-primary"
          >
            Download {selectedFormat.toUpperCase()}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormatOption({ 
  format, title, description, icon, selected, allowed, reason, onClick 
}: { 
  format: string, title: string, description: string, icon: React.ReactNode, selected: boolean, allowed: boolean, reason: string | null, onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
        selected ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-black/20"
      )}
    >
      <div className={cn(
        "shrink-0 p-2 rounded-lg",
        selected ? "bg-primary/10 text-primary" : "bg-white/5 text-white/40"
      )}>
        {icon}
      </div>
      <div>
        <h4 className={cn("text-sm font-bold mb-1", selected ? "text-primary" : "text-white/80")}>{title}</h4>
        <p className="text-[10px] text-white/50 leading-relaxed mb-2">{description}</p>
        
        {!allowed && reason && (
          <div className="flex items-start gap-1.5 mt-2 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-md text-[9px] font-medium leading-tight">
            <ShieldAlert className="w-3 h-3 shrink-0" />
            <span>{reason}</span>
          </div>
        )}
      </div>
    </button>
  );
}
