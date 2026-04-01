# OVERSCITE™ Global Operator Manual

**Version 0.1** | Built with Bona Fide Intelligence  
© 2026 Inspection Systems Direct LLC. All rights reserved.

---

## Table of Contents

- [Volume 1: Foundations](#volume-1-foundations)
  - [Chapter 1 — What Is OVERSCITE?](#chapter-1--what-is-overscite)
  - [Chapter 2 — System Philosophy](#chapter-2--system-philosophy)
- [Volume 2: System Architecture](#volume-2-system-architecture)
  - [Chapter 3 — System Layers](#chapter-3--system-layers)
  - [Chapter 4 — The Scing–LARI–BANE Model](#chapter-4--the-scinglari-bane-model)
- [Volume 3: Interface Operations](#volume-3-interface-operations)
  - [Chapter 5 — The Panel System](#chapter-5--the-panel-system)
  - [Chapter 6 — Navigation & Routes](#chapter-6--navigation--routes)
- [Volume 4: Environment & Safety](#volume-4-environment--safety)
  - [Chapter 7 — Weather Command](#chapter-7--weather-command)
  - [Chapter 8 — Locations OverSCITE](#chapter-8--locations-overscite)
- [Volume 5: Data & Sensors](#volume-5-data--sensors)
  - [Chapter 9 — The SRT System](#chapter-9--the-srt-system)
  - [Chapter 10 — Data Truth States](#chapter-10--data-truth-states)
- [Volume 6: Operational Workflows](#volume-6-operational-workflows)
  - [Chapter 11 — Inspection Workflows](#chapter-11--inspection-workflows)
  - [Chapter 12 — The Contractor Division](#chapter-12--the-contractor-division)
- [Volume 7: Scheduling](#volume-7-scheduling)
  - [Chapter 13 — SmartSCHEDULER™](#chapter-13--smartscheduler)
- [Volume 8: Governance & Audit](#volume-8-governance--audit)
  - [Chapter 14 — BANE Enforcement](#chapter-14--bane-enforcement)
  - [Chapter 15 — Audit & Traceability](#chapter-15--audit--traceability)
- [Volume 9: User Responsibility](#volume-9-user-responsibility)
  - [Chapter 16 — What The System Does Not Do](#chapter-16--what-the-system-does-not-do)
  - [Chapter 17 — Known Limitations](#chapter-17--known-limitations)
- [Volume 10: Quick Start & Reference](#volume-10-quick-start--reference)
  - [Chapter 18 — Quick Start Guide](#chapter-18--quick-start-guide)
  - [Chapter 19 — Reference Glossary](#chapter-19--reference-glossary)

### Truth-State Legend

| Badge | Meaning |
|-------|---------|
| `[LIVE]` | Fully operational with real data sources |
| `[PARTIAL]` | Architecture complete, partially connected |
| `[MOCK]` | Synthetic data for structural simulation |
| `[CANDIDATE]` | System-generated, awaiting human approval |
| `[ACCEPTED]` | Human-approved and locked |

---

# Volume 1: Foundations

## Chapter 1 — What Is OVERSCITE?

### 1.1 The Purpose of This Manual

This is the definitive reference for the OVERSCITE Global platform. Every chapter describes the actual behavior of the system — not aspirational goals, but current behavior. Where features are under development, the manual says so explicitly using truth-state markers.

### 1.2 What OVERSCITE Is

OVERSCITE is a **governed operational environment** for inspection, compliance, and field operations. It is not a single application but a persistent, instrumented workspace where multiple capabilities converge under a unified governance framework. Every action is auditable, every intelligence output is bounded, and every decision remains the operator's.

The platform integrates three foundational layers:

- **Scing™** — the conversational interface presence. Interprets intent and coordinates responses. Does not decide for you.
- **LARI™** (Logistics, Analytics, Routing, Ingestion) — the bounded reasoning fabric. Computes analysis, generates reports, produces risk assessments. Every output is a suggestion, never a decision.
- **BANE™** (Boundary, Audit, Notification, Enforcement) — the integrity gatekeeper. Validates transitions, logs compliance metadata, enforces truth-state verification.

These layers are separated so no single component can both reason and execute without external validation.

### 1.3 Why OVERSCITE Exists

Traditional inspection software falls into two categories: simple digital forms that store checkmarks but add no intelligence, and over-automated black boxes that obscure AI reasoning and create liability exposure. OVERSCITE occupies a third position: **governed augmented intelligence**. It draws a bright line between what the system computes and what the human operator authorizes.

### 1.4 What Problems OVERSCITE Solves

- **Scattered operational data** — consolidates weather, codes, scheduling, communication, reporting, and client management into one governed workspace
- **No environmental awareness at the point of decision** — delivers inspection-specific IRI risk scoring and Guangel Safety Strip classification
- **Audit gaps** — produces immutable Security Decision Records and governance receipts
- **Intelligence without accountability** — every LARI output carries confidence markers and is logged through BANE
- **The "Coming Soon" trap** — mandatory truth-state system labels every surface as `[LIVE]`, `[PARTIAL]`, `[MOCK]`, `[CANDIDATE]`, or `[ACCEPTED]`

### 1.5 Governed Systems vs. Automated Systems

An **automated system** reduces human involvement; success is measured by how much human effort it eliminates. A **governed system** augments human involvement; success is measured by how much better-informed the operator becomes. OVERSCITE is a governed system. It optimizes for correctness, accountability, and trust — not speed alone.

### 1.6 Who OVERSCITE Is For

Property inspectors, building code compliance officers, safety auditors, construction project managers, drone operators, contractor oversight professionals, and field team coordinators — accountable professionals who need both intelligence and accountability.

---

## Chapter 2 — System Philosophy

### 2.1 The Human Authority Doctrine

No component of the OVERSCITE system may self-authorize a meaningful action. All consequential execution requires explicit human approval. The system augments the operator — it does not replace, override, or circumvent the operator.

Scing will never execute an action without your approval. LARI will never present an analysis as a final determination. BANE will never approve an action on your behalf — BANE can deny, but only humans can approve.

### 2.2 Non-Autonomous System Design

OVERSCITE operates in domains where error consequences are high, the domain is not well-bounded, and accountability is critical. Non-autonomous design means the system is built to be maximally helpful without being independently consequential. The system prepares reports but does not send them. It scores risks but does not alter schedules. It detects potential violations but does not record them as confirmed findings.

### 2.3 Why Approvals Exist

Approval gates serve three purposes: **safety** (preventing cascading errors from unreviewed AI output), **accountability** (preserving the connection between human judgment and system output), and **evidence** (creating discrete, timestamped, attributable events in the audit trail).

### 2.4 Why Audit Trails Matter

Audit trails serve four purposes: professional protection (demonstrating what the inspector observed and decided), regulatory compliance (satisfying chain-of-custody requirements), system integrity (detecting anomalous access patterns), and continuous improvement (identifying workflow bottlenecks without compromising privacy).

### 2.5 Bona Fide Intelligence

The SCINGULAR ecosystem operates under Bona Fide Intelligence (BFI) — a commitment that all intelligence is genuine, transparent, bounded, and accountable. BFI enforces four principles: transparency (you always know when AI is involved), trustworthiness (every AI action is logged and bounded), human centrality (humans decide, AI assists), and honesty about limitations (confidence scores are visible, partial features are labeled).

### 2.6 The Authority Flow

Every request follows this path: Human Intent → Scing (interprets) → BANE (pre-validates) → LARI (processes) → BANE (audits) → Scing (presents) → Human Decision. BANE appears twice — before LARI processes and after — ensuring both the request and the result are governed. The flow begins and ends with the human.

---

# Volume 2: System Architecture

## Chapter 3 — System Layers

### 3.1 The Three-Layer Model

OVERSCITE separates concerns across three layers:

**Layer 1: UI Layer** — What the operator sees and touches. Next.js client, React components, shell layout, Scing Panel, OverHUD, route pages. Location: `src/app/`, `src/components/`.

**Layer 2: Governed Intelligence** — What the system reasons about. Scing orchestration, LARI engines, BANE security, SRT pipeline, governance gates. Location: `cloud/functions/`, `scing/`, `src/lib/`.

**Layer 3: Infrastructure** — Where data lives. Firebase Auth, Firestore, Cloud Functions, Storage, Security Rules.

Layer 1 cannot execute consequential actions. Layer 2 enforces governance mechanically. Layer 3 provides defense-in-depth security through Firestore rules independent of application logic.

### 3.2 The Shell Architecture

Every authenticated page renders inside the App Shell, which provides: Sidebar (navigation), Top Command Bar (Scing Panel, utility actions), Flash Notification Bar, Main Content Area, and OverHUD. The layout follows the **5-Zone Model**: Top Command Bar, Page Identity Band, Primary Content Region, Contextual Intelligence Panel, and Action Surface.

### 3.3 The Governed Intelligence Layer

**Scing Orchestration** routes requests to LARI engines, checks BANE policy, and manages conversational context. Scing does not reason independently.

**LARI Engine Suite** consists of specialized engines following a standardized contract (`LariEngineContract`). Each engine receives a `LariRequest` and returns a `LariResponse` with confidence score and trace ID.

| Engine | Truth State | Function |
|--------|-------------|----------|
| LARI-Reasoning | `[LIVE]` | Multi-step workflows and report generation |
| LARI-Vision | `[PARTIAL]` | Image analysis and defect detection |
| LARI-Mapper | `[PARTIAL]` | Spatial reasoning and location intelligence |
| LARI-Guardian | `[PARTIAL]` | System health and anomaly detection |
| LARI-Narrator | `[PARTIAL]` | Natural language report synthesis |
| LARI-Fi | `[PARTIAL]` | Financial event classification |

**BANE Enforcement** classifies actions into four levels: `read` (authentication only), `write` (pre/post-gate receipts), `sensitive` (elevated capability), `irreversible` (secondary capability + triple governance).

### 3.4 Data Flow Principle

Data flows are classified by consequence, not complexity. A complex weather computation runs client-side because it is non-consequential. A simple reschedule request runs server-side because it changes system state and requires audit.

---

## Chapter 4 — The Scing–LARI–BANE Model

### 4.1 Three Components, Three Roles

| Component | Role | Function |
|-----------|------|----------|
| Scing | Interface & Orchestration | Takes requests, routes to engines, delivers responses |
| LARI | Bounded Reasoning | Analyzes data, computes findings, produces output |
| BANE | Enforcement & Audit | Checks authorization, creates audit records |

Scing never reasons. LARI never enforces. BANE never orchestrates. This separation is an architectural invariant.

### 4.2 Scing — What It Does and Does Not Do

Scing performs intent interpretation, orchestration, context management, and response delivery. Scing does not reason about data, enforce policy, store persistent data, or make decisions. The Scing Panel's role lock prohibits BANE alert feeds, security dashboards, and passive monitoring — those belong in the OverHUD.

### 4.3 LARI — The Engine Contract

Every engine follows the `LariEngineContract`: receives a `LariRequest` (intent + context + trace ID), returns a `LariResponse` (result + confidence score + duration + trace ID). Engines cannot reach out to access arbitrary data — they operate within the data box provided to them.

Confidence scores: 0.90–1.00 (high, typically reliable), 0.70–0.89 (moderate, verify key claims), 0.50–0.69 (low, substantial human review needed), below 0.50 (do not rely without independent verification).

### 4.4 BANE — The Policy Engine

BANE uses profiles with configurable hints: `strictMode`, `defaultVerdict`, `escalationEnabled`, `quarantineOnDeny`, `lockoutOnRepeat`, `incidentOnCritical`. Default profile: `bane_fog_v1` (strictest available). Fail-closed: when in doubt, deny.

Security Decision Records (SDRs) record every BANE evaluation — timestamp, user ID, action, result, capability token, and metadata. SDRs are append-only and immutable.

**Demon Mode**: Activates when threat score exceeds 90 or honeytokens are accessed. Isolates session, revokes tokens, creates incident SDR, alerts administrators.

---

# Volume 3: Interface Operations

## Chapter 5 — The Panel System

### 5.1 Two Panels, Two Purposes

The **Scing Panel** is where you talk — interactive conversational surface for requests and responses. The **OverHUD** is where you observe — passive intelligence surface for system status and security alerts.

Interactive intelligence and passive observation must never share the same surface. Mixing them would create cognitive overload, blur audit boundaries, and make conversation reconstruction impossible.

### 5.2 The Scing Panel

Located center of the Top Command Bar. Two states: collapsed (compact bar, 44px) and expanded (drop-down panel, 450px wide, up to 640px tall). Contains header bar, scrollable messages area, and prompt input. Expansion is animated (300ms, ease-out).

Allowed content: conversation, requests, responses, suggestions, task execution. Prohibited content: BANE alert feeds, security dashboards, monitoring panels, defender event streams.

### 5.3 The OverHUD

Full-height right-side panel (320px wide). Contains tabbed sections: Security & Integrity (SDRs, threat level, policy summary) and Operational Intelligence (repo health, environment indicators, LARI engine status). Updates passively — no user input accepted.

### 5.4 Panel State Interactions

Both panels can operate simultaneously. The Scing Panel floats above the main content. The OverHUD pushes the main content leftward. This allows concurrent conversation and monitoring.

---

## Chapter 6 — Navigation & Routes

### 6.1 The Route System

OVERSCITE provides **28 authenticated routes** organized into sidebar navigation groups: Main Navigation, Tools, and Management.

### 6.2 Route Catalog

| Route | Path | Truth State |
|-------|------|-------------|
| Dashboard | `/dashboard` | `[LIVE]` |
| Workstation | `/workstation` | `[LIVE]` |
| Overview | `/overview` | `[LIVE]` |
| Inspections | `/inspections` | `[FUNCTIONAL MVP]` |
| Contractor | `/contractor` | `[FUNCTIONAL MVP]` |
| Drone Vision | `/drone-vision` | `[BOUNDED SHELL]` |
| LARI Vision | `/lari-vision` | `[BOUNDED SHELL]` |
| Weather | `/weather` | `[LIVE]` |
| Monitor | `/monitor` | `[BOUNDED SHELL]` |
| Library | `/library` | `[FUNCTIONAL MVP]` |
| Topics | `/topics` | `[BOUNDED SHELL]` |
| Calendar | `/calendar` | `[FUNCTIONAL MVP]` |
| Messaging | `/messaging` | `[BOUNDED SHELL]` |
| Conference Rooms | `/conference-rooms` | `[BOUNDED SHELL]` |
| Clients | `/clients` | `[FUNCTIONAL MVP]` |
| Teams | `/teams` | `[FUNCTIONAL MVP]` |
| Keys | `/keys` | `[BOUNDED SHELL]` |
| Profile | `/profile` | `[LIVE]` |
| Finances | `/finances` | `[FUNCTIONAL MVP]` |
| Payouts | `/payouts` | `[BOUNDED SHELL]` |
| Orders | `/orders` | `[BOUNDED SHELL]` |
| Marketplace | `/marketplace` | `[BOUNDED SHELL]` |
| Field Market | `/field-market` | `[BOUNDED SHELL]` |
| Community | `/community` | `[DEFERRED SHELL]` |
| Social | `/social` | `[DEFERRED SHELL]` |
| Dynamic Dash | `/dynamic-dash` | `[BOUNDED SHELL]` |
| Admin | `/admin` | `[DEFERRED SHELL]` |
| Settings | `/settings` | `[LIVE]` |

### 6.3 Navigation Elements

**Top Command Bar**: Fixed horizontal element — sidebar toggle (left), Scing Panel (center), utility actions (right). Never scrolls.

**Page Identity Band**: Below the command bar on each route — page title, mission context, truth-state badge.

**Navigation patterns**: Sidebar click (client-side transition), Scing-directed navigation ("Go to the Weather Command"), deep linking (direct URL access, bookmark-friendly).

---

# Volume 4: Environment & Safety

## Chapter 7 — Weather Command

### 7.1 The Four-Tab Interface

**Overview** `[LIVE]`: Current conditions, Inspection Risk Index (IRI), Roof Surface Temperature Model, hourly trend chart.

**Live Radar** `[PARTIAL]`: Interface structure complete, requires Doppler API keys for real radar data.

**Safety & Risk** `[LIVE]`: Consolidated safety view with IRI, Roof Temperature, and Guangel Safety Strip.

**10-Day Forecast** `[PARTIAL]`: Scaffolded for long-range modeling data.

### 7.2 Inspection Risk Index (IRI)

A composite safety metric weighting wind speed (elevated work risk), precipitation (traction, electrical safety), temperature (extreme conditions), humidity (measurement accuracy), and UV index (exposure risk). The IRI does not make decisions — it presents a risk assessment for operator evaluation.

### 7.3 Guangel Safety Strip

Binary go/no-go classification. Green (CLEAR): conditions within acceptable ranges. Red (DANGER): one or more hazard thresholds exceeded. Advisory only — does not lock you out or override professional judgment.

### 7.4 Weather-Scheduling Integration

SmartSCHEDULER can access IRI scores to inform scheduling proposals. The system does not auto-cancel inspections based on weather.

---

## Chapter 8 — Locations OverSCITE

### 8.1 Five-Component Architecture

**Locations Command Bar**: Search and filter controls. **Operations Rail**: Navigate, pin, measure, search tools. **Layer Toggle Panel**: Seven independently toggleable layers (Users, Clients, Inspections, Devices, Teams, Weather, Hazards). **Map Canvas**: Google Maps instance with custom markers. **Intelligence Drawer**: Contextual data and actions for selected map entities.

### 8.2 Current Truth State: `[PARTIAL]`

Full interface architecture complete. Map rendering requires Google Maps API key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`). Layer panel, operations rail, and intelligence drawer function independently of map status.

---

# Volume 5: Data & Sensors

## Chapter 9 — The SRT System

### 9.1 Six-Stage Pipeline

**Stage 1: Capture** — Validates sensor data against the Sensor Resolution Registry Schema. Enforces 90-day calibration window. Expired calibration = hard stop (`SENSOR_TRUST_FAIL`).

**Stage 2: Normalize** — Converts all measurements to nanometers (base unit). IEEE-754 double precision. Highest-precision source dominates.

**Stage 3: Tolerance** — Applies domain-specific tolerance thresholds: structural (500,000 nm), electrical (10,000 nm), thermal (5,000 nm), automotive (25,000 nm).

**Stage 4: Threshold** — Evaluates compliance: PASS (≤2mm), FLAGGED (2–3mm), FAIL (>3mm).

**Stage 5: Template** — Identifies applicable report templates based on measurement domain and compliance status.

**Stage 6: Audit** — Commits cryptographically signed record with SHA-256 hash chain, deterministic JSON serialization, and distributed node identity. Each record links to the previous via `previous_hash`, creating a tamper-detectable chain.

### 9.2 Operator Impact

You rarely interact with SRT directly. When you see a measurement in a report, it has been sensor-validated, unit-normalized, tolerance-checked, compliance-assessed, and cryptographically committed to the audit chain.

---

## Chapter 10 — Data Truth States

### 10.1 The Five Truth States

**[LIVE]** — Real data, fully operational. Rely on it for professional decisions.

**[PARTIAL]** — Partially connected. Some aspects work with real data; others are scaffolded.

**[MOCK]** — Synthetic data for structural simulation. Do not use for professional decisions.

**[CANDIDATE]** — System-generated, awaiting human review. Treat as a draft.

**[ACCEPTED]** — Human-reviewed and approved. Locked, signed, auditable.

### 10.2 Transition Lifecycle

Development: `[MOCK]` → `[PARTIAL]` → `[LIVE]`. Operational: `[CANDIDATE]` → `[ACCEPTED]`. A feature's truth state only advances in response to real implementation progress — it is never inflated.

### 10.3 Key Principle

No route fakes functionality. A Bounded Shell does not pretend to be a Functional MVP. A Deferred Shell does not display fake data. Every route tells you exactly what it can and cannot do.

---

# Volume 6: Operational Workflows

## Chapter 11 — Inspection Workflows

### 11.1 The Seven-Stage Lifecycle

**Create** → **Configure** → **Capture** → **Analyze** → **Report** → **Authorize** → **Deliver**

All stages audited by BANE. You cannot skip stages. You cannot finalize without findings. You cannot deliver without authorization.

### 11.2 Stage Details

**Create**: New inspection record with ID, property, type, client, inspector, timestamp. Initial truth state: `[CANDIDATE]`.

**Configure**: Jurisdiction, code edition, inspection scope, special conditions.

**Capture**: Manual finding entry, photo evidence, SRT sensor data, voice notes. Every event is timestamped and attributed.

**Analyze**: LARI assists with code compliance analysis, risk assessment, and pattern detection. All outputs carry confidence scores and `[CANDIDATE]` status.

**Report**: LARI-Reasoning assembles findings, evidence, and analysis into a structured document with AI advisory blocks clearly marked.

**Authorize** (Inspector Authority Gate): Per-item AI advisory review (approve/reject each), professional notes field, mandatory attestation checkboxes, digital signature. Once signed, the report is immutable in the OVERSCITE Ledger.

**Deliver**: PDF export, client portal, email delivery, print. Each delivery event recorded in audit trail.

---

## Chapter 12 — The Contractor Division

### 12.1 Seven Components

**Party Intake**: Name, role type (prime/sub), trade class, self-perform status. **Governance Setup**: Required licenses, insurance, registrations, bonds, certifications. **Verification State Banner**: `verified_active`, `verified_registered_only`, `unverified`, `expired`, `suspended`. **Documentation Upload**: Timestamped, attributed, expiration-tracked. **Proposal Drafting**: Scing-assisted scope and proposal generation (`[CANDIDATE]`). **Oversight Chain**: Visual tree of prime-sub relationships with independent verification at each node. **Scing Draft Wizard**: Context-aware document generation.

### 12.2 Key Principle: Non-Inherited Compliance

Each node in the Oversight Chain is an independent verification locus. A subcontractor is not compliant because the prime contractor is compliant. No aggregate compliance scoring is permitted.

---

# Volume 7: Scheduling

## Chapter 13 — SmartSCHEDULER™

### 13.1 Calendar Interface `[FUNCTIONAL MVP]`

Time-based grid view with team filtering. Each `CalendarBooking` record contains: title, start/end times, location, status (confirmed/pending/cancelled/completed), linked entity type (inspection/meeting/operational_block), and creator identity.

### 13.2 Scheduling Intelligence

SmartSCHEDULER proposes optimal time slots based on available slots, IRI weather scores, travel time, and inspector availability. Proposals are `[CANDIDATE]` — the system never books without human confirmation.

### 13.3 Governance Constraints

No auto-cancellation based on weather. No auto-rescheduling. No auto-dispatch. The system advises; the operator decides.

---

# Volume 8: Governance & Audit

## Chapter 14 — BANE Enforcement

### 14.1 The Four-Level Classification

| Classification | Meaning | Governance |
|---------------|---------|------------|
| `read` | Non-mutating access | Authentication only |
| `write` | State-changing | Pre/post-gate receipts + provenance |
| `sensitive` | PII or compliance data | Above + elevated capability |
| `irreversible` | Cannot be undone | Above + secondary capability |

### 14.2 Capability-Based Authorization

OVERSCITE uses capability tokens rather than role-based access control. Each capability (`inspection.view`, `inspection.finalize`, `tool:db_write`, etc.) is explicitly granted and can be explicitly revoked.

### 14.3 Fail-Closed Principle

Unrecognized capability, unclassified action, or unresolvable profile = denial. Default profile: `bane_fog_v1` (maximum enforcement).

### 14.4 Hardening Map

**Fully Wrapped**: `scing.chat`, all tool invocations — complete governance with gate evaluation and receipts. **Endpoint-Protected**: `scing.boot`, `scing.tools`, `aip.handleMessage` — BANE authentication at entry. **Not Yet Implemented**: `admin.updatePolicy`, `admin.revokeSession` — planned for maximum governance.

---

## Chapter 15 — Audit & Traceability

### 15.1 Security Decision Records (SDRs)

Append-only, immutable records for every BANE evaluation. Contains: timestamp (UTC, ms), user identity, action, classification, decision, capability token, context metadata, engine ID, trace ID, governance receipt IDs.

### 15.2 Governance Receipts

Pre-gate receipts (request arrives at gate) and post-gate receipts (outcome recorded) bracket every processing event.

### 15.3 Chain of Custody

Request SDR → Pre-Receipt → Processing → Post-Receipt → Result SDR. Every step is linked via `governanceRef`. No gaps between request and response.

### 15.4 Immutability Guarantees

SDRs, governance receipts, finalized inspection reports, SRT audit records, BANE-Watcher events, and authentication events cannot be deleted through normal system operations.

---

# Volume 9: User Responsibility

## Chapter 16 — What The System Does Not Do

The system does not make decisions — it computes, you commit. It does not replace professional judgment — code interpretation, visual inspection, and regulatory analysis require human expertise. It does not execute autonomously — no auto-sending, auto-rescheduling, auto-dispatching, auto-verifying, or auto-generating findings. It does not guarantee completeness — sensor coverage, image limitations, and code database coverage have natural boundaries. It does not operate offline — LARI engines, BANE enforcement, and data persistence require connectivity.

## Chapter 17 — Known Limitations

**Partially implemented**: LARI-Vision, LARI-Mapper, LARI-Guardian, LARI-Narrator, LARI-Fi (all `[PARTIAL]`). Live Radar requires Doppler API keys. Locations requires Google Maps API key.

**Mock data surfaces**: Inspections table, Calendar bookings, Library documents, Financial records use seed data through real processing logic.

**Deferred features**: Admin dashboard, Community, Social — labeled `[DEFERRED SHELL]` in the interface.

**Infrastructure**: Email/password auth only (additional providers planned). No offline capability. Responsive web application (native mobile planned). Single-tenant deployment model.

---

# Volume 10: Quick Start & Reference

## Chapter 18 — Quick Start Guide

### Your First Five Minutes

1. **Authenticate and orient** — Sign in. Learn the shell: Sidebar (left), Scing Bar (top center), OverHUD toggle (top right).
2. **Meet the Scing Panel** — Click the Scing Bar. Type a question. Scing maintains conversational context.
3. **Explore the OverHUD** — Click the toggle. Review security status and system health.
4. **Navigate to your primary tool** — Inspectors: Weather → Inspections. Managers: Dashboard → Teams. Scheduling: Calendar.
5. **Understand truth states** — Every badge tells you how real the data is. `[LIVE]` = confidence. `[MOCK]` = demonstration only.

### Quick Reference

| Action | How |
|--------|-----|
| Open Scing Panel | Click Scing Bar (top center) |
| Close Scing Panel | Click X or click outside |
| Open OverHUD | Click HUD toggle (top right) |
| Navigate | Click sidebar link |
| Ask Scing | Open panel → type → Enter |
| Check weather risk | Weather → IRI panel |
| See security | Open OverHUD → Security tab |

---

## Chapter 19 — Reference Glossary

| Term | Definition |
|------|-----------|
| **AIP** | Augmented Intelligence Protocol. Communication protocol connecting OVERSCITE to the SCINGULAR backend. |
| **App Shell** | Persistent layout wrapper containing Sidebar, Command Bar, Content Area, and OverHUD. |
| **ARC** | Accountable Responsible Contact. Identity authority for human users. |
| **BANE** | Boundary, Audit, Notification, Enforcement. The integrity gatekeeper. |
| **BANE-Watcher** | Security observation protocol in isolated data collections. |
| **BFI** | Bona Fide Intelligence. Requirement that all intelligence be transparent, bounded, and accountable. |
| **Capability Token** | Specific permission authorizing a particular action. |
| **[CANDIDATE]** | Truth state for system-generated data awaiting human approval. |
| **Classification** | Action severity level: read, write, sensitive, irreversible. |
| **Demon Mode** | BANE critical threat response: session isolation, token revocation, incident SDR. |
| **Fail-Closed** | Default behavior: when uncertain, deny. |
| **Guangel Safety Strip** | Binary go/no-go safety classification (green CLEAR / red DANGER). |
| **IRI** | Inspection Risk Index. Composite weather-to-safety metric. |
| **Inspector Authority Gate** | Final human approval interface for inspection reports. |
| **LARI** | Logistics, Analytics, Routing, Ingestion. Bounded reasoning engine collection. |
| **[LIVE]** | Truth state for fully operational, real-data features. |
| **M-UCB** | Monitoring Universal Control Block. BANE-Watcher event protocol. |
| **[MOCK]** | Truth state for synthetic demonstration data. |
| **Non-Autonomous Design** | Principle: maximally helpful without being independently consequential. |
| **OverHUD** | Operational Verification Heads-Up Display. Passive observation panel. |
| **OVERSCITE** | Governed operational environment for inspection and compliance. |
| **Oversight Chain** | Visual tree of contractor relationships with independent verification nodes. |
| **SDR** | Security Decision Record. Immutable audit record for every BANE evaluation. |
| **Scing** | Conversational interface presence and orchestration coordinator. Pronounced "sing." |
| **SmartSCHEDULER™** | Weather-aware scheduling intelligence system. |
| **SRT** | Secure Remote Telemetry. Six-stage sensor data pipeline. |
| **Truth State** | Maturity label: LIVE, PARTIAL, MOCK, CANDIDATE, or ACCEPTED. |
| **UTCB** | Universal Telemetry Control Block. SRT pipeline configuration. |

---

*End of the OVERSCITE™ Global Operator Manual v0.1*

*© 2026 Inspection Systems Direct LLC. All rights reserved.*  
*Built with Bona Fide Intelligence | OVERSCITE Global*
