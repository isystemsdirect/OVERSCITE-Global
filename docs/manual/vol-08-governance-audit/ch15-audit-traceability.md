# Chapter 15 — Audit & Traceability

*Volume 8: Governance & Audit | OVERSCITE Global User Manual*

---

## 15.1 The Audit Philosophy

Every consequential event in OVERSCITE produces a record. This is not optional, not configurable, and not dependent on the operator's preference. It is a structural invariant: if a governed action occurs, a record exists.

This philosophy exists because OVERSCITE serves industries where after-the-fact reconstruction is not a convenience — it is a legal and professional necessity. When someone asks "What did the inspector see?", "What did the system recommend?", "When was the report signed?", or "Was the contractor verified at the time of the inspection?", the audit system must produce precise, timestamped, attributable answers.

---

## 15.2 Security Decision Records (SDRs)

The atomic unit of the audit trail is the **Security Decision Record (SDR)**. Every time BANE evaluates a request — whether it approves, denies, or gates the action — an SDR is created.

An SDR captures:

| Field | Description |
|-------|-------------|
| **Timestamp** | UTC, millisecond precision |
| **User Identity** | Authenticated operator ID |
| **Action Requested** | What capability was invoked |
| **Classification** | Read, write, sensitive, or irreversible |
| **Decision** | Approved, denied, or gated (pending human review) |
| **Capability Token** | The token that was validated (or rejected) |
| **Context Metadata** | Action-specific data (inspection ID, resource path, etc.) |
| **Engine ID** | Which LARI engine was involved (if applicable) |
| **Trace ID** | Correlation identifier linking related SDRs |
| **Governance Receipt IDs** | References to pre/post governance receipts |

SDRs are designed to be **append-only**. Once written, they are not modified, overwritten, or deleted through normal system operations. This immutability is what gives the audit trail its evidentiary strength.

---

## 15.3 Governance Receipts

Governance receipts are related to SDRs but serve a different purpose. While an SDR records a BANE *decision*, a governance receipt records a governance *event* — the fact that a gate was traversed.

There are two types of governance receipts:

**Pre-gate receipt**: Created when a request arrives at a governance gate. Records that the gate was reached, what was requested, and what the operator's state was at that moment.

**Post-gate receipt**: Created when a request exits a governance gate. Records the outcome: what was approved, what LARI produced, and what the operator will see.

The combination of pre-gate and post-gate receipts creates a sandwich — they bracket the processing event so that the full story is captured: what went in, what came out, and what happened in between.

---

## 15.4 The Chain of Custody

The audit trail is not a flat log — it is a **chain of custody** that links events into causal sequences:

```
Request SDR ────→ Pre-Receipt ────→ Processing ────→ Post-Receipt ────→ Result SDR
     │                                                                        │
     └── governanceRef ──────────────────────────────────────────────────────┘
```

Each SDR includes a `governanceRef` field that links it to the corresponding governance receipts. This means that for any given action, an auditor can reconstruct:

1. When the request was made (SDR timestamp)
2. Who made it (SDR user identity)
3. What the request contained (pre-gate receipt)
4. What processing occurred (LARI engine trace)
5. What output was produced (post-gate receipt)
6. What the operator saw and decided (result SDR)

This chain is unbroken. There are no gaps between the operator's request and the system's response. Every step is recorded.

---

## 15.5 Event Reconstruction

The practical value of the audit system is its ability to support **event reconstruction** — the process of answering the question "What exactly happened?"

### Reconstruction Scenario: Disputed Inspection Finding

A client disputes a finding in an inspection report, claiming the inspector fabricated the observation.

**The audit trail shows:**

1. **Inspection creation SDR**: Inspector ID, timestamp, property address — proves the inspection record exists and who created it.

2. **Finding capture SDR**: The specific finding was entered at a specific time from a specific location. If SRT sensor data was attached, the SRT audit record shows the sensor ID, calibration status, and measurement value.

3. **Photo evidence SDR**: If a photo was attached, the upload event shows the timestamp, file hash, and associated finding ID.

4. **LARI analysis SDR**: If LARI-Reasoning contributed analysis, the trace shows what LARI was asked, what data it received, and what it produced — with confidence scores.

5. **Authority Gate SDR**: The finalization event shows that the inspector reviewed all findings, checked both attestation boxes, and digitally signed the report at a specific time.

6. **Delivery SDR**: The report delivery event shows when the client received the report and through which channel.

This reconstruction demonstrates, with timestamped precision, that the finding was captured during the inspection, supported by evidence, reviewed by the inspector, and delivered through the governed pipeline. The client's claim can be evaluated against a complete, immutable record.

### Reconstruction Scenario: Security Event

An administrator notices unusual activity — a large number of report generations from a single account in a short time period.

**The audit trail shows:**

1. **Authentication SDR**: When the account logged in, from what device/location.
2. **Rate limiting SDRs**: If the rate limit was exceeded, the denial events show when and how many requests were rejected.
3. **Capability validation SDRs**: Whether the account's capability tokens are consistent with their assigned profile.
4. **BANE-Watcher signals**: If the pattern triggered a BANE-Watcher alert, the signal record captures the detection logic and threat score.

---

## 15.6 BANE-Watcher Signal Protocol

Beyond the core SDR system, OVERSCITE implements a dedicated security observation layer: the **BANE-Watcher** protocol. This system operates in its own isolated data space — separate Firestore collections — to prevent cross-contamination between operational data and security monitoring data.

BANE-Watcher events conform to the **M-UCB (Monitoring Universal Control Block)** protocol, which defines structured security event contracts. Each event carries:

- **Event type** (access event, policy violation, anomaly detection, etc.)
- **Threat score** (0–100 severity assessment)
- **Trust metadata** (verification status of the identity involved)
- **Truth-state** (the maturity classifier for the event data)
- **Originating component** (which system generated the event)

The Watcher protocol explicitly separates **observation from enforcement**. BANE-Watcher observes and records. BANE enforcement (described in Chapter 14) acts. This separation ensures that the monitoring system cannot inadvertently trigger enforcement actions and that enforcement actions are always deliberate, governed decisions.

---

## 15.7 What OVERSCITE Cannot Delete

Certain record types in OVERSCITE are designed to be permanently immutable:

| Record Type | Deletable? | Rationale |
|-------------|-----------|-----------|
| Event SDRs | No | Evidentiary integrity |
| Governance receipts | No | Gate traversal evidence |
| Finalized inspection reports | No | Professional attestation records |
| SRT audit records | No | Sensor data chain of custody |
| BANE-Watcher events | No | Security event history |
| Authentication events | No | Access audit requirements |

The system does not provide an administrative interface for deleting these records. Even at the database level, the Firestore security rules are designed to prevent deletion of audit-critical collections. If a legitimate business need requires recordermanagement (such as regulatory data retention limits), the process must be handled outside normal system operations with explicit governance approval and a replacement mechanism that preserves the audit chain's integrity.

---

## 15.8 Chapter Summary

OVERSCITE's audit system produces immutable records at every governance gate: SDRs for decisions, governance receipts for gate traversals, and SRT audit records for sensor data custody. These records form an unbroken chain of custody that supports event reconstruction, dispute resolution, and security investigation.

The BANE-Watcher protocol provides a separate observation layer for security events, maintaining isolation between monitoring and enforcement. And the system's immutability guarantees ensure that audit records cannot be altered or destroyed through normal operations.

This concludes Volume 8 and Phase B of the manual. In Volume 9, we address user responsibility — what the system does not do and why understanding its boundaries is as important as understanding its capabilities.

---

*Previous: [Chapter 14 — BANE Enforcement](ch14-bane-enforcement.md)*  
*Next: [Chapter 16 — What The System Does Not Do](../vol-09-user-responsibility/ch16-what-system-does-not-do.md)*
