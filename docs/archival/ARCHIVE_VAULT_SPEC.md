# ArcHive™ Vault Specification

## Current State: localStorage (Development-Only)
ArcHive™ manifests are currently stored in the browser's localStorage. This is acceptable for development and simulation but **not suitable for production**.

## Backend Immutable Vault Target
Production deployment requires a persistent, immutable backend vault with the following properties:

### WORM Behavior (Write Once, Read Many)
Once a manifest is sealed, it cannot be modified or deleted. New versions create new records.

### Immutable Manifest Storage
Sealed manifests are stored with cryptographic integrity proofs. Any tampering is detectable.

### Version Promotion
Manifests progress through lifecycle states: Open → Sealed → Archived. Promotion is one-directional.

### Retention
Retention policies define how long manifests must be preserved. Governance-sensitive manifests may have indefinite retention.

### Export
Manifests can be exported in .sgr or standard formats for external verification, legal proceedings, or regulatory compliance.

### Audit Chain Binding
Every vault operation (store, promote, export) is logged in the BANE audit trail with ARC identity attribution.
