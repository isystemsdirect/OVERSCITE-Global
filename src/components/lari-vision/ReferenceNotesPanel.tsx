'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check, FileText } from "lucide-react";
import { Finding } from "@/lib/types";

interface ReferenceNotesPanelProps {
    findings: Finding[];
    onAddToReport: (finding: Finding) => void;
    addedFindingIds: string[]; // To track what's already added
}

export function ReferenceNotesPanel({ findings, onAddToReport, addedFindingIds }: ReferenceNotesPanelProps) {
    return (
        <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reference Candidates
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="flex flex-col gap-2 p-4">
                        {findings.length === 0 ? (
                            <div className="text-center text-muted-foreground text-xs py-8">
                                No findings analyzed yet. <br/>Capture an image to begin.
                            </div>
                        ) : (
                            findings.map((finding, idx) => {
                                const isAdded = addedFindingIds.includes(finding.sourceAssetId + finding.label); // simplified ID check
                                return (
                                    <div key={idx} className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                 <Badge variant={finding.severity === 'HIGH' ? 'destructive' : 'secondary'} className="text-[10px] px-1 py-0 h-5">
                                                    {finding.severity}
                                                </Badge>
                                                <span className="font-semibold text-sm">{finding.label}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                {(finding.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {finding.description}
                                        </p>
                                        <Button 
                                            size="sm" 
                                            variant={isAdded ? "secondary" : "outline"} 
                                            className="w-full h-7 text-xs mt-1"
                                            onClick={() => !isAdded && onAddToReport(finding)}
                                            disabled={isAdded}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check className="mr-1 h-3 w-3" /> Added to Report
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="mr-1 h-3 w-3" /> Add to Notes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
