'use client';

import React from 'react';
import { GitGraph, Shield, User, FileCheck, AlertCircle } from 'lucide-react';
import type { PartyEntity, VerificationStatus } from '../../lib/contractor/types';

interface OversightNodeProps {
  party: PartyEntity;
  verificationStatus: VerificationStatus;
  licenseRequired: boolean;
  registrationRequired: boolean;
}

const OversightNode: React.FC<OversightNodeProps> = ({ 
  party, 
  verificationStatus,
  licenseRequired,
  registrationRequired
}) => {
  const isCompliant = verificationStatus.includes('verified');
  
  return (
    <div className="flex flex-col p-4 bg-white/[0.03] border border-white/10 rounded-lg shadow-xl shadow-black/20 w-[280px] backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {party.prime_or_sub === 'prime' ? <Shield className="w-4 h-4 text-indigo-400" /> : <User className="w-4 h-4 text-white/20" />}
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{party.role_type.replace('_', ' ')}</span>
        </div>
        <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
          isCompliant ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {verificationStatus.replace(/_/g, ' ')}
        </div>
      </div>
      
      <h4 className="font-bold text-white/90 text-sm truncate mb-3">{party.company_or_person_name}</h4>
      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-white/30">License Required</span>
          <span className={`font-bold ${licenseRequired ? 'text-indigo-400' : 'text-white/10'}`}>{licenseRequired ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-white/30">Registration Required</span>
          <span className={`font-bold ${registrationRequired ? 'text-indigo-400' : 'text-white/10'}`}>{registrationRequired ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
          <span className="text-white/30 uppercase tracking-tighter font-bold">Verification State</span>
          <span className={`font-bold uppercase ${isCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isCompliant ? 'Verified' : 'Review Required'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OversightChain: React.FC = () => {
  // Simulated chain with evidence-bearing nodes
  return (
    <div className="p-8 bg-white/[0.01] rounded-xl border border-white/10 min-h-[500px] overflow-auto backdrop-blur-sm shadow-inner shadow-black/20">
      <div className="flex items-center gap-2 mb-8 text-white/80">
        <GitGraph className="w-5 h-5 text-indigo-400" />
        <h2 className="font-bold tracking-tight">Governed Oversight Chain</h2>
        <div className="ml-auto flex items-center gap-4 text-[10px] font-bold text-white/30">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/20" /> VERIFIED</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/20" /> MANUAL REVIEW</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 relative">
        {/* Prime Node */}
        <OversightNode 
          party={{ 
            party_id: 'p1', 
            company_or_person_name: 'Overcite Prime Construction', 
            role_type: 'prime_contractor', 
            prime_or_sub: 'prime',
            direct_to_owner: true,
            trade_class: ['General'],
            self_perform_allowed: true
          }} 
          verificationStatus="verified_active"
          licenseRequired={true}
          readiness="PHASE 2 RESOLUTION PENDING"
          registrationRequired={true}
        />

        {/* Connector */}
        <div className="w-px h-12 bg-white/10 relative">
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 p-1 bg-background/50 border border-white/10 rounded-full backdrop-blur-md">
            <FileCheck className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Subs Row */}
        <div className="flex gap-8">
          <OversightNode 
            party={{ 
              party_id: 's1', 
              company_or_person_name: 'ElectriSeal Specialties', 
              role_type: 'subcontractor', 
              prime_or_sub: 'sub',
              direct_to_owner: false,
              trade_class: ['Electrical'],
              self_perform_allowed: false
            }} 
            verificationStatus="verified_registered_only"
            licenseRequired={true}
            registrationRequired={true}
          />
          <OversightNode 
            party={{ 
              party_id: 's2', 
              company_or_person_name: 'FlowGuard Plumbing', 
              role_type: 'subcontractor', 
              prime_or_sub: 'sub',
              direct_to_owner: false,
              trade_class: ['Plumbing'],
              self_perform_allowed: true
            }} 
            verificationStatus="unverified"
            licenseRequired={true}
            registrationRequired={false}
          />
        </div>
      </div>
      
      <div className="mt-12 p-4 bg-white/[0.03] border border-white/10 rounded-lg flex items-start gap-3 backdrop-blur-md">
        <AlertCircle className="w-4 h-4 text-amber-500/80 mt-0.5" />
        <div className="text-[11px] text-white/40 leading-relaxed">
          <span className="font-bold text-white/80">OVERSCITE Lineage Note:</span> Each node represents an independent verification locus. 
          Compliance status is not inherited from upstream Prime contractors; all participants must maintain their own 
          governed verification evidence. No aggregate compliance scoring is permitted.
        </div>
      </div>
    </div>
  );
};

export default OversightChain;
