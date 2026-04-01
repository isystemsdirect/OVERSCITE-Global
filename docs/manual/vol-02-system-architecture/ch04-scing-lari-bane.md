# Chapter 4 — The Scing–LARI–BANE Model

*Volume 2: System Architecture | OVERSCITE Global User Manual*

---

## 4.1 Three Components, Three Roles

In Chapter 3, we described the three *layers* of OVERSCITE — UI, governed intelligence, and infrastructure. Within the governed intelligence layer, three components form the operational core of the system. Each has a single, well-defined role:

| Component | Role | Analogy |
|-----------|------|---------|
| **Scing** | Interface & Orchestration | The receptionist who takes your request, knows who to call, and brings you the response |
| **LARI** | Bounded Reasoning | The specialist who analyzes data, runs computations, and produces findings |
| **BANE** | Enforcement & Audit | The compliance officer who checks authorization before and after every action |

These three components interact according to rigid rules. Scing never reasons. LARI never enforces. BANE never orchestrates. This separation is not a guideline — it is an architectural invariant.

---

## 4.2 Scing in Detail

### What Scing Is

Scing™ (pronounced "sing") is the conversational interface presence of the SCINGULAR ecosystem. It is the single point of contact between the human operator and the system's intelligence capabilities. Every request you make enters the system through Scing. Every response you receive is delivered through Scing.

Scing is embodied in the **Scing Panel** — the horizontal bar that sits in the center of the Top Command Bar. When collapsed, it displays a compact bar showing the Scing logo, the current workspace name, and a "Ready" status indicator. When expanded, it transforms into a drop-down conversational surface with a scrollable message history, a prompt input area, and an active threads sidebar.

### What Scing Does

Scing performs four functions:

1. **Intent Interpretation**: When you type "generate a report for this inspection" or "what's the weather risk for tomorrow," Scing parses your natural language input and maps it to a structured request that can be routed to the appropriate LARI engine.

2. **Orchestration**: Scing determines which LARI engine(s) can handle the request, in what order, and with what input data. For multi-step operations, Scing coordinates sequential engine invocations, passing outputs from one engine as inputs to the next.

3. **Context Management**: Scing maintains conversational context across multiple turns. If you ask "what's the code for handrail height?" and then follow up with "is that the same in Oregon?", Scing carries the context of the first question into the second, so you don't have to repeat yourself.

4. **Response Delivery**: After LARI processes a request and BANE audits the output, Scing formats the response and presents it in the Scing Panel conversation view. It manages thinking indicators, typing animations, and message attribution so you always know what state the system is in.

### What Scing Does Not Do

Scing does not:

- **Reason about data.** It does not analyze images, generate reports, or compute risk scores. Those are LARI functions.
- **Enforce policy.** It does not check whether you have permission to do something. That is a BANE function.
- **Store persistent data.** Conversational context exists in session state but is not the system of record for inspection findings, audit events, or compliance data.
- **Make decisions.** Scing coordinates — it does not decide. When you ask Scing to do something, Scing arranges for the appropriate engine to process it, but the result is always presented to you for review.

### Role Lock

The Scing Panel's docblock contains an explicit role lock that governs what content is allowed and prohibited:

**ALLOWED**: Casual conversation, context-aware dialogue, multi-turn reasoning, suggestions, insights, task execution requests, workflow assistance, command routing, action confirmation.

**PROHIBITED**: BANE alert feeds, security threat cards, system integrity dashboards, passive monitoring panels, defender/event streams, repo/system status stacks. Those belong in the OverHUD.

This role lock enforces the architectural distinction between the *interactive conversational surface* (Scing Panel) and the *passive intelligence surface* (OverHUD). These are not interchangeable.

---

## 4.3 LARI in Detail

### What LARI Is

LARI™ (Logistics, Analytics, Routing, Ingestion) is the bounded reasoning fabric of OVERSCITE. It is not a single engine but a collection of specialized engines, each designed for a specific analytical domain.

Think of LARI as a department of specialists. When Scing receives a request that requires analytical work, it consults the LARI department and routes the request to the specialist with the right expertise.

### The Engine Contract

Every LARI engine follows the same structural contract. This uniformity is what allows Scing to route to any engine without special-case logic. The contract specifies:

- **Request**: A `LariRequest` containing the operator's intent (as a parsed structure), contextual data (pre-fetched by orchestration), a trace ID (for audit correlation), and any engine-specific parameters.

- **Response**: A `LariResponse` containing the engine's identifier, the result (text, structured data, or a reference), a confidence score (0.0–1.0), the processing duration in milliseconds, and the trace ID echoed back for correlation.

This contract means that a LARI engine cannot "reach out" and access arbitrary data sources. It receives its context through the request and must produce its result through the response. This boundary is what makes LARI *bounded* reasoning — the engine operates within the box of data that Scing and BANE have authorized it to access.

### LARI Engine Catalog

**LARI-Reasoning** [LIVE]
The workflow and report generation engine. When you ask for an inspection report, LARI-Reasoning accesses the inspection's findings, measurements, and code references through its provided context, then generates a structured report document. It accesses Firestore through a legacy path that is mediated by Scing orchestration and BANE enforcement at the callable layer.

**LARI-Vision** [PARTIAL]
The image analysis engine. Designed for defect detection in inspection photography, thermal imaging interpretation, and photo organization. Currently scaffolded with structural components and pending full integration with computer vision APIs.

**LARI-Mapper** [PARTIAL]
The spatial reasoning engine. Handles property layout understanding, geospatial calculations, and area/distance analysis. The Locations OverSCITE module surfaces LARI-Mapper's capabilities through map layers and the intelligence drawer.

**LARI-Guardian** [PARTIAL]
The monitoring engine. Tracks system health indicators, detects anomalies in operational patterns, and generates alerts. Currently integrated with the BANE-Watcher monitoring protocol for security event observation.

**LARI-Narrator** [PARTIAL]
The natural language synthesis engine. Generates human-readable summaries, narrative descriptions, and formatted output from structured data. Designed to convert inspection findings into professional prose.

**LARI-Fi** [PARTIAL]
The financial intelligence engine. Classifies financial events (billing, subscriptions, payouts), routes notifications, and produces financial accounting summaries for organizational oversight.

### The Confidence Score

Every LARI response includes a confidence score between 0.0 (no confidence) and 1.0 (full confidence). This score communicates the engine's self-assessment of its output quality.

Operators should interpret confidence scores as follows:

| Range | Interpretation | Operator Action |
|-------|---------------|-----------------|
| 0.90–1.00 | High confidence — well-supported by available data | Review for correctness; typically reliable |
| 0.70–0.89 | Moderate confidence — some uncertainty present | Review carefully; verify key claims independently |
| 0.50–0.69 | Low confidence — significant uncertainty | Treat as a starting point; substantial human review needed |
| Below 0.50 | Very low confidence — insufficient data or poor match | Do not rely on this output without independent verification |

A confidence score is not an accuracy guarantee. It is the engine's honest assessment of how well its output is supported by the data it received. An engine that receives incomplete data will produce a lower confidence score, which is the correct behavior — it protects you from treating an under-informed analysis as reliable.

---

## 4.4 BANE in Detail

### What BANE Is

BANE™ (Boundary, Audit, Notification, Enforcement) is the integrity gatekeeper of OVERSCITE. It sits at every transition point in the system's execution path and performs three functions:

1. **Pre-gate validation**: Before a request reaches LARI, BANE checks whether the operator has the required capability, whether the request is classified correctly, and whether policy permits the operation.

2. **Post-gate auditing**: After LARI produces a result, BANE creates an immutable record of what was computed, by whom, when, and with what data.

3. **Threat detection**: BANE monitors behavioral patterns for anomalies — unusual access patterns, repeated capability failures, or attempts to invoke capabilities that should never be requested.

### The Policy Engine

BANE's policy decisions are driven by profiles — named configurations that determine enforcement behavior. Each profile specifies:

```
┌────────────────────────────────────────────┐
│            BANE Policy Hints               │
├────────────────────────────────────────────┤
│  strictMode: boolean                       │
│  defaultVerdict: 'deny' | 'allow'          │
│  escalationEnabled: boolean                │
│  quarantineOnDeny: boolean                 │
│  lockoutOnRepeat: boolean                  │
│  incidentOnCritical: boolean               │
└────────────────────────────────────────────┘
```

The system defaults to the `bane_fog_v1` profile — the strictest available — as a fail-safe. If a profile cannot be resolved, the system falls back to this maximum-enforcement configuration. This is **fail-closed** behavior: when in doubt, deny.

### Security Decision Records (SDRs)

Every time BANE processes a request — whether it approves, denies, or gates the action — it creates a Security Decision Record. SDRs are the atomic units of the audit trail.

An SDR contains:
- **Timestamp**: When the decision was made (UTC, millisecond precision)
- **User ID**: Which operator's request triggered the decision
- **Action**: What capability was requested
- **Result**: Approved, denied, or gated
- **Capability token**: The cryptographic token that was validated (or rejected)
- **Metadata**: Context-specific information (inspection ID, resource path, etc.)

SDRs are designed to be immutable. Once created, they cannot be modified or deleted through normal system operations. This immutability is what gives the audit trail its evidentiary value — it can demonstrate, after the fact, exactly what happened and when.

### Demon Mode

When BANE detects a critical security event — a threat score exceeding 90, a honeytoken being accessed, or repeated policy violations from the same identity — it can enter **Demon Mode**, an aggressive threat containment response:

1. Isolate the affected component
2. Revoke all capability tokens issued to the suspect identity
3. Terminate the active session
4. Create a comprehensive incident SDR
5. Alert administrators

Demon Mode is a last-resort mechanism. In normal operation, it never triggers. Its existence is a deterrent and a safety net for scenarios where the system detects behavior that clearly falls outside normal operational patterns.

---

## 4.5 Interaction Scenarios

The following scenarios trace specific operator requests through the Scing–LARI–BANE pipeline to illustrate how the components interact.

### Scenario 1: "What building code applies to handrail height in Oregon?"

```
Operator → Scing Panel: Types the question
    │
    ▼
Scing: Classifies as read-only code lookup
    │  (No state mutation → BANE pre-gate: authentication only)
    │
    ▼
BANE: Validates operator authentication ✓ 
    │  Classification: read → minimal governance
    │
    ▼
LARI-Reasoning: Processes code lookup
    │  Searches indexed code database for Oregon
    │  handrail height requirements
    │  Confidence: 0.92
    │
    ▼
BANE: Creates SDR (action: code_lookup, result: success)
    │
    ▼
Scing: Formats response with code reference,
    │  section number, and effective date
    │
    ▼
Operator: Reads the answer in Scing Panel
```

**Key observation**: This is a `read` operation, so BANE applies minimal governance — authentication confirms the operator is who they claim to be, but no capability token or pre/post receipt is required.

### Scenario 2: "Finalize the inspection report and prepare it for delivery."

```
Operator → Scing Panel: Requests report finalization
    │
    ▼
Scing: Classifies as irreversible write operation
    │  (Report finalization locks content → highest classification)
    │
    ▼
BANE Pre-Gate:
    │  ✓ Operator authenticated
    │  ✓ Operator holds 'inspection.finalize' capability
    │  ✓ Inspection has data (not empty)
    │  ✓ Rate limit not exceeded
    │  ✓ Creates pre-gate governance receipt
    │
    ▼
LARI-Reasoning: Generates final report document
    │  Assembles findings, code references, photos
    │  Confidence: 0.95
    │  Duration: 2,400ms
    │
    ▼
BANE Post-Gate:
    │  ✓ Validates output (references authorized data)
    │  ✓ Creates SDR with full provenance chain
    │  ✓ Creates post-gate governance receipt
    │
    ▼
Scing: Presents report in review interface
    │  AI-generated findings clearly marked
    │  Report status: [CANDIDATE] — not yet approved
    │
    ▼
Operator: Reviews, edits, and clicks "Finalize"
    │
    ▼
BANE: Records finalization as human-authorized action
    │  Report status transitions: [CANDIDATE] → [ACCEPTED]
    │  Creates finalization SDR
    │
    ▼
Report: Now locked, signed, and available for delivery
```

**Key observation**: This is an `irreversible` operation, so BANE applies full governance — pre-gate receipt, post-gate receipt, provenance tracking, and a final SDR for the human authorization event. The report's transition from [CANDIDATE] to [ACCEPTED] is itself an audited event.

---

## 4.6 The Separation Imperative

Why are Scing, LARI, and BANE separate components rather than a single system that does everything?

The answer involves three engineering principles:

**Containment.** If a LARI engine has a bug that produces incorrect analysis, that bug is contained within the engine's response. It cannot bypass BANE's audit logging, corrupt Scing's orchestration state, or directly modify Firestore documents. The bug produces bad output, but that output is logged in an SDR and presented to the operator for review — the system's defenses catch the problem before it causes real-world harm.

**Auditability.** Because each component has a distinct identity and role, audit records clearly show which component did what. "LARI-Reasoning generated a report with confidence 0.95" is a meaningful, attributable record. "The system generated a report" is not. Separation creates the granularity needed for effective forensic analysis.

**Evolvability.** LARI engines can be added, upgraded, or replaced without affecting Scing's orchestration logic or BANE's enforcement model. When a new engine is developed — say, LARI-Thermal for specialized thermal imaging analysis — it registers with the same contract interface. Scing learns how to route to it. BANE governs it with the same classification system. No existing component needs to change.

---

## 4.7 Chapter Summary

The Scing–LARI–BANE model is the operational core of OVERSCITE. Scing orchestrates, LARI reasons, and BANE enforces. No component can perform another's function. Every interaction between them generates audit records. And every result passes through the operator for review before it becomes consequential.

This separation is what makes OVERSCITE a governed system rather than an automated one. The intelligence is real and powerful. The governance is structural and inescapable. And the human authority is preserved at every step.

In the next chapter, we examine the panel system — the Scing Panel and the OverHUD — and explain why these two surfaces are architecturally separated and what belongs in each.

---

*Previous: [Chapter 3 — System Layers](ch03-system-layers.md)*  
*Next: [Chapter 5 — The Panel System](../vol-03-interface-operations/ch05-panel-system.md)*
