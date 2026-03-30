'use client';

import React from 'react';
import { SecurityEvent } from '@/types/security-event';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, Info, ShieldAlert, Clock, Database, User, Laptop } from 'lucide-react';

interface SecurityEventCardProps {
  event: SecurityEvent;
  onClick?: () => void;
}

export function SecurityEventCard({ event, onClick }: SecurityEventCardProps) {
  const isCritical = event.severity === 'critical' || event.severity === 'safety_critical';
  const isHigh = event.severity === 'elevated';

  const severityIcon = () => {
    switch (event.severity) {
      case 'critical':
      case 'safety_critical':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'elevated':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const truthStateColor = () => {
    switch (event.truthState) {
      case 'live': return 'text-green-500 bg-green-500/10';
      case 'normalized': return 'text-primary bg-primary/10';
      case 'cached': return 'text-muted-foreground bg-white/5';
      case 'partial': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-muted-foreground bg-white/5';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-3 rounded-lg transition-all duration-200 cursor-pointer",
        "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07]",
        isCritical && "border-red-500/20 bg-red-500/[0.02] hover:border-red-500/40",
        isHigh && "border-orange-500/20 bg-orange-500/[0.02] hover:border-orange-500/40"
      )}
    >
      {/* Header: Source & Severity */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {severityIcon()}
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
            {event.source}
          </span>
        </div>
        <div className={cn(
          "px-1.5 py-0.5 rounded text-[8px] font-mono tracking-tighter uppercase",
          truthStateColor()
        )}>
          {event.truthState}
        </div>
      </div>

      {/* Title / Type */}
      <h4 className="text-[13px] font-medium text-white/90 truncate mb-1">
        {event.payload?.threatName || event.type}
      </h4>

      {/* Details Row */}
      <div className="flex items-center gap-4 mt-2 mb-1 opacity-60">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-mono">
            {typeof event.timestamp === 'string' 
              ? new Date(event.timestamp).toLocaleTimeString([], { hour12: false }) 
              : 'LIVE'}
          </span>
        </div>
        {event.deviceId && (
          <div className="flex items-center gap-1">
            <Laptop className="w-3 h-3" />
            <span className="text-[10px] font-mono truncate max-w-[80px]">
              {event.deviceId}
            </span>
          </div>
        )}
      </div>

      {/* Footer: Trust Metadata */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Database className="w-3 h-3 text-white/30" />
          <span className="text-[9px] font-mono text-white/30 truncate">
            TRUST: {(event.trust.sourceReliability * 100).toFixed(0)}% • {event.trust.sourceClass.toUpperCase()}
          </span>
        </div>
        {event.trust.verified && (
          <Shield className="w-3 h-3 text-primary/60 shrink-0" />
        )}
      </div>
    </div>
  );
}
