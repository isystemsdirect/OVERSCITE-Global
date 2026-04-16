# OVERSCITE Cryptographic Posture: v1.1.00

**Effective Date**: 2026-04-14  
**Status**: ACTIVE / VERSION-LOCKED  

## 1. Primary Posture
OVERSCITE enforces a 128-bit security level baseline across all production surfaces.

| Domain | Algorithm | Strength | Purpose |
| :--- | :--- | :--- | :--- |
| **Asymmetric Identity** | **Ed25519** | ~128-bit | Authentication & Integrity |
| **Key Agreement** | **Curve25519** | ~128-bit | Session Confidentiality |
| **Symmetric Cipher** | **AES-256-GCM** | 256-bit | Authenticated Encryption |
| **Digest Engine** | **SHA-256** | 256-bit | Cryptographic Hashing |

## 2. Bounded Optional Primitives

### 2.1 RSA-4096 (Archival)
Accepted for archival seal validation and legacy backend authenticity only. Prohibited from all live runtime paths.

## 3. Version Lock Doctrine
No modifications to this primitive set are permitted without a formal `UTCB` Cryptographic Benchmark Qualification and BANE governance review. Speculative math and vanity-sized keys are explicitly rejected to maintain architectural performance.

## 4. Promotion Evidence
This posture is backed by benchmark findings documented in `BCI-Benchmark-Qualification.md`.
