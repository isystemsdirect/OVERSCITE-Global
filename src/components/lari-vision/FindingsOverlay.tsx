'use client';

import { Finding } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface FindingsOverlayProps {
    findings: Finding[];
    onSelect: (finding: Finding) => void;
}

export function FindingsOverlay({ findings, onSelect }: FindingsOverlayProps) {
    // MVP: Stack tags on the left side
    return (
        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-end items-start gap-2">
            {findings.map((finding, index) => (
                <div key={index} className="pointer-events-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="h-8 gap-2 bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => onSelect(finding)}
                            >
                                <div className={cn("w-2 h-2 rounded-full", finding.severity === 'HIGH' ? "bg-red-500" : "bg-yellow-500")} />
                                {finding.label}
                                <span className="text-[10px] text-white/60 ml-1">{(finding.confidence * 100).toFixed(0)}%</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="right" align="start" className="w-64 bg-black/90 border-white/20 text-white p-3">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none flex items-center justify-between">
                                    {finding.label}
                                    <Badge variant="outline" className={cn("text-[10px]", finding.severity === 'HIGH' ? "text-red-400 border-red-400" : "text-yellow-400 border-yellow-400")}>{finding.severity}</Badge>
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {finding.description}
                                </p>
                                <Button size="sm" className="w-full text-xs h-7 mt-2" onClick={() => onSelect(finding)}>
                                    Add to Report Notes
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
        </div>
    );
}
