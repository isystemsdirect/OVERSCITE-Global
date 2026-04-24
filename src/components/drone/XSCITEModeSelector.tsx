'use client';
import React from 'react';
import { useLiveFlight, FlightMode } from '@/context/LiveFlightContext';
import { Plane, Zap, Map as MapIcon, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification XSCITE_CONTROL_MODULE
 * @module MODE_SELECTOR
 * @authority Pilot / XSCITE™
 * @purpose Multi-state flight mode selection with tactical feedback.
 */
export function XSCITEModeSelector() {
  const { 
    flightMode, setFlightMode, isArmed, authorityPosture, 
    setConsequenceState, consequenceState, blockReason, currentOperatorRole
  } = useLiveFlight();

  const modes: { id: FlightMode; icon: any; label: string }[] = [
    { id: 'MANUAL', icon: MousePointer2, label: 'MAN' },
    { id: 'HOLD', icon: Zap, label: 'HLD' },
    { id: 'PLAN', icon: MapIcon, label: 'PLN' },
  ];

  const handleModeChange = (mode: FlightMode) => {
    if (!isArmed) {
      setConsequenceState('restricted', 'MODE_LOCKED::DISARMED_POSTURE');
      setTimeout(() => setConsequenceState('idle'), 2000);
      return;
    }
    if (authorityPosture === 'INVALID') {
      setConsequenceState('blocked', 'LINK_LOSS::MODE_REJECTED');
      return;
    }

    if (currentOperatorRole === 'OBSERVER') {
      setConsequenceState('blocked', 'ROLE_RESTRICTED::OBSERVER');
      return;
    }
    
    setConsequenceState('pending_confirmation');
    setTimeout(() => {
      setFlightMode(mode);
      setConsequenceState('confirmed');
      setTimeout(() => setConsequenceState('idle'), 1000);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      <span className="text-[8px] font-black tracking-widest text-muted-foreground uppercase px-1">
        FLT MODE SELECTION
      </span>
      
      <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-md border border-white/5">
        {modes.map((mode) => {
          const isActive = flightMode === mode.id;
          const Icon = mode.icon;
          
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 gap-1 rounded transition-all duration-200 border",
                isActive 
                  ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]" 
                  : "bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/60",
                !isArmed && "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              <Icon className={cn("h-3 w-3", isActive ? "text-primary" : "text-current")} />
              <span className="text-[7px] font-black tracking-tighter">{mode.label}</span>
              
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-3 bg-primary rounded-full shadow-[0_0_5px_rgba(var(--primary-rgb),0.5)]" />
              )}

              {/* Restriction Indicator */}
              {!isArmed && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                  <div className="h-0.5 w-2 bg-red-500/50 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between px-1 text-[7px] font-mono italic">
        <span className={cn(
          (consequenceState === 'restricted' || consequenceState === 'blocked') ? "text-red-400 animate-pulse" : "text-muted-foreground"
        )}>
          {(consequenceState === 'restricted' || consequenceState === 'blocked') 
            ? `BLOCK: ${blockReason}` 
            : `SEL: ${flightMode}`
          }
        </span>
        <span className={cn(isArmed ? "text-red-500" : "text-primary")}>
          {isArmed ? 'FC_LIVE' : 'PRE_FLIGHT'}
        </span>
      </div>
    </div>
  );
}
