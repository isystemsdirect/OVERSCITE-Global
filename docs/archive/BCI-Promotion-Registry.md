# ArcHive™ Promotion Registry: BANE Cryptography Intelligence

**Registry Status**: INITIALIZED  

## 1. Promotion Tracking

| Promotion ID | Date | BCI Version | Posture | BANE Gate | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BCI-PROM-001** | 2026-04-14 | 1.1.00 | v1.1.00 | G11-G12 | **PROMOTED** | [v0.1.00 Baseline](file:///g:/GIT/isystemsdirect/OVERSCITE-Global/docs/archive/OVERSCITE-BUILD-001.md) |

## 2. BCI Policy Promotion States
- **1.1.00**: Current development baseline. Enforces Ed25519/AES-256 mandatory gating.
- **Promotion Level**: DEVELOPMENT BASELINE (Locked in OVERSCITE-BUILD-001)

## 3. Bounded Feature Flags
- `BCI_RSA_ARCHIVAL_ENABLED`: **ON** (Backend only).
- `BCI_LIVE_PATH_RSA_ENABLED`: **OFF** (Enforced by Policy).

## 4. Rollback Path
In the event of BCI execution failure, operations fallback to standard BANE Base Governance (`enforceBaneCallable`) where no crypto intelligence is applied, but primitive execution remains restricted by role capabilities.
