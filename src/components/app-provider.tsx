'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "./app-shell";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { TooltipProvider } from "./ui/tooltip";
import { useAuthStore, initAuthListener } from "@/lib/auth/auth-service";

export function AppProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, loading, setUser } = useAuthStore();
    const [refreshKey, setRefreshKey] = useState(0);

    const isAuthPage =
        pathname === "/" ||
        pathname === "/signup" ||
        pathname === "/forgot-password";

    useEffect(() => {
        const unsubscribe = initAuthListener();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };
    
    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    }

    if (loading) {
        console.log("[BOOT] Displaying OVERSCITE initialization splash...");
        return <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-foreground">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">Initializing OVERSCITE™</p>
        </div>;
    }
    
    if (isAuthPage) {
        return (
            <TooltipProvider>
                <main key={refreshKey} className="relative z-10">{children}</main>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider>
            <AppShell 
                key={refreshKey}
                userId={user?.uid || 'guest'} 
                isFullScreen={isFullScreen} 
                toggleFullScreen={toggleFullScreen}
                handleRefresh={handleRefresh}
            >
                {children}
            </AppShell>
        </TooltipProvider>
    );
}
