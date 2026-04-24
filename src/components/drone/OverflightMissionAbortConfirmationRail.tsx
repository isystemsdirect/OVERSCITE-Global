'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @classification OVERFLIGHT_SURFACE
 * @module MISSION_ABORT_RAIL
 * @authority BANE / Pilot
 * @purpose Governed mission interruption with confirmation and boundary logic.
 */
export function OverflightMissionAbortConfirmationRail() {
  const { missionState, setMissionState, setConsequenceState } = useLiveFlight();

  if (missionState !== 'abort_pending') return null;

  const handleConfirm = () => {
    setMissionState('aborted');
    setConsequenceState('confirmed', 'PILOT_INITIATED_ABORT');
  };

  const handleCancel = () => {
    setMissionState('in_progress');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-black border-2 border-red-600/50 p-8 rounded-2xl w-[400px] shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col items-center gap-6 text-center">
        <div className="bg-red-600/20 p-4 rounded-full border border-red-500/50">
           <AlertTriangle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2">
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Confirm Mission Abort</h2>
           <p className="text-xs text-white/60 leading-relaxed">
             Aborting will terminate the active flight path and engage automatic RTH. 
             This action is <span className="text-red-400 font-bold">FINAL</span> and will be recorded in the ArcHive™ witness stream.
           </p>
        </div>

        <div className="w-full flex flex-col gap-3">
           <button 
             onClick={handleConfirm}
             className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 group"
           >
             <XCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
             CONFIRM_ABORT
           </button>
           <button 
             onClick={handleCancel}
             className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
           >
             <ArrowLeft className="h-4 w-4" />
             RESUME_MISSION
           </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
           <span className="text-[8px] font-black text-red-500/60 uppercase tracking-[0.2em]">GOVERNANCE::BANE_0041</span>
           <div className="h-1 w-1 rounded-full bg-red-500/40" />
           <span className="text-[8px] font-mono text-white/20 uppercase">AUTH_REQUIRED</span>
        </div>
      </div>
    </div>
  );
}
