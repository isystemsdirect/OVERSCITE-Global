import React from 'react';
import { Sparkles } from 'lucide-react';

interface ScingDraftWizardButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}

export const ScingDraftWizardButton: React.FC<ScingDraftWizardButtonProps> = ({
  onClick,
  isLoading,
  disabled,
  label = "Scing Draft Wizard"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 
        text-[10px] font-bold uppercase tracking-wider
        bg-indigo-600 hover:bg-indigo-700 disabled:bg-white/5 disabled:text-white/10
        text-white rounded shadow-xl border border-indigo-500/30
        transition-all duration-200 group overflow-hidden
        ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
      `}
    >
      {/* Scing SVG Orb Simulation / Logo */}
      <div className="relative w-4 h-4 flex-shrink-0">
        <svg viewBox="0 0 24 24" className={`w-full h-full fill-current ${isLoading ? 'animate-spin' : ''}`}>
          <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10,10-4.47,10-10S17.53,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Z" opacity=".3"/>
          <path d="M12,4c-4.41,0-8,3.59-8,8s3.59,8,8,8,8-3.59,8-8S16.41,4,12,4Zm0,14c-3.31,0-6-2.69-6-6s2.69-6,6-6,6,2.69,6,6-2.69,6-6,6Z"/>
          <circle cx="12" cy="12" r="3" className={isLoading ? 'animate-pulse' : ''} />
        </svg>
      </div>
      
      <span className="relative z-10">{isLoading ? "Processing..." : label}</span>
      
      {!isLoading && (
        <Sparkles className="w-3 h-3 text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </button>
  );
};
