'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LocationEntity } from '@/lib/locations/locationTypes';

interface LocationIntelligenceDrawerProps {
  selectedEntity: LocationEntity | null;
  onClose: () => void;
}

export default function LocationIntelligenceDrawer({ selectedEntity, onClose }: LocationIntelligenceDrawerProps) {
  if (!selectedEntity) {
    return (
      <Card className="w-full h-full bg-zinc-950 border-zinc-800 flex-shrink-0 flex flex-col xl:flex">
         <CardHeader className="pb-4 border-b border-zinc-800/50">
          <CardTitle className="text-zinc-100 text-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Live Intelligence
          </CardTitle>
          <CardDescription className="text-zinc-400">Entity Details</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center items-center text-zinc-500 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="2"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="M20 12h2"/>
              <path d="M2 12h2"/>
            </svg>
            <p className="text-sm">Select an entity on the map to view detailed operational intelligence, active telemetry, and risk scoring.</p>
        </CardContent>
      </Card>
    );
  }

  // STUB: This is where we will render actual entity details once Phase 2 connects Firestore
  return (
    <Card className="w-full h-full bg-zinc-950 border-zinc-800 flex-shrink-0 flex flex-col xl:flex relative">
       <button 
         onClick={onClose}
         className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
       >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
       </button>
       <CardHeader className="pb-4 border-b border-zinc-800/50 pr-12">
        <CardTitle className="text-zinc-100 text-lg flex items-center gap-2 uppercase tracking-wide">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          {selectedEntity.entityType} Selected
        </CardTitle>
        <CardDescription className="text-zinc-400">ID: {selectedEntity.entityId}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-6 overflow-y-auto">
         <div className="space-y-4">
            <div>
               <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-1">Coordinates</h4>
               <p className="text-sm text-zinc-300 font-mono bg-zinc-900 p-2 rounded-md border border-zinc-800">
                  {selectedEntity.lat.toFixed(6)}, {selectedEntity.lng.toFixed(6)}
               </p>
            </div>
            
            <div>
               <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-1">Source & Status</h4>
               <p className="text-sm text-zinc-300">{selectedEntity.source} — <span className="text-emerald-400">{selectedEntity.status}</span></p>
               <p className="text-xs text-zinc-500 mt-1">Last Update: {new Date(selectedEntity.timestamp).toLocaleString()}</p>
            </div>

            <div>
               <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-1">Governance Policy</h4>
               <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                    {selectedEntity.visibilityPolicy}
                  </div>
               </div>
            </div>

            {selectedEntity.addressNormalized && (
               <div>
                 <h4 className="text-xs uppercase font-bold text-zinc-500 tracking-wider mb-1">Normalized Address</h4>
                 <p className="text-sm text-zinc-300">{selectedEntity.addressNormalized}</p>
               </div>
            )}

            <div className="mt-8 border-t border-zinc-800 pt-6">
                <p className="text-xs text-zinc-500 italic text-center">
                   Phase 2 connection required for live telemetry, routing, and weather correlation views.
                </p>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
