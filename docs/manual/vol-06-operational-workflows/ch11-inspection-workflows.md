# Chapter 11 — Inspection Workflows

*Volume 6: Operational Workflows | OVERSCITE Global User Manual*

---

## 11.1 The Inspection Lifecycle

Inspections are the primary operational domain of OVERSCITE. Every other system — weather intelligence, scheduling, contractor management, audit enforcement — converges on the inspection lifecycle. Understanding this lifecycle is essential for any operator who performs, manages, or reviews inspections.

The inspection lifecycle in OVERSCITE follows a governed sequence:

```
CREATE  →  CONFIGURE  →  CAPTURE  →  ANALYZE  →  REPORT  →  AUTHORIZE  →  DELIVER
   │           │             │           │          │           │              │
   └───────────┴─────────────┴───────────┴──────────┴───────────┴──────────────┘
                              All stages audited by BANE
```

Each stage has a specific purpose, and the transition between stages is governed. You cannot skip stages. You cannot finalize a report that has no findings. You cannot deliver a report that has not been authorized. These constraints exist to protect you, your clients, and the integrity of the inspection record.

---

## 11.2 Stage 1: Create

An inspection begins when an operator creates a new inspection record. This can happen through multiple entry points:

- **Direct creation** via the Inspections route (`/inspections`)
- **Scing request** — "Scing, create a new inspection for 123 Main Street"
- **Calendar link** — Creating an inspection from a scheduled appointment
- **Client record** — Creating an inspection from a client's property profile

The creation event captures foundational metadata:

| Field | Purpose |
|-------|---------|
| Inspection ID | System-generated unique identifier |
| Property address | Physical location of the inspection |
| Inspection type | Category (residential, commercial, roofing, electrical, etc.) |
| Client information | Who requested the inspection |
| Inspector ID | Who will conduct the inspection (the accountable professional) |
| Created timestamp | When the record was established |
| Truth state | Initially [CANDIDATE] — the record exists but is not yet populated |

---

## 11.3 Stage 2: Configure

Before field work begins, the inspection is configured with the applicable regulatory framework:

- **Jurisdiction selection** — Which municipality, county, or state governs this property?
- **Code edition** — Which version of the applicable building code applies? (e.g., IRC 2021, IBC 2018)
- **Inspection scope** — Which systems are being inspected? (structural, electrical, plumbing, mechanical, fire/life safety, exterior, roofing)
- **Special conditions** — Any site-specific requirements (occupied property, hazardous materials present, access restrictions)

Configuration determines which code references LARI will use during analysis and which compliance templates will be available during reporting. Getting the configuration right before entering the field prevents downstream errors where findings are evaluated against the wrong code.

---

## 11.4 Stage 3: Capture

The capture stage is where field work happens. The operator is on-site, observing conditions, recording findings, and collecting evidence.

OVERSCITE supports multiple capture methods:

**Manual finding entry**: The operator describes a finding in text, selects a severity level, and associates it with the relevant building system and code section.

**Photo evidence**: The operator captures photographs through the platform's media tools. Each photo is tagged with metadata: timestamp, location (if GPS is available), the finding it is associated with, and the operator who captured it.

**SRT sensor data**: If connected sensors are in use (thermal cameras, moisture meters, distance measurers), their data enters through the SRT pipeline described in Chapter 9. Each sensor reading is validated, normalized, and committed to the audit trail.

**Voice notes**: The operator can record voice annotations that are attached to specific findings or to the inspection as a whole.

Every capture event is timestamped and attributed. The audit trail records what was captured, when, by whom, and through which method. This contemporaneous evidence collection is what gives the final inspection report its evidentiary weight.

---

## 11.5 Stage 4: Analyze

After field capture, OVERSCITE's LARI engines can assist with analysis:

**Code compliance analysis**: LARI-Reasoning evaluates findings against the applicable building codes configured in Stage 2. For each finding, it identifies the relevant code section, the requirement, and whether the observed condition appears to comply.

**Risk assessment**: LARI evaluates the severity of findings based on safety implications, building system affected, and applicable code classification (violation, observation, recommendation).

**Pattern detection**: For operators with multiple inspections, LARI can identify patterns across properties — recurring deficiency types, common code sections, or seasonal trends.

All LARI analysis outputs carry confidence scores and are marked as **[CANDIDATE]** truth state. They are suggestions for the operator to review. LARI does not determine whether a condition is a code violation — the licensed inspector makes that determination based on their professional judgment, training, and direct observation.

---

## 11.6 Stage 5: Report

The reporting stage assembles captured findings, evidence, and analysis into a structured inspection report. LARI-Reasoning generates the report document using the inspection's data and the applicable report template.

A generated report includes:

- **Header block**: Inspection ID, property information, inspector credentials, date, applicable codes
- **Findings section**: Each finding with description, severity, code reference, and attached evidence
- **AI advisory blocks**: LARI-generated analysis, clearly marked with [CANDIDATE] status and confidence scores
- **Summary section**: Total findings count, severity distribution, overall assessment
- **Footer**: Generation metadata, OVERSCITE version, BFI declaration

The report is presented in the interface as a reviewable document. The operator can edit text, add professional notes, remove or modify AI-generated content, and reorder findings. The report remains in [CANDIDATE] state throughout this review process.

---

## 11.7 Stage 6: Authorize — The Inspector Authority Gate

The Inspector Authority Gate is the most important interface in the inspection lifecycle. It is the point where the human operator exercises professional authority over the inspection record.

The Authority Gate presents:

**AI Advisory Block Review**: Every LARI-generated advisory in the report is listed with approve/reject controls. The operator must explicitly accept or reject each AI contribution. This is not a blanket approval — it is per-item review.

**Professional Notes**: A text area where the operator adds their own assessment, observations, and professional commentary. These notes are attributed directly to the inspector — they are not AI-generated.

**Final Confirmation Checklist**: Two mandatory checkboxes:
1. "I have reviewed and approved all media attachments."
2. "I confirm that the SRT compliance visibility is correct and unambiguous."

Both boxes must be checked before the finalization button becomes active. This prevents accidental finalization.

**Digital Signature**: The "Digitally Sign & Finalize Report" button. Clicking this triggers a BANE-governed finalization event that:
1. Transitions the report from [CANDIDATE] to [ACCEPTED]
2. Creates a finalization SDR with the inspector's identity and timestamp
3. Locks the report content against further modification
4. Moves the record to the OVERSCITE Ledger

**Once signed, the report is immutable.** It cannot be edited, deleted, or backdated. This immutability is the report's evidentiary strength. If the report is disputed, the audit trail shows exactly what the inspector reviewed, when they approved it, and that they attested to the completeness and accuracy of the content.

---

## 11.8 Stage 7: Deliver

After authorization, the report is available for delivery to the client. Delivery methods include:

- **Direct download**: PDF export from the platform
- **Client portal**: If the client has OVERSCITE access, the report appears in their view
- **Email delivery**: Report sent as a secure link or attachment
- **Print**: Formatted for physical distribution where required

Each delivery event is recorded in the audit trail. The system tracks who received the report, when, and through which channel. This delivery provenance is important for regulatory compliance and for resolving disputes about whether a client received the inspection results.

---

## 11.9 Chapter Summary

The inspection lifecycle — create, configure, capture, analyze, report, authorize, deliver — is OVERSCITE's core operational workflow. Every stage is governed by BANE. Every transition is auditable. And the critical authorization stage — the Inspector Authority Gate — ensures that no report is finalized without explicit, item-level human review and professional attestation.

This workflow embodies the Human Authority Doctrine in its most concrete form: powerful intelligence assists the inspector at every stage, but the inspector's signature is what makes the report authoritative.

In the next chapter, we examine the Contractor Division — OVERSCITE's system for managing contractor governance, oversight chains, and compliance verification.

---

*Previous: [Chapter 10 — Data Truth States](../vol-05-data-sensors/ch10-data-truth-states.md)*  
*Next: [Chapter 12 — The Contractor Division](ch12-contractor-division.md)*
