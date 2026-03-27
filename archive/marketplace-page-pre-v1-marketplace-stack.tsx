
'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  ListFilter, 
  MapPin, 
  Search, 
  Star, 
  ShieldCheck, 
  Briefcase, 
  KeyRound, 
  Construction, 
  Users, 
  Building,
  Loader2,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { mockInspectors, mockClients } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceMap } from "@/components/marketplace-map";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AnnouncementsWidget } from "@/components/announcements-widget";
import { PageHeader } from "@/components/layout/PageHeader";
import { TruthStateBadge } from "@/components/layout/TruthStateBadge";
import { getAvailableCapabilities, requestCapabilityAccess, Capability } from "@/lib/services/marketplace-service";
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const [showMap, setShowMap] = useState(true);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadCapabilities() {
      try {
        const data = await getAvailableCapabilities();
        setCapabilities(data);
      } catch (error) {
        console.error("Failed to load registry:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCapabilities();
  }, []);

  const handleRequestAccess = async (capId: string) => {
    const success = await requestCapabilityAccess(capId);
    if (success) {
      toast({
        title: "Access Request Logged",
        description: "Your request for this capability has been transmitted to the BANE governance audit trail.",
      });
      // Optionally update local status to 'requested'
      setCapabilities(prev => prev.map(c => c.id === capId ? { ...c, status: 'requested' } : c));
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
      <div className="flex flex-col gap-6">
      <PageHeader
        title="Capability Registry"
        status="live"
        description="The OVERSCITE Marketplace is the primary commercial environment for acquiring certified field services, advanced LARI™ analytical keys, and mission-essential hardware. It connects jurisdictional clients with pre-verified contractors, ensuring that every transaction adheres to SCINGULAR™ trust and safety standards. The marketplace facilitates the seamless exchange of entitlements and professional services within a governed, secure financial layer. This ecosystem drives the scalable growth of OVERSCITE Global by democratizing access to Elite-Grade inspection tools and expertise."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              Filter
            </Button>
          </div>
        }
      />
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="space-y-8">
                {/* Operational Asset Visibility */}
                <Card className="bg-card/60 backdrop-blur-sm border-pro/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Operational Asset Visibility</CardTitle>
                                <CardDescription>Live telemetry and spatial coordination for dispatched personnel.</CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="show-map" checked={showMap} onCheckedChange={setShowMap} />
                                <Label htmlFor="show-map" className="text-xs">Telemetry Map</Label>
                            </div>
                        </div>
                    </CardHeader>
                    {showMap && (
                        <CardContent>
                            <div className="h-[45vh] w-full rounded-lg overflow-hidden border border-primary/10 shadow-inner group">
                                <MarketplaceMap
                                    inspectors={mockInspectors}
                                    clients={mockClients}
                                />
                                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono border border-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    LIVE FEED: UTC COORDINATED
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>

                <Tabs defaultValue="capabilities" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-card/40 max-w-md">
                        <TabsTrigger value="capabilities"><KeyRound className="mr-2 h-4 w-4" /> System Capabilities</TabsTrigger>
                        <TabsTrigger value="personnel"><Users className="mr-2 h-4 w-4" /> Personnel Index</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="capabilities" className="mt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {loading ? (
                                <div className="col-span-full py-20 flex flex-col items-center text-muted-foreground">
                                    <Loader2 className="h-10 w-10 animate-spin mb-4" />
                                    <p>Querying Registry...</p>
                                </div>
                            ) : (
                                capabilities.map((cap) => (
                                    <Card key={cap.id} className="bg-card/40 border-border/50 flex flex-col transition-all hover:bg-card/60">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant="outline" className="text-[10px] items-center gap-1">
                                                    {cap.category.replace('_', ' ')}
                                                </Badge>
                                                <TruthStateBadge status={cap.status} />
                                            </div>
                                            <CardTitle className="text-base flex items-center justify-between">
                                                {cap.name}
                                                {cap.status === 'active' ? <Unlock className="h-4 w-4 text-green-500" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                                            </CardTitle>
                                            <CardDescription className="text-xs">{cap.provider}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 pb-4">
                                            <p className="text-sm text-muted-foreground leading-snug">{cap.description}</p>
                                            {cap.lari_key_required && (
                                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-pro bg-pro/5 px-2 py-1 rounded border border-pro/20 w-fit">
                                                    <KeyRound className="h-3 w-3" /> LARI-G AUTH KEY REQUIRED
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="pt-0 border-t border-border/50 py-3 mt-auto">
                                            {cap.status === 'active' ? (
                                                <Button className="w-full h-9" variant="pro">Launch Interface</Button>
                                            ) : cap.status === 'requested' ? (
                                                <Button className="w-full h-9" variant="ghost" disabled>Pending Authorization</Button>
                                            ) : (
                                                <Button className="w-full h-9" onClick={() => handleRequestAccess(cap.id)}>Request Access</Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="personnel" className="mt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {mockInspectors.map((inspector) => {
                                const avatar = PlaceHolderImages.find(p => p.id === inspector.imageHint);
                                return (
                                <Card key={inspector.id} className="bg-card/40 border-border/50 transition-all hover:bg-card/60">
                                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                                        <div className="relative">
                                            {avatar && (
                                                <Image
                                                src={avatar.imageUrl}
                                                alt={inspector.name}
                                                width={56}
                                                height={56}
                                                className="rounded-full border-2 border-primary/20"
                                                />
                                            )}
                                            <div className={cn(
                                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                                inspector.onCall ? "bg-green-500" : "bg-muted"
                                            )} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base truncate">{inspector.name}</CardTitle>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                                                <span>{inspector.rating} • {inspector.reviews} verified reviews</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono mt-0.5">
                                                <MapPin className="h-2.5 w-2.5" />
                                                <span className="truncate">{inspector.location.name}</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {inspector.certifications.slice(0, 2).map((cert) => (
                                                <Badge key={cert.id} variant="outline" className="text-[9px] px-1.5 h-4 gap-1">
                                                    <ShieldCheck className="h-2 w-2" />
                                                    {cert.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-4 pb-4 pt-0">
                                        <Button variant="outline" size="sm" className="w-full text-xs h-8">
                                            {inspector.onCall ? "Direct Dispatch" : "Request Scheduling"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                                )
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            
            <div className="sticky top-24 space-y-6">
                <AnnouncementsWidget />
                
                <Card className="bg-card/40 backdrop-blur-sm border-pro/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" /> Registry Note
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-[11px] text-muted-foreground space-y-2">
                        <p>Purchasing logic is handled via established corporate procurement contracts.</p>
                        <p>LARI Keys requested here are subject to CDG approval cycles.</p>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between font-mono text-[9px] opacity-70">
                            <span>GATE_STATUS:</span>
                            <span className="text-pro">BANE_ACTIVE</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
