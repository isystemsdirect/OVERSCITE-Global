/**
 * DocuSCRIBE™ — Lineage Placeholder
 *
 * @classification UI_COMPONENT
 * @authority DocuSCRIBE Division
 * @status P1_PLACEHOLDER
 *
 * Bottom region for document lineage display. Phase 1 shows version
 * and parent reference only. Full lineage history UI is Phase 2.
 */

'use client';

import React, { useState } from 'react';
import { GitBranch, ChevronDown, ChevronUp } from 'lucide-react';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

interface LineagePlaceholderProps {
  document: DocuScribeDocument;
}

export function LineagePlaceholder({ document }: LineagePlaceholderProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-white/5">
      {/* ─── Collapse Toggle ─── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2 text-xs text-white/30 hover:text-white/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <GitBranch className="w-3 h-3" />
          <span className="font-bold uppercase tracking-widest text-[10px]">Lineage</span>
          <span className="font-mono text-[10px] text-white/20">
            v{document.version}.{document.sub_version}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* ─── Expanded Detail ─── */}
      {expanded && (
        <div className="px-4 pb-3 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Current Version
                </span>
                <span className="font-mono text-xs text-white/60">
                  v{document.version}.{document.sub_version}
                </span>
              </div>
              {document.lineage_parent_id ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Parent
                  </span>
                  <span className="font-mono text-xs text-white/40">
                    {document.lineage_parent_id}
                  </span>
                </div>
              ) : (
                <div className="text-[10px] text-white/20 italic">
                  No lineage parent — this is the root document
                </div>
              )}
            </div>
          </div>

          <div className="text-[9px] text-white/15 text-center font-mono uppercase tracking-wider py-1">
            Lineage History — Coming in Phase 2
          </div>
        </div>
      )}
    </div>
  );
}
