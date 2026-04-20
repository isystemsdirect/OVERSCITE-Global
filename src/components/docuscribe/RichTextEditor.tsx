/**
 * DocuSCRIBE™ — Rich Text Authoring Engine
 * 
 * A custom contenteditable implementation providing high-fidelity
 * document production tools with deterministic rendering.
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAutoFlow } from '@/lib/docuscribe/useAutoFlow';
import { useDocuScribe } from '@/lib/docuscribe/context';
import { SelectionFloatingMenu } from './SelectionFloatingMenu';
import { DataBlockHydrator } from './DataBlockHydrator';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
  className?: string;
  readOnly?: boolean;
  pageId: string;
}

export function RichTextEditor({ initialContent, onChange, className, readOnly, pageId }: RichTextEditorProps) {
  const { activeDocument } = useDocuScribe();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Integrate Intelligent Auto-Flow
  const { isReflowing } = useAutoFlow(pageId, editorRef, readOnly || false);

  // Sync initial content only once on mount
  useEffect(() => {
    if (editorRef.current && !isMounted) {
      editorRef.current.innerHTML = initialContent || '<p><br></p>';
      setIsMounted(true);
    }
  }, [initialContent, isMounted]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          break;
      }
    }
  };

  const formatting = activeDocument?.formatting;

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full min-h-full outline-none",
          "prose prose-invert max-w-none transition-opacity duration-300",
          "selection:bg-primary/30",
          readOnly ? "cursor-default opacity-60" : "cursor-text"
        )}
        style={{
          fontFamily: formatting?.fontFamily || 'Inter',
          lineHeight: formatting?.lineSpacing || 1.6,
          fontSize: '14px'
        }}
      />
      
      {!readOnly && <SelectionFloatingMenu pageId={pageId} />}
      
      <DataBlockHydrator pageId={pageId} containerRef={editorRef} />

      {isReflowing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300">
          <div className="bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Layout Shift Active</span>
          </div>
        </div>
      )}

      {readOnly && (
        <div className="absolute inset-0 z-10 pointer-events-none" />
      )}
    </div>
  );
}
