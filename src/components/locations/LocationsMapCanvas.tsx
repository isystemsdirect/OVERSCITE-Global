'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { loadGoogleMaps } from '@/lib/locations/googleMapsLoader';

interface LocationsMapCanvasProps {
  mapId?: string; // Optional: Required for AdvancedMarkerElement styling in Google Maps Platform
}

export default function LocationsMapCanvas({ mapId }: LocationsMapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let activeMap: google.maps.Map | null = null;

    const initializeMap = async () => {
      try {
        if (!mapRef.current) return;

        const googleApi = await loadGoogleMaps();
        
        // Use a generic map ID if none provided, but note that advanced markers require a valid Map ID from Google Cloud Console
        const finalMapId = mapId || 'OVERSCITE_GLOBAL_DEFAULT';

        activeMap = new googleApi.maps.Map(mapRef.current, {
          center: { lat: 39.8283, lng: -98.5795 }, // US Center
          zoom: 4,
          mapTypeId: 'satellite',
          disableDefaultUI: false, // We may want to turn these off later and build custom controls
          mapId: finalMapId, // required for AdvancedMarkers
        });

        // STUB: Here is where we will hook up layer state, listen to bounds_changed, 
        // and fetch entity pins to render on the map programmatically.
        
        console.debug('[LocationsMapCanvas] Google Maps JS API Loaded successfully.');

      } catch (error: any) {
        console.error('Error loading Google Maps:', error);
        setMapError(error.message || 'Failed to initialize Google Maps Platform.');
      }
    };

    initializeMap();

    return () => {
      // Cleanup if necessary
      activeMap = null;
    };
  }, [mapId]);

  if (mapError) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-zinc-950 border-zinc-800 p-8">
        <div className="text-center text-zinc-400">
          <p className="text-xl font-medium text-red-400 mb-2">Map Engine Error</p>
          <p>{mapError}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-zinc-950 group rounded-xl border border-zinc-800">
       {/* Visual indicator for shell-phase mapping */}
       <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <span className="text-zinc-200 text-sm font-medium tracking-wide uppercase">Operational Canvas [Phase 1B]</span>
       </div>
      
       {/* Google Map Container */}
       <div ref={mapRef} className="w-full h-full grayscale-[0.2] contrast-[1.1] brightness-[0.9]" />
    </div>
  );
}
