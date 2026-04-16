# BCI Policy Model: Governed Cryptographic Decision Logic

**Policy Version**: 1.1.00  

## 1. Decision Outcomes
BCI issues one of four decisions for every cryptographic request:
- **ALLOW**: Operation proceeds at full requested scope.
- **RESTRICT**: Operation proceeds but with modified scope (e.g., `read_only_authenticity`).
- **DENY**: Operation is blocked; truth-state identifies the cause (e.g., `revoked_identity`).
- **ESCALATE**: Operation is blocked pending human or automated BANE review.

## 2. Decision Logic Matrix

| Operation type | Risk | Environments | Trigger for Deny | Trigger for Escalate |
| :--- | :--- | :--- | :--- | :--- |
| **SIGN_ARTIFACT** | MED | Backend/Desktop/Mobile | Revoked Device | Posture Anomaly |
| **ENCRYPT_PAYLOAD** | LOW | Backend/Desktop/Mobile | Revoked Session | None |
| **DECRYPT_PAYLOAD** | MED | Backend/Desktop/Mobile | Context Mismatch | Anomaly Detected |
| **SEAL_EXPORT** | HIGH | Backend only | Non-Backend env | Mandatory |
| **UNWRAP_KEY** | CRIT | Backend only | Non-Backend env | Mandatory |
| **REVOKE_DEVICE** | HIGH | Backend/Desktop | Permission Lack | None |

## 3. Restriction Modes
- **reduced_scope**: Access limited to specific target IDs.
- **no_decrypt**: Allowed to sign/hash but not decrypt.
- **backend_only**: Operation must be migrated to a secure backend queue.

## 4. Revocation Interaction
The BCI Policy engine consumes signals from the BCI Revocation Engine. Any target marked as `REVOKED` in the BCI truth-state results in an immediate **DENY** for all associated cryptographic operations.
