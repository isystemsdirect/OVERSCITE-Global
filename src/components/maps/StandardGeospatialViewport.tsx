'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Map as MapIcon, 
  Layers, 
  Box, 
  Image as ImageIcon, 
  Maximize2, 
  Compass,
  Navigation2
} from 'lucide-react';
import { loadGoogleMaps } from '@/lib/locations/googleMapsLoader';
import { cn } from '@/lib/utils';

interface StandardGeospatialViewportProps {
  address: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  show3D?: boolean;
  showPhotos?: boolean;
}

/**
 * STANDARD GEOSPATIAL INTELLIGENCE VIEWPORT
 * Governed by L-UTCB-S__20260420-000000Z
 * Mandatory surface for all PIP Pages.
 */
export const StandardGeospatialViewport: React.FC<StandardGeospatialViewportProps> = ({
  address,
  lat = 39.8283, // Default US Center if not provided
  lng = -98.5795,
  zoom = 18,
  className,
  show3D = true,
  showPhotos = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('satellite');
  const [is3D, setIs3D] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        
        const google = await loadGoogleMaps();
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom,
          mapTypeId: activeLayer,
          tilt: is3D ? 45 : 0,
          heading: 0,
          mapId: 'PIP_GEOSPATIAL_STANDARD', // Use default if no custom ID
          disableDefaultUI: true,
          gestureHandling: 'greedy',
        });

        // Add standard property marker
        new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: { lat, lng },
          title: address,
        });

        setMap(mapInstance);
      } catch (err: any) {
        console.error('[GeospatialViewport] Error:', err);
        setMapError(err.message || 'Failed to initialize Map Engine');
      }
    };

    initMap();
  }, [lat, lng, zoom]);

  useEffect(() => {
    if (map) {
      map.setMapTypeId(activeLayer);
    }
  }, [activeLayer, map]);

  const toggle3D = () => {
    if (map) {
      const next3D = !is3D;
      setIs3D(next3D);
      map.setTilt(next3D ? 45 : 0);
    }
  };

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-border/50 bg-background/40 shadow-lg group h-[400px]", className)}>
        {/* Layer Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Card className="p-1 flex flex-col gap-1 bg-background/80 backdrop-blur-md border-border/40 shadow-xl">
                <Button 
                    variant={activeLayer === 'roadmap' ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setActiveLayer('roadmap')}
                    title="Map View"
                >
                    <MapIcon className="h-4 w-4" />
                </Button>
                <Button 
                    variant={activeLayer === 'satellite' ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setActiveLayer('satellite')}
                    title="Satellite View"
                >
                    <Layers className="h-4 w-4" />
                </Button>
                <div className="h-px bg-border/50 mx-1" />
                <Button 
                    variant={is3D ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={toggle3D}
                    title="3D Perspective"
                    disabled={activeLayer === 'roadmap'}
                >
                    <Box className="h-4 w-4" />
                </Button>
            </Card>

            <Card className="p-1 bg-background/80 backdrop-blur-md border-border/40 shadow-xl">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </Card>
        </div>

        {/* Orientation Controls */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <Card className="p-1 px-3 flex items-center gap-3 bg-background/80 backdrop-blur-md border-border/40 text-[10px] font-mono tracking-wider tabular-nums">
                <div className="flex items-center gap-1.5 border-r border-border/50 pr-3">
                    <Navigation2 className="h-3 w-3 text-primary rotate-[-45deg]" />
                    <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                </div>
                <span>Z:{zoom}</span>
            </Card>
        </div>

        {/* Identity Anchor */}
        <div className="absolute top-4 left-4 z-10">
            <Card className="bg-background/80 backdrop-blur-md border-border/40 px-3 py-1.5 flex items-center gap-2 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase">GEOSPATIAL INTELLIGENCE VIEWPORT</span>
            </Card>
        </div>

        {/* Map Container */}
        {mapError ? (
            <div className="w-full h-full flex items-center justify-center p-8 bg-muted/20">
                <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-destructive">Viewport Engine Error</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">{mapError}</p>
                </div>
            </div>
        ) : (
            <div ref={mapRef} className="w-full h-full bg-muted/10" />
        )}
    </div>
  );
};
