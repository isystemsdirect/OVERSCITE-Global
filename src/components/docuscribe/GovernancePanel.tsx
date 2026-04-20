/**
 * DocuSCRIBE™ — Governance Panel
 * 
 * Right-hand workspace Rail for truth-state enforcement, 
 * commenting, and audit/history tracking.
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, MessageSquare, History, 
  Fingerprint, Lock, ShieldAlert, CheckCircle2,
  Sparkles, Zap, ChevronRight, Wand2, Share2, Hash
} from 'lucide-react';
import { useDocuScribe } from '@/lib/docuscribe/context';
import type { DocuScribeDocument, SectionTruthState } from '@/lib/docuscribe/types';
import type { ScingAction } from '@/lib/docuscribe/ScingIntelligenceService';
import { DiscussionPanel } from './DiscussionPanel';
import { DocumentOutline } from './DocumentOutline';

interface GovernancePanelProps {
  document: DocuScribeDocument;
  onNavigate: (pageIndex: number, elementId: string) => void;
}

export function GovernancePanel({ document, onNavigate }: GovernancePanelProps) {
  const { updatePageSection, executeScingAction, confirmSuggestion, addPage } = useDocuScribe();
  const [activeTab, setActiveTab] = useState<'status' | 'comments' | 'history' | 'audit' | 'intelligence' | 'discuss' | 'outline'>('status');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: 'outline', icon: Hash, label: 'Nav' },
    { id: 'status', icon: ShieldCheck, label: 'Truth' },
    { id: 'intelligence', icon: Sparkles, label: 'Scing' },
    { id: 'discuss', icon: Share2, label: 'Discuss' },
    { id: 'comments', icon: MessageSquare, label: 'Review' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'audit', icon: Fingerprint, label: 'Audit' },
  ];

  return (
    <div className="flex flex-col h-full bg-black/20">
      {/* ─── Tab Navigation ─── */}
      <div className="flex border-b border-white/5 bg-black/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex flex-col items-center py-3 gap-1.5 transition-all relative",
              activeTab === tab.id 
                ? "text-primary bg-primary/5" 
                : "text-white/20 hover:text-white/40"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow shadow-primary/20" />
            )}
          </button>
        ))}
      </div>

      <div className={cn("flex-1 overflow-y-auto custom-scrollbar", activeTab === 'outline' && "overflow-hidden")}>
        {/* ─── Navigation/Outline Tab ─── */}
        {activeTab === 'outline' && (
          <DocumentOutline document={document} onNavigate={onNavigate} />
        )}

        {/* ─── Intelligence Tab ─── */}
        {activeTab === 'intelligence' && (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Scing Assistant</h4>
                 <div className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">LARI-V4 Active</div>
               </div>

               <div className="space-y-2">
                 <textarea 
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   placeholder="Enter structural mission prompt..."
                   className="w-full h-32 bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white/60 focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10 resize-none"
                 />
                 <button 
                   disabled={!prompt || isGenerating}
                   onClick={async () => {
                     setIsGenerating(true);
                     try {
                        const sug = await executeScingAction('notes_to_report', prompt);
                        // For prompt-to-doc, we suggest a new page
                        const confirm = window.confirm('Scing generated a structured report. Spawn new page?');
                        if (confirm) {
                           addPage(sug.proposed);
                           setPrompt('');
                        }
                     } finally { setIsGenerating(false); }
                   }}
                   className="w-full py-2.5 bg-primary text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                 >
                   {isGenerating ? <Wand2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                   Generate Section
                 </button>
               </div>

               <div className="pt-4 space-y-3">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Transformation Presets</span>
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'notes_to_report', label: 'Notes → Structured Report', icon: Zap },
                      { id: 'formalize' as ScingAction, label: 'Document Formalization', icon: ShieldCheck },
                      { id: 'clarify_technical' as ScingAction, label: 'Technical Clarification', icon: Wand2 }
                    ].map(action => (
                      <button 
                        key={action.id}
                        onClick={async () => {
                          const res = await executeScingAction(action.id as ScingAction, document.pages[0].content);
                          const conf = window.confirm(`PROPOSED: ${res.explanation}\n\nCommit transformation to Page 1?`);
                          if (conf) confirmSuggestion(document.pages[0].page_id, res);
                        }}
                        className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <action.icon className="w-3 h-3 text-white/40 group-hover:text-primary transition-colors" />
                          <span className="text-[10px] text-white/60 group-hover:text-white">{action.label}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 text-white/10" />
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* ─── Discussion Tab ─── */}
        {activeTab === 'discuss' && (
          <DiscussionPanel />
        )}

        {/* ─── Truth State Tab ─── */}
        {activeTab === 'status' && (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Page Status Enforcement</h4>
              
              {document.pages.map((page, idx) => (
                <div key={page.page_id} className="p-3 rounded-lg border border-white/5 bg-black/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Page {idx + 1}</span>
                    <StatusBadge status={page.status} />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    {(['draft', 'reviewed', 'locked'] as SectionTruthState[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updatePageSection(page.page_id, { status: s })}
                        className={cn(
                          "py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all",
                          page.status === s 
                            ? "bg-white/10 text-white border border-white/20" 
                            : "text-white/20 hover:text-white/40 hover:bg-white/5"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ─── Comments Tab ─── */}
        {activeTab === 'comments' && (
          <div className="p-4 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Review Threads</h4>
            {document.comments.length === 0 ? (
              <div className="py-20 text-center opacity-20">
                <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Active Threads</span>
              </div>
            ) : (
              <div className="space-y-3">
                {document.comments.map(comment => (
                   <div key={comment.id} className="p-3 rounded-lg border border-white/5 bg-white/5 space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-primary uppercase">{comment.author}</span>
                       <span className="text-[8px] text-white/20 font-mono">{new Date(comment.timestamp).toLocaleDateString()}</span>
                     </div>
                     <p className="text-[11px] text-white/60 leading-relaxed">{comment.text}</p>
                   </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── History Tab ─── */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Version Snapshots</h4>
            {document.history.length === 0 ? (
              <div className="py-20 text-center opacity-20">
                <History className="w-8 h-8 mx-auto mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Snapshots Found</span>
              </div>
            ) : (
              <div className="space-y-2">
                {document.history.map(snap => (
                  <button key={snap.version_id} className="w-full text-left p-2 rounded border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all flex items-center justify-between group">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white/60 group-hover:text-white">{snap.version_id}</span>
                      <span className="text-[8px] text-white/20">{new Date(snap.timestamp).toLocaleString()}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Audit Tab ─── */}
        {activeTab === 'audit' && (
          <div className="p-4 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Authority Audit Trail</h4>
            <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
              {document.audit_log.map((entry) => (
                <div key={entry.id} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter">{entry.action.replace(/_/g, ' ')}</span>
                      <span className="text-[8px] font-mono text-white/20">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-snug">{entry.details}</p>
                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-widest">Actor: {entry.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SectionTruthState }) {
  const configs = {
    draft: { color: 'text-white/40 border-white/10 bg-white/5', icon: ShieldAlert, label: 'Draft' },
    reviewed: { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', icon: CheckCircle2, label: 'Reviewed' },
    locked: { color: 'text-primary border-primary/20 bg-primary/5', icon: Lock, label: 'Locked' },
    archived: { color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', icon: History, label: 'Archived' },
  };

  const config = configs[status] || configs.draft;
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest", config.color)}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </div>
  );
}
