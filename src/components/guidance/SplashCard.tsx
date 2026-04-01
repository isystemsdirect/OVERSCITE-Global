'use client';

import React from 'react';
import { ChevronRight, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuidanceEntry } from '@/lib/guidance/guidance-registry';

interface SplashCardProps {
  entry: GuidanceEntry;
  onAskScing: () => void;
}

export function SplashCard({ entry, onAskScing }: SplashCardProps) {
  return (
    <div className="guidance-splash scing-card flex flex-col overflow-hidden text-sm">
      {/* ─── Header ─── */}
      <div className="px-4 py-3 bg-primary/10 border-b border-primary/20 flex flex-col gap-1">
        <div className="flex items-center gap-2">
           <h3 className="font-bold uppercase tracking-widest text-primary text-[11px] leading-tight">
             Contextual Guidance
           </h3>
        </div>
      </div>

      {/* ─── Body Sections ─── */}
      <div className="flex flex-col">
        {/* Section 1: What it is */}
        <div className="px-4 py-3 border-b border-white/5 bg-black/20">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">WHAT IT IS</p>
          <p className="text-white/90 leading-relaxed font-medium">{entry.splashCard.whatItIs}</p>
        </div>

        {/* Section 2: What it does */}
        <div className="px-4 py-3 border-b border-white/5 bg-black/10">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">WHAT IT DOES</p>
          <p className="text-muted-foreground leading-relaxed">{entry.splashCard.whatItDoes}</p>
        </div>

        {/* Section 3: What it does NOT do */}
        <div className="px-4 py-3 border-b border-white/5 bg-destructive/5">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider">WHAT IT DOES NOT DO</p>
          </div>
          <p className="text-white/70 leading-relaxed text-[13px]">{entry.splashCard.whatItDoesNotDo}</p>
        </div>

        {/* Section 4: Why it matters */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <p className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">WHY IT MATTERS</p>
          </div>
          <p className="text-white/80 leading-relaxed text-[13px]">{entry.splashCard.whyItMatters}</p>
        </div>
      </div>

      {/* ─── Footer Action ─── */}
      <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
        <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em] ml-1">LARI_GUIDE_S1</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onAskScing}
          className="h-8 gap-1.5 bg-primary/5 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg px-3 group"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold tracking-wide">Explain More</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Button>
      </div>
    </div>
  );
}
