'use client';
import React from 'react';
import { useLiveFlight } from '@/context/LiveFlightContext';
import { User, Users, Shield, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OperatorRole } from '@/lib/lari/flight/lari-sync';

/**
 * @classification OVERFLIGHT_DEV_TOOL
 * @module OPERATOR_ROLE_SWITCHER
 * @authority Pilot / Supervisor
 * @purpose Allows switching the active operator role for testing authority-scoped multi-surface scaling.
 */
export function OperatorRoleSwitcher() {
  const { currentOperatorRole, setOperatorRole } = useLiveFlight();

  const roles: { id: OperatorRole; icon: any; label: string }[] = [
    { id: 'PILOT', icon: User, label: 'PILOT' },
    { id: 'OBSERVER', icon: Eye, label: 'OBSERVER' },
    { id: 'SUPPORT', icon: Users, label: 'SUPPORT' },
    { id: 'SUPERVISOR', icon: Shield, label: 'SUPERVISOR' },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-black tracking-widest text-primary">OPERATOR_ROLE_RAIL</span>
      <div className="grid grid-cols-2 gap-1">
        {roles.map(({ id, icon: Icon, label }) => (
          <button
            id={`stress-role-${id}`}
            key={id}
            onClick={() => setOperatorRole(id)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 border rounded transition-all",
              currentOperatorRole === id
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
            )}
          >
            <Icon className="h-2.5 w-2.5" />
            <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
