# Chapter 16 — What The System Does Not Do

*Volume 9: User Responsibility | OVERSCITE Global User Manual*

---

## 16.1 Why This Chapter Exists

This chapter exists because understanding a system's boundaries is as important as understanding its capabilities. An operator who does not know what OVERSCITE can do will underuse the platform. An operator who does not know what OVERSCITE *cannot* do may over-rely on it — creating exactly the kind of accountability gap that the system is designed to prevent.

Every item in this chapter is a deliberate design choice, not a deficiency. OVERSCITE is built to stop before certain lines, and this chapter maps those lines.

---

## 16.2 The System Does Not Make Decisions

OVERSCITE analyzes data, computes risk scores, identifies patterns, and generates suggestions. It does not make decisions.

When LARI-Reasoning produces an inspection report, the report is a draft — a structured proposal for the inspector to review. The system does not determine whether a condition is a code violation. That determination requires professional judgment, physical observation, and regulatory knowledge that belong to the licensed inspector.

When the Weather Command Center displays a "DANGER" Guangel Safety Strip, the system is communicating that measured conditions exceed safety thresholds. It is not ordering you to cancel an inspection. The decision to proceed, postpone, or modify operations remains entirely with the operator.

When SmartSCHEDULER™ proposes an optimal time slot for an inspection, it is presenting a recommendation based on available data. It is not booking the appointment. Only your confirmation creates a booking.

**The line the system will not cross**: Computing an answer is not the same as committing to an answer. OVERSCITE computes; you commit.

---

## 16.3 The System Does Not Replace Professional Judgment

OVERSCITE is built for licensed, certified, or otherwise accountable professionals. It assumes that the operator brings professional expertise, regulatory knowledge, and field experience to every interaction.

The system will not:

- **Substitute for building code expertise.** LARI can look up code sections and present references, but interpreting how a code section applies to a specific field condition requires professional judgment.

- **Replace visual inspection.** LARI-Vision can flag potential defects in images, but it cannot see what is behind a wall, assess structural integrity by feel, or detect odors that indicate mold or gas leaks.

- **Override professional opinion.** If you determine that a LARI analysis is incorrect based on your field observations, your professional judgment takes precedence. The system will record your decision and your professional notes — it will never argue with you about an observation you made in person.

- **Provide legal advice.** Code references, compliance assessments, and risk scores are informational. They are not legal opinions. Regulatory interpretation, applicability determinations, and enforcement actions require licensed legal or regulatory professionals.

---

## 16.4 The System Does Not Execute Autonomously

No action in OVERSCITE occurs without being initiated or approved by a human operator. The system does not:

- **Auto-send reports to clients.** Completed reports are available for delivery, but the delivery action requires explicit operator initiation.

- **Auto-reschedule inspections.** If weather conditions deteriorate, the system advises. It does not modify, cancel, or reschedule bookings.

- **Auto-dispatch teams.** The Locations system can show team positions and suggest efficient routing, but dispatching a team requires a human dispatch action.

- **Auto-verify contractor credentials.** The Contractor Division tracks documentation and flags compliance gaps, but verifying that a submitted credential is genuine requires human review.

- **Auto-escalate security events.** BANE can enter Demon Mode to isolate a session when critical thresholds are exceeded, but this is a containment action, not a decision. Investigation and resolution require human administrators.

- **Auto-generate findings.** LARI can suggest findings based on captured images or sensor data, but entering a finding into an inspection record requires the inspector to review and approve the suggestion.

---

## 16.5 The System Does Not Guarantee Completeness

OVERSCITE provides tools and intelligence that support thorough inspection work. It does not guarantee that every deficiency will be found.

- **Sensor limitations.** SRT data is only as comprehensive as the sensors deployed. An area that was not scanned is not represented in the data.

- **Image analysis limitations.** LARI-Vision operates on the images it receives. It cannot detect conditions that are not visible in photographs — hidden structural defects, concealed code violations, or conditions that require physical testing.

- **Code coverage.** LARI's code intelligence covers the regulatory frameworks in its database. Highly specialized, local, or recently updated codes may not yet be indexed.

- **Environmental limitations.** The Weather Command Center reports conditions for the configured location. Hyper-local microclimate variations (urban heat islands, wind channeling between buildings) may not be captured.

**The operator's responsibility**: You are responsible for the completeness of your inspection. OVERSCITE makes you more efficient and more informed, but it does not replace the professional obligation to conduct a thorough examination.

---

## 16.6 The System Does Not Store Data Indefinitely by Default

While audit records are designed to be immutable, the retention period for operational data (inspection records, booking history, communication logs) is subject to organizational policy and regulatory requirements:

- **Audit-critical records** (SDRs, governance receipts, SRT audit chains) are designed for permanent retention.
- **Operational records** (inspections, bookings, client records) follow the data retention policy configured by the organization.
- **Session data** (Scing conversation history, transient UI state) may have shorter retention periods.

**The operator's responsibility**: Understand your organization's data retention requirements. If regulatory or contractual obligations require records to be retained beyond the system's default retention period, coordinate with system administrators.

---

## 16.7 The System Does Not Operate Offline

OVERSCITE is a cloud-connected platform. Its intelligence capabilities, governance enforcement, and data persistence depend on connectivity to the SCINGULAR AI backend:

- **LARI engines** operate server-side. Without connectivity, no LARI-powered analysis, report generation, or code lookup is available.
- **BANE enforcement** operates server-side. Without connectivity, no governance gates can be traversed.
- **Data persistence** depends on Firestore connectivity. Without connectivity, captured data cannot be committed to the system of record.

The platform is designed for graceful degradation — you will see clear error messages and connection status indicators rather than silent failures. But offline-capable field data capture requires future SRT enhancements that are not yet implemented.

**The operator's responsibility**: Ensure adequate connectivity before relying on OVERSCITE for active field work. Plan for connectivity requirements in remote or underground inspection environments.

---

## 16.8 Chapter Summary

OVERSCITE does not make decisions, replace professional judgment, execute autonomously, guarantee completeness, store data indefinitely, or operate offline. Each of these boundaries is a deliberate design choice that preserves the Human Authority Doctrine, maintains professional accountability, and ensures that the system remains a governed tool rather than an autonomous agent.

Understanding these boundaries allows you to rely on OVERSCITE for what it is exceptionally good at — data organization, environmental intelligence, analytical assistance, and audit enforcement — without overestimating its role in your professional practice.

---

*Previous: [Chapter 15 — Audit & Traceability](../vol-08-governance-audit/ch15-audit-traceability.md)*  
*Next: [Chapter 17 — Known Limitations](ch17-limitations.md)*
