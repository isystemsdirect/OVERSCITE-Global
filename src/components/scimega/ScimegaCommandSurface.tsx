"use client";

import React from 'react';
import { ScimegaSystemStateHeader } from './ui/ScimegaSystemStateHeader';
import { ScimegaCommandRail } from './ui/ScimegaCommandRail';
import { ScimegaPrimePanel } from './ui/ScimegaPrimePanel';
import { ScimegaAuthorityRail } from './ui/ScimegaAuthorityRail';
import { ScimegaEventTimeline } from './ui/ScimegaEventTimeline';
import { ScimegaAuthorityFlowTrace } from './ui/ScimegaAuthorityFlowTrace';
import { ScimegaScingPresencePanel } from './ui/ScimegaScingPresencePanel';
import { SCIMEGADomain, SCIMEGASystemStatus } from '@/lib/scimega/uix/scimega-uix-state';
import { SCIMEGAAuthorityLevel, SCIMEGAAuthorityFlowEvent } from '@/lib/scimega/uix/scimega-authority-flow-trace';

interface ScimegaCommandSurfaceProps {
  activeDomain: SCIMEGADomain;
  onDomainChange: (domain: SCIMEGADomain) => void;
  systemStatus: SCIMEGASystemStatus;
  phase: string;
  authority: {
    scing: boolean;
    iu: boolean;
    bane: boolean;
    teon: boolean;
    arc: boolean;
  };
  dominantAuthority: SCIMEGAAuthorityLevel;
  scingAdvisory: {
    statement: string;
    interpretation: string;
    explanation?: string;
  };
  authorityFlowEvents: SCIMEGAAuthorityFlowEvent[];
  authorityDetails: {
    scingStatus: string;
    iuBinding: string;
    archivalStatus: string;
    baneGates: { label: string; status: 'APPROVED' | 'PENDING' | 'LOCKED' | 'ERROR' }[];
    teonStack: { label: string; active: boolean }[];
    arcSignature: string;
    preemptionReason?: string;
  };
  events: any[];
  children: React.ReactNode;
}

export function ScimegaCommandSurface({
  activeDomain,
  onDomainChange,
  systemStatus,
  phase,
  authority,
  dominantAuthority,
  scingAdvisory,
  authorityFlowEvents,
  authorityDetails,
  events,
  children
}: ScimegaCommandSurfaceProps) {
  return (
    <div className="fixed inset-0 bg-[#050505] text-white flex flex-col font-sans selection:bg-primary/30 overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.03),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none mix-blend-overlay" />

      {/* Header */}
      <ScimegaSystemStateHeader 
        status={systemStatus}
        phase={phase}
        authority={authority}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rail */}
        <ScimegaCommandRail 
          activeDomain={activeDomain}
          onDomainChange={onDomainChange}
        />

        {/* Center Prime Panel */}
        <ScimegaPrimePanel activeDomain={activeDomain}>
          <div className="grid grid-cols-12 gap-8 h-full">
            <div className="col-span-8 flex flex-col gap-8">
              {children}
            </div>
            <div className="col-span-4 flex flex-col gap-8">
              <ScimegaScingPresencePanel 
                advisory={scingAdvisory}
                systemStatus={systemStatus}
              />
              <ScimegaAuthorityFlowTrace 
                events={authorityFlowEvents}
              />
            </div>
          </div>
        </ScimegaPrimePanel>

        {/* Right Authority Rail */}
        <ScimegaAuthorityRail 
          dominantAuthority={dominantAuthority}
          {...authorityDetails}
        />
      </div>

      {/* Bottom Event Timeline */}
      <ScimegaEventTimeline events={events} />
    </div>
  );
}
