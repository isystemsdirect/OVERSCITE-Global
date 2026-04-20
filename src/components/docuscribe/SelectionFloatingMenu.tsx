/**
 * DocuSCRIBE™ — Selection Floating Menu
 * 
 * Anchors to text selection and provides Scing intelligence actions.
 * Enforces Preview & Confirm governance.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sparkles, Zap, Minimize2, 
  Type, Check, X, Loader2 
} from 'lucide-react';
import { useDocuScribe } from '@/lib/docuscribe/context';
import type { ScingAction, ScingSuggestion } from '@/lib/docuscribe/ScingIntelligenceService';

interface SelectionMenuProps {
  pageId: string;
}

export function SelectionFloatingMenu({ pageId }: SelectionMenuProps) {
  const { executeScingAction, confirmSuggestion } = useDocuScribe();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [suggestion, setSuggestion] = useState<ScingSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      if (!suggestion) setPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position above selection
    setPosition({
      top: rect.top + window.scrollY - 45,
      left: rect.left + window.scrollX + rect.width / 2
    });
    setSelectedText(selection.toString());
  }, [suggestion]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePosition);
    return () => document.removeEventListener('selectionchange', updatePosition);
  }, [updatePosition]);

  const handleAction = async (action: ScingAction) => {
    setIsLoading(true);
    try {
      const res = await executeScingAction(action, selectedText);
      setSuggestion(res);
    } catch (err) {
      console.error('Scing Action Failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!position) return null;

  return (
    <div 
      className="fixed z-[1000] -translate-x-1/2 pointer-events-auto"
      style={{ top: position.top, left: position.left }}
    >
      {!suggestion ? (
        <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl animate-in fade-in zoom-in duration-200">
          <button 
            onClick={() => handleAction('formalize')}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary transition-all"
          >
            <Sparkles className={cn("w-3 h-3", isLoading && "animate-spin")} />
            {isLoading ? 'Processing...' : 'Formalize'}
          </button>
          
          <div className="w-px h-3 bg-white/10 mx-1" />
          
          <button 
            onClick={() => handleAction('clarify_technical')}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
            title="Clarify Technical"
          >
            <Zap className="w-3 h-3" />
          </button>
          <button 
            onClick={() => handleAction('summarize')}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
            title="Summarize"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-80 bg-zinc-900 border border-primary/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Scing Suggestion
            </span>
            <div className="flex items-center gap-1">
              <div className="text-[8px] font-bold bg-primary text-black px-1.5 py-0.5 rounded">
                {(suggestion.confidence * 100).toFixed(0)}% CONF
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
             <div className="space-y-1">
               <span className="text-[8px] font-black uppercase tracking-tighter text-white/20">Proposed Content</span>
               <div className="text-xs text-white/80 leading-relaxed bg-black/20 p-2 rounded border border-white/5 italic">
                 "{suggestion.proposed.replace(/<[^>]*>/g, '')}"
               </div>
             </div>
             
             <p className="text-[9px] text-white/40 leading-snug">{suggestion.explanation}</p>
          </div>

          <div className="p-2 bg-black/40 flex items-center gap-2">
            <button 
              onClick={() => {
                confirmSuggestion(pageId, suggestion);
                setSuggestion(null);
                setPosition(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all"
            >
              <Check className="w-3 h-3" />
              Confirm & Insert
            </button>
            <button 
              onClick={() => setSuggestion(null)}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all rounded-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
