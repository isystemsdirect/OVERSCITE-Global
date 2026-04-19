/**
 * DocuSCRIBE™ — Page Renderer
 * 
 * Orchestrates the page-based layout of the authoring surface.
 * Wraps the rich text editor in discrete PagePane containers.
 */

'use client';

import React from 'react';
import { PagePane } from './PagePane';
import { RichTextEditor } from './RichTextEditor';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface PageRendererProps {
  document: DocuScribeDocument;
  onContentChange: (html: string) => void;
  readOnly?: boolean;
}

export function PageRenderer({ document, onContentChange, readOnly }: PageRendererProps) {
  // In a full implementation, we would split content into multiple strings per page.
  // For P3.3A, we provide a single primary page pane for the active editor,
  // following the OVERSCITE premium workstation design.
  
  return (
    <div className="flex flex-col items-center py-12 min-h-full">
      <div className="flex flex-col gap-8 w-full items-center">
        {/* Page 1: Active Authoring Surface */}
        <PagePane 
          isVerified={document.is_verified} 
          pageNumber={1} 
          totalPages={1}
        >
          <RichTextEditor
            initialContent={document.content}
            onChange={onContentChange}
            readOnly={readOnly}
          />
        </PagePane>
        
        {/* Visual indicators for future pages could go here */}
      </div>
    </div>
  );
}
