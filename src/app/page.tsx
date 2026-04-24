'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
/**
 * @diagnostic_test 2026-04-21
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { Mail, Apple, Loader2, ShieldCheck, LockKeyhole, UserCircle2, ChevronRight, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth/auth-service";
import { AUTH_MODE } from "@/config/auth";
import { DEV_USERS } from "@/lib/auth/devUsers";
import { normalizeUser } from "@/lib/auth/getCurrentUser";
import PbScingularLogo from '../../public/Pb_SCINGULAR_Logo_White.svg';

const INTERNAL_ACCESS_CODE = "SCING2026";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);

  // Auto-reveal if we already have a session (for refresh)
  useEffect(() => {
    const user = localStorage.getItem("devUser");
    if (user && AUTH_MODE === "GENERIC") {
      setShowPersonas(true);
    }
  }, []);

  const handleAccessCode = (e: React.FormEvent) => {
      e.preventDefault();
      if (accessCode === INTERNAL_ACCESS_CODE) {
          setShowPersonas(true);
          toast({
              title: "Access Granted",
              description: "Internal persona selector enabled.",
          });
      } else {
          toast({
              variant: "destructive",
              title: "Access Denied",
              description: "Invalid internal security code.",
          });
          setAccessCode('');
      }
  };

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);
    
    if (AUTH_MODE === "GENERIC") {
        console.warn("[AUTH] Generic Mode Active. Access code required.");
        setIsLoading(false);
        return;
    }

    // ARC logic would go here
    setIsLoading(false);
  };

  const handleDevLogin = (userId: string) => {
      const user = DEV_USERS.find(u => u.id === userId);
      if (!user) return;

      setIsLoading(true);
      setTimeout(() => {
          localStorage.setItem("devUser", JSON.stringify(user));
          useAuthStore.getState().setUser(normalizeUser(user));
          
          toast({
              title: "Generic Access Granted",
              description: `Authenticated as ${user.name} (${user.role})`,
          });
          
          router.push('/dashboard');
          setIsLoading(false);
      }, 500);
  };

  const handleGoogleLogin = async () => {
    if (AUTH_MODE === "GENERIC") return;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <Card className="mx-auto w-full max-w-sm shadow-2xl bg-black/40 backdrop-blur-xl overflow-hidden border border-white/10 ring-1 ring-white/5">
        <CardHeader className="text-center pt-10 pb-2 space-y-2 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20">
             <div className="w-1 h-1 rounded-full bg-[#F5C242] animate-pulse" />
             <span className="text-[8px] font-mono text-white tracking-widest uppercase">ZTI-ACTIVE</span>
          </div>
          
          <div className="flex flex-col items-center justify-center">
             <Logo isLoginPage={true} disableMask={true} />
             <p className="tracking-[0.2em] font-light text-[10px] text-white/50 uppercase mt-4">OVERSCITE™ GLOBAL NODE</p>
          </div>
          
          <CardDescription className="text-white/40 font-mono text-[10px] pt-4 flex items-center justify-center gap-2">
            <LockKeyhole className="w-3 h-3 text-[#F5C242]/40" />
            {AUTH_MODE === "GENERIC" ? "INTERNAL LIVE-ACTION STABILIZATION" : "Secure access to your inspection environment."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 min-h-[300px] flex flex-col justify-center">
          {AUTH_MODE === "GENERIC" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {!showPersonas ? (
                <form onSubmit={handleAccessCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Security Access Gate</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        type="password"
                        placeholder="INTERNAL_CODE"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="bg-black/20 border-white/10 text-white placeholder:text-white/10 pl-10 focus:border-[#F5C242]/50 focus:ring-[#F5C242]/20 text-center tracking-[0.5em] font-mono"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#F5C242] text-black hover:bg-[#F5C242]/90 font-bold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                  >
                    INITIATE CHALLENGE
                  </Button>
                  <p className="text-[10px] text-center text-white/20">Authorized inspection personnel only.</p>
                </form>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex flex-col space-y-2">
                    <Label className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-2">Select Identity Persona</Label>
                    <div className="grid gap-2">
                      {DEV_USERS.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleDevLogin(user.id)}
                          disabled={isLoading}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#F5C242]/30 transition-all group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-black/40 text-[#F5C242] group-hover:bg-[#F5C242] group-hover:text-black transition-colors">
                               <UserCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{user.displayName}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-tighter">{user.systemRole} — {user.authorityLevel.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#F5C242] translate-x-0 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[8px] uppercase tracking-[0.3em]">
                      <span className="bg-[#111] px-4 text-white/20 border border-white/5 rounded-full py-0.5">
                        Sovereign Governance Active
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/80 text-xs uppercase tracking-wider font-semibold">Email Identity</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@scingular.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-[#F5C242]/50 focus:ring-[#F5C242]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-white/80 text-xs uppercase tracking-wider font-semibold">Secure Passkey</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-xs text-[#F5C242]/80 hover:text-[#F5C242] transition-colors"
                    >
                      Forgot credentials?
                    </Link>
                  </div>
                  <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="bg-black/20 border-white/10 text-white focus:border-[#F5C242]/50 focus:ring-[#F5C242]/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#F5C242] text-black hover:bg-[#F5C242]/90 font-bold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "AUTHENTICATE"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 space-y-1">
            <div className="w-24 opacity-40">
                {typeof PbScingularLogo === 'function' ? (
                    <PbScingularLogo className="w-full h-auto" />
                ) : (
                    <img 
                        src={(PbScingularLogo as any)?.src || PbScingularLogo} 
                        alt="Scingular Logo"
                        className="w-full h-auto"
                    />
                )}
            </div>
            <p className="text-[10px] text-white/20 mt-4">Copyright © 2026 Inspection Systems Direct Inc.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
