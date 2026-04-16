'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function IPNAuditPage() {
    return (
        <div className="flex flex-col gap-6 font-mono p-4 md:p-8">
             <header className="flex justify-between items-end border-b border-white/10 pb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-black uppercase text-white tracking-widest flex items-center gap-2">
                        <ShieldAlert className="text-primary" /> Audit Lineage
                    </h1>
                     <nav className="text-xs text-muted-foreground"><Link href="/workstation/ipn" className="hover:text-white">IPN Home</Link> / Audit</nav>
                </div>
            </header>
            
            <div className="bg-black/40 border border-white/10 rounded-md p-8 text-center text-muted-foreground">
                 System log empty. No recent consequential transport occurrences.
            </div>
        </div>
    );
}
