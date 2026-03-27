import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { DivisionMode, VerificationStatus } from '../../lib/contractor/types';

interface VerificationStateBannerProps {
  mode: DivisionMode;
  jurisdictionStatus: VerificationStatus;
  readiness: string;
}

export const VerificationStateBanner: React.FC<VerificationStateBannerProps> = ({
  mode,
  jurisdictionStatus,
  readiness
}) => {
  const getModeColor = (m: DivisionMode) => {
    switch (m) {
      case 'SETUP_REQUIRED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DRAFT_ASSIST_ONLY': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'COMPLIANCE_READY': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'CONTRACT_READY': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const getStatusIcon = (s: VerificationStatus) => {
    if (s.includes('verified')) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (s.includes('incomplete') || s.includes('unverified')) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="w-full mb-6 space-y-2">
      <div className={`flex items-center justify-between p-3 rounded-xl border ${getModeColor(mode)} backdrop-blur-md shadow-lg shadow-black/20`}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-bold tracking-tight text-sm uppercase">Division Mode: {mode.replace('_', ' ')}</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
          SCINGULAR Governed Execution Layer
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 shadow-lg shadow-black/10">
          {getStatusIcon(jurisdictionStatus)}
          <div>
            <div className="text-[10px] uppercase font-bold text-white/30 leading-none mb-1">Jurisdiction Resolution</div>
            <div className="text-sm font-semibold text-white/80">{jurisdictionStatus.replace(/_/g, ' ').toUpperCase()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/10 shadow-lg shadow-black/10">
          <Info className="w-4 h-4 text-indigo-400" />
          <div>
            <div className="text-[10px] uppercase font-bold text-white/30 leading-none mb-1">Verification Readiness</div>
            <div className="text-sm font-semibold text-white/80">{readiness}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
