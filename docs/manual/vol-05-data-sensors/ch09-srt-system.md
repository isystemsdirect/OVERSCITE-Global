# Chapter 9 — The SRT System

*Volume 5: Data & Sensors | OVERSCITE Global User Manual*

---

## 9.1 What SRT Is

**Secure Remote Telemetry (SRT)** is OVERSCITE's data ingestion and normalization system. It is the pipeline through which raw sensor data enters the platform, is validated, standardized, analyzed for compliance, and committed to an immutable audit record.

If the Scing–LARI–BANE model is how OVERSCITE thinks and governs, SRT is how OVERSCITE perceives. It is the sensory input discipline — the governed process by which measurements from the physical world become trusted data inside the digital environment.

SRT is not a sensor product. It does not include hardware. It is the *protocol and pipeline* that ensures that sensor data — wherever it comes from — enters OVERSCITE in a validated, calibrated, and standardized form with a complete chain of custody from the moment of capture to the moment of archival.

---

## 9.2 Why SRT Exists

In traditional inspection workflows, measurement data enters software systems through manual entry, copy-paste from device screens, or automatic export from manufacturer-specific applications. At each transfer point, precision can degrade, units can be misinterpreted, and the chain of custody between "what the sensor measured" and "what the report says" is broken.

SRT eliminates these gaps by defining a rigid, six-stage pipeline that every sensor measurement must traverse. Each stage produces an output that feeds the next stage, and the final stage produces a cryptographically signed audit record that links the measurement back to its source sensor, its calibration status, and the inspection context.

The practical consequence for operators is that when you see a measurement in OVERSCITE that came through the SRT pipeline, you can trust three things:

1. **The sensor was calibrated.** SRT rejects data from sensors whose calibration has expired (beyond 90 days).
2. **The units are correct.** SRT normalizes all measurements to a base unit (nanometers) before any analysis occurs, eliminating unit conversion errors.
3. **The measurement has a chain of custody.** The SRT audit record links the measurement to its sensor, its timestamp, its calibration status, and its compliance assessment.

---

## 9.3 The Six-Stage Pipeline

The SRT pipeline processes sensor data through six sequential stages. Each stage has a specific function and produces a specific output.

```
Stage 1         Stage 2         Stage 3         Stage 4         Stage 5         Stage 6
CAPTURE    →   NORMALIZE   →   TOLERANCE   →   THRESHOLD   →   TEMPLATE   →   AUDIT
                                                                              
Validate       Convert to      Apply domain    Evaluate        Trigger         Commit to
sensor data    base unit       tolerance       compliance      report          immutable
+ calibration  (nanometers)    schema          thresholds      templates       audit log
```

### Stage 1: Sensor Data Capture

The pipeline begins with raw sensor input. Stage 1 validates the input against the **Sensor Resolution Registry Schema** — a strict schema that requires:

| Field | Description |
|-------|-------------|
| `sensor_id` | UUID uniquely identifying the physical sensor |
| `hardware_signature` | Manufacturer serial identifier |
| `manufacturer_id` | Sensor manufacturer |
| `firmware_version` | Sensor firmware version at time of capture |
| `native_resolution_nm` | The sensor's native measurement resolution in nanometers |
| `dynamic_range` | The measurement range as a tuple [min, max] |
| `calibration_timestamp` | ISO 8601 timestamp of last calibration |
| `error_margin_nm` | Manufacturer-specified error margin in nanometers |

**Calibration enforcement**: Stage 1 checks whether the sensor's calibration timestamp is within the 90-day window. If calibration has expired, the pipeline halts immediately with a `SENSOR_TRUST_FAIL` error. This is a hard stop — there is no override. Expired calibration means untrustworthy data, and the system refuses to process it.

This enforcement protects operators from a common field error: using an instrument that has not been recently calibrated and discovering later that the measurements were unreliable. SRT catches this at the point of data entry rather than after the report has been filed.

### Stage 2: Unit Standardization to Nanometers

Stage 2 converts the sensor's native measurement to the universal base unit: **nanometers (nm)**. This is defined by the **Universal Precision Matrix**, which specifies:

- **Base unit**: nanometer
- **Hierarchical scale**: nm → micron → millimeter → centimeter → meter → kilometer
- **Normalization**: Always required
- **Floating precision standard**: IEEE-754 double precision
- **Propagation rule**: The highest-precision source dominates

Why nanometers? Because OVERSCITE is designed for precision measurement domains where micrometer-level differences matter — thermal expansion, structural tolerances, electrical clearances. Starting from the smallest practical unit and converting upward ensures that precision is never lost to rounding during unit conversion.

### Stage 3: Tolerance Schema Application

Stage 3 applies domain-specific tolerance thresholds to the normalized measurement. The **Tolerance Schema** defines acceptable variation ranges for four measurement domains:

| Domain | Default Tolerance (nm) | Practical Meaning |
|--------|----------------------|-------------------|
| Structural | 500,000 | ± 0.5 mm — standard building construction tolerance |
| Electrical | 10,000 | ± 10 μm — circuit clearance and component tolerance |
| Thermal | 5,000 | ± 5 μm — thermal expansion precision requirement |
| Automotive | 25,000 | ± 25 μm — vehicle component manufacturing tolerance |

The tolerance values are loaded from the UTCB (Universal Telemetry Control Block) configuration, which means they can be updated without changing pipeline code. This separation of measurement policy from processing logic allows tolerances to be adjusted per-project, per-jurisdiction, or per-client without engineering changes.

### Stage 4: Threshold Comparison Engine

Stage 4 evaluates the measurement against risk thresholds to produce a compliance assessment:

| Measurement | Compliance Status | Risk Level |
|-------------|-------------------|------------|
| ≤ 2,000,000 nm (≤ 2mm) | PASS | Low |
| 2,000,001 – 3,000,000 nm | FLAGGED | Medium |
| > 3,000,000 nm (> 3mm) | FAIL | High |

The compliance status and risk level become part of the measurement record. They do not trigger automatic actions — a "FAIL" result means the measurement exceeds the threshold, but the operator decides what to do about it. The system informs; the human decides.

### Stage 5: Smart Template Orchestration

Stage 5 determines which report templates should be triggered by the measurement data. If a measurement from a structural domain produces a FLAGGED or FAIL status, the appropriate template for structural deviation reporting is identified and queued.

This stage connects SRT data to the reporting system — it is the bridge between measurement and documentation.

### Stage 6: Immutable Audit Log

Stage 6 is the final and most critical stage. It produces a cryptographically signed audit record that commits the entire pipeline result to the system's ledger.

The audit record contains:

```
┌─────────────────────────────────────────────┐
│            SRT Audit Record                  │
├─────────────────────────────────────────────┤
│  inspection_id     │  Context link          │
│  inspector_id      │  Human accountability  │
│  sensor_id         │  Device traceability   │
│  measurement_nm    │  Normalized value      │
│  compliance_status │  PASS / FLAGGED / FAIL │
│  risk_level        │  Low / Medium / High   │
│  timestamp_utc     │  Capture time          │
│  previous_hash     │  Chain link            │
│  nonce             │  Uniqueness guarantee  │
│  hardware_signature│  Device identity       │
│  error_margin_nm   │  Precision bounds      │
│  node_id           │  Processing node       │
│  region_code       │  Deployment region     │
│  deployment_version│  Software version      │
│  audit_hash        │  SHA-256 commitment    │
└─────────────────────────────────────────────┘
```

**Cryptographic chaining**: Each audit record includes the `previous_hash` field — the SHA-256 hash of the preceding record. This creates a hash chain (similar to a blockchain) where tampering with any record would invalidate all subsequent hashes. If an audit record is altered after the fact, the chain breaks, and the alteration is detectable.

**Deterministic serialization**: The audit payload is serialized using sorted JSON key ordering before hashing. This ensures that the same data always produces the same hash, regardless of the order in which fields were originally populated.

**Distributed node identity**: Each record includes the processing node's identity (node ID, region code, deployment version), supporting future distributed processing scenarios where multiple nodes may be generating audit records simultaneously.

---

## 9.4 What This Means for Operators

As an operator, you rarely interact with the SRT pipeline directly. It runs behind the scenes whenever sensor data enters the system. However, understanding SRT helps you interpret the data you work with:

**When you see a measurement in an inspection report**, you know it has been validated against a calibrated sensor, normalized to a consistent unit, evaluated against domain-specific tolerances, and committed to an immutable audit record with a cryptographic chain of custody.

**When you see a SENSOR_TRUST_FAIL error**, you know that the sensor's calibration has expired and the measurement was rejected before it could enter the system. The fix is to recalibrate the sensor and re-capture the measurement — the system will not accept workarounds.

**When you see compliance statuses (PASS, FLAGGED, FAIL)**, you know they were computed against the tolerance schema defined in the UTCB configuration, not arbitrary thresholds chosen at random. These assessments are policy-driven and configurable.

---

## 9.5 Chapter Summary

The SRT pipeline is OVERSCITE's data integrity backbone. Six stages — capture, normalize, tolerance, threshold, template, and audit — transform raw sensor readings into trusted, auditable measurements with complete chains of custody. Calibration enforcement prevents unreliable data from entering the system. Cryptographic chaining makes tampering detectable. And the entire pipeline is governed by configurable policy (the UTCB) rather than hardcoded logic.

In the next chapter, we examine the truth-state system — OVERSCITE's mechanism for ensuring that every data surface in the platform honestly communicates its maturity and reliability.

---

*Previous: [Chapter 8 — Locations OverSCITE](../vol-04-environment-safety/ch08-locations-overscite.md)*  
*Next: [Chapter 10 — Data Truth States](ch10-data-truth-states.md)*
