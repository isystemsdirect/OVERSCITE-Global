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
import { useDocuScribe } from '@/lib/docuscribe/context';

interface PageRendererProps {
  document: DocuScribeDocument;
  readOnly?: boolean;
}

export function PageRenderer({ document, readOnly }: PageRendererProps) {
  const { pages } = document;
  const { updatePageContent, updatePageSection, addPage } = useDocuScribe();
  
  return (
    <div className="flex flex-col items-center py-12 min-h-full">
      <div className="flex flex-col gap-12 w-full items-center">
        {pages.map((page, index) => (
          <PagePane 
            key={page.page_id}
            document={document}
            pageNumber={index + 1} 
            totalPages={pages.length}
            readOnly={readOnly}
            onHeaderChange={(payload) => updatePageSection(page.page_id, payload)}
            onFooterChange={(payload) => updatePageSection(page.page_id, payload)}
          >
            <RichTextEditor
              pageId={page.page_id}
              initialContent={page.content}
              onChange={(html) => updatePageContent(page.page_id, html)}
              readOnly={readOnly}
            />
          </PagePane>
        ))}

        {!readOnly && (
          <div className="py-20 flex justify-center">
            <button 
              onClick={() => addPage()}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 rounded-lg transition-all"
            >
              Add Discrete Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
