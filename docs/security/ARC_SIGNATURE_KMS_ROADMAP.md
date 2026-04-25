# ARC Signature KMS Roadmap

## Current State: Hash-Binding
ARC signatures currently use SHA-256 hash binding — a deterministic hash that links actions to an ARC identity. This provides tamper-detection but not cryptographic non-repudiation.

## Future: Private/Public Key Signatures
ARC will transition to asymmetric cryptographic signatures using a public/private key pair.

## KMS Options
- Cloud-based KMS (AWS KMS, Google Cloud KMS, Azure Key Vault).
- Hardware Security Modules (HSM) for high-assurance deployments.
- On-device secure enclaves for field operations.

## Signer Identity Custody
Private keys are bound to ARC identity and stored in a managed KMS. No private key material is exposed to client-side code.

## Key Rotation
Keys are rotated on a governance-defined schedule. Rotation does not invalidate previously signed documents.

## Revocation
Compromised keys can be revoked through the ARC identity management system. Revocation invalidates future signatures but preserves historical witness records.

## Manifest Verification
Verification of ArcHive™ manifests uses the public key associated with the ARC signer at the time of signing. Verification is available through the public verification endpoint.
