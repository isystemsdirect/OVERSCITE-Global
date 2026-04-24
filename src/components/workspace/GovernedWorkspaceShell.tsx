'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  Activity, 
  AlertCircle, 
  Clock, 
  Map as MapIcon, 
  Hash,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface GovernedWorkspaceShellProps {
  children: React.ReactNode;
  entityName: string;
  entityId: string;
  version?: string;
  lastHash?: string;
  status?: string;
  taskRailContent?: React.ReactNode;
  activeMode?: string;
}

export function GovernedWorkspaceShell({
  children,
  entityName,
  entityId,
  version = '1.0.0',
  lastHash = '0x0000...0000',
  status = 'Nominal',
  taskRailContent,
  activeMode
}: GovernedWorkspaceShellProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      {/* 1. Operational Status Bar */}
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-md border border-border/50 p-2 px-4 rounded-xl shadow-inner animate-in fade-in slide-in-from-top-1 duration-500">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Entity Baseline</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight">{entityName}</span>
              <Badge variant="outline" className="text-[9px] h-4 font-mono bg-primary/10 border-primary/20 text-primary">v{version}</Badge>
            </div>
          </div>
          
          <Separator orientation="vertical" className="h-8 opacity-20" />
          
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Forensic ID</span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] opacity-70">
              <Hash className="h-3 w-3" />
              <span>{lastHash}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-md">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{status}</span>
          </div>
          <div className="text-[10px] font-mono opacity-40">
            {new Date().toISOString().replace('T', ' ').split('.')[0]} UTC
          </div>
        </div>
      </div>

      {/* 2. Main Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 flex-1 overflow-hidden">
        
        {/* Left/Center: Work Region */}
        <div className="flex flex-col gap-4 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-2xl" />
          <ScrollArea className="flex-1 bg-card/20 backdrop-blur-[2px] border border-border/30 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
            <div className="p-6">
              {children}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Dynamic Task Rail */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl flex flex-col overflow-hidden shadow-xl animate-in slide-in-from-right-2 duration-500">
            <div className="p-4 border-b border-border/30 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Task Rail
                </span>
                <Badge variant="outline" className="text-[10px] font-mono opacity-60">Live</Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {taskRailContent || (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShieldCheck className="h-8 w-8 opacity-10 mb-3" />
                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">All Conditions Nominal</p>
                    <p className="text-[10px] opacity-40 mt-1">Ready for next protocol activation</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/30 bg-muted/10">
              <button 
                className="w-full py-2 bg-primary/80 hover:bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all group"
                onClick={() => {}} // Root activation hook
              >
                Activate Protocol
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Operational Persistence Indicator (Bottom) */}
      <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
        <div className="h-full w-48 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
