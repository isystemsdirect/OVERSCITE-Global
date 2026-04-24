'use client';

import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { AlertTriangle, ShieldAlert, Zap, Radio, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification CRITICAL_ALERT_BAND
 * @authority Director
 * @purpose Emergency visual hierarchy for critical flight states.
 * Supports Informational, Warning, and Emergency states.
 */
export function CriticalAlertBand() {
  const { alerts } = useLiveFlight();

  if (alerts.length === 0) return null;

  return (
    <div className="w-full shrink-0 z-[100] border-b border-white/10">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={cn(
            "h-8 w-full flex items-center justify-center gap-3 px-4 transition-all",
            alert.severity === 'EMERGENCY' ? "bg-red-600 text-white animate-pulse-slow" : 
            alert.severity === 'WARNING' ? "bg-yellow-500 text-black font-bold" : 
            "bg-blue-600/20 text-blue-400 backdrop-blur-md"
          )}
        >
          {alert.severity === 'EMERGENCY' ? <ShieldAlert className="h-4 w-4" /> : 
           alert.severity === 'WARNING' ? <AlertTriangle className="h-4 w-4" /> : 
           <Info className="h-4 w-4" />}
          
          <span className={cn(
            "text-[10px] font-black tracking-[0.2em] uppercase",
            alert.severity === 'INFO' && "tracking-widest font-bold"
          )}>
            {alert.message}
          </span>

          <div className="flex gap-1 ml-4">
             <div className="h-1.5 w-1.5 rounded-full bg-current" />
             <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
             <div className="h-1.5 w-1.5 rounded-full bg-current opacity-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
