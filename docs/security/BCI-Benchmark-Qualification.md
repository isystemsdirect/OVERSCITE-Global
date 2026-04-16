# BCI Benchmark Qualification Report: Cryptographic Runtime Tolerance

**CB_ID**: UTCB-G__20260414-072200Z__SCING__003  
**Status**: QUALIFIED  

## 1. Environment Matrix
Benchmarks were executed on the following environment classes:
- **Backend Node.js**: Qualified for all roles.
- **Desktop/Workstation**: Qualified for all roles.
- **Mobile/Constrained**: Qualified for ECC (Ed25519/Curve25519) only. RSA-4096 REJECTED.

## 2. Performance Baselines (P95)

| Primitive | Operation | Mean Latency | Verdict |
| :--- | :--- | :--- | :--- |
| **Ed25519** | Sign/Verify | 0.6ms | **PASS** (Live-safe) |
| **Curve25519** | Handshake | 0.4ms | **PASS** (Live-safe) |
| **AES-256-GCM** | Protect (500KB) | 2.1ms | **PASS** (Live-safe) |
| **SHA-256** | Hash (5MB) | 31.0ms | **PASS** (Integrity-safe) |
| **RSA-4096** | KeyGen | 2551.6ms | **WARN** (Archival only) |

## 3. Variance Review
RSA-4096 demonstrated extreme variance (max latency 12.8s), confirming its unsuitability for real-time or interactive paths. Ed25519 and AES-GCM demonstrated stable, low-variance performance across all burst tests.

## 4. Final Tolerance Qualification
The OVERSCITE `v1.1.00` stack is qualified for production deployment. Developers must ensure RSA-4096 operations are restricted to asynchronous backend queues.
