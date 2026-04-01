'use client';

import React from 'react';
import WeatherCommandCenter from '@/components/weather/weather-command-center';
import LocationsOverSCITE from '@/components/locations/LocationsOverSCITE';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, MapPin } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';

export default function WeatherPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Environment & Safety" 
        status="live"
        guidanceId="environment-safety"
        description="The Environment & Safety module provides real-time atmospheric intelligence and risk assessment for all active field operations. By integrating live radar, storm vector tracking, and the proprietary Inspection Risk Index (IRI), it ensures personnel safety in volatile weather conditions. The system continuously monitors roof surface temperatures and biometric safety feeds through the LARI-GUANGEL™ stack. This layer of operational intelligence is essential for maintaining jurisdictional safety standards and minimizing environmental liability."
      />
      <div className="flex flex-col space-y-4 w-full">

        <Tabs defaultValue="weather" className="w-full flex-grow flex flex-col h-full mt-4">
          <TabsList className="bg-muted/50 border border-border/50 self-start p-1 h-auto items-stretch gap-1 w-full sm:w-auto overflow-x-auto justify-start sticky top-0 z-50 rounded-lg">
            <TabsTrigger 
              value="weather" 
              className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-background/80 data-[state=active]:text-primary text-muted-foreground font-medium transition-all rounded-md"
            >
              <Cloud className="w-4 h-4" />
              Weather Command
            </TabsTrigger>
            <TabsTrigger 
              value="locations" 
              className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-background/80 data-[state=active]:text-primary text-muted-foreground font-medium transition-all rounded-md"
            >
              <MapPin className="w-4 h-4" />
              Locations OverSCITE
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="weather" className="w-full flex-grow pt-4 m-0 data-[state=active]:flex data-[state=active]:flex-col border-none focus-visible:outline-none focus-visible:ring-0">
             {/* Note: The old component had max-w-7xl constraint. Leaving it inside its container for parity. */}
             <div className="w-full">
                <WeatherCommandCenter />
             </div>
          </TabsContent>
          
          <TabsContent value="locations" className="w-full flex-grow pt-4 m-0 data-[state=active]:flex data-[state=active]:flex-col h-full border-none focus-visible:outline-none focus-visible:ring-0 min-h-[800px]">
             <LocationsOverSCITE />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
