# ARC Signature KMS Roadmap

## Purpose
Defines the multi-phase plan for transitioning from session-based ARC binding to hardware-backed, cryptographic signatures using a Key Management System (KMS).

## Current Truth-State
ARC identity is currently bound to actions via session-based metadata and SHA-256 content hashing. While verifiable within the system, it does not yet provide non-repudiation via public-key cryptography.

## Canon Position
The final ARC signature model must be:
- **Human-Held**: The private key must reside on a device controlled by the human (e.g., YubiKey, TPM).
- **KMS-Governed**: All signing operations must be governed by the OVERSCITE™ KMS.
- **Audit-Immutable**: Every signature must be linked to a specific BANE-authorized instruction set.

## Implementation Roadmap
### Phase 1: Hash-Binding (Active)
- Link session ARC ID to all export artifacts.
- Implement SHA-256 content verification on import.

### Phase 2: Centralized KMS (Target: v0.2.0)
- Integrate with a cloud-based or organization-local KMS.
- System-generated signatures for all mission manifests.

### Phase 3: Hardware Token Integration (Target: v0.3.0)
- Support for WebAuthn/FIDO2 tokens for operator signing.
- Mandatory hardware-backed signature for "Armed" simulation states.

## Known Limitations
- **Current Trust Posture**: Relies on the security of the user session and system database.
- **No Non-Repudiation**: A system administrator could theoretically falsify a session-bound record.

## Next Required Work
- **KMS Provider Evaluation**: Research cloud-agnostic KMS providers suitable for the SCINGULAR™ architecture.
- **WebAuthn Prototype**: Build a proto-interface for signing a `.sgdoc` with a hardware key.
