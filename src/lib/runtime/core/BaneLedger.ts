/**
 * @classification SCINGULAR_RUNTIME_CORE
 * @engine BANE_LEDGER
 * @purpose Implements an append-only, hash-chained persistence layer for BANE audit events, fulfilling D-STORE ledger simulation requirements.
 */

import { AuditLogEntry } from './ScingularRuntimeEngine';

const BANE_LEDGER_KEY = 'OVERSCITE_BANE_LEDGER';

export class BaneLedger {
  public static append(entry: Omit<AuditLogEntry, 'baneComplianceHash'>): AuditLogEntry {
    const history = this.readLedger();
    const previousHash = history.length > 0 ? history[history.length - 1].baneComplianceHash : 'GENESIS';
    
    // Simulate cryptographic hash chaining
    const hashInput = `${previousHash}|${entry.timestamp}|${entry.triad.role}|${entry.triad.arcSignature}|${entry.action}|${entry.permitted}`;
    const baneHash = `BANE-ZTI-${this.simpleHash(hashInput)}`;

    const fullEntry: AuditLogEntry = {
      ...entry,
      baneComplianceHash: baneHash
    };

    const newHistory = [...history, fullEntry];
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BANE_LEDGER_KEY, JSON.stringify(newHistory.slice(-500))); // Keep last 500
      } catch (e) {
        console.warn('Failed to persist BANE Ledger to localStorage', e);
      }
    }

    return fullEntry;
  }

  public static readLedger(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(BANE_LEDGER_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }
}
