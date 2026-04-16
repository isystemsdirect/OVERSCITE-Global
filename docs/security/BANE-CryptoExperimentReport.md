# UTCB Cryptographic Experiment Report & BANE Packet

**CB_ID:** UTCB-G__20260414-063334Z__SCING__001
**Experiment Context:** Evaluation of RSA-4096 against Ed25519 for bounded identity-anchor operations, leaving real-time and bulk encrypted workflows to AES-256 and Curve25519.

## 1. Measured Findings (Latency & Constraints)
A controlled execution of cryptographic operations simulating sealing mechanisms and identity verification yielded the following empirical limits:

| Primitive | Operation | Latency Margin | Operational Burden |
| :--- | :--- | :--- | :--- |
| **Ed25519** | Key Generation | **~2.8ms** | Non-blocking. Ephemeral scaling is viable. |
| **RSA-4096** | Key Generation | **~1508.3ms** | High blocking risk. Requires async offload/worker pools to prevent main thread saturation. |
| **Ed25519** | Signing (Payload) | **~2.9ms** | Viable for real-time user-facing flows. |
| **RSA-4096** | Signing (Payload) | **~28.8ms** | High latency. Barely adequate for single operations; scales poorly for batched audit sealing. |
| **Ed25519** | Verification | **~1.0ms** | Very Fast. |
| **RSA-4096** | Verification | **~0.3ms** | Exceptionally Fast (Asymmetric signature advantage). |
| **AES-256-GCM** | Bulk Encrypt (50KB) | **~2.3ms** | Sub-millisecond scale at higher frequencies. Confirmed as required for telemetry/media workflows. |

## 2. Fit Assessment & Rejected Paths
*   **REJECTED:** Any attempt to use RSA-4096 for operational payload encryption. It fundamentally lacks performance scaling for real-time intelligence feeds (e.g., Drone Telemetry, Camera Fusions).
*   **REJECTED:** Real-time mobile device key rotation loops relying on RSA-4096. Generation latency exceeds acceptable UX thresholds (>1.5 seconds purely for compute).
*   **APPROVED (Bounded):** Use of RSA-4096 is constrained strictly to centralized document/certificate signing functions explicitly unbothered by up to 2.0s of generation + signing latency per artifact (e.g., Export Authenticity, Contractor Forensic Packets).

## 3. BANE Review Packet (Boundary & Trust Effects)
### Trust-Boundary Impact
Adopting RSA-4096 in isolated sealing functions does not compromise current trust flows, provided the storage logic accommodates much larger key outputs. Using Ed25519 universally remains the recommendation for seamless operation across the stack due to size/speed balance.

### Rollback Posture & Failure Scenarios
The system operates `OVERSCITE-CryptoStack-v1.0.00`. If RSA-4096 is enabled as an experimental lane for audit seals, reverting to Ed25519 must remain algorithm-agnostic on verification layers (i.e., verifying logic must read key type from the `payloadType` before decrypting/verifying).

### Truth-State & Disclosure Review
*   OVERSCITE will not market RSA-4096 as an all-encompassing envelope. It will truthfully assert that distinct cryptographic roles are deployed for Distinct Data States (Bulk Data = AES; Exchange = ECDH; Sealing = Ed25519/RSA).

## 4. Adoption Recommendation
**Retain OVERSCITE-CryptoStack-v1.0.00 with Ed25519 as the primary engine for Identity and Trust Anchors.** Include RSA-4096 purely as an available ArcHive™ export sealing configuration, but lock defaults to Ed25519 for performance/battery preservation across the wider footprint. Do not expand RSA into runtime state synchronization.
