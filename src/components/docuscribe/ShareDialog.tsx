/**
 * DocuSCRIBE™ — Governed Share & Distribution Dialog
 * 
 * Central interface for secure link management and simulated outbound routing.
 * Enforces truth-state awareness for final vs draft sharing.
 */

'use client';

import React, { useState } from 'react';
import { 
  Share2, Link, Mail, Shield, AlertCircle, 
  ExternalLink, Copy, Check, X, Trash2, Clock
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocuScribe } from '@/lib/docuscribe/context';
import { cn } from '@/lib/utils';
import { buildEmailPackage } from '@/lib/docuscribe/DistributionService';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const { 
    activeDocument, 
    createShareLink, 
    revokeShareLink, 
    sendDocumentEmail,
    logAuditEntry
  } = useDocuScribe();

  const [activeTab, setActiveTab] = useState('link');
  const [copied, setCopied] = useState(false);
  const [linkOptions, setLinkOptions] = useState({
    type: 'live' as 'live' | 'snapshot',
    expiryDays: 7
  });

  const [emailForm, setEmailForm] = useState({
    recipient: '',
    subject: activeDocument ? buildEmailPackage(activeDocument.title, activeDocument.document_id).subject : '',
    body: activeDocument ? buildEmailPackage(activeDocument.title, activeDocument.document_id).body : ''
  });

  if (!activeDocument) return null;

  const handleCreateLink = () => {
    createShareLink(linkOptions.type, undefined, linkOptions.expiryDays);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!emailForm.recipient) return;
    sendDocumentEmail(emailForm.recipient, emailForm.subject, emailForm.body);
    onOpenChange(false);
  };

  const isDraft = activeDocument.status === 'draft';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-white/10 text-white p-0 overflow-hidden">
        <div className="flex h-[500px]">
          {/* Sidebar / Context */}
          <div className="w-1/3 bg-zinc-900/50 border-r border-white/5 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="text-primary w-5 h-5" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Distribute</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Document Status</div>
                <div className={cn(
                  "text-xs font-black uppercase tracking-wider",
                  isDraft ? "text-amber-400" : "text-emerald-400"
                )}>
                  {activeDocument.status}
                </div>
              </div>

              {isDraft && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3">
                  <AlertCircle className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-amber-500 font-medium leading-relaxed">
                    Draft Status: Sharing live links will expose ongoing workspace mutations until document is locked.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-bold tracking-tight">Governance Distribution Bridge</DialogTitle>
              <DialogDescription className="text-white/40 text-sm">
                Control how this document is shared across SCINGULAR nodes.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col mt-4">
              <TabsList className="mx-6 bg-white/5 border border-white/10 p-1">
                <TabsTrigger value="link" className="text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                  Secure Link
                </TabsTrigger>
                <TabsTrigger value="email" className="text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                  Email Distribute
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-black">
                  History
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <TabsContent value="link" className="mt-0 space-y-6">
                  {/* Link Generation */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-white/30 uppercase">Link Type</label>
                        <select 
                          value={linkOptions.type}
                          onChange={(e) => setLinkOptions({...linkOptions, type: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white/80"
                        >
                          <option value="live">Live Document URL</option>
                          <option value="snapshot">Immutable Snapshot</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-white/30 uppercase">Expiry (Days)</label>
                        <Input 
                          type="number" value={linkOptions.expiryDays} 
                          onChange={(e) => setLinkOptions({...linkOptions, expiryDays: parseInt(e.target.value)})}
                          className="bg-white/5 border-white/10 h-8 text-xs" 
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleCreateLink}
                      className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-black font-bold h-9"
                    >
                      <Link size={14} className="mr-2" />
                      Generate Secure Link
                    </Button>
                  </div>

                  {/* Active Links List */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                       Active Distribution Tokens
                       <div className="flex-1 h-px bg-white/5" />
                    </h4>
                    
                    {activeDocument.distribution.links?.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-white/5 rounded-lg text-xs text-white/20">
                        No active distribution links
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activeDocument.distribution.links.filter(l => !l.revoked).map(link => (
                          <div key={link.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between group">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Shield size={10} className="text-emerald-500" />
                                <span className="text-[10px] font-mono text-white/80 truncate">{link.url}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[9px] text-white/30 font-bold uppercase tracking-tighter">
                                <span className="flex items-center gap-1"><Clock size={9} /> Exp: {new Date(link.expiry).toLocaleDateString()}</span>
                                <span className="text-primary">{link.type}</span>
                                <span>{link.view_count} Views</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(link.url)}>
                                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-rose-500/50 hover:text-rose-500" onClick={() => revokeShareLink(link.id)}>
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="email" className="mt-0 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase">Recipient SCINGULAR Node</label>
                      <Input 
                        placeholder="node-id@SCINGULAR.domain" 
                        value={emailForm.recipient}
                        onChange={(e) => setEmailForm({...emailForm, recipient: e.target.value})}
                        className="bg-white/5 border-white/10 text-xs" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-white/30 uppercase">Subject</label>
                      <Input 
                        value={emailForm.subject}
                        onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                        className="bg-white/5 border-white/10 text-xs" 
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <label className="text-[10px] font-bold text-white/30 uppercase">Body Context</label>
                      <textarea 
                        value={emailForm.body}
                        onChange={(e) => setEmailForm({...emailForm, body: e.target.value})}
                        className="w-full min-h-[140px] bg-white/5 border border-white/10 rounded-md p-3 text-xs text-white/70 outline-none focus:border-primary/40"
                      />
                    </div>

                    <div className="p-3 border border-white/5 bg-black/40 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <ExternalLink size={14} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-white font-mono">{activeDocument.title}.html</div>
                          <div className="text-[8px] font-bold text-white/20 uppercase">Audit-Linked Artifact Attached</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0 space-y-2">
                   {activeDocument.distribution.outbound_history?.length === 0 ? (
                     <div className="text-center py-12 text-xs text-white/20 uppercase font-black tracking-widest">
                       No Outbound Lineage Found
                     </div>
                   ) : (
                     activeDocument.distribution.outbound_history.map((item, idx) => (
                       <div key={idx} className="p-3 border border-white/5 rounded-lg flex justify-between items-center bg-white/5">
                         <div>
                            <div className="text-xs font-bold text-white/80">{item.recipient}</div>
                            <div className="text-[9px] text-white/30 font-mono">{item.timestamp}</div>
                         </div>
                         <div className="text-[9px] font-black text-primary px-2 py-0.5 rounded border border-primary/20 uppercase">
                            Delivered
                         </div>
                       </div>
                     ))
                   )}
                </TabsContent>
              </div>

              <DialogFooter className="p-6 border-t border-white/5 bg-black/20">
                 {activeTab === 'email' ? (
                   <Button 
                    className="w-full bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90"
                    onClick={handleSend}
                    disabled={!emailForm.recipient}
                   >
                     Distribute Document via Bridge
                   </Button>
                 ) : (
                   <Button variant="ghost" className="w-full text-white/40 hover:text-white" onClick={() => onOpenChange(false)}>
                     Close Distribution Chamber
                   </Button>
                 )}
              </DialogFooter>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
