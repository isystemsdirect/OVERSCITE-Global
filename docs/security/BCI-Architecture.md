# BCI Architecture: BANE Cryptography Intelligence

**Version**: 1.1.00  
**Domain**: BANE Intelligence / Cryptographic Governance  

## 1. System Definition
BANE Cryptography Intelligence (BCI) is the execution intelligence layer that governs cryptographic operations across OVERSCITE. It stands between the service request and primitive execution to ensure that every operation is authorized, context-bound, and audited.

## 2. Decision Flow
1. **Request**: An user or service invokes a cryptographic operation (e.g., `SIGN_ARTIFACT`).
2. **Gatekeeper**: `enforceBaneCallable` verifies authentication and base capabilities.
3. **Authorization**: BCI `authorizeCryptoOperation` evaluates the request against active policies, checking environment, revocation state, and scope.
4. **Context Binding**: BCI validates that the actor, session, and device match the requested trust boundary.
5. **Execution**: If allowed, the primitive is executed (Ed25519, Curve25519, or AES-256-GCM).
6. **Audit**: An immutable, attributable record of the decision and outcome is written to the BCI Audit Spine.

## 3. Layer Separation
- **Policy Layer**: Defines the rules for operation/environment/risk mapping.
- **Authorization Layer**: Executes decision logic and issues decision IDs.
- **Execution Layer**: Orchestrates hashing, encryption, and signing.
- **Audit Layer**: Ensures truth-state persistence.

## 4. Cryptographic Posture
BCI enforces the OVERSCITE `v1.1.00` posture:
- **Trust Anchor**: Ed25519 for live signing.
- **Session**: Curve25519 for ephemeral exchange.
- **Protection**: AES-256-GCM for bulk data.
- **Integrity**: SHA-256 for hashing.
- **Archival**: RSA-4096 (Bounded backend-only).
