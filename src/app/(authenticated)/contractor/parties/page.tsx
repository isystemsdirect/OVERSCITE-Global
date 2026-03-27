'use client';

import React from 'react';
import PartyIntake from '@/components/contractor/PartyIntake';

export default function PartiesPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Party Intelligence</h1>
        <p className="text-white/50 text-sm max-w-2xl">
          Onboard contractor and subcontractor entities, classify roles, and resolve jurisdictional requirements.
        </p>
      </div>

      <PartyIntake />
    </div>
  );
}
