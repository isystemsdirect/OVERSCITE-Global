# Chapter 6 — Navigation & Routes

*Volume 3: Interface Operations | OVERSCITE Global User Manual*

---

## 6.1 The Route System

OVERSCITE organizes its operational capabilities into **routes** — distinct pages that serve specific functional domains. Each route loads inside the App Shell's main content area, inheriting the persistent Top Command Bar, Scing Panel, Sidebar, and OverHUD.

The platform currently provides **28 authenticated routes**, and this chapter documents them in full. Every route appears in the sidebar navigation, grouped by operational category.

---

## 6.2 The Sidebar

The sidebar is the primary navigation mechanism. It is a vertical panel on the left side of the shell that provides direct access to all routes.

### Structure

The sidebar uses a collapsible drawer pattern:
- **Expanded**: Full-width sidebar (~260 pixels) showing icons, labels, and group headers
- **Collapsed**: Minimal sidebar showing only icons (~48 pixels)
- **Mobile**: Slides over the content area with an overlay backdrop

### Navigation Groups

The sidebar organizes routes into logical groups:

**Main Navigation** — Primary work surfaces you use daily  
**Tools** — Specialized operational tools  
**Management** — Administrative and organizational surfaces  

---

## 6.3 Route Catalog

The following table lists every authenticated route in the platform, its functional description, and its implementation truth-state as verified against the `IMPLEMENTATION_TRUTH_MATRIX.md` source.

### Core Operations

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Dashboard** | `/dashboard` | [LIVE] | Command center showing operational panels: Inspection Flow, Financial Pulse, Weather Intelligence, Team Readiness, Evidence Chain Queue, Calendar, LARI Advisory, Mission Map, and Industry News |
| **Workstation** | `/workstation` | [LIVE] | Personal workspace for settings, preferences, and environment configuration |
| **Overview** | `/overview` | [LIVE] | Operational summary and key metrics display |

### Inspection & Field Work

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Inspections** | `/inspections` | [FUNCTIONAL MVP] | Inspection records table with detail view. Data-driven with mock data backing. Supports inspection creation, finding entry, and evidence attachment |
| **Contractor** | `/contractor` | [FUNCTIONAL MVP] | Contractor management division with party intake, governance setup, oversight chain tracking, proposal drafting, and verification state management |
| **Drone Vision** | `/drone-vision` | [BOUNDED SHELL] | Aerial inspection capture and analysis interface. Interface structure complete; backend wiring restricted to safe states |
| **LARI Vision** | `/lari-vision` | [BOUNDED SHELL] | LARI-Vision engine interface for image analysis and defect detection |

### Environmental Intelligence

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Weather** | `/weather` | [LIVE] | Weather Command Center with four-tab interface: Overview (current conditions, IRI, roof temp), Live Radar, Safety & Risk, and 10-Day Forecast |
| **Monitor** | `/monitor` | [BOUNDED SHELL] | System monitoring and BANE-Watcher event observation surface |

### Data & Knowledge

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Library** | `/library` | [FUNCTIONAL MVP] | Document management with real records, functional simulated upload, and truthful status markers |
| **Topics** | `/topics` | [BOUNDED SHELL] | Knowledge base and topic management for code references, standards, and domain knowledge |

### Scheduling & Communication

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Calendar** | `/calendar` | [FUNCTIONAL MVP] | Scheduling system with persisted booking records, data-driven grid, and validated team filtering — the operational surface for SmartSCHEDULER™ |
| **Messaging** | `/messaging` | [BOUNDED SHELL] | Internal communication system. Thread list architecture in progress |
| **Conference Rooms** | `/conference-rooms` | [BOUNDED SHELL] | Virtual meeting room management and scheduling |

### Client & Team Management

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Clients** | `/clients` | [FUNCTIONAL MVP] | Client records management — property owners, building managers, and organizational contacts |
| **Teams** | `/teams` | [FUNCTIONAL MVP] | Team composition, role assignments, and field team dispatch coordination |
| **Keys** | `/keys` | [BOUNDED SHELL] | Access key management and credential distribution |
| **Profile** | `/profile` | [LIVE] | Operator profile management — personal information, certifications, and credentials |

### Financial Operations

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Finances** | `/finances` | [FUNCTIONAL MVP] | Billing records, subscription status, and financial reporting with truthful sub-status indicators and export pathways |
| **Payouts** | `/payouts` | [BOUNDED SHELL] | Earnings distribution and payout management for contractor payments |
| **Orders** | `/orders` | [BOUNDED SHELL] | Service order management and tracking |

### Marketplace & Commerce

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Marketplace** | `/marketplace` | [BOUNDED SHELL] | Capability Marketplace for entitlement commerce — service tier upgrades, capability purchases, and integration access. "Request Access" gating for unreleased capabilities |
| **Field Market** | `/field-market` | [BOUNDED SHELL] | Field Market for labor and dispatch operations — contractor matching, job posting, and field coordination |

### Community & Social

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Community** | `/community` | [DEFERRED SHELL] | Read-only community presence. All social interactions are gated pending implementation |
| **Social** | `/social` | [DEFERRED SHELL] | Social networking and professional connection features |

### Geospatial

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Dynamic Dash** | `/dynamic-dash` | [BOUNDED SHELL] | Configurable dashboard surface for custom operational views |

### Administration

| Route | Path | Truth State | Description |
|-------|------|-------------|-------------|
| **Admin** | `/admin` | [DEFERRED SHELL] | System administration surface. Static health placeholders with non-functional toggles |
| **Settings** | `/settings` | [LIVE] | Application-level settings including display preferences, notification preferences, and system configuration |

---

## 6.4 Understanding Truth States in Route Context

The truth-state markers in the route catalog deserve closer attention, because they directly affect your experience on each page:

**[LIVE]** routes are fully operational. Their data sources are connected, their interactions produce real results, and their displays accurately reflect system state. The Dashboard, Weather, Profile, Settings, Workstation, and Overview routes fall in this category.

**[FUNCTIONAL MVP]** routes have real data-driven logic and consequential actions that are either fully functional or truthfully simulated with audit logging. The Inspections, Calendar, Library, Finances, Clients, Teams, and Contractor routes are in this state. You can use these routes for real work, understanding that some advanced capabilities may not yet be fully connected.

**[BOUNDED SHELL]** routes have complete interface logic but are restricted to safe, predictable states on the backend. They will look and feel complete, but backend operations are confined to prevent unintended consequences while integration work continues. The Messaging, Marketplace, Field Market, Monitor, Drone Vision, LARI Vision, Topics, Conference Rooms, Keys, Payouts, Orders, and Dynamic Dash routes are in this state.

**[DEFERRED SHELL]** routes have visual existence only. Their interactions are truthfully disabled — you will see the interface, but buttons and actions will clearly indicate that the feature is not yet available. The Community, Social, and Admin routes are in this state.

The critical principle is this: **no route fakes functionality.** A Bounded Shell does not pretend to be a Functional MVP. A Deferred Shell does not display fake data. Every route tells you exactly what it can and cannot do.

---

## 6.5 The Top Command Bar

The Top Command Bar is the fixed horizontal element at the very top of every page. It is the only persistent UI element that has a higher visual priority than the sidebar.

### Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  [≡]  │           Scing Panel (center)           │  [🔔] [⚙️] [HUD]  │
│ Menu  │  ┌─────────────────────────────────────┐  │  Utility Actions   │
│       │  │  ✦ OVERSCITE Global  ·  Ready      │  │                    │
│       │  └─────────────────────────────────────┘  │                    │
└─────────────────────────────────────────────────────────────────┘
```

**Left Region**: Sidebar toggle button (hamburger icon). Collapses or expands the sidebar.

**Center Region**: The Scing Panel bar. Shows workspace name and status when collapsed. Expands to the full conversational panel when clicked.

**Right Region**: Utility actions. OverHUD toggle, notifications, settings shortcuts.

### Fixed Behavior

The Top Command Bar is fixed — it does not scroll with page content. It remains visible at all times, providing constant access to Scing and global navigation regardless of how far down a page the operator has scrolled.

---

## 6.6 The Page Identity Band

Below the Top Command Bar, each route renders a **Page Identity Band** — a horizontal strip that declares:

1. **Page Title**: The name of the current route (e.g., "Weather Command", "Inspections", "Library")
2. **Mission Context**: A subtitle describing the route's purpose (typically a four-sentence operational description)
3. **Truth-State Badge**: The route's maturity marker ([LIVE], [FUNCTIONAL MVP], etc.)

The Page Identity Band ensures that the operator always knows where they are, what the page does, and how mature the implementation is. Combined with the persistent Top Command Bar and Sidebar, this creates what the UI Layout Contract calls the **5-Zone Model** — a structural template that eliminates visual and behavioral drift across routes.

---

## 6.7 Navigation Patterns

### Primary Navigation (Sidebar Click)

The most common navigation pattern is clicking a sidebar link. This triggers a Next.js client-side route transition: the URL changes, the main content area updates with the new route's components, and the Page Identity Band updates. The shell remains stable — no page reload occurs.

### Scing-Directed Navigation

You can ask Scing to navigate for you. Saying "Go to the Weather Command" or "Open the inspection for 123 Main Street" will trigger navigation through Scing's orchestration logic. This is particularly useful when you are mid-conversation and want to move to a relevant page without losing conversational context.

### Deep Linking

Every route supports direct URL access. If you bookmark `/inspections` and return to it later, the system will authenticate you, load the shell, and render the Inspections page directly. This supports browser-native workflows like tabbed browsing, link sharing, and browser history navigation.

---

## 6.8 Chapter Summary

OVERSCITE organizes its capabilities into 28 authenticated routes, each with a declared truth-state indicating its implementation maturity. The sidebar provides structured navigation across five groups. The Top Command Bar offers persistent access to Scing and utility actions. The Page Identity Band ensures transparency about each route's purpose and readiness.

No route hides its state. No shell element changes behavior between routes. The navigation system is predictable, transparent, and governed by the same truthfulness principles that govern the rest of the platform.

In the next chapter, we examine the Weather Command Center — OVERSCITE's environmental intelligence system and its integration with inspection risk assessment.

---

*Previous: [Chapter 5 — The Panel System](ch05-panel-system.md)*  
*Next: [Chapter 7 — Weather Command](../vol-04-environment-safety/ch07-weather-command.md)*
