
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Wind, Search, RefreshCw, Settings, MapPin, Layers, Globe } from "lucide-react";
import { useWeatherData, useIRI, useRoofTemp, useGuangel } from "@/hooks/weather/use-weather";
import { CurrentConditionsPanel } from "./CurrentConditionsPanel";
import { InspectionRiskPanel } from "./InspectionRiskPanel";
import { HourlyTrendChart } from "./HourlyTrendChart";
import { RoofSurfaceTempModel } from "./RoofSurfaceTempModel";
import { GuangelSafetyStrip } from "./GuangelSafetyStrip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function WeatherCommandCenter() {
  const [locationQuery, setLocationQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { data: weather, loading, error } = useWeatherData(); // In a real app, pass locationQuery to hook
  const iri = useIRI(weather);
  const roofTemp = useRoofTemp(weather);
  const guangel = useGuangel(iri?.score || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", locationQuery);
  };

  const handleRefresh = () => {
      console.log("Refreshing weather data...");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <div className="absolute inset-0 flex items-center justify-center">
                <CloudRain className="h-6 w-6 text-primary animate-pulse" />
            </div>
        </div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium tracking-wide">INITIALIZING ATMOSPHERIC DATA FUSION...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
        <div className="bg-destructive/10 p-4 rounded-full">
            <Wind className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">System Offline</h3>
            <p className="text-sm text-muted-foreground">{error || 'Unable to establish connection to weather satellites.'}</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry Connection</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                Weather Command
                <Badge variant="outline" className="text-xs font-mono font-normal text-muted-foreground bg-background/50">FBS_UTCB v1.0</Badge>
            </h2>
            <p className="text-muted-foreground mt-1">Operational Environmental Intelligence & Safety Monitoring</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    type="search" 
                    placeholder="Search location..." 
                    className="pl-9 h-9 w-full md:w-[250px] bg-background/50"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                />
            </form>
            <Button variant="outline" size="icon" onClick={handleRefresh} className="h-9 w-9 shrink-0">
                <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <Settings className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-0 gap-4">
            <TabsList className="bg-transparent p-0 h-auto space-x-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
                <TabsTrigger 
                    value="overview" 
                    className="bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                    Overview
                </TabsTrigger>
                <TabsTrigger 
                    value="radar" 
                    className="bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                    Live Radar
                </TabsTrigger>
                <TabsTrigger 
                    value="safety" 
                    className="bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                    Safety & Risk
                </TabsTrigger>
                <TabsTrigger 
                    value="forecast" 
                    className="bg-transparent p-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                    10-Day Forecast
                </TabsTrigger>
            </TabsList>
            
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-muted-foreground pb-2">
                <Globe className="h-3 w-3 opacity-50" />
                <span>{weather.lat.toFixed(4)}°N, {weather.lon.toFixed(4)}°W</span>
                <span className="flex items-center gap-1.5 ml-2 text-primary font-bold tracking-wider"><div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" /> LIVE</span>
            </div>
        </div>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 mt-0 pt-2">
            <GuangelSafetyStrip status={guangel} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CurrentConditionsPanel weather={weather} />
                <InspectionRiskPanel score={iri} />
                <RoofSurfaceTempModel data={roofTemp} />
            </div>

            <div className="h-[400px]">
                <HourlyTrendChart weather={weather} />
            </div>
        </TabsContent>

        <TabsContent value="radar" className="h-[600px] animate-in fade-in-50 slide-in-from-bottom-2 duration-500 mt-0 pt-2">
             <Card className="h-full flex flex-col overflow-hidden border border-border/50 shadow-lg bg-background/40 backdrop-blur-sm">
                <CardHeader className="bg-muted/5 border-b border-border/30 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Layers className="h-4 w-4 text-primary" />
                        Interactive Radar Composition
                    </CardTitle>
                    <div className="flex gap-2">
                         <Badge variant="outline" className="bg-background/20 font-mono text-[10px] tracking-wider border-primary/20 text-primary">PRECIPITATION</Badge>
                         <Badge variant="outline" className="bg-background/20 font-mono text-[10px] tracking-wider border-primary/20 text-primary">WIND VECTORS</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative bg-zinc-950 overflow-hidden">
                    {/* Mock Radar Visuals */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                         <div className="w-[800px] h-[800px] rounded-full border border-primary/20 animate-[spin_30s_linear_infinite]" />
                         <div className="w-[600px] h-[600px] rounded-full border border-primary/30 animate-[spin_20s_linear_infinite_reverse]" />
                         <div className="w-[400px] h-[400px] rounded-full border border-primary/40 animate-[spin_10s_linear_infinite]" />
                         <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                         <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="bg-zinc-900/90 backdrop-blur-md p-8 rounded-xl border border-zinc-800 shadow-2xl max-w-md">
                            <Wind className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                            <h4 className="text-lg font-bold text-foreground mb-2">Live Radar Feed</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                High-resolution Doppler integration requires active API keys for the mapping engine. 
                                <br/><br/>
                                In production, this view renders a WebGL-accelerated canvas overlaying real-time precipitation intensity and storm cell tracking vectors.
                            </p>
                            <Button className="mt-6 w-full font-semibold tracking-wide" variant="default">Initialize Demo Layer</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="safety" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500 mt-0 pt-2">
             <div className="grid gap-6 md:grid-cols-2">
                 <InspectionRiskPanel score={iri} />
                 <RoofSurfaceTempModel data={roofTemp} />
             </div>
             <GuangelSafetyStrip status={guangel} />
             <Card>
                 <CardHeader><CardTitle>Calibration Ledger</CardTitle></CardHeader>
                 <CardContent>
                     <p className="text-sm text-muted-foreground">Sensor calibration logs and force-fix events will appear here.</p>
                 </CardContent>
             </Card>
        </TabsContent>

        <TabsContent value="forecast" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500 mt-0 pt-2">
            <Card>
                 <CardHeader><CardTitle>10-Day Hyper-Local Forecast</CardTitle></CardHeader>
                 <CardContent>
                     <p className="text-sm text-muted-foreground">Long-range modeling data will appear here.</p>
                 </CardContent>
             </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
