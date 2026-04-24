'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Map as MapIcon, Navigation, Target, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @classification ALWAYS_ON_MAP
 * @purpose Persistent geospatial awareness for Live Flight.
 */
export function LiveFlightMap({ className }: { className?: string }) {
  return (
    <Card className={cn("border-white/10 bg-black/60 backdrop-blur-md overflow-hidden flex flex-col", className)}>
      <CardHeader className="py-2 px-3 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
        <CardTitle className="text-[10px] font-bold tracking-tighter flex items-center gap-1.5 uppercase opacity-70">
          <MapIcon className="h-3 w-3 text-primary" />
          Geospatial Context
        </CardTitle>
        <Badge variant="outline" className="h-4 text-[8px] border-green-500/30 text-green-400 font-mono">
          GPS: LOCK
        </Badge>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative bg-[#0d1117] min-h-[150px]">
        {/* Placeholder Map Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #30363d 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        
        {/* Drone Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
          <Navigation className="h-5 w-5 text-primary rotate-45" />
        </div>

        {/* Home Point */}
        <div className="absolute top-1/3 left-1/4">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-[8px] text-blue-400 font-mono absolute -top-3 -left-2 whitespace-nowrap">HOME_P1</span>
        </div>

        {/* Geofence Boundary (Visual) */}
        <div className="absolute inset-4 border border-dashed border-red-500/20 rounded-lg pointer-events-none flex items-center justify-center">
            <span className="text-[7px] text-red-500/30 uppercase tracking-[0.3em] rotate-12">Restricted Airspace</span>
        </div>

        {/* Map UI Overlay */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
           <div className="bg-black/80 p-1 rounded border border-white/10 text-[8px] font-mono text-white/60">
              LAT: 34.0522° N
           </div>
           <div className="bg-black/80 p-1 rounded border border-white/10 text-[8px] font-mono text-white/60">
              LNG: 118.2437° W
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
