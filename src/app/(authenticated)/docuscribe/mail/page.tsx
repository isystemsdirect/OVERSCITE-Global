/**
 * DocuSCRIBE™ — Mail / Delivery Workspace
 *
 * @classification PAGE
 * @authority DocuSCRIBE Division
 * @status P3_CONNECTOR
 *
 * Formal report delivery and transmit center.
 */

'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Send, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { MOCK_DOCUMENTS } from '@/lib/docuscribe/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { recordStampAction } from '@/lib/docuscribe/stamp-audit';

export default function MailWorkspacePage() {
  // Only documents with valid Trust Stamps can be attached
  const attachableDocuments = MOCK_DOCUMENTS.filter(d => Boolean(d.trust_stamp?.is_valid));
  const [selectedDocId, setSelectedDocId] = useState<string>(attachableDocuments[0]?.document_id || '');
  const [sent, setSent] = useState(false);

  const selectedDoc = attachableDocuments.find(d => d.document_id === selectedDocId);

  const handleTransmit = async () => {
    if (!selectedDoc) return;
    
    // Simulate sending then record to audit
    setSent(true);
    
    await recordStampAction(
      'generation_authorized', // Reusing this action type for report transmit logging
      selectedDoc.trust_stamp?.stamp_id || 'unknown',
      selectedDoc.document_id,
      'System Automaton',
      `Formal report transmitted via Mail relay. Recipients: Client Core Group.`
    );

    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white/90 font-sans">
      <div className="p-6 md:p-8 lg:p-10 pb-0">
        <PageHeader
          title="Transmit Interface"
          status="live"
          guidanceId="docuscribe-mail"
          description="Secure delivery gateway for authorized, Trust-Stamped formal reports."
        />
      </div>

      <div className="flex-1 min-h-0 px-6 md:px-8 lg:px-10 py-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Status Alert */}
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Connector Not Provisioned</h4>
              <p className="text-[11px] text-amber-400/70 leading-relaxed">
                SMTP or SendGrid delivery mechanics are not yet configured in this deployment environment.
                The action below will generate the structured output and log the transmit event locally but will not disptach external network requests.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
              <h3 className="text-sm font-bold ml-2">New Transmission</h3>
              <Send className="w-4 h-4 text-white/30 mr-2" />
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">To</label>
                <Input defaultValue="stakeholders@client.corp" className="bg-black/50 border-white/10" disabled />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Subject</label>
                <Input defaultValue={selectedDoc ? `OVERSCITE Submission: ${selectedDoc.title}` : ''} className="bg-black/50 border-white/10" />
              </div>

              <div className="space-y-1.5 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Secure Attachment (Stamped Only)</label>
                
                {attachableDocuments.length > 0 ? (
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-md p-2.5 text-sm outline-none focus:border-primary/50 text-white"
                    value={selectedDocId}
                    onChange={(e) => setSelectedDocId(e.target.value)}
                  >
                    {attachableDocuments.map(doc => (
                      <option key={doc.document_id} value={doc.document_id}>
                        {doc.title} (v{doc.version}.{doc.sub_version}) — Trust Stamp Attached
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-red-500/5 text-red-400 border border-red-500/10 p-3 rounded-md text-xs">
                    No documents currently possess a valid SCINGULAR Trust Stamp. Formal reports cannot be transmitted.
                  </div>
                )}
              </div>

              {selectedDoc && selectedDoc.trust_stamp && (
                <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{selectedDoc.title}.pdf</h4>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                       <span className="text-[10px] text-white/50 font-mono">ID: {selectedDoc.document_id}</span>
                       <span className="text-[10px] text-white/50 font-mono">CARR: {selectedDoc.trust_stamp.carr_score.toFixed(2)}</span>
                       <span className="text-[10px] text-primary flex items-center gap-1 font-bold">
                         <CheckCircle2 className="w-3 h-3" /> Valid Trust Stamp
                       </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/40 flex justify-end">
               <Button 
                onClick={handleTransmit}
                disabled={!selectedDoc || sent} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-8"
              >
                {sent ? 'Transmitted' : 'Authorize & Transmit'}
               </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
