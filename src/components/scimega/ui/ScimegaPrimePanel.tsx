"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { SCIMEGADomain } from '@/lib/scimega/uix/scimega-uix-state';

interface ScimegaPrimePanelProps {
  activeDomain: SCIMEGADomain;
  children: React.ReactNode;
}

export function ScimegaPrimePanel({ activeDomain, children }: ScimegaPrimePanelProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-black/20 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          <h2 className="text-xs font-black tracking-[0.3em] text-white/80 uppercase">
            {activeDomain.replace(/_/g, ' ')} DOMAIN
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Instrument Cluster v1.2.0</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
