'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from "next/navigation";
import { 
  Building2, 
  Users, 
  Map as MapIcon, 
  History, 
  FileText,
  ShieldCheck,
  Zap,
  Activity as ActivityIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById, getInspectionsByClientId } from "@/lib/services/canonical-provider";
import { Client, Inspection } from "@/lib/types";
import { CIP_Metadata, EECIP_Metadata, EECIP_Status } from "@/lib/types/client-intelligence";

// Workspace Components
import { GovernedWorkspaceShell } from '@/components/workspace/GovernedWorkspaceShell';
import { ClientCIPWorkspace } from '@/components/clients/workspace/ClientCIPWorkspace';
import { ClientPIPWorkspace } from '@/components/clients/workspace/ClientPIPWorkspace';
import { ClientPortfolioWorkspace } from '@/components/clients/workspace/ClientPortfolioWorkspace';
import { ClientActivityWorkspace } from '@/components/clients/workspace/ClientActivityWorkspace';
import { ChurchOperationalVerification } from '@/components/test/ChurchOperationalVerification';

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cip");

  useEffect(() => {
    async function load() {
      const c = await getClientById(params.id);
      if (c) {
        setClient(c);
        const ins = await getInspectionsByClientId(params.id);
        setInspections(ins);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) return <div className="flex justify-center p-20 opacity-40 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Governed Workspace...</div>;
  if (!client) notFound();

  // Mock Intelligence Data for Orchestration
  const mockCip: CIP_Metadata = {
    cip_id: `cip-${client.id}`,
    cip_version: '1.2.0',
    eecip_status: EECIP_Status.AVAILABLE,
    profileType: 'CIP',
    truthClass: 'accepted_baseline',
    material_change_flag: false,
    last_verified_at: new Date().toISOString()
  };

  const mockEecip: EECIP_Metadata = {
    eecip_id: `eecip-${client.id}`,
    eecip_version: '1.3.1',
    profileType: 'EECIP',
    truthClass: 'external_enhancement_candidate',
    sources: ['SEC-Reg', 'Public-Tax-Rolls'],
    retrieved_at: new Date().toISOString()
  };

  // Extract unique properties from inspections for the PIP view
  const properties = inspections.map(ins => ({
    id: ins.id,
    address: (ins as any).propertyAddress?.street || (ins as any).propertyAddress || 'Unknown Property',
    city: (ins as any).propertyAddress?.city || 'Los Angeles'
  }));

  return (
    <GovernedWorkspaceShell
      entityName={client.name}
      entityId={client.id}
      version={mockCip.cip_version}
      lastHash="0x8f2e...3a1c"
      status="Nominal"
    >
      <Tabs defaultValue="cip" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <TabsList className="bg-background/40 backdrop-blur-md border border-border/40 p-1 rounded-xl h-auto shadow-inner">
            <TabsTrigger value="cip" className="px-4 py-2 text-xs font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
               <Users className="h-3.5 w-3.5 mr-2" />
               Client (CIP)
            </TabsTrigger>
            <TabsTrigger value="pip" className="px-4 py-2 text-xs font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
               <Building2 className="h-3.5 w-3.5 mr-2" />
               Properties (PIP)
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="px-4 py-2 text-xs font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
               <MapIcon className="h-3.5 w-3.5 mr-2" />
               Portfolio
            </TabsTrigger>
            <TabsTrigger value="activity" className="px-4 py-2 text-xs font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
               <ActivityIcon className="h-3.5 w-3.5 mr-2" />
               Activity
            </TabsTrigger>
            {client.id === 'CIP-CHURCH-001' && (
              <TabsTrigger value="verification" className="px-4 py-2 text-xs font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-primary">
                 <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                 Forensic Lab
              </TabsTrigger>
            )}
          </TabsList>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40 italic">OVERSCITE Operational Shell v1.1</span>
          </div>
        </div>

        <TabsContent value="cip" className="m-0 focus-visible:outline-none">
          <ClientCIPWorkspace cip={mockCip} eecip={mockEecip} />
        </TabsContent>

        <TabsContent value="pip" className="m-0 focus-visible:outline-none">
          <ClientPIPWorkspace clientId={client.id} properties={properties} />
        </TabsContent>

        <TabsContent value="portfolio" className="m-0 focus-visible:outline-none h-[600px]">
          <ClientPortfolioWorkspace clientId={client.id} properties={properties} />
        </TabsContent>

        <TabsContent value="activity" className="m-0 focus-visible:outline-none">
          <ClientActivityWorkspace clientId={client.id} />
        </TabsContent>

        <TabsContent value="verification" className="m-0 focus-visible:outline-none">
          <ChurchOperationalVerification clientId={client.id} />
        </TabsContent>
      </Tabs>
    </GovernedWorkspaceShell>
  );
}
