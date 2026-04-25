/**
 * DocuSCRIBE™ — Trust Stamp Dialog
 *
 * @classification UI_COMPONENT
 * @authority SCINGULAR Prime / DocuSCRIBE Division
 * @status P2_TRUST_STAMP
 *
 * Password-gated Trust Stamp issuance dialog.
 * Every stamp insertion requires a password challenge.
 * The password is NEVER stored — validated locally only.
 *
 * P2 uses a configurable mock passphrase. Production Firebase Auth
 * re-authentication is Phase 3 scope.
 */

'use client';

import React, { useState } from 'react';
import { Stamp, AlertTriangle, Loader2 } from 'lucide-react';
import type { DocuScribeDocument } from '@/lib/docuscribe/types';
import { calculateCARR } from '@/lib/docuscribe/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** P2 mock passphrase. Production will use Firebase Auth re-authentication. */
const STAMP_PASSPHRASE = 'SCINGULAR_STAMP_2026';

interface TrustStampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocuScribeDocument;
  onStampIssued: (document: DocuScribeDocument) => void;
}

export function TrustStampDialog({
  open,
  onOpenChange,
  document,
  onStampIssued,
}: TrustStampDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const carrScore = calculateCARR(document.findings ?? []);
  const hasFindings = (document.findings?.length ?? 0) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (password !== STAMP_PASSPHRASE) {
      setError('Invalid stamp authorization password.');
      return;
    }

    setLoading(true);

    try {
      // Simulate brief processing delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 400));
      onStampIssued(document);
      setPassword('');
      setError(null);
      onOpenChange(false);
    } catch {
      setError('Stamp issuance failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Stamp className="w-5 h-5 text-primary" />
            <DialogTitle className="text-sm font-black uppercase tracking-tight">
              Apply Trust Stamp
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            This action binds a Trust Stamp to the current document version.
            A password challenge is required for every stamp issuance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* ─── Document Summary ─── */}
          <div className="p-3 bg-white/[0.03] border border-white/5 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                Document
              </span>
              <span className="text-[9px] font-mono text-white/20">
                v{document.version}.{document.sub_version}
              </span>
            </div>
            <p className="text-xs text-white/70 font-semibold truncate">
              {document.title}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[10px] text-white/30">CARR Preview</span>
              {hasFindings ? (
                <span className={cn(
                  "text-sm font-black tabular-nums",
                  carrScore >= 0.8 ? "text-emerald-400" :
                  carrScore >= 0.6 ? "text-amber-400" :
                  carrScore >= 0.4 ? "text-orange-400" : "text-rose-400"
                )}>
                  {carrScore.toFixed(2)}
                </span>
              ) : (
                <span className="text-[10px] text-white/20 italic">No findings</span>
              )}
            </div>
          </div>

          {/* ─── Password Challenge ─── */}
          <div className="space-y-2">
            <label
              htmlFor="stamp-password"
              className="text-[10px] font-bold uppercase tracking-widest text-white/40"
            >
              Stamp Authorization Password
            </label>
            <Input
              id="stamp-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter stamp password"
              autoComplete="off"
              className="bg-white/[0.03] border-white/10 text-white placeholder-white/20"
            />
            {error && (
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[10px] font-bold">{error}</span>
              </div>
            )}
          </div>

          {/* ─── Actions ─── */}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="text-xs"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!password.trim() || loading}
              className="text-xs font-bold uppercase tracking-wider bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Issuing…
                </>
              ) : (
                <>
                  <Stamp className="w-3.5 h-3.5 mr-1.5" />
                  Issue Trust Stamp
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
