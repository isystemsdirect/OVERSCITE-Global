/**
 * DocuSCRIBE™ — Truth-State Disclosure Footer
 *
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P1_MANDATORY
 *
 * This footer MUST appear on every unverified document surface (screen, print, export).
 * It cannot be dismissed, hidden, or overridden by the user.
 * Canon: "All unverified documents must show footer on every page."
 */

'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TruthStateDisclosureFooterProps {
  isVerified: boolean;
}

export function TruthStateDisclosureFooter({ isVerified }: TruthStateDisclosureFooterProps) {
  if (isVerified) return null;

  return (
    <div
      className="docuscribe-disclosure-footer flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 select-none"
      role="alert"
      aria-live="polite"
      data-disclosure="unverified"
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <p className="text-xs font-bold tracking-wide uppercase leading-tight">
        This document has not been verified and is NOT a formal report/document.
      </p>
    </div>
  );
}
