'use client';

import { useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Shield, Lock, Activity } from 'lucide-react';
import { IPNPostureStateEnum } from '@/lib/ipn/types';
import { DEFAULT_POSTURE, getPostureDefinition } from '@/lib/ipn/posture';

export default function IPNGovernancePanel() {
    const posture = DEFAULT_POSTURE;
    const def = getPostureDefinition(posture.currentState);

    const PostureIcon = useMemo(() => {
        if (posture.currentState === IPNPostureStateEnum.Aggressive) return ShieldCheck;
        if (posture.currentState === IPNPostureStateEnum.Controlled) return Shield;
        return ShieldAlert;
    }, [posture.currentState]);

    return (
        <div className="flex flex-col gap-2 mt-4 border-t border-border/30 pt-4 px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity size={14} /> BANE IPN Monitoring
            </h3>
            
            <div className="bg-black/40 border border-primary/20 rounded p-3 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase">Network Posture</span>
                        <span className="text-primary font-bold flex items-center gap-2 mt-0.5">
                            <PostureIcon size={16} className={posture.currentState === IPNPostureStateEnum.Aggressive ? 'text-green-500' : 'text-yellow-500'} />
                            {def.label}
                        </span>
                    </div>
                </div>
                
                <p className="text-[10px] text-muted-foreground leading-tight">
                    {def.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex flex-col bg-black/60 p-1.5 rounded border border-white/5">
                        <span className="text-[9px] text-muted-foreground uppercase">Safety Core</span>
                        <span className="text-[11px] font-bold text-green-400 flex items-center gap-1">
                            <Lock size={10} /> {posture.safetyCoreLocked ? 'LOCKED' : 'UNLOCKED'}
                        </span>
                    </div>
                    <div className="flex flex-col bg-black/60 p-1.5 rounded border border-white/5">
                        <span className="text-[9px] text-muted-foreground uppercase">Conflict Pressure</span>
                        <span className="text-[11px] font-bold text-yellow-400">{posture.conflictPressure}%</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 text-[9px] font-mono text-muted-foreground bg-black/60 p-2 rounded border border-white/5 mt-1">
                    <div className="flex justify-between"><span>Identity Binding:</span> <span className="text-white">ENFORCED</span></div>
                    <div className="flex justify-between"><span>Audit Chain:</span> <span className="text-white">IMMUTABLE</span></div>
                    <div className="flex justify-between"><span>Protocol Ver:</span> <span className="text-white truncate max-w-[120px]">{posture.protocolVersion}</span></div>
                    <div className="flex justify-between"><span>Policy Pack:</span> <span className="text-white truncate max-w-[120px]">{posture.policyPackVersion}</span></div>
                </div>
                
                <div className="bg-primary/10 border border-primary/20 p-2 text-[10px] text-primary rounded leading-tight">
                    <span className="font-bold">Recommendation:</span> <br />
                    {posture.recommendation}
                </div>
            </div>
        </div>
    );
}
