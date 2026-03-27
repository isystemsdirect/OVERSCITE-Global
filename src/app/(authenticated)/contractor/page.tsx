'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileEdit, 
  Network, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { VerificationStateBanner } from '@/components/contractor/VerificationStateBanner';
import { GovernanceSetup } from '@/components/contractor/GovernanceSetup';
import PartyIntake from '@/components/contractor/PartyIntake';
import { ProposalDrafting } from '@/components/contractor/ProposalDrafting';
import { OversightChain } from '@/components/contractor/OversightChain';
import { PageHeader } from '@/components/layout/PageHeader';
import type { DivisionMode, GovernanceProfile, ProposalProfile } from '@/lib/contractor/types';

export default function ContractorStatusBoard() {
  const [activeTab, setActiveTab] = useState<'status' | 'parties' | 'proposals' | 'oversight' | 'governance'>('status');
  
  // Simulated State for Phase 3 Recalibration
  const [mode, setMode] = useState<DivisionMode>('DRAFT_ASSIST_ONLY');
  
  const [governance, setGovernance] = useState<GovernanceProfile>({
    approval_thresholds: {},
    authorized_signers: [],
    seal_authority: [],
    template_set: 'Standard',
    forbidden_clauses: [],
    mandatory_clauses: [],
    sections: [
      { id: 'bylaws', title: 'Company Bylaws', content: '', attachments: [], draftWizardEnabled: true, draftState: 'none', modeVisibilityState: 'SETUP_REQUIRED', verificationBannerState: 'unverified' },
      { id: 'safety', title: 'Safety Policy', content: '', attachments: [], draftWizardEnabled: true, draftState: 'none', modeVisibilityState: 'SETUP_REQUIRED', verificationBannerState: 'unverified' }
    ]
  });

  const [proposals] = useState<ProposalProfile[]>([
    {
      id: 'prop-101',
      party_id: 'sub-77',
      title: 'Structural Steel Package - Phase A',
      scope_summary: 'Detailed erection and welding for secondary support structures.',
      base_value: 45000,
      draft_text: '[LARI ASSISTIVE DRAFT]\nReference: Project Omega\nTrade: Structural Steel\nCompliance: CSLB B General / C-51 Specialty\nRule: CA Civil Code §7018.5 applies.',
      compliance_audit: {
        packet_id: 'audit-555',
        decision_result: 'review_required',
        reason_chain: ['LARI Synthesis Complete', 'Jurisdiction: CA (CSLB)', 'Threshold: Job > $500'],
        rule_matrix_version: '2026.01.CD',
        source_refs: ['CSLB Register'],
        unresolved_flags: ['human_seal_required', 'license_active_check']
      },
      seal_status: 'draft',
      created_at: new Date().toISOString()
    }
  ]);

  const tabs = [
    { id: 'status', label: 'Division Status', icon: LayoutDashboard },
    { id: 'governance', label: 'Governance Setup', icon: ShieldCheck },
    { id: 'parties', label: 'Parties & Intake', icon: Users },
    { id: 'proposals', label: 'Proposals & Drafts', icon: FileEdit },
    { id: 'oversight', label: 'Oversight Chain', icon: Network },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      <PageHeader 
        title="Contractor Division" 
        status="live"
        description="The Contractor Management module is designed to govern the full lifecycle of third-party personnel and jurisdictional partnerships within the OVERSCITE ecosystem. It facilitates credential verification, readiness auditing, and contract resolution to ensure all external parties adhere to the strict SCINGULAR safety protocols. By providing a transparent view of contractor performance and compliance status, it maintains the trust boundaries necessary for secure global operations. This interface is critical for managing the accountability and evidentiary chains of every site inspection and field mission."
      />

      {/* Main Command Surface */}
      <main className="flex-1 overflow-hidden flex flex-col p-8">
        
        {/* Global Mode Banner */}
        <VerificationStateBanner 
          mode={mode}
          jurisdictionStatus="jurisdiction_incomplete"
          readiness="PHASE 2 RESOLUTION PENDING"
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-white/10 mb-6 px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all relative
                ${activeTab === tab.id ? 'text-indigo-400' : 'text-white/40 hover:text-white/60'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-auto rounded-xl">
          {activeTab === 'governance' && (
            <GovernanceSetup 
              governance={governance} 
              onUpdateField={(id, content) => {
                const newSections = governance.sections.map(s => s.id === id ? { ...s, content } : s);
                setGovernance({ ...governance, sections: newSections });
              }}
              onInvokeWizard={(id) => {
                const newSections = governance.sections.map(s => s.id === id ? { ...s, draftState: 'drafted' as const } : s);
                setGovernance({ ...governance, sections: newSections });
              }}
            />
          )}

          {activeTab === 'parties' && (
            <PartyIntake onPartyAdded={(p: any) => console.log('Party Added', p)} />
          )}

          {activeTab === 'proposals' && (
            <ProposalDrafting proposals={proposals} mode={mode} />
          )}

          {activeTab === 'oversight' && (
            <OversightChain />
          )}

          {activeTab === 'status' && (
            <div className="p-12 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-12 bg-white/[0.02] backdrop-blur-md">
              <ShieldCheck className="w-12 h-12 text-white/10 mb-6" />
              <h3 className="text-xl font-bold text-white/90 mb-2">Division Active: {mode}</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-8">
                Your Contractor Division is currently operating in <span className="font-bold text-white/60">{mode}</span> mode. 
                Final contract issuance and compliance certification will remain locked until jurisdiction rule-resolution 
                (Phase 2) is verified for your active regions.
              </p>
              <button 
                onClick={() => setActiveTab('governance')}
                className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded shadow-lg shadow-indigo-900/20 hover:bg-indigo-700 transition-all border border-indigo-500/30"
              >
                Complete Governance Setup
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
