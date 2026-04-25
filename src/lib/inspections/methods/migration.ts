/**
 * @fileOverview Method Migration Utility — SCINGULAR™ Methodology Stack
 * @domain Inspections / Methodology
 * @canonical true
 * 
 * Enforces Doctrine 2: Legacy Migration Must Be Explicit.
 * Assigns default General method only through visible migration rules.
 */

import { DocuScribeDocument } from '../../docuscribe/types';
import { METHOD_REGISTRY } from './registry';

/**
 * Migration result containing the updated document and migration metadata.
 */
export interface MigrationResult {
  document: DocuScribeDocument;
  migrationApplied: boolean;
  notes: string[];
}

/**
 * Ensures a document is method-bound. 
 * If no method is present, assigns the 'general-property' method as a legacy fallback.
 */
export function migrateToMethodBound(doc: DocuScribeDocument): MigrationResult {
  const result: MigrationResult = {
    document: { ...doc },
    migrationApplied: false,
    notes: []
  };

  // Check if document already has methodology ID
  if (result.document.method_id) {
    return result;
  }

  // Doctrine 2 Enforcement: Explicit default assignment
  const defaultMethod = METHOD_REGISTRY['general-property'];
  
  result.document.method_id = defaultMethod.methodId;
  result.document.method_version = defaultMethod.version;
  result.migrationApplied = true;
  result.notes.push(`[MIGRATION-v1] Assigned default ${defaultMethod.methodName} to legacy document.`);
  
  // Traceability: Add audit entry
  if (result.document.audit_log) {
    result.document.audit_log.push({
      id: `mig-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'METHOD_MIGRATION',
      actor: 'SYSTEM',
      details: 'Legacy document migrated to General Property Method (code-canon default).'
    });
  }

  return result;
}
