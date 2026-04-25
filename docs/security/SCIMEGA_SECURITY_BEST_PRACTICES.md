# SCIMEGA™ Security Best Practices

## BANE/TEON Security Posture
- **BANE** enforces truth-state integrity. Any attempt to transition to LIVE or ARMED mode without proper authorization is blocked.
- **TEON** enforces kinetic safety constraints. All parameters are restricted to simulation-safe values in v0.1.2.

## ARC Identity Security
- ARC identity must be verified before any authority-bearing action.
- Current implementation uses hash-binding. Future: KMS-backed keypair signatures.
- Identity capsules (.sgi) are encrypted at rest.

## No Hardcoded Secrets
No secrets, tokens, credentials, or private endpoints are hardcoded in the SCIMEGA™ codebase.

## Environment-Based Configuration
All sensitive configuration is managed through environment variables and secure secret management.

## Telemetry Security
Telemetry intake is read-only. No command-send pathways exist in the Dry-Link boundary.

## Audit Logging
All BANE governance events, ARC authorizations, and TEON constraint checks are logged with forensic detail.
