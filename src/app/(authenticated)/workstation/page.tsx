'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Shield,
  Key,
  Smartphone,
  Sparkles,
  Bot,
  Trash2,
  Plus,
  Activity,
  Zap,
  DollarSign,
  History,
  LayoutGrid,
  ShieldCheck,
  Signal,
  AlertCircle,
  FileSearch,
  Lock,
  Eye,
  Bell,
  Settings,
  ArrowUpRight,
  ChevronRight,
  Info,
  Check
} from "lucide-react";
import { useAuthStore } from "@/lib/auth/auth-service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { WorkstationLocationSettings } from "@/components/workstation-location-settings";
import { WorkstationTimeFormatSwitch } from "@/components/workstation-time-format-switch";
import { CANON } from "@/core/canon/terminology";
import { getAvailableCapabilities } from "@/lib/services/marketplace-service";
import { AuditEntry, FiscalLimit, Capability } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function WorkstationPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loadingCapabilities, setLoadingCapabilities] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAvailableCapabilities();
        // Map service type to local Capability type if needed, but they are aligned
        setCapabilities(data as any);
      } catch (error) {
        console.error("Failed to load registry:", error);
      } finally {
        setLoadingCapabilities(false);
      }
    }
    load();
  }, []);

  const handleSave = (section: string) => {
    toast({
      title: `${section} Updated`,
      description: "Changes have been committed to the BANE governance ledger.",
    });
  };

  // Mock Data for Forensic Audit
  const mockAuditLogs: AuditEntry[] = [
    { id: 'aud-001', action: 'LARI-VISION Activation', timestamp: '2026-03-26 14:22:10', actor: 'System (Auth)', signature: '0x8f2e...3a1c', severity: 'info' },
    { id: 'aud-002', action: 'BANE Security Guard-rail Triggered', timestamp: '2026-03-26 12:45:00', actor: 'BANE Enforcement', signature: '0x1a9c...77db', severity: 'warning' },
    { id: 'aud-003', action: 'Fiscal Threshold Adjusted', timestamp: '2026-03-25 09:15:33', actor: user?.displayName || 'Inspector', signature: '0x4e2b...99ef', severity: 'info' },
    { id: 'aud-004', action: 'New Device Paired: Skydio X2', timestamp: '2026-03-24 16:20:11', actor: user?.displayName || 'Inspector', signature: '0xcc12...aa43', severity: 'info' }
  ];

  // Mock Data for Fiscal Ops
  const mockFiscalLimits: FiscalLimit[] = [
    { category: 'LARI Processing', threshold: 500, spent: 124.50, currency: 'USD' },
    { category: 'Marketplace Subscriptions', threshold: 1000, spent: 849.00, currency: 'USD' },
    { category: 'Cloud Storage (Vault)', threshold: 200, spent: 45.20, currency: 'USD' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Workstation Command" 
        status="mock"
        description="The Workstation Command center is the primary interface for managing your professional identity, intelligence thresholds, and digital fleet assets. It allows mission controllers to fine-tune Scing™ interaction layers and LARI™ sensor sensitivities to match their specific field requirements. Through this hub, all system mutations and fiscal boundaries are monitored and enforced by the BANE™ governance engine. This is the nervous system of your OVERSCITE experience, providing absolute control over your operational environment."
        actions={
          <div className="bg-card/30 backdrop-blur-md border border-border/40 p-3 rounded-xl flex items-center gap-4 shadow-xl">
            <div className="flex flex-col items-center px-4 border-r border-border/40">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">{CANON.BFI} Signal</span>
              <div className="flex items-center gap-1.5 text-green-500">
                <Signal className="h-4 w-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-tighter">Nominal</span>
              </div>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Enforcement</span>
              <div className="flex items-center gap-1.5 text-pro">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-tighter">Active</span>
              </div>
            </div>
          </div>
        }
      />

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto p-1 bg-card/40 backdrop-blur-md border border-border/50 rounded-xl lg:inline-flex shadow-inner">
            <TabsTrigger value="profile" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><User className="mr-2 h-4 w-4"/>Identity</TabsTrigger>
            <TabsTrigger value="intelligence" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><Sparkles className="mr-2 h-4 w-4"/>Intel Center</TabsTrigger>
            <TabsTrigger value="fleet" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><Smartphone className="mr-2 h-4 w-4"/>Fleet Hub</TabsTrigger>
            <TabsTrigger value="fiscal" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><DollarSign className="mr-2 h-4 w-4"/>Fiscal Ops</TabsTrigger>
            <TabsTrigger value="audit" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><History className="mr-2 h-4 w-4"/>Audit Trace</TabsTrigger>
            <TabsTrigger value="registry" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><LayoutGrid className="mr-2 h-4 w-4"/>Registry</TabsTrigger>
            <TabsTrigger value="security" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><Shield className="mr-2 h-4 w-4"/>Security</TabsTrigger>
            <TabsTrigger value="alerts" className="px-5 py-2.5 text-sm rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"><Bell className="mr-2 h-4 w-4"/>Alerts</TabsTrigger>
          </TabsList>

          {/* Identity Tab */}
          <TabsContent value="profile" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                <CardTitle className="text-2xl">Inspector Identity Profile</CardTitle>
                <CardDescription>Authenticated credentials for the OVERSCITE field registry. Your identity is anchor-verified by BANE.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Public Designation</Label>
                    <Input defaultValue={user?.displayName || "Inspector"} className="bg-background/20 h-12 rounded-xl border-border/40 focus:border-primary/50 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Operational Email</Label>
                    <Input defaultValue={user?.email || ""} disabled className="bg-muted/10 opacity-70 cursor-not-allowed h-12 rounded-xl border-border/20 font-mono" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Affiliated Organization</Label>
                    <Input placeholder="E.g. SCINGULAR Structural" className="bg-background/20 h-12 rounded-xl border-border/40 focus:border-primary/50 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Credential ID (NACHI/INTER)</Label>
                    <Input placeholder="E.g. CERT-9942-X" className="bg-background/20 h-12 rounded-xl border-border/40 focus:border-primary/50 transition-all font-mono text-primary font-bold" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Professional Summary (LARI Corpus Training)</Label>
                  <Input className="h-32 bg-background/20 rounded-xl border-border/40 focus:border-primary/50 transition-all p-4 resize-none" placeholder="Summarize your expert field..." />
                </div>
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 space-y-6">
                  <WorkstationLocationSettings />
                  <WorkstationTimeFormatSwitch />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-8 pb-8 px-8 bg-muted/10">
                <Button onClick={() => handleSave("Identity")} variant="pro" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-base font-bold">Commit Identity Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Intel Center Tab */}
          <TabsContent value="intelligence" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                    <Bot className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Intelligence & {CANON.BFI} Interface</CardTitle>
                    <CardDescription>Configure your augmented interaction layer and {CANON.LARI} inference sensitivity.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-10 px-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="flex items-center justify-between p-6 rounded-xl bg-background/20 border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="space-y-1">
                      <Label className="text-base font-bold">Wake Word Activation</Label>
                      <p className="text-xs text-muted-foreground">Listen for "Hey Scing" for touchless command entry.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-6 rounded-xl bg-background/20 border border-border/40 group hover:border-primary/30 transition-all">
                    <div className="space-y-1">
                      <Label className="text-base font-bold">Scing™ Voice Presence</Label>
                      <p className="text-xs text-muted-foreground">Enable verbal feedback and sonic synthesized status.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">Scing™ Personality Alignment</Label>
                    <Badge variant="outline" className="font-mono text-[9px] bg-primary/10 border-primary/20 tracking-tighter text-primary">MODE: NEUTRAL_ANALYTIC</Badge>
                  </div>
                  <Select defaultValue="scing_neutral">
                    <SelectTrigger className="bg-background/20 h-12 rounded-xl border-border/40">
                      <SelectValue placeholder="Select Alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scing_neutral">Neutral Analytic (Canonical)</SelectItem>
                      <SelectItem value="scing_concise">Concise Tactical</SelectItem>
                      <SelectItem value="scing_expressive">Musically Expressive (HB-V1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6 pt-10 border-t border-border/30">
                  <div className="space-y-5">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <Label className="text-lg font-bold text-primary">LARI-VISION™ Inference Sensitivity</Label>
                        <p className="text-xs text-muted-foreground max-w-lg">Dictates the confidence threshold for anomaly detection and automated finding proposals.</p>
                      </div>
                      <span className="text-sm font-mono font-black text-pro bg-pro/10 px-2 py-0.5 rounded-md">85% OPTIMAL</span>
                    </div>
                    <Slider defaultValue={[85]} max={100} step={1} className="py-6" />
                    <div className="grid grid-cols-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Precision-First (Low False Pos)</span>
                      <span className="text-right">Discovery-First (High Capture)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-10 border-t border-border/30">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Local Learning & Corpus Training</h4>
                   <div className="grid gap-4">
                     <div className="flex items-start space-x-4 bg-primary/5 p-5 rounded-xl border border-primary/20 group hover:bg-primary/10 transition-colors">
                        <Checkbox id="c-1" defaultChecked className="mt-1" />
                        <div className="space-y-1">
                          <Label htmlFor="c-1" className="text-base font-bold leading-none cursor-pointer">Historical Correction Personalization</Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">Scing™ will refine its summarization style and prioritizations based on your manual edits to LARI findings.</p>
                        </div>
                     </div>
                     <div className="flex items-start space-x-4 p-5 rounded-xl border border-transparent hover:bg-muted/10 transition-colors">
                        <Checkbox id="c-2" className="mt-1" />
                        <div className="space-y-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Label htmlFor="c-2" className="text-base font-bold leading-none cursor-pointer">Global Fleet Contribution</Label>
                          <p className="text-xs text-muted-foreground leading-relaxed">Contribute anonymized anomaly signatures to help train the OVERSCITE Global network models. Identity remains masked.</p>
                        </div>
                     </div>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-8 pb-8 px-8 bg-muted/10 flex justify-between items-center">
                <p className="text-[10px] text-muted-foreground italic font-medium px-4 border-l-2 border-primary/20 leading-relaxed uppercase tracking-tighter">BFI SYNC v2.4 ACTIVATED • MODEL_LARI_X1_CORE</p>
                <Button onClick={() => handleSave("Intelligence Center")} variant="pro" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold">Sync Intelligence State</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Fleet Hub Tab */}
          <TabsContent value="fleet" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Fleet Hub & Hardware</CardTitle>
                    <CardDescription>Manage and calibrate your OVERSCITE-connected capture hardware and UAV nodes.</CardDescription>
                  </div>
                  <Button size="sm" className="gap-2 h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4"/> Pair New Asset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-8 pb-10">
                <Card className="bg-background/20 border-border/40 relative overflow-hidden group hover:border-primary/50 transition-all h-full flex flex-col hover:shadow-2xl hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 p-3"><Badge variant="default" className="bg-green-500 shadow-lg shadow-green-500/20 text-[9px] h-4 font-bold tracking-tighter">ONLINE</Badge></div>
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                      <Smartphone className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">Mobile Command</CardTitle>
                    <CardDescription className="text-xs font-mono opacity-70 uppercase tracking-widest">iPhone 15 Pro Max (Primary)</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground/80 tracking-widest items-end">
                          <span>Link Integrity</span> 
                          <span className="text-sm font-mono text-green-500">94%</span>
                        </div>
                        <Progress value={94} className="h-2 bg-muted/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold leading-tight">
                        <div className="p-2 rounded-lg bg-background/30 border border-border/20 flex flex-col">
                           <span className="opacity-50 text-[8px] uppercase">Link Arch</span>
                           <span className="text-primary truncate">SCING-P2P</span>
                        </div>
                        <div className="p-2 rounded-lg bg-background/30 border border-border/20 flex flex-col">
                           <span className="opacity-50 text-[8px] uppercase">LARI-V</span>
                           <span className="text-green-500 uppercase">Ready</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/20">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-10 hover:bg-primary/10 hover:text-primary transition-colors font-bold uppercase tracking-widest">Diagnostic Protocol</Button>
                  </CardFooter>
                </Card>

                <Card className="bg-background/20 border-border/40 relative overflow-hidden group hover:border-pro/50 transition-all h-full flex flex-col hover:shadow-2xl hover:shadow-pro/5">
                  <div className="absolute top-0 right-0 p-3"><Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[9px] h-4 font-bold tracking-tighter">STANDBY</Badge></div>
                  <CardHeader className="pb-4">
                    <div className="h-14 w-14 rounded-xl bg-pro/10 flex items-center justify-center text-pro mb-2 group-hover:scale-110 transition-transform">
                      <Eye className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">LARI-VIS Node #1</CardTitle>
                    <CardDescription className="text-xs font-mono opacity-70 uppercase tracking-widest">UAV Integrated Optical</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground/80 tracking-widest items-end">
                          <span>Battery Cluster</span> 
                          <span className="text-sm font-mono text-pro">82%</span>
                        </div>
                        <Progress value={82} className="h-2 bg-muted/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold leading-tight">
                        <div className="p-2 rounded-lg bg-background/30 border border-border/20 flex flex-col">
                           <span className="opacity-50 text-[8px] uppercase">Firmware</span>
                           <span className="text-pro">v2.1.0-F</span>
                        </div>
                        <div className="p-2 rounded-lg bg-background/30 border border-border/20 flex flex-col">
                           <span className="opacity-50 text-[8px] uppercase">Calibration</span>
                           <span className="text-green-500 uppercase font-black">Optimal</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/20">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-10 hover:bg-pro/10 hover:text-pro transition-colors font-bold uppercase tracking-widest">Recalibrate Optics</Button>
                  </CardFooter>
                </Card>

                <Card className="bg-background/10 border-dashed border-border/30 flex flex-col items-center justify-center p-8 text-center hover:bg-background/20 hover:border-primary/50 transition-all cursor-pointer group rounded-xl">
                  <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-125 transition-all duration-500 group-hover:bg-primary/20 shadow-inner">
                    <Plus className="h-8 w-8 text-primary group-hover:rotate-90 transition-transform duration-500" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">Add Fleet Asset</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed px-4">Connect Drone, Sensor, or AI Vision Module to the BFI interface.</p>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fiscal Ops Tab */}
          <TabsContent value="fiscal" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-green-500/5 to-transparent pb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-inner">
                    <DollarSign className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Fiscal Operations & Thresholds</CardTitle>
                    <CardDescription>BANE-enforced spending limits and automated billing governance across the global network.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-10 px-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {mockFiscalLimits.map((limit, i) => (
                    <div key={i} className="p-6 rounded-xl bg-background/25 border border-border/40 space-y-5 hover:bg-background/40 hover:border-primary/30 transition-all shadow-xl group">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-[0.2em] leading-none">{limit.category}</span>
                        <Badge variant="outline" className="h-5 text-[10px] font-mono border-primary/20 bg-primary/5 text-primary">${limit.threshold}</Badge>
                      </div>
                      <div className="text-4xl font-black tabular-nums tracking-tighter group-hover:scale-105 transition-transform origin-left">
                        <span className="text-2xl font-light opacity-50 mr-1">$</span>
                        {limit.spent.toFixed(2)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase items-end">
                           <span className="opacity-60">Absorption Rate</span>
                           <span className={cn(
                             "tabular-nums",
                             (limit.spent / limit.threshold) > 0.8 ? "text-red-500" : "text-primary"
                           )}>{Math.round((limit.spent / limit.threshold) * 100)}%</span>
                        </div>
                        <Progress value={(limit.spent / limit.threshold) * 100} className={cn(
                          "h-2 bg-muted/20",
                          (limit.spent / limit.threshold) > 0.8 && "[&>div]:bg-red-500"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-10 border-t border-border/30">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Fiscal Guardrails (BANE™ Controlled)</h4>
                   <div className="grid gap-6 md:grid-cols-2">
                       <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between group hover:bg-red-500/10 transition-colors">
                          <div className="space-y-1">
                             <Label className="text-base font-bold text-red-500">Hard Spend Limit</Label>
                             <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">Instantly freeze all LARI processing and Marketplace keys if budget is exceeded.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between group hover:bg-amber-500/10 transition-colors">
                          <div className="space-y-1">
                             <Label className="text-base font-bold text-amber-500">Threshold Warning (80%)</Label>
                             <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">Proactive SCING notification when any category approaches 80% usage.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                   </div>
                </div>

                <div className="p-8 rounded-xl bg-primary/10 border-2 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
                      <DollarSign className="h-24 w-24" />
                   </div>
                   <div className="flex gap-6 items-center flex-1">
                     <div className="h-16 w-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0 scale-110">
                       <ShieldCheck className="h-10 w-10 text-primary" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xl tracking-tight">Active Plan: SCING™ PRO ENTERPRISE</h4>
                          <Badge className="bg-primary hover:bg-primary font-bold">LEGACY ELITE</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xl">Comprehensive fleet-wide LARI-G authorized. Billing Cycle: Monthly ($149.00) • Governance Node: US-EAST-1 • Renewal: 2026-04-15</p>
                     </div>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" size="lg" className="h-12 px-6 rounded-xl font-bold bg-background/50 border-border/50 hover:bg-card">Invoice History</Button>
                      <Button variant="pro" size="lg" className="h-12 px-8 rounded-xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Optimize Plan</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trace Tab */}
          <TabsContent value="audit" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-pro/5 to-transparent pb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-pro/20 flex items-center justify-center text-pro shadow-inner">
                    <History className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Forensic Audit Trace</CardTitle>
                    <CardDescription>Real-time terminal of system mutations, BANE-authenticated signatures, and evidentiary chain of custody.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className="px-8 mb-4">
                   <div className="bg-background/20 rounded-xl border border-border/40 p-3 flex items-center gap-3">
                      <FileSearch className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search forensic ledger by signature, action or ID..." className="h-8 bg-transparent border-none text-xs focus-visible:ring-0 px-0" />
                      <Badge variant="outline" className="h-5 text-[9px] opacity-70">LIVE STREAMING</Badge>
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="hover:bg-transparent border-border/20">
                        <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest pl-8">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">System Operational Event</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Timestamp (UTC)</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest">Initiating Actor</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase tracking-widest pr-8">BANE Trace Signature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAuditLogs.map((log) => (
                        <TableRow key={log.id} className="group cursor-help transition-all hover:bg-primary/5 border-border/10">
                          <TableCell className="pl-8">
                            <Badge variant={log.severity === 'warning' ? 'secondary' : 'outline'} className={cn(
                              "text-[10px] font-bold tracking-tighter uppercase px-2 py-0 h-4",
                              log.severity === 'warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/10"
                            )}>
                              {log.severity}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-extrabold text-sm tracking-tight group-hover:text-primary transition-colors">{log.action}</TableCell>
                          <TableCell className="text-xs font-mono opacity-60 tabular-nums">{log.timestamp}</TableCell>
                          <TableCell className="text-xs font-bold opacity-80">{log.actor}</TableCell>
                          <TableCell className="text-right font-mono text-[10px] pr-8 text-primary/40 group-hover:text-primary transition-all duration-300">
                            {log.signature}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-8 mb-8 flex justify-center">
                   <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-[2px] bg-gradient-to-b from-primary/50 to-transparent"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                        BANE EVIDENTIARY END-OF-TRACE
                      </span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registry Tab */}
          <TabsContent value="registry" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                    <LayoutGrid className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Capability Registry & LARI Keys</CardTitle>
                    <CardDescription>Manage your authorized system extensions and specialized forensic modules within the OVERSCITE ecosystem.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                {loadingCapabilities ? (
                  <div className="py-24 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="relative mb-6">
                      <Activity className="h-12 w-12 animate-spin text-primary opacity-50" />
                      <LayoutGrid className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                    </div>
                    <p className="font-bold tracking-widest text-xs uppercase animate-pulse">Synchronizing Global Registry State...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {capabilities.map((cap) => (
                      <div key={cap.id} className="flex items-center justify-between p-5 rounded-xl border border-border/40 bg-background/20 group transition-all hover:bg-background/40 hover:border-primary/40 hover:translate-x-1">
                        <div className="flex gap-6 items-center">
                          <div className={cn(
                            "h-14 w-14 rounded-xl border transition-all duration-500 group-hover:scale-110 flex items-center justify-center shadow-inner",
                            cap.status === 'active' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/10 border-border/50 text-muted-foreground opacity-60"
                          )}>
                             {cap.category === 'LARI_VISION' && <Eye className="h-7 w-7" />}
                             {cap.category === 'SCING_VOICE' && <Zap className="h-7 w-7" />}
                             {cap.category === 'BANE_GOVERNANCE' && <ShieldCheck className="h-7 w-7" />}
                             {cap.category === 'SYSTEM_EXTENSION' && <Bot className="h-7 w-7" />}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-extrabold text-lg tracking-tight">{cap.name}</h4>
                              {cap.lari_key_required && (
                                <Badge variant="pro" className="h-5 text-[9px] font-black tracking-normal px-2 bg-pro/10 text-pro border-pro/20">LARI-KEY REQUIRED</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[600px] line-clamp-1 group-hover:line-clamp-none transition-all duration-500">{cap.description}</p>
                            <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                              <span>Provider: {cap.provider}</span>
                              <span className="h-1 w-1 rounded-full bg-border"></span>
                              <span>Category: {cap.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 pr-4">
                          <Badge variant={cap.status === 'active' ? 'default' : 'outline'} className={cn(
                            "text-[11px] font-black font-mono px-3 h-6 tracking-tighter",
                            cap.status === 'active' ? "bg-green-500" : "opacity-40"
                          )}>
                            {cap.status.toUpperCase()}
                          </Badge>
                          {cap.status === 'active' ? (
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-background/30 border-border/40 hover:bg-primary/10 hover:text-primary transition-all group-hover:border-primary/40"><Settings className="h-4 w-4"/></Button>
                          ) : (
                            <Button variant="pro" size="sm" className="h-10 px-6 rounded-xl font-black text-xs shadow-lg shadow-primary/10">Authorize Node</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-pro/20 flex items-center justify-center text-pro shadow-inner">
                      <Shield className="h-7 w-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Security & Access Architecture</CardTitle>
                      <CardDescription>Manage BANE-gated authentication protocols and secure session persistence.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 px-8 pb-12">
                   <div className="grid gap-6 md:grid-cols-2">
                       <Button variant="outline" className="h-24 justify-start px-8 gap-6 rounded-xl border-border/40 bg-background/20 hover:bg-background/40 hover:border-primary/50 transition-all group shadow-xl">
                          <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                             <Lock className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                              <div className="font-black text-lg tracking-tight">Rotate Secret Key</div>
                              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Update Operational Password</div>
                          </div>
                       </Button>
                       <Button variant="outline" className="h-24 justify-start px-8 gap-6 rounded-xl border-border/40 bg-background/20 hover:bg-background/40 hover:border-pro/50 transition-all group shadow-xl">
                          <div className="h-12 w-12 rounded-xl bg-muted/20 flex items-center justify-center group-hover:bg-pro/20 group-hover:text-pro transition-all">
                             <ShieldCheck className="h-6 w-6" />
                          </div>
                          <div className="text-left">
                              <div className="font-black text-lg tracking-tight">2FA Configuration</div>
                              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Enforce Multi-Factor Verified Link</div>
                          </div>
                       </Button>
                   </div>
                   <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex gap-3 items-center">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h4 className="font-bold text-red-500 uppercase tracking-tighter">Account Destruction Guard</h4>
                         </div>
                         <Button variant="destructive" size="sm" className="h-8 rounded-lg font-bold px-4">DESTRUCT PROTOCOL</Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">Initiating this protocol will wipe all locally cached LARI evidence and unbind all BFI identity anchors. Actions are irreversible and recorded in the Global BANE Ledger.</p>
                   </div>
                </CardContent>
              </Card>
          </TabsContent>
          
          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-2xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent pb-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                        <Bell className="h-7 w-7" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Operational Alert Configuration</CardTitle>
                        <CardDescription>Customize the transmission and reception of critical field alerts and system intelligence.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-10">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-6 rounded-xl bg-background/20 border border-border/30 hover:bg-background/30 transition-all group">
                            <div className="space-y-1">
                                <Label className="text-lg font-bold">Push Signal Transmission</Label>
                                <p className="text-sm text-muted-foreground leading-relaxed">Receive real-time mobile notifications for high-severity critical findings discovered by LARI-VISION™.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl bg-background/20 border border-border/30 hover:bg-background/30 transition-all group">
                            <div className="space-y-1">
                                <Label className="text-lg font-bold text-pro underline underline-offset-8 decoration-pro/30">BANE™ Governance Warnings</Label>
                                <p className="text-sm text-muted-foreground leading-relaxed">Receive instant interaction if your current field actions approach or exceed regulatory governance thresholds.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-xl bg-background/20 border border-border/30 hover:bg-background/30 transition-all group">
                            <div className="space-y-1">
                                <Label className="text-lg font-bold">Operational Dispatch Summaries</Label>
                                <p className="text-sm text-muted-foreground leading-relaxed">Receive a synthesized SCING™ briefing of your upcoming daily schedule and priority inspections.</p>
                            </div>
                            <Switch />
                        </div>
                      </div>
                  </CardContent>
                  <CardFooter className="pt-8 pb-8 px-8 bg-muted/10 border-t border-border/30">
                     <div className="flex items-center justify-between w-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Notification Engine: OVERSCITE-SIG-1</p>
                        <Button variant="outline" className="h-10 px-8 rounded-xl font-bold bg-background/50 hover:bg-background">Internal Alert Test</Button>
                     </div>
                  </CardFooter>
              </Card>
          </TabsContent>

        </Tabs>
    </div>
  );
}
