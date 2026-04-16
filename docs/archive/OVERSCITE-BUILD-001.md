# OVERSCITE Build v0.1.00 — System State Lock (BCI Integration Milestone)

**Build Version**: v0.1.00  
**Registry ID**: [OVERSCITE-BUILD-001](file:///g:/GIT/isystemsdirect/OVERSCITE-Global/docs/archive/OVERSCITE-BUILD-001.md)  
**CB_ID**: L-UTCB-S__20260414-081200Z__SCING__006  
**Codename**: BCI Integration Baseline  
**Timestamp**: 2026-04-14T08:12:00Z  

## 1. System Composition & State
- **State**: PARTIALLY STABLE / ARCHITECTURALLY STABLE
- **Readiness**: DEVELOPMENT BASELINE (Production: NO)
- **Achievements**:
    - BCI v1.0.00 foundational implementation complete.
    - Cryptographic posture locked and validated (Ed25519/Curve25519/AES-256-GCM/SHA-256).
    - RSA-4096 restricted to backend archival seal roles only.
    - Backend boundary stabilization complete (no app-root src leakage).
    - IPN revocation engine integrated into BCI.

## 2. Locked Cryptographic Posture

| Layer | Primitive | Role |
| :--- | :--- | :--- |
| **Trust Anchor** | **Ed25519** | Primary Identity & Live Signing |
| **Session Exchange** | **Curve25519** | Ephemeral Handshakes |
| **Data Protection** | **AES-256-GCM**| Payload Encryption |
| **Integrity** | **SHA-256** | Artifact & Audit Hashing |

### ⚠️ Restricted Primitives
- **RSA-4096**: Restricted to **Backend Archival Sealing Only**. Prohibited for live, mobile, or telemetry paths.

## 3. Known System Conditions (Migration Debt)
- **Firebase V1 → V2 Incomplete**: Partial stabilization achieved in `bane/enforce.ts`. Legacy modules (`obs/`, `report/`) still fail global compilation due to type mismatches.
- **Mobile Runtime**: Benchmarking extrapolated; raw device validation pending.

## 4. Next Required Evolution
1. **Firebase V2 Normalization**: Resolve global TS failures in legacy domains.
2. **BCI Hardening**: Expand BCI enforcement across all system execution paths.
3. **Mobile Qualification**: Raw device cryptographic benchmark execution.

## 5. Promotion Hierarchy
- **Promotion Level**: DEVELOPMENT BASELINE
- **Mutation Rules**: Only via governed CB lineage. No direct posture mutation allowed.

---
*Authorized by CDG Scing as the canonical baseline for OVERSCITE Build v0.1.00.*
