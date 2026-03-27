'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { advisory_logs } from "@/lib/mockLogs";
import { Signature, ThumbsUp, ThumbsDown, ShieldAlert, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { pipelinePersistence } from "@/lib/pipeline/persistence";
import { useParams } from "next/navigation";

export function InspectorAuthorityGate() {
    const { toast } = useToast();
    const params = useParams();
    const inspectionId = params?.id as string;
    
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [notes, setNotes] = useState("");
    const [approvals, setApprovals] = useState({
        media: false,
        compliance: false
    });

    const handleFinalize = async () => {
        if (!approvals.media || !approvals.compliance) {
            toast({
                variant: 'destructive',
                title: "Validation Required",
                description: "You must check all confirmation boxes before signing.",
            });
            return;
        }

        setIsFinalizing(true);
        try {
            await pipelinePersistence.finalizeReport(inspectionId, notes, approvals);
            toast({
                title: "Report Finalized",
                description: "The inspection record has been cryptographically signed and moved to the ledger.",
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Finalization Failed",
                description: error.message || "An error occurred while connecting to the federation endpoints.",
            });
        } finally {
            setIsFinalizing(false);
        }
    };

    return (
        <Card className="bg-card/60 backdrop-blur-sm border-primary/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-6 w-6 text-primary" /> Inspector Authority Gate</CardTitle>
                <CardDescription>
                    Final legal attestation. Once signed, this record becomes immutable in the OVERSCITE™ Ledger.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Approve AI-Generated Advisory Blocks</h3>
                    <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                        {advisory_logs.map(log => (
                            <div key={log.id} className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground flex-1 pr-4">{log.advisoryBlockId}</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon"><ThumbsUp className="h-4 w-4 text-green-500" /></Button>
                                    <Button variant="outline" size="icon"><ThumbsDown className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Professional Notes</h3>
                    <Label htmlFor="professional-notes">Add your final assessment notes for the client.</Label>
                    <Textarea 
                        id="professional-notes" 
                        placeholder="Enter your notes here..." 
                        className="min-h-[120px]" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={isFinalizing}
                    />
                </div>

                <div className="space-y-4">
                     <h3 className="font-semibold text-foreground">Final Confirmation</h3>
                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="media-approval" 
                            checked={approvals.media}
                            onCheckedChange={(checked) => setApprovals(prev => ({ ...prev, media: !!checked }))}
                            disabled={isFinalizing}
                        />
                        <Label htmlFor="media-approval" className="text-sm font-normal">I have reviewed and approved all media attachments.</Label>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="compliance-visibility" 
                            checked={approvals.compliance}
                            onCheckedChange={(checked) => setApprovals(prev => ({ ...prev, compliance: !!checked }))}
                            disabled={isFinalizing}
                        />
                        <Label htmlFor="compliance-visibility" className="text-sm font-normal">I confirm that the SRT compliance visibility is correct and unambiguous.</Label>
                    </div>
                </div>

                <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleFinalize} 
                    disabled={isFinalizing}
                >
                    {isFinalizing ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                        <Signature className="h-5 w-5 mr-2" />
                    )}
                    Digitally Sign & Finalize Report
                </Button>
            </CardContent>
        </Card>
    );
}
