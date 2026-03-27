import React from 'react';
import { Upload, FileText, X } from 'lucide-react';
import type { FieldAttachment } from '../../lib/contractor/types';

interface DocumentationUploadControlProps {
  attachments: FieldAttachment[];
  onUpload: (files: FileList) => void;
  onRemove: (id: string) => void;
}

export const DocumentationUploadControl: React.FC<DocumentationUploadControlProps> = ({
  attachments,
  onUpload,
  onRemove
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="mt-2 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Source Documentation</h4>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase bg-white/5 hover:bg-white/10 text-white/60 rounded border border-white/10 transition-colors"
        >
          <Upload className="w-3 h-3" />
          + Documentation
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
          accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.svg"
        />
      </div>

      {attachments.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {attachments.map(att => (
            <div key={att.id} className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded group hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-white/20 flex-shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-medium text-white/70 truncate">{att.fileName}</div>
                  <div className="text-[10px] text-white/20">{att.purpose.replace('_', ' ')} • Preserved</div>
                </div>
              </div>
              <button 
                onClick={() => onRemove(att.id)}
                className="p-1 hover:bg-red-500/10 text-white/10 hover:text-red-400 rounded transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {attachments.length === 0 && (
        <div className="p-4 border border-dashed border-white/5 rounded text-center bg-white/[0.01]">
          <p className="text-[10px] text-white/20 italic">No source documentation uploaded for this field.</p>
        </div>
      )}
    </div>
  );
};
