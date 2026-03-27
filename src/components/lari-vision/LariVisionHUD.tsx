'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, Zap, ZapOff, Image as ImageIcon, X, Check, Loader2, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type HUDState = 'idle' | 'streaming' | 'captured' | 'uploading' | 'analyzing' | 'ready' | 'error';

interface LariVisionHUDProps {
    onCapture: (blob: Blob) => void;
    isUploading?: boolean;
    analysisStatus?: string;
}

export function LariVisionHUD({ onCapture, isUploading = false, analysisStatus }: LariVisionHUDProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string>('');
    const [hudState, setHudState] = useState<HUDState>('idle');
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { toast } = useToast();

    // Initialize Camera
    useEffect(() => {
        async function getDevices() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                if (videoDevices.length > 0) {
                    setActiveDeviceId(videoDevices[0].deviceId); // Default to first
                }
            } catch (err) {
                console.error("Error enumerating devices:", err);
                setHudState('error');
            }
        }
        getDevices();
    }, []);

    const startCamera = useCallback(async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    deviceId: activeDeviceId ? { exact: activeDeviceId } : undefined,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                     // Torch support usually requires advanced constraints or track application
                }
            };
            
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setHudState('streaming');
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast({
                title: "Camera Error",
                description: "Could not access camera. Please check permissions.",
                variant: "destructive"
            });
            setHudState('error');
        }
    }, [activeDeviceId, stream, toast]);

    useEffect(() => {
        if (activeDeviceId) {
            startCamera();
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [activeDeviceId]); // Re-run when device changes

    const toggleTorch = async () => {
        if (!stream) return;
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any; // Cast to any for non-standard torch support

        if (capabilities.torch) {
            try {
                await track.applyConstraints({
                    advanced: [{ torch: !torchEnabled }] as any
                });
                setTorchEnabled(!torchEnabled);
            } catch (e) {
                console.error("Torch toggle failed:", e);
            }
        } else {
             toast({
                description: "Torch not supported on this device.",
            });
        }
    };
    
    const switchCamera = () => {
        const currentIndex = devices.findIndex(d => d.deviceId === activeDeviceId);
        const nextIndex = (currentIndex + 1) % devices.length;
        if (devices[nextIndex]) {
            setActiveDeviceId(devices[nextIndex].deviceId);
        }
    };

    const captureFrame = () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                setCapturedImage(url);
                setHudState('captured');
                // We don't call onCapture yet, we wait for confirmation
            }
        }, 'image/jpeg', 0.95);
    };

    const confirmCapture = () => {
        if (!canvasRef.current) return;
        canvasRef.current.toBlob((blob) => {
             if (blob) {
                 onCapture(blob);
             }
        }, 'image/jpeg', 0.95);
    };

    const retake = () => {
        setCapturedImage(null);
        setHudState('streaming');
        if (capturedImage) URL.revokeObjectURL(capturedImage);
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
            {/* Live View / Preview */}
            <div className="relative flex-1 bg-zinc-900">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={cn("w-full h-full object-cover", hudState !== 'streaming' && "hidden")}
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {capturedImage && (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                )}
                
                {/* HUD Overlay - Always Visible */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                     {/* Top Bar */}
                    <div className="flex justify-between items-start pointer-events-auto">
                        <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-mono text-white flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full", hudState === 'streaming' ? "bg-green-500 animate-pulse" : "bg-yellow-500")} />
                             {hudState.toUpperCase()}
                        </div>
                         {analysisStatus && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/40 animate-pulse">
                                {analysisStatus}
                            </Badge>
                        )}
                        <div className="flex gap-2">
                             <Button variant="ghost" size="icon" onClick={toggleTorch} className="rounded-full bg-black/20 hover:bg-black/40 text-white">
                                 {torchEnabled ? <Zap className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <ZapOff className="h-4 w-4" />}
                             </Button>
                             {devices.length > 1 && (
                                <Button variant="ghost" size="icon" onClick={switchCamera} className="rounded-full bg-black/20 hover:bg-black/40 text-white">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                             )}
                        </div>
                    </div>

                    {/* Target Reticle (Only in streaming) */}
                    {hudState === 'streaming' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/30 rounded-lg pointer-events-none opacity-50">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="h-24 bg-black/90 flex items-center justify-center gap-8 p-4 z-20">
                {hudState === 'streaming' ? (
                     <Button 
                        size="icon" 
                        className="h-16 w-16 rounded-full border-4 border-white bg-transparent hover:bg-white/10 transition-all"
                        onClick={captureFrame}
                    >
                        <div className="w-12 h-12 bg-red-500 rounded-full" />
                     </Button>
                ) : hudState === 'captured' ? (
                    <>
                        <Button variant="outline" className="h-12 w-12 rounded-full border-white/20 text-white hover:bg-white/10" onClick={retake}>
                            <X className="h-6 w-6" />
                        </Button>
                        <Button 
                            className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg"
                            onClick={confirmCapture}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                            {isUploading ? "Uploading..." : "Analyze"}
                        </Button>
                    </>
                ) : (
                    <Button variant="secondary" onClick={() => setHudState('streaming')}>Reset Camera</Button>
                )}
            </div>
        </div>
    );
}
