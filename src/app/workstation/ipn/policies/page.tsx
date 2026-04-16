'use client';

import { Book } from 'lucide-react';
import Link from 'next/link';

export default function IPNPoliciesPage() {
    return (
        <div className="flex flex-col gap-6 font-mono p-4 md:p-8">
             <header className="flex justify-between items-end border-b border-white/10 pb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-black uppercase text-white tracking-widest flex items-center gap-2">
                        <Book className="text-primary" /> Policy Packs
                    </h1>
                     <nav className="text-xs text-muted-foreground"><Link href="/workstation/ipn" className="hover:text-white">IPN Home</Link> / Policies</nav>
                </div>
            </header>
            
            <div className="bg-black/60 border border-white/10 rounded-md p-6">
                <div className="flex justify-between border-b border-white/5 pb-2 mb-4">
                    <span className="font-bold text-primary uppercase">BIPN-PACK-2026.04.11-r01</span>
                    <span className="text-xs text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                </div>
                <ul className="text-sm text-muted-foreground font-mono space-y-2">
                    <li className="flex justify-between"><span className="text-white">REQUIRE_ARC_IDENTITY</span> <span className="text-primary">BLOCK_IF_MISSING</span></li>
                    <li className="flex justify-between"><span className="text-white">REQUIRE_BANE_AUTHORIZATION</span> <span className="text-primary">BLOCK_IF_MISSING</span></li>
                    <li className="flex justify-between"><span className="text-white">LOCK_SAFETY_CORE</span> <span className="text-primary">ENFORCE_STATIC</span></li>
                    <li className="flex justify-between"><span className="text-white">PROHIBIT_AUTONOMOUS_MESH</span> <span className="text-yellow-500">BLOCK</span></li>
                </ul>
            </div>
        </div>
    );
}
