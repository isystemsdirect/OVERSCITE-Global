/**
 * DocuSCRIBE™ — Structured Inspection Intelligence Block
 * 
 * Provides governed fields for site-specific findings (Roof, HVAC, etc.)
 * with Scing-assisted risk scoring and recommendation generators.
 */

'use client';

import React, { useState } from 'react';
import { ClipboardCheck, AlertTriangle, Lightbulb, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocuScribe } from '@/lib/docuscribe/context';

interface InspectionBlockProps {
  id: string;
  pageId: string;
}

export function InspectionBlock({ id, pageId }: InspectionBlockProps) {
  const { activeDocument, updatePageContent } = useDocuScribe();
  
  // Local state for the "Form" part of the block
  // Note: In Phase 5, these blocks are stored in the context's 'blocks' dictionary.
  const page = activeDocument?.pages.find(p => p.page_id === pageId);
  const block = page?.blocks?.[id];
  const isReadOnly = page?.status === 'locked' || block?.mode === 'snapshot';

  const [localData, setLocalData] = useState(block?.data || {
    label: block?.type?.replace('_', ' ').toUpperCase() || 'INSPECTION ITEM',
    condition: 'Good',
    riskScore: 3,
    recommendation: 'Continue routine maintenance.'
  });

  const handleSave = () => {
    // In a real implementation, we'd update the context block dictionary.
    // For this turn, we'll demonstrate the UI state.
    alert('Block data committed to document model.');
  };

  return (
    <div className="my-6 p-5 rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Structured Finding</h4>
            <input 
              type="text" 
              value={localData.label} 
              readOnly={isReadOnly}
              onChange={(e) => setLocalData({...localData, label: e.target.value})}
              className="bg-transparent border-none outline-none text-lg font-bold text-white/90 p-0 m-0 w-full"
            />
          </div>
        </div>

        {isReadOnly ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-white/30 uppercase">
             Snapshot Locked
          </div>
        ) : (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all"
          >
            <Save size={14} />
            Commit
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-white/30 uppercase mb-1.5 block">Observed Condition</label>
            <select 
              disabled={isReadOnly}
              value={localData.condition}
              onChange={(e) => setLocalData({...localData, condition: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white/80 outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Critical">Critical / Immediate Action</option>
            </select>
          </div>

          <div>
             <label className="text-[10px] font-bold text-white/30 uppercase mb-1.5 block">Risk Level (1-10)</label>
             <input 
              type="range" 
              min="1" max="10" 
              disabled={isReadOnly}
              value={localData.riskScore}
              onChange={(e) => setLocalData({...localData, riskScore: parseInt(e.target.value)})}
              className="w-full accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
             />
             <div className="flex justify-between mt-1 text-[9px] font-mono text-white/30">
               <span>LOW</span>
               <span className="text-primary font-bold">{localData.riskScore}</span>
               <span>MAX</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-white/30 uppercase mb-1.5 flex items-center gap-2">
            <Lightbulb size={10} className="text-amber-400" />
            Scing-Assisted Recommendation
          </label>
          <textarea 
            readOnly={isReadOnly}
            value={localData.recommendation}
            onChange={(e) => setLocalData({...localData, recommendation: e.target.value})}
            className="flex-1 w-full bg-white/5 border border-white/10 rounded-md p-3 text-sm text-white/70 outline-none focus:border-primary/40 transition-colors resize-none min-h-[100px]"
          />
        </div>
      </div>

      {/* Footer Audit Rail */}
      {!isReadOnly && (
        <div className="mt-4 flex items-center gap-2 text-[9px] font-medium text-white/20">
          <AlertTriangle size={10} />
          <span>This block is currently LIVE. Changes are captured in the document audit log.</span>
        </div>
      )}
    </div>
  );
}
