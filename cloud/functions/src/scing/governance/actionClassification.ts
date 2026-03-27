/**
 * Scing Cloud Core — Action Classification Framework
 *
 * Classifies every action path by its operational consequence:
 *   read         — no mutation, information retrieval only
 *   write        — creates or updates data, reversible
 *   sensitive    — involves identity, auth, config, or compliance-adjacent data
 *   irreversible — cannot be undone (deletes, external calls, deployments)
 *
 * Default classification is 'sensitive' (fail-safe — unclassified actions
 * receive elevated scrutiny rather than open access).
 *
 * Canon: This module classifies; it does not enforce. Enforcement is handled
 * by the action gate. Classification and enforcement remain separable.
 */

import {
  ActionClassification,
  ClassificationPolicy,
  GovernancePolicy,
} from './governanceTypes';

// ---------------------------------------------------------------------------
// Built-in action classifications
// ---------------------------------------------------------------------------

/**
 * Explicit classification map for known action paths.
 * Format: 'domain.action' → classification
 *
 * New tools/endpoints MUST be added here. If missing, the default
 * classification ('sensitive') applies — intentionally conservative.
 */
const ACTION_CLASSIFICATIONS: Record<string, ActionClassification> = {
  // ----- Scing endpoints -----
  'scing.boot':                   'write',        // Creates or restores session
  'scing.chat':                   'write',        // Mutates session state + model call
  'scing.tools':                  'read',         // Lists available tools

  // ----- Scing built-in tools -----
  'scing_getSessionHistory':      'read',         // Reads conversation messages
  'scing_updateContext':          'write',        // Patches session context
  'scing_healthCheck':            'read',         // System status read

  // ----- AIP endpoints -----
  'aip.handleMessage':            'write',        // Routes through orchestrator
  'aip.contextUpdate':            'write',        // Patches session context

  // ----- BANE/LARI endpoints -----
  'bane.enforce':                 'read',         // Policy evaluation
  'lari.inference':               'write',        // Model call
  'lari.analyze':                 'write',        // Analysis with state mutation

  // ----- Session lifecycle -----
  'session.create':               'write',
  'session.restore':              'read',
  'session.end':                  'sensitive',     // Lifecycle state change
  'session.updateContext':        'write',
  'session.appendMessage':        'write',

  // ----- Admin/config paths (future) -----
  'admin.updatePolicy':           'irreversible', // Policy mutation
  'admin.revokeSession':          'irreversible', // Session termination
  'admin.deleteAuditRecords':     'irreversible', // Audit record removal (should never exist)
  'admin.deployFunction':         'irreversible', // Deployment action
};

// ---------------------------------------------------------------------------
// Classification function
// ---------------------------------------------------------------------------

/**
 * Classify an action by name using the explicit map.
 * Falls back to defaultClassification (normally 'sensitive').
 */
export function classifyAction(
  actionName: string,
  defaultClassification: ActionClassification = 'sensitive',
): ActionClassification {
  return ACTION_CLASSIFICATIONS[actionName] ?? defaultClassification;
}

/**
 * Check whether an action name has an explicit classification.
 * Used for drift detection — unclassified actions are governance gaps.
 */
export function isClassified(actionName: string): boolean {
  return actionName in ACTION_CLASSIFICATIONS;
}

/**
 * Return all explicitly classified action names.
 * Used by the hardening map documentation generator.
 */
export function getAllClassifications(): Record<string, ActionClassification> {
  return { ...ACTION_CLASSIFICATIONS };
}

// ---------------------------------------------------------------------------
// Classification-level policy defaults
// ---------------------------------------------------------------------------

/**
 * Default governance policy per classification level.
 * These are the baseline policies before any per-deployment overrides.
 */
export const DEFAULT_CLASSIFICATION_POLICIES: Record<ActionClassification, ClassificationPolicy> = {
  read: {
    requiredCapabilities: ['bane:invoke'],
    requiresPreReceipt: false,
    requiresPostReceipt: false,
    captureProvenance: false,
    rateLimited: false,
  },
  write: {
    requiredCapabilities: ['bane:invoke'],
    requiresPreReceipt: true,
    requiresPostReceipt: true,
    captureProvenance: true,
    rateLimited: false,
  },
  sensitive: {
    requiredCapabilities: ['bane:invoke', 'tool:db_write'],
    requiresPreReceipt: true,
    requiresPostReceipt: true,
    captureProvenance: true,
    rateLimited: true,
  },
  irreversible: {
    requiredCapabilities: ['bane:invoke', 'tool:db_write', 'tool:external_call'],
    requiresPreReceipt: true,
    requiresPostReceipt: true,
    captureProvenance: true,
    rateLimited: true,
  },
};

/**
 * Build the default governance policy.
 * Feature flags default to enforcement ON with receipts ON.
 */
export function buildDefaultPolicy(): GovernancePolicy {
  const enforceGate = process.env.SCING_GOVERNANCE_ENFORCE !== 'false';
  const emitReceipts = process.env.SCING_GOVERNANCE_RECEIPTS !== 'false';

  return {
    enforceGate,
    emitReceipts,
    defaultClassification: 'sensitive',
    classificationPolicies: { ...DEFAULT_CLASSIFICATION_POLICIES },
  };
}
