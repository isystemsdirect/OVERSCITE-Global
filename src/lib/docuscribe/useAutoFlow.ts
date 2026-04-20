/**
 * DocuSCRIBE™ — Auto-Flow Hook
 * 
 * Monitors the provided ref for vertical overflow.
 * When overflow is detected, it identifies the spillover nodes 
 * and triggers a structural move to the next page.
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useDocuScribe } from '@/lib/docuscribe/context';

export function useAutoFlow(
  pageId: string, 
  contentRef: React.RefObject<HTMLDivElement>, 
  readOnly: boolean,
  marginPx: number = 48 // Buffer
) {
  const { activeDocument, activeDocumentId, updatePageContent, addPage, logAuditEntry } = useDocuScribe();
  const isReflowing = useRef(false);
  const [isReflowingUI, setIsReflowingUI] = useState(false);

  const checkOverflow = useCallback(() => {
    if (readOnly || isReflowing.current || !contentRef.current || !activeDocument) return;

    const container = contentRef.current;
    const maxHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    if (scrollHeight > maxHeight + marginPx) {
      console.log(`[AutoFlow] Overflow detected on page ${pageId}: ${scrollHeight}px > ${maxHeight}px`);
      isReflowing.current = true;

      // Identify split point
      const children = Array.from(container.children) as HTMLElement[];
      let splitIndex = -1;
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.offsetTop + child.offsetHeight > maxHeight) {
          splitIndex = i;
          break;
        }
      }

      if (splitIndex !== -1) {
        setIsReflowingUI(true);
        if (activeDocumentId) {
          logAuditEntry(activeDocumentId, 'page_reflow', `Structural overflow resolved on page ${pageId}`);
        }
        
        const keptNodes = children.slice(0, splitIndex);
        const movedNodes = children.slice(splitIndex);

        const keptHtml = keptNodes.map(n => n.outerHTML).join('');
        const movedHtml = movedNodes.map(n => n.outerHTML).join('');

        const currentPageIdx = activeDocument.pages.findIndex(p => p.page_id === pageId);
        const nextPage = activeDocument.pages[currentPageIdx + 1];

        // 1. Update current page with truncated content
        updatePageContent(pageId, keptHtml || '<p><br></p>');

        // 2. Move overflow to next page
        if (nextPage) {
          const nextContent = movedHtml + (nextPage.content === '<p><br></p>' ? '' : nextPage.content);
          updatePageContent(nextPage.page_id, nextContent);
        } else {
          addPage(movedHtml);
        }

        setTimeout(() => {
          setIsReflowingUI(false);
          isReflowing.current = false;
        }, 1500); // Visual duration
      } else {
        isReflowing.current = false;
      }
    }
  }, [pageId, contentRef, readOnly, activeDocument, activeDocumentId, updatePageContent, addPage, logAuditEntry, marginPx]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      checkOverflow();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, { 
        childList: true, 
        characterData: true, 
        subtree: true 
      });
    }

    return () => observer.disconnect();
  }, [checkOverflow, contentRef]);

  return { checkOverflow, isReflowing: isReflowingUI };
}
