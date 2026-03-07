
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Inspector, Client } from '@/lib/types';
import { Loader2, AlertTriangle, Layers, Cloud, Wind } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const initialCenter = {
  lat: 34.0522,
  lng: -118.2437
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: true,
    styles: [
        {
          "elementType": "geometry",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#746855" }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#d59563" }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#d59563" }]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{ "color": "#263c3f" }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#6b9a76" }]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{ "color": "#38414e" }]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#212a37" }]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#9ca5b3" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{ "color": "#746855" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{ "color": "#1f2835" }]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#f3d19c" }]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{ "color": "#2f3948" }]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#d59563" }]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{ "color": "#17263c" }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#515c6d" }]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#17263c" }]
        }
    ]
};

interface MarketplaceMapProps {
    inspectors?: Inspector[];
    clients?: Client[];
}

export function MarketplaceMap({ inspectors = [], clients = [] }: MarketplaceMapProps) {
  const router = useRouter();
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'],
    preventGoogleFontsLoading: true,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(10);
  const [activeInspector, setActiveInspector] = useState<Inspector | null>(null);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [mapTypeId, setMapTypeId] = useState('roadmap');

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(12);
        },
        () => {
          console.log("Geolocation permission denied. Using default location.");
        }
      );
    }
  }, []);

  if (loadError) {
    return (
        <div className="flex items-center justify-center h-full w-full bg-muted p-4 rounded-lg border border-border">
            <Alert variant="destructive" className="max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Map Load Error</AlertTitle>
                <AlertDescription>
                    Unable to load Google Maps API. Please check your API key configuration.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!isLoaded) {
      return (
          <div className="flex flex-col items-center justify-center h-full w-full bg-muted/50 rounded-lg border border-border animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
              <p className="text-xs text-muted-foreground">Initializing Satellite Uplink...</p>
          </div>
      )
  }

  return (
      <div className="relative w-full h-full rounded-lg overflow-hidden border border-border shadow-inner">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={{
              ...mapOptions, 
              mapTypeId,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
          }}
          onLoad={onLoad}
        >
            
          {inspectors.map(inspector => (
              <MarkerF 
                  key={`inspector-${inspector.id}`} 
                  position={{ lat: inspector.location.lat, lng: inspector.location.lng }}
                  onClick={() => router.push(`/teams/${inspector.id}`)}
                  onMouseOver={() => setActiveInspector(inspector)}
                  onMouseOut={() => setActiveInspector(null)}
                  // Custom marker for inspectors (Blue)
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
              />
          ))}
          
          {activeInspector && (
             <InfoWindowF
                position={{ lat: activeInspector.location.lat, lng: activeInspector.location.lng }}
                onCloseClick={() => setActiveInspector(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -10) }}
             >
                 <div className="p-2 min-w-[150px]">
                     <h4 className="font-bold text-sm text-black">{activeInspector.name}</h4>
                     <p className="text-xs text-gray-600">{activeInspector.role}</p>
                     <div className="mt-1 flex gap-1">
                        {activeInspector.status === 'Available' && <span className="inline-block w-2 h-2 rounded-full bg-green-500"/>}
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{activeInspector.status}</span>
                     </div>
                 </div>
             </InfoWindowF>
          )}

          {clients.map(client => (
              <MarkerF 
                  key={`client-${client.id}`}
                  position={{ lat: client.location.lat, lng: client.location.lng }}
                  onClick={() => router.push(`/clients/${client.id}`)}
                  onMouseOver={() => setActiveClient(client)}
                  onMouseOut={() => setActiveClient(null)}
                   // Custom marker for clients (Teal)
                   icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: "#14b8a6",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
              />
          ))}

            {activeClient && (
             <InfoWindowF
                position={{ lat: activeClient.location.lat, lng: activeClient.location.lng }}
                onCloseClick={() => setActiveClient(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -10) }}
             >
                 <div className="p-2 min-w-[150px]">
                     <h4 className="font-bold text-sm text-black">{activeClient.name}</h4>
                     <p className="text-xs text-gray-600 truncate">{activeClient.address.city}, {activeClient.address.state}</p>
                 </div>
             </InfoWindowF>
          )}
        </GoogleMap>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => setMapTypeId(mapTypeId === 'roadmap' ? 'satellite' : 'roadmap')} 
                        className={cn("shadow-md hover:scale-105 transition-transform", mapTypeId === 'satellite' && 'bg-primary text-primary-foreground hover:bg-primary/90')}
                      >
                          <Layers className="h-4 w-4"/>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>Toggle Satellite View</p></TooltipContent>
                 </Tooltip>
            </TooltipProvider>
        </div>
        
        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4">
            <Card className="p-2 bg-background/90 backdrop-blur border-border/50 shadow-lg flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white shadow-sm" />
                    <span className="font-medium text-muted-foreground">Inspectors</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 border border-white shadow-sm" />
                    <span className="font-medium text-muted-foreground">Job Sites</span>
                </div>
            </Card>
        </div>
      </div>
  )
}
