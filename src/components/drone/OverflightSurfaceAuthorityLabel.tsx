'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { Shield, ShieldAlert, User, Eye, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SurfaceAuthorityPosture, OperatorRole, SurfaceClassification } from '@/lib/lari/flight/lari-sync';

interface Props {
  surfaceId: string;
}

/**
 * @classification OVERFLIGHT_DISTRIBUTION
 * @module SURFACE_AUTHORITY_LABEL
 * @authority BANE / Governance
 * @purpose Discloses the authority posture and role for a specific distributed surface.
 */
export function OverflightSurfaceAuthorityLabel({ surfaceId }: Props) {
  const { surfaceManifest } = useLiveFlight();
  
  const manifest = surfaceManifest[surfaceId];
  if (!manifest) return null;

  const { authority, role, classification, integrity } = manifest;

  const getAuthorityColor = () => {
    switch (authority) {
      case 'DELEGATED_CONTROL': return 'text-primary border-primary/50 bg-primary/10';
      case 'ADVISORY': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'DISPLAY_ONLY': return 'text-white/40 border-white/10 bg-white/5';
      case 'BLOCKED': return 'text-red-500 border-red-500/50 bg-red-500/10';
      default: return 'text-white/20 border-white/5 bg-transparent';
    }
  };

  return (
    <div className={cn(
      "absolute top-0 right-0 p-2 flex flex-col items-end gap-1 pointer-events-none z-[50]",
      integrity !== 'ALIGNED' && "animate-pulse"
    )}>
      <div className={cn(
        "px-3 py-1 border rounded-md backdrop-blur-md flex items-center gap-3 transition-all duration-500",
        getAuthorityColor()
      )}>
        <div className="flex flex-col items-end">
           <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-60">
             {classification}
           </span>
           <span className="text-[9px] font-black uppercase tracking-widest">
             {authority.replace('_', ' ')}
           </span>
        </div>
        
        <div className="h-4 w-[1px] bg-current opacity-20" />

        {authority === 'DELEGATED_CONTROL' ? (
          <ShieldAlert className="h-3 w-3" />
        ) : authority === 'BLOCKED' ? (
          <Lock className="h-3 w-3" />
        ) : (
          <Shield className="h-3 w-3 opacity-60" />
        )}
      </div>

      <div className="flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded border border-white/5">
         <User className="h-2 w-2 text-white/40" />
         <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest">
           ROLE::{role}
         </span>
         {integrity !== 'ALIGNED' && (
           <>
             <div className="h-2 w-[1px] bg-white/10 mx-1" />
             <span className="text-[7px] font-mono text-red-400 font-bold uppercase tracking-tighter">
               {integrity}
             </span>
           </>
         )}
      </div>
    </div>
  );
}
