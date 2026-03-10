'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LocationsMapCanvas from './LocationsMapCanvas';
import LocationsCommandBar from './LocationsCommandBar';
import LocationLayerTogglePanel from './LocationLayerTogglePanel';
import LocationIntelligenceDrawer from './LocationIntelligenceDrawer';
import LocationsOperationsRail from './LocationsOperationsRail';
import { MapLayerState, LocationEntity } from '@/lib/locations/locationTypes';

export default function LocationsOverSCITE() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [layers, setLayers] = useState<MapLayerState>({
    users: true,
    clients: true,
    inspections: true,
    devices: true,
    teams: false,
    weather: false,
    hazards: false,
  });

  const [selectedEntity, setSelectedEntity] = useState<LocationEntity | null>(null);
  const [activeTool, setActiveTool] = useState<string>('navigate');

  const handleLayerChange = (layer: keyof MapLayerState, value: boolean) => {
    setLayers((prev) => ({ ...prev, [layer]: value }));
  };

  const handleSearch = (query: string) => {
    console.debug('[LocationsOverSCITE] Search request:', query);
    // STUB: Will connect to Geocoding & Entity search API
  };

  if (!apiKey) {
    return (
      <Card className="w-full h-[800px] flex items-center justify-center border-border/50 bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="text-xl font-medium text-foreground mb-2">Google Maps API Key Missing</p>
            <p>Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-[800px] flex flex-col gap-4">
      {/* Top Command Bar */}
      <LocationsCommandBar onSearch={handleSearch} />

      <div className="flex flex-row gap-4 h-full flex-grow overflow-hidden">
        
        {/* Operations Toolbar */}
        <LocationsOperationsRail 
          activeTool={activeTool} 
          onToolSelect={setActiveTool} 
        />

        {/* Layer Panel (Left Rail replacement) */}
        <div className="w-64 flex-shrink-0 flex flex-col hidden md:flex">
           <LocationLayerTogglePanel 
              layers={layers} 
              onLayerChange={handleLayerChange} 
           />
        </div>

        {/* Center Map Canvas */}
        <div className="flex-grow flex flex-col min-w-0">
           <LocationsMapCanvas />
        </div>

        {/* Right Intelligence Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col hidden xl:flex">
           <LocationIntelligenceDrawer 
              selectedEntity={selectedEntity} 
              onClose={() => setSelectedEntity(null)} 
           />
        </div>

      </div>
    </div>
  );
}
