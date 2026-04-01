# Chapter 3 — System Layers

*Volume 2: System Architecture | OVERSCITE Global User Manual*

---

## 3.1 The Three-Layer Model

OVERSCITE is built on a three-layer architecture that separates concerns cleanly between what the operator sees, what the system reasons about, and how data is stored and transmitted. These layers are not abstractions drawn on a whiteboard — they correspond to real directories in the codebase, real deployment boundaries, and real security partitions.

```
┌──────────────────────────────────────────────────────────────┐
│                    Layer 1: UI Layer                          │
│              (What the operator sees and touches)             │
│                                                              │
│   Next.js Client  •  React Components  •  Shell Layout       │
│   Scing Panel  •  OverHUD  •  Route Pages  •  Sidebar        │
│                                                              │
│   Location: src/app/, src/components/, src/styles/            │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │  API calls, state management
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                Layer 2: Governed Intelligence                 │
│              (What the system reasons about)                  │
│                                                              │
│   Scing Orchestration  •  LARI Engines  •  BANE Security     │
│   SRT Pipeline  •  Governance Gates  •  SDR Logging          │
│                                                              │
│   Location: cloud/functions/, scing/, src/lib/ (services)     │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │  Firebase Admin SDK, Firestore
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                Layer 3: Infrastructure                        │
│           (Where data lives and how it moves)                 │
│                                                              │
│   Firebase Auth  •  Firestore  •  Cloud Functions            │
│   Firebase Storage  •  Security Rules  •  Hosting            │
│                                                              │
│   Location: firebase.json, firestore.rules, storage.rules     │
└──────────────────────────────────────────────────────────────┘
```

Understanding this separation matters because it determines what can happen where:

- **Layer 1 cannot execute consequential actions.** The UI can request actions, display results, and capture input, but it cannot directly write to governance-sensitive collections, bypass BANE enforcement, or invoke LARI engines without going through the governed intelligence layer.

- **Layer 2 is where governance lives.** Every tool invocation, every report generation, and every state transition passes through Cloud Functions that enforce BANE policy, emit governance receipts, and create audit records. This is the layer where the Human Authority Doctrine is mechanically enforced.

- **Layer 3 is the persistence boundary.** Firestore rules, storage rules, and function-level authentication ensure that even if a client is compromised, direct database access follows the least-privilege principle.

---

## 3.2 Layer 1: The UI Layer

The UI layer is implemented as a **Next.js 14+ application** using React 18, TypeScript, and Tailwind CSS. It runs in the operator's browser and communicates with the governed intelligence layer through API calls.

### The Shell Architecture

Every authenticated page in OVERSCITE is rendered inside a component called the **App Shell** (`app-shell.tsx`). The App Shell provides the persistent interface structure that remains consistent across all routes:

- **Sidebar** — Left navigation panel with collapsible sections for main navigation, tools, and management. Contains links to all 28 primary routes.
- **Top Command Bar** — Fixed horizontal bar at the top containing the Scing Panel (center), utility actions (right), and the sidebar trigger (left).
- **Flash Notification Bar** — Immediately below the command bar, displays transient system notifications.
- **Main Content Area** — The scrollable region where route-specific content renders.
- **OverHUD** — Full-height right-side intelligence panel that pushes the main content left when expanded.

This shell composition is governed by the **5-Zone Model** defined in the UI Layout Contract:

| Zone | Name | Position | Content |
|------|------|----------|---------|
| 1 | Top Command Bar | Fixed top | Navigation, Scing Panel, utility actions |
| 2 | Page Identity Band | Below command bar | Page title, mission context, truth-state badge |
| 3 | Primary Content Region | Center scrollable | Route-specific core logic |
| 4 | Contextual Intelligence Panel | Right sidebar | OverHUD: secondary data, AI suggestions |
| 5 | Action Surface | Bottom/header | Commits, saves, dispatches, transitions |

### Client-Side State Management

The UI layer uses React context providers for cross-component state:

- **`ShellLayoutProvider`** — Manages OverHUD open/close state and shell geometry.
- **`ScingPanelProvider`** — Manages Scing Panel expansion, conversation history, thinking indicators, and mode state.
- **`SidebarProvider`** — Shadcn sidebar context for collapse/expand state.

These providers are nested at the App Shell level, which means any component anywhere in the shell tree can access shell layout state without prop drilling.

### Styling Architecture

The visual identity is implemented through:

- **Global CSS variables** in `globals.css` defining the color system (dark-mode-first with HSL-based tokens)
- **Shell-surface material class** (`.shell-surface`) applied to all chrome elements for visual consistency
- **OverHUD-specific class** (`.overhud-panel`) inheriting shell-surface plus left border treatment
- **Scing aesthetic classes** (`.scing-card`, `.scing-border-glow`, `.scing-interactive-panel`) for intelligence surfaces
- **Custom scrollbar styling** with gold-accent micro-animations

The platform's primary accent color is gold (`HSL 45, 91%, 61%` — `#FFD84D`), which appears throughout the interface as the Scing signalization color, active-state indicator, and interactive element highlight.

---

## 3.3 Layer 2: The Governed Intelligence Layer

The governed intelligence layer is where the system's reasoning, enforcement, and orchestration capabilities reside. It is divided into three major subsystems, each with distinct roles and boundaries:

### Scing Orchestration

Scing is the orchestration coordinate — the component that receives operator requests and coordinates responses. It is **not** an independent intelligence. Scing does not reason about inspection data, generate reports, or analyze images. Instead, it routes requests to the appropriate LARI engine, ensures BANE enforcement occurs at every transition, and manages the conversational context that allows multi-turn interactions.

The orchestration layer is implemented through Cloud Functions that:

1. Receive operator requests (via the Scing Panel or the AIP protocol)
2. Determine which LARI engine(s) can address the request
3. Check BANE policy for the requested capability
4. Forward the request to the appropriate engine with pre-validated context
5. Receive the engine response
6. Create a BANE audit record
7. Return the result to the UI layer for operator review

### LARI Engine Suite

LARI (Logistics, Analytics, Routing, Ingestion) is the collection of specialized reasoning engines. Each engine conforms to a standardized contract (`LariEngineContract`) that defines:

```
┌─────────────────────────────────┐
│       LariEngineContract         │
├─────────────────────────────────┤
│  id: string                      │  Unique engine identifier
│  description: string             │  Human-readable purpose
│  capability: string              │  Required BANE capability
│  handler: (LariRequest)          │  
│    → Promise<LariResponse>       │  Async processing function
└─────────────────────────────────┘
```

Every engine receives a `LariRequest` containing the operator's intent and pre-fetched context, and returns a `LariResponse` containing the result, a confidence score, processing duration, and a trace ID for audit correlation.

Current LARI engines include:

| Engine | Capability | Truth State | Function |
|--------|-----------|-------------|----------|
| LARI-Reasoning | `reasoning` | [LIVE] | Multi-step workflows and report generation |
| LARI-Vision | `vision` | [PARTIAL] | Image analysis and defect detection |
| LARI-Mapper | `mapping` | [PARTIAL] | Spatial reasoning and location intelligence |
| LARI-Guardian | `monitoring` | [PARTIAL] | System health and anomaly detection |
| LARI-Narrator | `narration` | [PARTIAL] | Natural language report synthesis |
| LARI-Fi | `finance` | [PARTIAL] | Financial event classification and routing |

### BANE Enforcement

BANE operates at the seam between Scing orchestration and LARI processing. Its enforcement model is classification-based:

| Classification | Meaning | Governance Requirements |
|---------------|---------|------------------------|
| `read` | Non-mutating data access | Basic authentication only |
| `write` | State-changing operation | Pre-gate receipt, post-gate receipt, provenance |
| `sensitive` | Data involving PII or compliance | All above, plus elevated capability |
| `irreversible` | Cannot be undone | All above, plus secondary capability requirement |

This classification system is what prevents a rogue or buggy component from silently escalating its permissions. An engine that is registered with `read` capability cannot perform `write` operations, because BANE's gate evaluates the classification before permitting execution.

---

## 3.4 Layer 3: The Infrastructure Layer

The infrastructure layer is Firebase-based and consists of several interconnected services:

**Firebase Authentication** manages user identity. Operators authenticate via email/password (with additional providers planned), and their Firebase UID becomes the identity key used across all system boundaries. Custom claims can encode role and capability metadata.

**Firestore** is the document database that stores all operational data. Collections follow a governed schema where:
- Top-level collections (`inspections`, `users`, `sessions`, `sdrs`) are directly regulated by Firestore Security Rules
- BANE-watcher events use isolated top-level collections (`bane_watcher_events`, `bane_watcher_signals`) to prevent cross-contamination with operational data
- Every document carries provenance metadata including creation timestamps, authoring identity, and truth-state

**Cloud Functions** host the governed intelligence layer. All consequential logic runs server-side, authenticated through the Firebase Admin SDK, and subject to BANE governance gates. Client-side code cannot bypass these functions to write directly to governed collections.

**Firebase Storage** handles binary assets — inspection photos, report PDFs, sensor data files. Storage rules enforce per-user access boundaries with path-based authorization.

**Firestore Security Rules** provide a secondary enforcement layer beyond BANE. Even if a Cloud Function bug allowed an unauthorized write, the Firestore rules would deny it based on the authenticated user's claims and the document's ownership metadata. This defense-in-depth approach means that compromising one layer does not compromise the system.

---

## 3.5 Data Flow: How a Request Travels Through the System

To make the layer architecture concrete, trace the path of a single operator request:

**The operator opens the Weather Command Center (`/weather`).**

1. **UI Layer**: The Next.js router renders the `WeatherCommandCenter` component. The component calls the `useWeatherData()` hook, which fetches weather data from the configured API endpoint.

2. **UI Layer**: The weather data arrives. The component passes it through three processing hooks:
   - `useIRI(weather)` — computes the **Inspection Risk Index**, a composite score weighting temperature, wind speed, precipitation, and humidity
   - `useRoofTemp(weather)` — models the **Roof Surface Temperature** based on ambient conditions, solar radiation estimates, and material properties
   - `useGuangel(iri)` — evaluates the **Guangel Safety Strip**, a go/no-go operational safety classification

3. **UI Layer**: The processed data renders across four tabs: Overview (conditions + risk), Live Radar (visualization), Safety & Risk (detailed scoring), and 10-Day Forecast. Each panel displays truth-state markers — the Live Radar tab, for example, clearly indicates that it requires external API keys for full operation.

4. **Governed Intelligence Layer**: In this particular flow, the weather data processing occurs client-side (hooks in `src/hooks/weather/`), since weather observation is a read-only, non-consequential operation. However, if the operator were to use the weather data to inform a scheduling decision — "Scing, reschedule tomorrow's inspections due to the storm" — that request would cross into Layer 2, where BANE governance and LARI orchestration would govern the scheduling mutation.

This example illustrates an important principle: **data flows are classified by consequence, not by complexity.** A complex weather computation can run client-side because it is non-consequential (viewing data does not change system state). A simple reschedule request must go server-side because it is consequential (it changes the state of scheduled inspections and requires audit).

---

## 3.6 Chapter Summary

OVERSCITE's three-layer architecture — UI, governed intelligence, and infrastructure — creates clear boundaries between what the operator sees, what the system reasons about, and where data lives. The UI layer cannot bypass governance. The intelligence layer operates only through BANE-gated functions. And the infrastructure layer provides defense-in-depth security through Firestore rules that enforce access control independently of application logic.

This architecture is not incidental — it is the mechanical implementation of the philosophical principles described in Chapter 2. Human authority is preserved because the UI layer cannot self-authorize. Audit traceability is maintained because Layer 2 generates audit records at every transition. And non-autonomous design is enforced because LARI engines can only be invoked through governed orchestration paths.

In the next chapter, we examine the Scing–LARI–BANE model in detail, tracing how specific operator requests propagate through each component with step-by-step scenarios.

---

*Previous: [Chapter 2 — System Philosophy](../vol-01-foundations/ch02-system-philosophy.md)*  
*Next: [Chapter 4 — The Scing–LARI–BANE Model](ch04-scing-lari-bane.md)*
