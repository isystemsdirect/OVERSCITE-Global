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
    <Card className="w-full h-full border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow flex-shrink-0 flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-lg flex items-center gap-2">
           <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
           Layers
        </CardTitle>
        <CardDescription className="text-muted-foreground">Visibility Control</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
        {Object.entries(layers).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 group">
            <Label htmlFor={`layer-${key}`} className="flex items-center gap-3 cursor-pointer text-sm font-medium text-foreground group-hover:text-foreground capitalize">
              <div className="w-4 h-4 rounded-sm border border-border/50 bg-muted flex items-center justify-center">
                 {value && <div className="w-2 h-2 rounded-sm bg-primary" />}
              </div>
              {key}
            </Label>
            <Switch 
              id={`layer-${key}`} 
              checked={value} 
              onCheckedChange={(checked) => onLayerChange(key as keyof MapLayerState, checked)} 
              className="data-[state=checked]:bg-primary"
            />
          </div>
        ))}

        <div className="mt-auto border-t border-border/50 pt-4">
           <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-center mb-1">
              <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Permission-gated results
           </p>
           <p className="text-xs text-muted-foreground text-center">Entity overlays apply current user policy.</p>
        </div>
      </CardContent>
    </Card>
  );
}
