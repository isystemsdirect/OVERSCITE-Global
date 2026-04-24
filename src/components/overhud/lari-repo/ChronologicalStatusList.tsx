'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Loader2, AlertCircle, Eye, AlertTriangle } from 'lucide-react';

/**
 * @classification CAPTURE_ANALYSIS_STATUS
 */
export type AnalysisStatus = 
  | 'Pending Analysis' 
  | 'Queued' 
  | 'Analyzing' 
  | 'Success' 
  | 'Failed' 
  | 'Image Corrupted - Unreadable' 
  | 'Telemetry Incomplete' 
  | 'Awaiting Operator Review';

interface StatusCardProps {
  id: string;
  filename: string;
  status: AnalysisStatus;
  progress?: number;
  timestamp: string;
}

/**
 * @classification ASSET_TRUTH_STATE_CARD
 * @purpose Truth-state rendering of captured asset analysis progress.
 */
export function AssetTruthStateCard({ filename, status, progress, timestamp }: StatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'Success': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'Analyzing': return <Loader2 className="h-3 w-3 text-primary animate-spin" />;
      case 'Pending Analysis':
      case 'Queued': return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'Failed':
      case 'Image Corrupted - Unreadable': return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'Telemetry Incomplete': return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'Awaiting Operator Review': return <Eye className="h-3 w-3 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Success': return 'text-green-500';
      case 'Analyzing': return 'text-primary';
      case 'Failed':
      case 'Image Corrupted - Unreadable': return 'text-red-500';
      case 'Telemetry Incomplete': return 'text-yellow-500';
      case 'Awaiting Operator Review': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-white/90 truncate uppercase tracking-tighter">
            {filename}
          </span>
          <span className="text-[8px] font-mono text-muted-foreground">
            {timestamp}
          </span>
        </div>
        {getStatusIcon()}
      </div>

      <div className="flex items-center justify-between">
        <span className={cn("text-[9px] font-mono font-bold uppercase tracking-widest", getStatusColor())}>
          {status === 'Analyzing' && progress ? `ANALYZING — [${progress}%]` : status}
        </span>
        
        {status === 'Analyzing' && (
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-300" 
               style={{ width: `${progress}%` }} 
             />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @classification OVERHUD_CHRONOLOGICAL_STATUS_LIST
 */
export function OverHUDChronologicalStatusList({ items }: { items: StatusCardProps[] }) {
  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto max-h-full custom-scrollbar">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Live Ingest Stream</span>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          {items.length} ASSETS
        </span>
      </div>
      {items.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center opacity-30">
          <Database className="h-8 w-8 mb-2" />
          <p className="text-[10px] font-mono uppercase">Awaiting Live Capture...</p>
        </div>
      ) : (
        items.map((item) => <AssetTruthStateCard key={item.id} {...item} />)
      )}
    </div>
  );
}

import { Database } from 'lucide-react';
