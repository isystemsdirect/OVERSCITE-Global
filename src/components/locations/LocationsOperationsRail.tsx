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
    <Card className="w-24 h-full border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow flex-shrink-0 flex flex-col items-center py-4 gap-4">
       <div className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mb-2">Tools</div>
       
       {tools.map((tool) => (
         <Button
           key={tool.id}
           variant="ghost"
           onClick={() => onToolSelect(tool.id)}
           className={`w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl transition-all ${
             activeTool === tool.id 
               ? 'bg-primary/10 text-primary border border-primary/50 shadow-sm' 
               : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
           }`}
           title={tool.label}
         >
           {tool.icon}
         </Button>
       ))}
    </Card>
  );
}
