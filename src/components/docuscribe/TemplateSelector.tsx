/**
 * DocuSCRIBE™ — Template Selector
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P1_FOUNDATION
 *
 * Basic template selection dialog. Users pick a template to create
 * a new document. Uses existing Dialog UI primitive.
 */

'use client';

import React from 'react';
import { FileText, BookOpen } from 'lucide-react';
import type { DocumentTemplate } from '@/lib/docuscribe/types';
import { getAuthorityClassColor } from '@/lib/docuscribe/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: DocumentTemplate[];
  onSelect: (template: DocumentTemplate) => void;
}

export function TemplateSelector({
  open,
  onOpenChange,
  templates,
  onSelect,
}: TemplateSelectorProps) {
  const handleSelect = (template: DocumentTemplate) => {
    onSelect(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <DialogTitle className="text-sm font-black uppercase tracking-tight">
              New Document
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Select a template to begin. You can modify the document after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleSelect(tpl)}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-2 w-full">
                <FileText className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">
                  {tpl.name}
                </span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2">
                {tpl.description}
              </p>
              <span className={cn(
                "inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border mt-auto",
                getAuthorityClassColor(tpl.authority_class)
              )}>
                {tpl.authority_class === 'draft_editable' ? 'Draft' : tpl.authority_class.replace(/_/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
