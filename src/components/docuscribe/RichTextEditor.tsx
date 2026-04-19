/**
 * DocuSCRIBE™ — Rich Text Authoring Engine
 * 
 * A custom contenteditable implementation providing high-fidelity
 * document production tools with deterministic rendering.
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
  className?: string;
  readOnly?: boolean;
}

export function RichTextEditor({ initialContent, onChange, className, readOnly }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

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

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full min-h-full outline-none",
          "prose prose-invert max-w-none",
          "selection:bg-primary/30",
          readOnly ? "cursor-default" : "cursor-text"
        )}
        style={{
          fontFamily: 'var(--font-sans)',
          lineHeight: '1.6',
          fontSize: '14px'
        }}
      />
    </div>
  );
}
