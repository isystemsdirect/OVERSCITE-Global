'use client';
import { useState } from 'react';
import AppShell from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Atom, Beaker, FileText, FlaskConical, Search, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth/auth-service";
import { Input } from '@/components/ui/input';
import { PeriodicTable } from '@/lib/periodic-table-data';
import { useToast } from "@/hooks/use-toast";
import { CANON } from "@/core/canon/terminology";

export default function LariPeriodicTablePage({ params }: { params: { id: string } }) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call failure since dependencies are missing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: `The ${CANON.BFI} substance analyzer has been temporarily disabled to fix dependency issues.`
    });
    
    setIsAnalyzing(false);
  };

  const filteredElements = PeriodicTable.filter(el => 
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell userId={user?.uid}>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto h-full">
        
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/workstation/keys/${params.id}`}><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">LARI-PRISM Table</h1>
                    <p className="text-muted-foreground">Elemental Composition & Material Analysis Database.</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <FlaskConical className="h-4 w-4 mr-2" />}
                    Analyze Sample
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Table Visualization */}
            <Card className="lg:col-span-3 bg-black/40 border-white/10 overflow-hidden relative">
                {isAnalyzing && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                         <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 max-w-md">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                            <h3 className="font-bold text-lg">Substance Analyzer Offline</h3>
                            <p className="text-sm mt-1">
                                Use SCING {CANON.BFI} to analyze the elemental composition of a substance. (Temporarily Disabled)
                            </p>
                         </div>
                    </div>
                )}
                
                <div className="p-4 overflow-x-auto custom-scrollbar h-[600px]">
                    <div className="grid grid-cols-18 gap-1 min-w-[800px]" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                        {/* Periodic Table Layout would go here - simplified for this view */}
                        {filteredElements.map((element) => (
                             <button
                                key={element.number}
                                onClick={() => setSelectedElement(element)}
                                className={`
                                    aspect-square flex flex-col items-center justify-center border border-white/10 rounded hover:border-white/50 transition-all
                                    ${selectedElement?.number === element.number ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'bg-white/5'}
                                `}
                                style={{ gridColumn: element.column, gridRow: element.row }}
                             >
                                 <span className="text-[10px] text-muted-foreground self-start pl-1">{element.number}</span>
                                 <span className="font-bold text-lg">{element.symbol}</span>
                                 <span className="text-[9px] truncate w-full text-center px-0.5">{element.name}</span>
                             </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Element Detail Panel */}
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Element Properties</CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search elements..." 
                            className="pl-8" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    {selectedElement ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="text-center p-6 bg-secondary/20 rounded-lg border border-white/5">
                                 <div className="text-6xl font-bold text-primary mb-2">{selectedElement.symbol}</div>
                                 <div className="text-xl font-medium">{selectedElement.name}</div>
                                 <div className="text-sm text-muted-foreground">{selectedElement.category}</div>
                             </div>

                             <div className="space-y-2">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted-foreground">Atomic Number</span>
                                    <span className="font-mono">{selectedElement.number}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted-foreground">Atomic Mass</span>
                                    <span className="font-mono">{selectedElement.atomic_mass} u</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted-foreground">Phase</span>
                                    <span className="font-mono capitalize">{selectedElement.phase}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted-foreground">Density</span>
                                    <span className="font-mono">{selectedElement.density} g/cm³</span>
                                </div>
                                 <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted-foreground">Melting Point</span>
                                    <span className="font-mono">{selectedElement.melt ? `${selectedElement.melt} K` : 'N/A'}</span>
                                </div>
                             </div>

                             <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-200">
                                <Atom className="h-4 w-4 mb-2" />
                                This data is cross-referenced with the LARI-PRISM canon for material compliance checks.
                             </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                            <Atom className="h-12 w-12 mb-4 opacity-20" />
                            <p>Select an element from the table to view its chemical properties and LARI-PRISM metadata.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
