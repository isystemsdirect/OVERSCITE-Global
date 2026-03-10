'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crosshair, Map, Navigation, Shield, Thermometer } from 'lucide-react';

interface LocationsOperationsRailProps {
  onToolSelect: (tool: string) => void;
  activeTool: string;
}

export default function LocationsOperationsRail({ onToolSelect, activeTool }: LocationsOperationsRailProps) {
  const tools = [
    { id: 'navigate', icon: <Navigation className="w-5 h-5" />, label: 'Navigate' },
    { id: 'measure', icon: <Crosshair className="w-5 h-5" />, label: 'Measure' },
    { id: 'geofence', icon: <Map className="w-5 h-5" />, label: 'Geofence' },
    { id: 'weather', icon: <Thermometer className="w-5 h-5" />, label: 'Weather Context' },
    { id: 'audit', icon: <Shield className="w-5 h-5" />, label: 'Audit Trail' },
  ];

  return (
    <Card className="w-24 h-full bg-zinc-950 border-zinc-800 flex-shrink-0 flex flex-col items-center py-4 gap-4">
       <div className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-2">Tools</div>
       
       {tools.map((tool) => (
         <Button
           key={tool.id}
           variant="ghost"
           onClick={() => onToolSelect(tool.id)}
           className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
             activeTool === tool.id 
               ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
               : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
           }`}
           title={tool.label}
         >
           {tool.icon}
         </Button>
       ))}
    </Card>
  );
}
