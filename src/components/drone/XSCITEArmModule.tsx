'use client';
import React, { useState, useEffect } from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Shield, ShieldAlert, Zap, AlertTriangle, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification XSCITE_CONTROL_MODULE
 * @module ARM_DISARM
 * @authority Pilot / XSCITE™
 * @purpose Cockpit-grade arming switch with safety gating and visual state feedback.
 */
export function XSCITEArmModule() {
  const { 
    isArmed, setArmed, isConnected, safeStateVerified, authorityPosture,
    setConsequenceState, consequenceState, blockReason, currentOperatorRole
  } = useLiveFlight();
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (isPending) return;
    
    if (!isConnected) {
      setConsequenceState('blocked', 'LINK_LOSS::COMMAND_REJECTED');
      return;
    }

    if (authorityPosture === 'INVALID') {
      setConsequenceState('blocked', 'AUTHORITY_POSTURE::INVALID');
      return;
    }

    if (currentOperatorRole === 'OBSERVER' || currentOperatorRole === 'SUPPORT') {
      setConsequenceState('blocked', `ROLE_RESTRICTED::${currentOperatorRole}`);
      return;
    }

    setIsPending(true);
    setConsequenceState('pending_confirmation');
    
    // Simulate tactical delay for arming sequence
    setTimeout(() => {
      setArmed(!isArmed);
      setIsPending(false);
      setConsequenceState('confirmed');
      setTimeout(() => setConsequenceState('idle'), 2000);
    }, 800);
  };

  const isBlocked = !isConnected || (authorityPosture === 'INVALID');

  useEffect(() => {
    if (consequenceState === 'blocked' && isConnected && authorityPosture !== 'INVALID') {
      setConsequenceState('idle');
    }
  }, [isConnected, authorityPosture, consequenceState, setConsequenceState]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[140px] select-none">
      <div className="flex items-center justify-between px-1">
        <span className="text-[8px] font-black tracking-tighter text-muted-foreground uppercase italic">XSCITE™ CONTROL</span>
        <div className={cn(
          "h-1 w-1 rounded-full",
          isConnected ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-red-500 animate-pulse"
        )} />
      </div>

      <button
        onClick={handleToggle}
        disabled={isBlocked || isPending}
        className={cn(
          "relative h-12 w-full rounded-md border transition-all duration-200 flex items-center justify-center overflow-hidden group",
          isArmed 
            ? "bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
            : "bg-black/60 border-white/20 hover:border-white/40",
          isBlocked && "opacity-50 cursor-not-allowed grayscale",
          isPending && "animate-pulse"
        )}
      >
        {/* Tactical Glow Effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
          isArmed ? "bg-red-500/10" : "bg-primary/5"
        )} />

        <div className="flex flex-col items-center gap-1 z-10">
          {isArmed ? (
            <>
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <span className="text-[9px] font-black tracking-[0.2em] text-red-400 uppercase">ARMED</span>
            </>
          ) : (
            <>
              <Shield className={cn("h-4 w-4", isPending ? "text-primary" : "text-white/40")} />
              <span className="text-[9px] font-black tracking-[0.2em] text-white/60 uppercase">
                {isPending ? 'ARMING...' : 'DISARMED'}
              </span>
            </>
          )}
        </div>

        {/* Consequence Overlay */}
        {consequenceState === 'blocked' && blockReason && (
          <div className="absolute inset-0 bg-red-950/90 flex items-center justify-center z-20 px-2 text-center">
            <span className="text-[7px] font-black text-red-400 animate-pulse tracking-widest leading-tight">
              {blockReason}
            </span>
          </div>
        )}
        
        {consequenceState === 'pending_confirmation' && (
           <div className="absolute inset-0 bg-primary/10 animate-pulse z-20 flex items-center justify-center">
              <span className="text-[7px] font-black text-primary tracking-[0.3em]">PROCESSING...</span>
           </div>
        )}

        {consequenceState === 'confirmed' && (
           <div className="absolute inset-0 bg-green-500/20 z-20 flex items-center justify-center">
              <span className="text-[7px] font-black text-green-400 tracking-[0.3em]">CONFIRMED</span>
           </div>
        )}

        {/* Status Line */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[1px]",
          isArmed ? "bg-red-500 shadow-[0_0_5px_red]" : "bg-white/10"
        )} />
      </button>

      <div className="flex justify-between items-center px-1">
        <div className="flex gap-1">
          <div className={cn("h-1 w-2 rounded-sm", isArmed ? "bg-red-500" : "bg-white/5")} />
          <div className={cn("h-1 w-2 rounded-sm", isConnected ? "bg-green-500" : "bg-white/5")} />
        </div>
        <span className={cn(
          "text-[7px] font-mono",
          safeStateVerified ? "text-green-500" : "text-muted-foreground"
        )}>
          {safeStateVerified ? 'SAFE-VERIFIED' : 'GATED'}
        </span>
      </div>
    </div>
  );
}
