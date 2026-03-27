'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/logo";
import { Chrome, Mail, Apple, Loader2, ShieldCheck, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth/auth-service";
import PbScingularLogo from '../../public/Pb_SCINGULAR_Logo_White.svg';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);
    
    // OFFLINE TEST MODE - ENFORCED
    console.warn("Offline test mode forced. Simulating login.");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create Mock User
    const mockUser: any = {
        uid: 'offline-user-' + Math.random().toString(36).substr(2, 9),
        email: email || 'guest@scingular.com',
        displayName: 'Offline Inspector',
        emailVerified: true,
        isAnonymous: false,
    };
    
    // Manually set user state since Firebase listener isn't active
    useAuthStore.getState().setUser(mockUser);

    toast({
        title: "Offline Mode Active",
        description: "Environment not configured. Logging in with simulated credentials.",
    });
    
    router.push('/dashboard');
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    // OFFLINE TEST MODE - ENFORCED
    // Fail-open for Google too
     useAuthStore.getState().setUser({
        uid: 'google-mock-' + Math.random().toString(36).substr(2, 9),
        email: 'google-user@example.com',
        displayName: 'Google User (Mock)',
    } as any);
    router.push('/dashboard');
  };

  const handleBypass = () => {
      // Direct bypass
      useAuthStore.getState().setUser({
          uid: 'bypass-user',
          email: 'bypass@scingular.com',
          displayName: 'Bypass User',
      } as any);
      router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <Card className="mx-auto w-full max-w-sm shadow-2xl bg-black/40 backdrop-blur-md overflow-hidden border border-white/10">
        <CardHeader className="text-center pt-10 pb-2 space-y-2">
          <div className="flex flex-col items-center justify-center">
             <Logo isLoginPage={true} disableMask={true} />
             <p className="tracking-[0.2em] font-light text-xs text-white/70 uppercase mt-4">INSPECTION SYSTEMS</p>
          </div>
          <CardDescription className="text-white/60 font-mono text-xs pt-4 flex items-center justify-center gap-2">
            <LockKeyhole className="w-3 h-3" />
            Secure access to your inspection environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

              <div className="text-center mt-2">
                <p className="text-xs text-white/60">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-[#F5C242] hover:underline font-semibold">
                    Sign Up Here
                  </Link>
                </p>
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-transparent px-2 text-white/40">
                    Federated Access
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={isLoading} className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                 <Button variant="outline" type="button" onClick={handleBypass} disabled={isLoading} className="bg-transparent border-white/10 text-white/80 hover:bg-white/5 hover:text-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Bypass
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pt-2 pb-6 space-y-1">
            <div className="w-24 opacity-40">
                <PbScingularLogo className="w-full h-auto" />
            </div>
            <p className="text-[10px] text-white/20 mt-4">Copyright © 2026 Inspection Systems Direct Inc.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
