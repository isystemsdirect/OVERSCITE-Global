/**
 * DocuSCRIBE™ — Data Block Hydrator
 * 
 * Scans the document DOM for data-block placeholders and injects 
 * interactive React components using portals. This allows rich 
 * dynamic content to exist within the static contentEditable HTML.
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { WeatherBlock } from './blocks/WeatherBlock';
import { InspectionBlock } from './blocks/InspectionBlock';

interface DataBlockHydratorProps {
  pageId: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface BlockPlaceholder {
  id: string;
  type: string;
  element: HTMLElement;
}

export function DataBlockHydrator({ pageId, containerRef }: DataBlockHydratorProps) {
  const [placeholders, setPlaceholders] = useState<BlockPlaceholder[]>([]);

  // Scan the container for block placeholders
  useEffect(() => {
    if (!containerRef.current) return;

    const scan = () => {
      const elements = containerRef.current?.querySelectorAll('[data-docuscribe-block]');
      const found: BlockPlaceholder[] = [];
      
      elements?.forEach((el) => {
        const type = el.getAttribute('data-docuscribe-block');
        const id = el.getAttribute('data-block-id');
        if (type && id && el instanceof HTMLElement) {
          found.push({ id, type, element: el });
        }
      });
      
      setPlaceholders(found);
    };

    // Initial scan
    scan();

    // Re-scan on mutations (content changes)
    const observer = new MutationObserver(scan);
    observer.observe(containerRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef, pageId]);

  return (
    <>
      {placeholders.map((p) => {
        // Find the right component for the block type
        let component = null;
        switch (p.type) {
          case 'weather':
            component = <WeatherBlock id={p.id} pageId={pageId} />;
            break;
          case 'inspection_section':
            component = <InspectionBlock id={p.id} pageId={pageId} />;
            break;
          // Add other block types here as they are implemented
          default:
            component = (
              <div className="p-2 border border-dashed border-red-500 text-red-500 text-[10px]">
                Unknown Block Type: {p.type}
              </div>
            );
        }

        return createPortal(
          <div 
            className="block-portal-root content-node-ignore" 
            contentEditable={false}
            onMouseDown={(e) => e.stopPropagation()} // Prevent editor selection interference
          >
            {component}
          </div>,
          p.element
        );
      })}
    </>
  );
}
