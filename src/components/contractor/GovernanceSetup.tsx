'use client';

import React from 'react';
import { ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import type { GovernanceProfile } from '../../lib/contractor/types';
import { DocumentationUploadControl } from './DocumentationUploadControl';
import { ScingDraftWizardButton } from './ScingDraftWizardButton';

interface GovernanceSetupProps {
  governance: GovernanceProfile;
  onUpdateField: (id: string, content: string) => void;
  onInvokeWizard: (id: string) => void;
}

export const GovernanceSetup: React.FC<GovernanceSetupProps> = ({ 
  governance, 
  onUpdateField,
  onInvokeWizard
}) => {
  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="p-4 bg-white/[0.03] border border-white/10 rounded-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2 text-white/90">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold tracking-tight">Company Governance Prerequisites</h2>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">
          Configure internal company bylaws, safety policies, and operating rules. 
          The Scing Draft Wizard provides assistive recommendations for missing protective clauses.
          Uploaded documentation is preserved in its original form without alteration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {governance.sections?.map((section) => (
          <div key={section.id} className="p-4 bg-white/[0.02] border border-white/10 rounded-lg shadow-lg shadow-black/10 hover:border-indigo-500/30 transition-colors backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white/20" />
                <h3 className="font-bold text-white/80 uppercase tracking-wide text-xs">{section.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  section.draftState === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  section.draftState === 'drafted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-white/5 text-white/30 border-white/10'
                }`}>
                  {section.draftState}
                </span>
                <ScingDraftWizardButton 
                  onClick={() => onInvokeWizard(section.id)} 
                  label="Rec. Clauses"
                />
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={section.content}
                onChange={(e) => onUpdateField(section.id, e.target.value)}
                placeholder={`Draft ${section.title} here...`}
                className="w-full min-h-[100px] p-3 text-sm bg-black/20 border border-white/10 rounded focus:ring-1 focus:ring-indigo-500/50 outline-none resize-y font-mono text-white/70"
              />

              <DocumentationUploadControl 
                attachments={section.attachments}
                onUpload={(files) => console.log('Upload to', section.id, files)}
                onRemove={(attId) => console.log('Remove from', section.id, attId)}
              />
              
              {section.draftState === 'drafted' && (
                <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-400">
                  <ChevronRight className="w-3 h-3" />
                  Recommendation received. Human review required for application.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {!governance.sections?.length && (
        <div className="p-12 border border-dashed border-white/10 rounded-xl text-center bg-white/[0.01]">
          <p className="text-white/20 text-sm italic">No governance sections defined. Initialize from template.</p>
        </div>
      )}
    </div>
  );
};

export default GovernanceSetup;
