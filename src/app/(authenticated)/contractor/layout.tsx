'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Handshake, 
  Eye, 
  Calculator, 
  LayoutTemplate, 
  Settings, 
  History,
  Activity
} from 'lucide-react';

const navItems = [
  { name: 'Command', href: '/contractor', icon: Activity },
  { name: 'Parties', href: '/contractor/parties', icon: Users },
  { name: 'Proposals', href: '/contractor/proposals', icon: FileText },
  { name: 'Contracts', href: '/contractor/contracts', icon: Handshake },
  { name: 'Subcontract Oversight', href: '/contractor/subcontract-oversight', icon: Eye },
  { name: 'Estimates', href: '/contractor/estimates', icon: Calculator },
  { name: 'Templates', href: '/contractor/templates', icon: LayoutTemplate },
  { name: 'Governance Setup', href: '/contractor/governance-setup', icon: Settings },
  { name: 'Audit', href: '/contractor/audit', icon: History },
];

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-[calc(100vh-13rem)] rounded-xl overflow-hidden border border-border/20 bg-black/40 backdrop-blur-md shadow-2xl">
      {/* Sub-Sidebar (Intelligence Panel Pattern) */}
      <aside className="w-64 border-r border-border/20 bg-background/20 flex flex-col pt-6 shrink-0">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 text-primary mb-1">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="font-extrabold tracking-tighter text-sm uppercase">Division Ops</h1>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-30">Contractor Node</p>
        </div>

        <nav className="flex-grow px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-primary/20" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground/40")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/20 text-[10px] text-muted-foreground/30 font-mono text-center">
          LARI_CONTRACTOR v0.1.0-canon
        </div>
      </aside>

      {/* Main Sub-Content */}
      <main className="flex-grow overflow-y-auto bg-transparent relative scrollbar-hide">
        <div className="p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
