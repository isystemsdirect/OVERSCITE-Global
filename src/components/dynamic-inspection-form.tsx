'use client';

import { getClients, getClientById } from "@/lib/services/canonical-provider";
import { Client } from "@/lib/types";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Users, PlusCircle, MapPin, Search, Camera, Mic, Building, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "@/components/client-form";
import { slugify } from "@/lib/utils";
import { EEPIP_Status, Delta_Packet } from "@/lib/types/property-intelligence";
import { StandardGeospatialViewport } from "@/components/maps/StandardGeospatialViewport";

import { PropertyExternalDataStatusCard } from "./property/PropertyExternalDataStatusCard";
import { PropertyDeltaReviewDrawer } from "./property/PropertyDeltaReviewDrawer";

type DynamicInspectionFormProps = {
    inspectionType: string;
}

function DynamicInspectionFormContent({ inspectionType }: DynamicInspectionFormProps) {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eepipStatus, setEepipStatus] = useState<EEPIP_Status>(EEPIP_Status.NOT_CONNECTED);
  const [lastFetchAt, setLastFetchAt] = useState<string | undefined>();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeDelta, setActiveDelta] = useState<Delta_Packet | null>(null);
  const inspectionSlug = slugify(inspectionType);

  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        if (clientId) {
            const client = await getClientById(clientId);
            setSelectedClient(client);
        }
        const allClients = await getClients();
        setClients(allClients);
        setIsLoading(false);
    }
    loadData();
  }, [clientId]);

  return (
    <div className="grid gap-8">
        {/* MANDATORY GEOSPATIAL VIEWPORT */}
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Geospatial Awareness</h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-widest">Live Viewport</span>
                </div>
             </div>
             <StandardGeospatialViewport 
                address="Active Inspection Property"
                lat={34.0522} 
                lng={-118.2437} 
                className="h-[300px]"
             />
        </div>

        <Separator />

        <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Client Information</h3>
            {isLoading ? (
                <div className="h-24 w-full animate-pulse bg-muted rounded-lg" />
            ) : selectedClient ? (
            <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="font-semibold">{selectedClient.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
                </div>
                <Link href={`/inspections/new/${inspectionSlug}`} className="ml-auto text-sm underline">Change client</Link>
            </div>
            ) : (
            <Tabs defaultValue="new-client">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="new-client"><PlusCircle className="mr-2 h-4 w-4"/>Add New Client</TabsTrigger>
                    <TabsTrigger value="existing-client"><Users className="mr-2 h-4 w-4" />Select Existing Client</TabsTrigger>
                </TabsList>
                <TabsContent value="new-client">
                    <ClientForm />
                </TabsContent>
                <TabsContent value="existing-client">
                    <div className="grid gap-4 pt-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            placeholder="Search clients by name, email..."
                            className="pl-9 pr-20 rounded-full"
                            />
                            <div className="absolute right-1 top-1/2 flex -translate-y-1/2">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                                <Camera className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">Use visual search</span>
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                                <Mic className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">Use voice command</span>
                            </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {clients.length > 0 ? (
                                clients.map(client => (
                                    <Link key={client.id} href={{pathname: `/inspections/new/${inspectionSlug}`, query: {clientId: client.id}}} className="w-full text-left p-4 rounded-lg border flex items-center gap-4 hover:bg-muted/50 transition-colors">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{client.name}</p>
                                            <p className="text-sm text-muted-foreground">{client.email}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center border rounded-lg border-dashed">
                                    <p className="text-muted-foreground">No canonical clients found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            )}
        </div>
        
        <Separator />
        
        <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Property Address</h3>
            <div className="grid gap-3">
                <Label htmlFor="street-address">Street Address</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="street-address" placeholder="Search for an address..." className="pl-9 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="CA" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" placeholder="12345" />
                </div>
            </div>
        </div>

        <Separator />

        <div className="grid gap-4">
            <PropertyExternalDataStatusCard 
                status={eepipStatus} 
                lastFetchAt={lastFetchAt}
                onConnect={() => {
                   setEepipStatus(EEPIP_Status.PENDING_REVIEW);
                   setActiveDelta({
                     delta_packet_id: 'dp_sim_1',
                     property_id: 'prop_1',
                     pip_version_base: 1,
                     proposed_eepip_version: 'v1.1',
                     retrieved_at: new Date().toISOString(),
                     source_list: ['County Assessor (Simulated)', 'Municipal Zoning (Simulated)'],
                     change_count: 2,
                     material_change_flag: true,
                     impact_summary: '2 proposed updates detected from simulated sources.',
                     field_changes: [
                        { section: 'County Assessor', field_path: 'lot_size', old_value: 5000, proposed_value: 5400, change_type: 'MODIFIED' as any, source: 'Assessor (Simulated)', source_timestamp: '', impact_level: 'MEDIUM' as any, validation_status: 'VALIDATED' as any },
                        { section: 'Municipal Zoning', field_path: 'zoning', old_value: 'R-1', proposed_value: 'R-2', change_type: 'MODIFIED' as any, source: 'Zoning (Simulated)', source_timestamp: '', impact_level: 'HIGH' as any, validation_status: 'VALIDATED' as any }
                     ]
                   });
                   setIsReviewOpen(true);
                }}

                onSkip={() => {
                    setEepipStatus(EEPIP_Status.DEFERRED);
                }}
            />

            <PropertyDeltaReviewDrawer 
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                deltaPacket={activeDelta}
                onAccept={(fields) => {
                    setEepipStatus(fields.length > 1 ? EEPIP_Status.FULLY_INGESTED : EEPIP_Status.PARTIALLY_INGESTED);
                    setLastFetchAt(new Date().toISOString());
                    setIsReviewOpen(false);
                }}
                onDecline={() => {
                    setEepipStatus(EEPIP_Status.USER_DECLINED);
                    setIsReviewOpen(false);
                }}
            />
        </div>

        <Separator />

        <div className="grid gap-4">
            <h3 className="font-semibold text-lg">Inspection-Specific Details</h3>
            
            {inspectionType === "Multi-family due-diligence unit walks (sampled or 100%)" && (
                <div className="grid gap-3">
                    <Label htmlFor="number-of-units">Number of Units</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="number-of-units" type="number" placeholder="e.g., 50" className="pl-9" />
                    </div>
                </div>
            )}
            
            <p className="text-sm text-muted-foreground">
                More inspection-specific fields will appear here based on the selected template.
            </p>
        </div>

        <Separator />
        <div className="flex justify-end">
            <Button asChild disabled={!clientId}>
                <Link href={`/inspections/new/review?clientId=${clientId}&inspectionType=${inspectionSlug}`}>Review & Confirm</Link>
            </Button>
        </div>
    </div>
  );
}

export function DynamicInspectionForm(props: DynamicInspectionFormProps) {
    return (
        <Suspense>
            <DynamicInspectionFormContent {...props} />
        </Suspense>
    )
}
