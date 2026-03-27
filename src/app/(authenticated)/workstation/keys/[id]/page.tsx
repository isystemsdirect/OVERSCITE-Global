'use client';
import { useState } from 'react';
import AppShell from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Box, Check, Copy, Crown, Download, Globe, Info, Key, Share2, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/auth-service";
import { CANON } from "@/core/canon/terminology";

export default function LariKeyDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const [isCopied, setIsCopied] = useState(false);
  
  // In a real app, fetch key details based on params.id
  const keyId = params.id;
  const keyName = keyId === 'lari-vision' ? 'LARI-VISION' : `LARI-${keyId.toUpperCase()}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText("LARI-KEY-8829-XJ29-9292");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const capabilities = [
      { id: "ocr_extraction", label: "OCR Data Extraction", description: "Read serial plates & docs", availability: "Core, Pro, Max", defaultChecked: true },
      { id: "defect_recognition", label: "Defect Recognition", description: "Standard defect library", availability: "Core, Pro, Max", defaultChecked: true },
      { id: "ai_defect_overlay", label: `${CANON.BFI} Defect Overlay`, description: "Live ML markups in HUD", availability: "Core, Pro, Max", defaultChecked: true },
      { id: "measurement", label: "LiDAR Measurement", description: "Planar area calc", availability: "Pro, Max", defaultChecked: true },
      { id: "thermal_fusion", label: "Thermal Fusion", description: "Overlay IR data on RGB", availability: "Max Only", defaultChecked: false },
  ];

  const tierComparison = [
      { feature: 'Resolution Limit', core: '1080p', pro: '4K', max: '8K / RAW' },
      { feature: 'Batch Processing', core: '10 imgs/min', pro: '50 imgs/min', max: 'Unlimited' },
      { feature: 'Hardware Support', core: 'Mobile (Phone/Tablet)', pro: 'External Cameras, Drones, Borescopes', max: `Unlimited Endpoints, 3rd Party ${CANON.BFI} Vision` },
  ]

  return (
    <AppShell userId={user?.uid}>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/workstation"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">{keyName} Key</h1>
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 border-0">ACTIVE</Badge>
                </div>
                <p className="text-muted-foreground">Manage entitlements and capabilities for this engine.</p>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {/* Key Info Card */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>License & Entitlement</CardTitle>
                    <CardDescription>Your unique cryptographic entitlement for this LARI engine.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border flex flex-col gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">License Key ID</span>
                        <div className="flex items-center gap-2">
                            <code className="text-lg font-mono bg-background px-2 py-1 rounded border border-border flex-1 text-center tracking-widest">
                                LARI-KEY-8829-XJ29-9292
                            </code>
                            <Button variant="outline" size="icon" onClick={handleCopy}>
                                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-green-500">
                             <ShieldCheck className="h-3 w-3" />
                             <span>Valid & Authenticated via BANE™</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            Active Capabilities
                        </h3>
                        <div className="grid gap-3">
                            {capabilities.map((cap) => (
                                <div key={cap.id} className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="space-y-0.5">
                                        <div className="font-medium text-sm">{cap.label}</div>
                                        <div className="text-xs text-muted-foreground">{cap.description}</div>
                                        <Badge variant="outline" className="text-[10px] h-5">{cap.availability}</Badge>
                                    </div>
                                    <Switch defaultChecked={cap.defaultChecked} />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sidebar / Tier Info */}
            <div className="space-y-6">
                <Card className="bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-yellow-500" />
                            Current Tier: PRO
                        </CardTitle>
                        <CardDescription>You are on the Professional plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="text-sm space-y-2">
                            {tierComparison.map((item, i) => (
                                <div key={i} className="flex flex-col border-b border-primary/10 pb-2 last:border-0">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">{item.feature}</span>
                                    <span className="font-medium">{item.pro}</span>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white border-0">
                            Upgrade to MAX
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Key Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            <Share2 className="mr-2 h-4 w-4" /> Share Entitlement
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Download className="mr-2 h-4 w-4" /> Export Logs
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                             <Box className="mr-2 h-4 w-4" /> View in Periodic Table
                        </Button>
                        <Button variant="destructive" className="w-full justify-start">
                             <Key className="mr-2 h-4 w-4" /> Revoke Key
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>

      </div>
    </AppShell>
  );
}
