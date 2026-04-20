/**
 * DocuSCRIBE™ — Division Layout Shell
 *
 * @classification LAYOUT
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P1_FOUNDATION
 * @route /docuscribe
 *
 * Division layout following the established Contractor layout pattern:
 * Left sub-sidebar with division identity + sub-navigation, main content area.
 * Header: "DocuSCRIBE™ — Powered by Scing™"
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  PenLine,
  LayoutGrid,
  Workflow,
  Mail,
} from 'lucide-react';
import { DocuScribeProvider, useDocuScribe } from '@/lib/docuscribe/context';
import { DocumentListPanel } from '@/components/docuscribe/DocumentListPanel';

const navItems = [
  { name: 'Write', href: '/docuscribe', icon: PenLine },
  { name: 'Grid', href: '/docuscribe/grid', icon: LayoutGrid },
  { name: 'Flow', href: '/docuscribe/flow', icon: Workflow },
  { name: 'Mail', href: '/docuscribe/mail', icon: Mail },
];

function SidebarContent() {
  const pathname = usePathname();
  const { 
    documents, 
    activeDocumentId, 
    setActiveDocumentId, 
    templates, 
    createDocument 
  } = useDocuScribe();

  const isWriteMode = pathname === '/docuscribe';

  return (
    <aside className="docuscribe-sub-sidebar w-[240px] border-r border-white/5 bg-transparent flex flex-col pt-6 shrink-0 relative z-20 transition-all duration-300">
      {/* Division Identity Header */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 text-primary mb-1">
          <PenLine className="w-5 h-5 text-primary" />
          <h1 className="font-extrabold tracking-tighter text-sm uppercase">
            DocuSCRIBE™
          </h1>
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-30">
          Powered by Scing™
        </p>
      </div>

      {/* Sub-Navigation (Mode Selection) */}
      <nav className="px-3 space-y-1 mb-6">
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
              <item.icon className={cn(
                "w-4 h-4",
                isActive ? "text-primary" : "text-muted-foreground/40"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Unified Document List (Global visibility for switcher) */}
      <div className="flex-1 overflow-hidden flex flex-col border-t border-white/5">
        <DocumentListPanel
          documents={documents}
          activeDocumentId={activeDocumentId}
          onSelectDocument={setActiveDocumentId}
          templates={templates}
          onCreateFromTemplate={createDocument}
        />
      </div>

      {/* Footer Version Tag */}
      <div className="p-4 border-t border-border/20 text-[10px] text-muted-foreground/30 font-mono text-center">
        DOCUSCRIBE v1.2.0-P3.3A
      </div>
    </aside>
  );
}

export default function DocuScribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocuScribeProvider>
      <div className="flex h-full min-h-[calc(100vh-13rem)] overflow-hidden">
        <SidebarContent />

        {/* ─── Main Content Area ─── */}
        <main className="flex-grow overflow-y-auto bg-transparent relative scrollbar-hide">
          {/* Vignette Overlay for depth */}
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
          {children}
        </main>
      </div>
    </DocuScribeProvider>
  );
}
