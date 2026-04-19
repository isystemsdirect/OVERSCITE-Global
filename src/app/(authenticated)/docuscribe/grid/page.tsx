/**
 * DocuSCRIBE™ — Grid Data Workspace
 *
 * @classification PAGE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Tabular representation of Document Findings and Metadata.
 */

'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ShieldAlert, Info, Settings2, Table as TableIcon } from 'lucide-react';
import { MOCK_DOCUMENTS } from '@/lib/docuscribe/mock-data';
import { calculateCARR } from '@/lib/docuscribe/types';
import { cn } from '@/lib/utils';

export default function GridWorkspacePage() {
  // Flatten findings across all documents for the grid view
  const gridData = MOCK_DOCUMENTS.flatMap(doc => {
    return (doc.findings || []).map(finding => ({
      ...finding,
      document_title: doc.title,
      document_id: doc.document_id,
      authority: doc.authority_class
    }));
  });

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      <div className="p-6 md:p-8 lg:p-10 pb-0">
        <PageHeader
          title="Grid Intelligence"
          status="live"
          guidanceId="docuscribe-grid"
          description="Tabular synthesis of document findings, metadata, and intelligence signals across the active workspace."
        />
      </div>

      <div className="flex-1 min-h-0 px-6 md:px-8 lg:px-10 pb-4 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-t-xl p-3 shrink-0">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">Finding Synthesis</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-md text-white/40 hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Surface */}
        <div className="flex-1 min-h-0 border-x border-b border-white/5 bg-black/40 rounded-b-xl overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-md z-10 text-[10px] uppercase font-bold tracking-wider text-white/40">
              <tr>
                <th className="font-semibold p-4 border-b border-white/5">Document</th>
                <th className="font-semibold p-4 border-b border-white/5">Finding ID</th>
                <th className="font-semibold p-4 border-b border-white/5">Category</th>
                <th className="font-semibold p-4 border-b border-white/5">Severity</th>
                <th className="font-semibold p-4 border-b border-white/5">Confidence</th>
                <th className="font-semibold p-4 border-b border-white/5 w-full">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {gridData.map((row, i) => (
                <tr key={`${row.document_id}-${i}`} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-white/80">{row.document_title}</div>
                    <div className="text-[10px] text-white/30 font-mono mt-0.5">{row.document_id}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-white/50">{row.id || `FIN-${100+i}`}</td>
                  <td className="p-4">
                    <span className="bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">
                      {row.category}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={cn(
                       "px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border",
                       row.severity === 'Critical' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                       row.severity === 'Major' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                       row.severity === 'Minor' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                       "bg-white/5 text-white/60 border-white/10"
                     )}>
                       {row.severity}
                     </span>
                  </td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                       <div className="w-16 h-1.5 bg-black/50 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary"
                           style={{ width: `${row.confidence === 'high' ? 100 : row.confidence === 'medium' ? 70 : row.confidence === 'low' ? 40 : 10}%`}}
                         />
                       </div>
                       <span className="text-[10px] text-white/50 w-12">{row.confidence}</span>
                     </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-white/70 truncate max-w-md">
                      {row.severity === 'Critical' ? <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" /> : <Info className="w-3.5 h-3.5 text-white/20 shrink-0" />}
                      <span className="truncate">{row.description}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
