'use client';

import React from 'react';
import GovernanceSetup from '@/components/contractor/GovernanceSetup';

export default function GovernanceSetupPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Company Governance Setup</h1>
        <p className="text-white/50 text-sm max-w-2xl">
          Establish the legal and operational guardrails required for contract-capable drafting.
          This system remains in Draft Assist Only Mode until all prerequisites are met.
        </p>
      </div>

      <GovernanceSetup governance={{ sections: [] } as any} onUpdateField={() => {}} onInvokeWizard={() => {}} />
    </div>
  );
}
