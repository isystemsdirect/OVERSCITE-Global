# LARI-IPN Audit Schema

## Foundational Mandate
Every consequential IPN transport operation, session enablement, capability mapping, and BANE gate denial is cataloged to an immutable audit ledger leveraging `SHA-256` payload hashes.

## IPNAuditRecord Contract

```typescript
export interface IPNAuditRecord {
  id: string;                // Uniquely assigned record ID
  sessionId?: string;        // IPN Session Binding (Optional for pre-session evictions)
  requestId?: string;        // Specific Transport Packet Request ID
  actorArcId: string;        // Accountable Arc Identity
  targetId?: string;         // Device, Session, or Workspace Target ID (Required for Revocation)
  
  // Scope Governance Fields
  requestedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
  evaluatedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
  executedScope?: 'SESSION' | 'DEVICE' | 'WORKSPACE' | 'GLOBAL';
  
  authorityBasis?: string;   // E.g., 'Operator Command', 'Director Override'
  reasonClass?: string;      // Operational justification string provided by operator
  resultState?: 'allowed_executed' | 'allowed_noop' | 'rejected_policy' | 'rejected_scope' | 'rejected_authority' | 'failed_runtime';
  policyReference?: string;  // Doctrine or Policy pointer (Required for Revocation)

  eventType: string;         // E.g., DEVICE_REVOKE_REQUEST, ALLOWED_TELEMETRY
  decision: 'ALLOW' | 'DENY' | 'CONSTRAIN' | 'REVIEW_REQUIRED';
  reasoningSummary: string;  // Justification returned from BANE Evaluation Matrix
  createdAt: Date;           // Timestamp
  hash: string;              // Cryptographic proof of origin and sequence
}
```

## Immutable Integrity
The `hash` attribute strictly covers all parameters mapping directly to authorization boundaries (Actor ID, Target ID, Scopes, Reason Class, Authority Basis, Result State, Policy Reference, and Ruleset version). Changing historical records invalidates the hash.
