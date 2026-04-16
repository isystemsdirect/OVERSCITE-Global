# OVERSCITE Cryptographic Version Lock: CryptoStack-v1.0.00
**Authority:** BANE Governance Unit & ArcHive™ Authoring Authority
**CB_ID:** UTCB-G__20260414-063334Z__SCING__001

## Doctrine Declarations
1. **Governance Before Cryptographic Size:** OVERSCITE security strength is rooted first in governance, trust boundaries, auditability, and controlled mutation; cryptographic primitive selection supports that foundation but does not replace it.
2. **Separation Of Cryptographic Roles:** Identity/signing, key exchange, and bulk data encryption are separate roles and must not be collapsed into one primitive merely for branding or superficial hardness.
3. **RSA-4096 Is Bounded, Not Global:** RSA-4096 may be evaluated for bounded trust-anchor roles such as signatures, certificate-style identity anchoring, or archival-grade authenticity assertions, but it shall not become the universal runtime cipher.
4. **Experiment Before Production:** All crypto-stack changes must progress through version lock, isolated experiment, measurement, review, and governed promotion.

## Specification (v1.0.00)

### 1. Trust Anchor Layer
*   **Primary Option (Production):** Ed25519 or equivalent modern signing primitive.
*   **Experimental Option:** RSA-4096 bounds-tested for selective authenticity, report sealing, and identity assertions.
*   **Purpose:** Identity assertions, document authenticity, audit artifact sealing, verification envelope signing.

### 2. Session Exchange Layer
*   **Locked Option:** Curve25519 / ECDH-class session establishment.
*   **Purpose:** Ephemeral session key establishment, forward-secrecy-aligned exchange posture.

### 3. Data Protection Layer
*   **Locked Option:** AES-256-GCM or equivalent authenticated symmetric encryption.
*   **Purpose:** Data at rest, data in transit, operational records, media transport, and stored payload protection.

### 4. Hash Integrity Layer
*   **Locked Option:** SHA-256 or stronger approved integrity primitive.
*   **Purpose:** Audit integrity, artifact hashing (ArcHive™), chain-of-custody support.

## Key Management Notes
*   **Generation:** Ed25519 paths are generated in-memory nearly instantly (<5ms). RSA-4096 generation introduces extreme blocking latency (~1500ms) requiring async worker offloads to avoid UI thread hanging.
*   **Storage:** Keys must remain in secure memory or KMS; never exported to standard logs.
*   **Rotation:** Keys mapped to identity require formal revocation checks within LARI-IPN before acceptance of replacements.
*   **Revocation:** Device and identity keys follow IPN Audit strict schema processing with cryptographic verification.
