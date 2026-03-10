'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MapLayerState {
  users: boolean;
  clients: boolean;
  inspections: boolean;
  devices: boolean;
  teams: boolean;
  weather: boolean;
  hazards: boolean;
}

interface LocationLayerTogglePanelProps {
  layers: MapLayerState;
  onLayerChange: (layer: keyof MapLayerState, value: boolean) => void;
}

export default function LocationLayerTogglePanel({ layers, onLayerChange }: LocationLayerTogglePanelProps) {
  return (
    <Card className="w-full h-full bg-zinc-950 border-zinc-800 flex-shrink-0 flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-zinc-100 text-lg flex items-center gap-2">
           <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           Layers
        </CardTitle>
        <CardDescription className="text-zinc-400">Visibility Control</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
        {Object.entries(layers).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800 group">
            <Label htmlFor={`layer-${key}`} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-zinc-300 group-hover:text-zinc-100 capitalize">
              <div className="w-4 h-4 rounded-sm border border-zinc-600 bg-zinc-800 flex items-center justify-center">
                 {value && <div className="w-2 h-2 rounded-sm bg-emerald-400" />}
              </div>
              {key}
            </Label>
            <Switch 
              id={`layer-${key}`} 
              checked={value} 
              onCheckedChange={(checked) => onLayerChange(key as keyof MapLayerState, checked)} 
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        ))}

        <div className="mt-auto border-t border-zinc-800 pt-4">
           <p className="text-xs text-zinc-500 flex items-center gap-1.5 justify-center mb-1">
              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Permission-gated results
           </p>
           <p className="text-xs text-zinc-600 text-center">Entity overlays apply current user policy.</p>
        </div>
      </CardContent>
    </Card>
  );
}
