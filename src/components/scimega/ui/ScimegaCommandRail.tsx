"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Cpu, Zap, Activity, Download, ScrollText, BookOpen, Eye, 
  Archive, Network, Crosshair, Radio, ShieldAlert, Terminal, Lock
} from 'lucide-react';
import { SCIMEGADomain } from '@/lib/scimega/uix/scimega-uix-state';

interface ScimegaCommandRailProps {
  activeDomain: SCIMEGADomain;
  onDomainChange: (domain: SCIMEGADomain) => void;
}

const GROUPS = [
  {
    id: 'Build_And_Config',
    label: 'Config',
    domains: [
      { id: 'BUILD', label: 'Build', icon: Cpu, color: 'text-white' },
      { id: 'METHOD_FIT', label: 'Method Fit', icon: Zap, color: 'text-blue-400' },
      { id: 'SCHEDULER', label: 'Scheduler', icon: Activity, color: 'text-green-400' },
      { id: 'EXPORT', label: 'Export', icon: Download, color: 'text-purple-400' },
    ]
  },
  {
    id: 'Governance',
    label: 'Gov',
    domains: [
      { id: 'ARC_AUTH', label: 'ARC Auth', icon: Lock, color: 'text-cyan-400' },
      { id: 'ARCHIVE', label: 'ArcHive™', icon: Archive, color: 'text-indigo-400' },
      { id: 'PRODUCTION', label: 'Gate', icon: Network, color: 'text-red-400' },
    ]
  },
  {
    id: 'Operation',
    label: 'Ops',
    domains: [
      { id: 'BFI_AUTONOMY', label: 'BFI Autonomy', icon: Crosshair, color: 'text-cyan-500' },
      { id: 'TELEMETRY', label: 'Telemetry', icon: Radio, color: 'text-blue-500' },
      { id: 'REPLAY', label: 'Replay', icon: Eye, color: 'text-teal-400' },
    ]
  },
  {
    id: 'Execution_Surface',
    label: 'Surface',
    domains: [
      { id: 'TERMINAL', label: 'Terminal', icon: Terminal, color: 'text-amber-400' },
      { id: 'PL_BOUNDARY', label: 'PL Boundary', icon: ShieldAlert, color: 'text-red-500' },
      { id: 'DRY_LINK', label: 'Dry-Link', icon: Network, color: 'text-indigo-500' },
    ]
  },
  {
    id: 'Intelligence_Training',
    label: 'Intel',
    domains: [
      { id: 'AUDIT', label: 'Audit', icon: ScrollText, color: 'text-emerald-400' },
      { id: 'TRAINING', label: 'Training', icon: BookOpen, color: 'text-pink-400' },
    ]
  }
];

export function ScimegaCommandRail({ activeDomain, onDomainChange }: ScimegaCommandRailProps) {
  return (
    <div className="w-20 bg-black/40 border-r border-white/10 flex flex-col items-center py-6 gap-6 backdrop-blur-md overflow-y-auto no-scrollbar">
      {GROUPS.map((group, groupIdx) => (
        <React.Fragment key={group.id}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">
              {group.label}
            </span>
            {group.domains.map((domain) => {
              const Icon = domain.icon;
              const isActive = activeDomain === domain.id;

              return (
                <button
                  key={domain.id}
                  onClick={() => onDomainChange(domain.id as any)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                      : "hover:bg-white/5 border border-transparent"
                  )}
                  title={domain.label}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? domain.color : "text-white/40 group-hover:text-white/70"
                  )} />
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter mt-1.5 transition-colors duration-300",
                    isActive ? "text-white/90" : "text-white/20 group-hover:text-white/40"
                  )}>
                    {domain.label.split(' ')[0]}
                  </span>

                  {isActive && (
                    <div className={cn(
                      "absolute left-0 w-1 h-6 rounded-r-full",
                      domain.color.replace('text-', 'bg-')
                    )} />
                  )}
                </button>
              );
            })}
          </div>
          {groupIdx < GROUPS.length - 1 && (
            <div className="w-8 h-px bg-white/5 my-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
