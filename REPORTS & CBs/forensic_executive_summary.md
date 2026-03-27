# OVERSCITE-Global — Forensic Executive Summary Report

> **Report Date:** 2026-03-20  
> **Workspace:** `g:\OVERSCITE-Global`  
> **Version:** `0.1.0-alpha.1`  
> **Stack:** Next.js 14.2.35 · TypeScript · Firebase · Firestore · Tailwind CSS · Genkit AI  
> **Classification:** Internal Engineering Audit — Forensic Grade

---

## 1. Application Identity

| Field | Value |
|---|---|
| Package Name | `scingula-ai-drone-control` |
| Version | `0.1.0-alpha.1` |
| Framework | Next.js 14 (App Router) |
| Runtime | Node.js ([.nvmrc](file:///g:/OVERSCITE-Global/.nvmrc) → v20) |
| Hosting Target | Firebase App Hosting ([apphosting.yaml](file:///g:/OVERSCITE-Global/apphosting.yaml)) |
| Dev Port | `localhost:3001` |

---

## 2. Application Routes (25 Pages)

All routes live under `src/app/` using the Next.js App Router convention.

| Route | Domain | Purpose |
|---|---|---|
| `/` | Landing | [page.tsx](file:///g:/OVERSCITE-Global/src/app/page.tsx) — Auth gate / splash |
| `/admin` | Admin | Administrative panel |
| `/bookings` | Operations | Booking management |
| `/calendar` | Operations | Calendar / scheduling |
| `/clients` | CRM | Client records |
| `/community` | Social | Community features |
| `/conference-rooms` | Operations | Room management |
| `/dashboard` | Core | Primary operational dashboard |
| `/drone-vision` | Drone/SRT | Drone camera and telemetry UI |
| `/dynamic-dash` | Core | Dynamic drag-and-drop dashboard |
| `/finances` | Billing | Financial tracking / LARI-Fi |
| `/forgot-password` | Auth | Password recovery |
| `/inspections` | Core | Inspection workflow hub |
| `/lari-vision` | AI/Vision | LARI AI-powered visual analysis |
| `/library` | Archive | Document / asset library |
| `/marketplace` | Commerce | OVERSCITE marketplace |
| `/messaging` | Communication | Chat / messaging (Stream Chat) |
| `/overview` | Core | System overview |
| `/profile` | Identity | User profile |
| `/settings` | Config | Application settings |
| `/signup` | Auth | Registration |
| `/social` | Community | Social features |
| `/teams` | Operations | Team management |
| `/topics` | Knowledge | Topic exploration |
| `/weather` | Environment | Weather monitoring |
| `/workstation` | Core | Workstation management |

**Layout:** [layout.tsx](file:///g:/OVERSCITE-Global/src/app/layout.tsx) — Root layout with global CSS  
**Global Styles:** [globals.css](file:///g:/OVERSCITE-Global/src/app/globals.css)

---

## 3. UI Component Inventory (80+ Components)

### 3.1 Core Application Components (30 files)

| Component | Purpose |
|---|---|
| `app-shell.tsx` | Master layout shell with sidebar + top bar |
| `app-provider.tsx` | Global context/provider wrapper |
| `ClientProviders.tsx` | Client-side provider bootstrap |
| `Sidebar.tsx` | Navigation sidebar |
| `OverHUD.tsx` | Heads-up display overlay (root) |
| `ScingGPT.tsx` | Embedded AI chat assistant |
| `LiveFusionViewer.tsx` | Real-time sensor fusion display (23KB) |
| `NewCaptureWizard.tsx` | Multi-step capture wizard (19KB) |
| `NewCaptureButton.tsx` | Capture initiation trigger |
| `LiDAR3DViewer.tsx` | 3D LiDAR point cloud viewer |
| `ai-search-dialog.tsx` | AI-powered search (16KB) |
| `marketplace-map.tsx` | Google Maps marketplace integration (11KB) |
| `dispatch-wizard.tsx` | Job dispatch workflow (9KB) |
| `dynamic-inspection-form.tsx` | Dynamic form generator for inspections |
| `flash-notification-bar.tsx` | System notification bar |
| `inspection-type-list.tsx` | Inspection type catalog |
| `inspector-profile-modal.tsx` | Inspector credentials modal |
| `dashboard-charts.tsx` | Recharts dashboard visualizations |
| `client-chart-wrapper.tsx` | Chart wrapper component |
| `client-form.tsx` | Client data form |
| `review-form.tsx` | Review submission form |
| `background-slideshow.tsx` | Background image carousel |
| `announcements-widget.tsx` | Announcements feed |
| `news-widget.tsx` | News feed widget |
| `messaging-dialog.tsx` | Messaging overlay |
| `nav-link.tsx` | Navigation link component |
| `logo.tsx` | Brand logo component |
| `workstation-location-settings.tsx` | Location config |
| `workstation-time-format-switch.tsx` | Time format toggle |

### 3.2 Drone Domain (8 files)

| Component | Size | Purpose |
|---|---|---|
| `AerialDroneConsole.tsx` | — | **Primary drone console** (BANE/SRT/AIP integrated) |
| `OversciteDroneVisionUI.tsx` | 30KB | Full drone vision interface |
| `DroneBuilderControlPanel.tsx` | 7KB | Drone hardware configuration |
| `LARIAutonomousControl.tsx` | 2.3KB | LARI autonomous flight control |
| `ECUManagement.tsx` | 1.7KB | Electronic control unit management |
| `FAACompliancePanel.tsx` | 0.4KB | FAA regulatory compliance |
| `FlightControllerConfig.tsx` | 0.5KB | Flight controller settings |
| `SensorDataPane.tsx` | 0.4KB | Sensor data readout |

### 3.3 OverHUD System (7 files)

| Component | Purpose |
|---|---|
| `OverHUD.tsx` | Main HUD overlay |
| `OverHUDExplorer.tsx` | File/repo explorer inside HUD |
| `FileTree.tsx` | Hierarchical file tree |
| `FileDetails.tsx` | File detail viewer |
| `Breadcrumbs.tsx` | Navigation breadcrumbs |
| `RepoSwitcher.tsx` | Repository context switcher |
| `Toolbar.tsx` | HUD toolbar |

### 3.4 LARI Visual Components (3 files)

| Component | Size | Purpose |
|---|---|---|
| `LariSensorControlStack.tsx` | 13KB | Sensor control panel stack |
| `LariFindingsPanel.tsx` | 12KB | AI findings display |
| `LariVisualCanvas.tsx` | 9KB | Visual analysis canvas |

### 3.5 Inspection Components (2 files)

| Component | Purpose |
|---|---|
| `AssetUpload.tsx` | Evidence / asset upload |
| `inspector-authority-gate.tsx` | BANE-gated inspector access control |

### 3.6 Radix UI Primitives (39 files)

Full design system built on Radix UI: `accordion`, `alert-dialog`, `alert`, `avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `date-range-picker`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `loading-logo`, `logo-text`, `menubar`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar` (23KB), `skeleton`, `slider`, `star-rating`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `tooltip`

---

## 4. AI / Genkit Flows (27 Flows)

All flows under `src/ai/flows/` powered by `@genkit-ai/googleai` (Gemini).

| Flow | Domain | Purpose |
|---|---|---|
| `lari.ts` | Core | Primary LARI reasoning engine |
| `lari-vision.ts` | Vision | Image analysis and defect detection |
| `lari-precog.ts` | Predictive | Predictive analytics engine |
| `lari-guangel-ai.ts` | Guardian | Guangel guardian AI system |
| `lari-compliance.ts` | Legal | Compliance verification |
| `lari-logistics-ai.ts` | Operations | Logistics optimization |
| `lari-health-ai.ts` | Safety | Health and safety AI |
| `lari-enviro-ai.ts` | Environment | Environmental analysis |
| `lari-scing-bridge.ts` | Integration | Scing ↔ LARI bridge |
| `lari-geo-ai.ts` | Geospatial | Geospatial intelligence |
| `lari-gis.ts` | Mapping | GIS data processing |
| `lari-mapper.ts` | Mapping | Map context generation |
| `lari-ingestor.ts` | Data | Data ingestion pipeline |
| `lari-echo.ts` | Audio | Audio processing |
| `lari-dose.ts` | Safety | Radiation/dosimetry |
| `lari-nose.ts` | Chemical | Chemical/olfactory detection |
| `lari-therm.ts` | Thermal | Thermal imaging analysis |
| `lari-prism.ts` | Optics | Optical spectrum analysis |
| `lari-narrator.ts` | Reporting | Narrative report generation |
| `lari-synthesizer.ts` | Synthesis | Data synthesis |
| `analyze-substance-composition.ts` | Chemistry | Substance analysis |
| `cross-check-standards.ts` | Compliance | Standards cross-referencing |
| `enable-voice-commands.ts` | Voice | Voice command processing |
| `generate-executive-summary.ts` | Reporting | Executive summary gen |
| `generate-upload-url.ts` | Storage | Presigned upload URLs |
| `ingest-telemetry.ts` | Telemetry | Drone/sensor telemetry intake |
| `lari-narrator-types.ts` | Types | Narrator type definitions |

---

## 5. Scing Engine Architecture (144+ TypeScript files across 32 modules)

The `scing/` directory is the core ScingOS runtime engine layer.

### 5.1 Module Inventory

| Module | Files | Purpose |
|---|---|---|
| **attractors** | 5 | Attractor scoring and selection |
| **bane** | 11 + 8 subdirs | Security, audit, entitlements, keys, signatures, policy |
| **canon** | — | Canonical reference data |
| **cognition** | 3 | Collapse engine, config, cognitive types |
| **compliance** | 2 | Regulatory disclosure, system claims |
| **core** | 5 | Catalyst/growth protocols, engine registry, runtime |
| **debug** | 1 | Sub-engine debug tooling |
| **devices** | 7 + 1 subdir | Device routing, policy, capture, capability registry |
| **domains** | 1 | Domain registry |
| **engine** | 8 | Engine contracts, graph, risk, validation, visuals |
| **engines** | 1 + adapters | LARI EDL adapter layer |
| **evidence** | 8 | Hash, index, policy, signing, store, WORM enforcement |
| **examples** | — | Reference implementations |
| **export** | — | Data export utilities |
| **expression** | 9 | Color field, motion field, language plan, telemetry plan, composition |
| **firebase** | — | Firebase integration layer |
| **gradients** | — | Gradient computation |
| **guards** | — | Execution guards |
| **identity** | 5 | Gating, constraints, style rules, types |
| **inspection** | 4 | Policy, selectors, finalize, types |
| **lari** | 14 subdirs | Full LARI engine (audit, config, context, contracts, critic, dose, echo, perf, planner, primitives, prism, readiness, runtime, tests) |
| **lariBus** | — | LARI message bus |
| **obs** | — | Observation layer |
| **orderFocus** | — | Order focus protocol |
| **posture** | — | System posture management |
| **providers** | — | Service providers |
| **report** | — | Report generation |
| **sensors** | 8 + 1 subdir | Camera, LiDAR, microphone, smartwatch, voice prosody, flux builder, registry |
| **srt** | 5 | Anti-repeat guard, federation, influence field, motif engine, runtime |
| **subengines** | — | Sub-engine lifecycle |
| **ui** | — | UI contracts |
| **weather** | 6 subdirs | Weather config, contracts, engines, model, ops, tests |

### 5.2 Key Engine Files

| File | Purpose |
|---|---|
| [orchestrator.ts](file:///g:/OVERSCITE-Global/scing/orchestrator.ts) | Master engine orchestrator |
| [engineRegistry.ts](file:///g:/OVERSCITE-Global/scing/engineRegistry.ts) | Global engine registration |
| [index.ts](file:///g:/OVERSCITE-Global/scing/index.ts) | Scing root barrel export |

---

## 6. Packages (5 Internal Packages)

| Package | Path | Purpose |
|---|---|---|
| `scingular-sdk` | `packages/scingular-sdk/` | Core SDK for SCINGULAR integration |
| `scingular-policy` | `packages/scingular-policy/` | Policy enforcement library |
| `scingular-devkit` | `packages/scingular-devkit/` | Developer toolkit |
| `bfi-intent` | `packages/bfi-intent/` | BFI intent classification |
| `bfi-policy` | `packages/bfi-policy/` | BFI policy enforcement |

---

## 7. Cloud Functions

| Path | Purpose |
|---|---|
| `cloud/functions/` | Firebase Cloud Functions (separate Node.js package with own `package.json`, `tsconfig.json`, ESLint) |

---

## 8. Lib / Core Utilities (37 files across 10 subdirs)

| File | Size | Purpose |
|---|---|---|
| `task-driven-ai-system.ts` | 26KB | Core task-driven AI orchestration system |
| `data.ts` | 22KB | Master data utilities |
| `autonomous-component-controller.ts` | 13KB | Autonomous UI component controller |
| `autonomous-dom-controller.ts` | 11KB | Autonomous DOM manipulation |
| `periodic-table-data.ts` | 15KB | Chemical element data (inspection use) |
| `precision-architecture.ts` | 5KB | Precision architecture definitions |
| `srt-pipeline.ts` | 3KB | SRT data pipeline |
| `lari-camera-lidar-fusion.ts` | 2KB | Camera + LiDAR sensor fusion |
| `lari-lidar-controller.ts` | 4KB | LiDAR control interface |
| `firebase.ts` | 3KB | Firebase client initialization |
| `conversationStore.ts` | 4KB | Chat conversation persistence |
| `subscription.ts` | 1KB | Subscription management |
| `aiops.ts` | 2KB | AI operations utilities |
| `vision-data.ts` | 2KB | Vision model data |
| `marketplace-data.ts` | 2KB | Marketplace seed data |
| `drone-types.ts` | 1KB | Drone type definitions |
| `mockLogs.ts` | 1KB | Mock telemetry logs |

### Subdirectories

| Dir | Purpose |
|---|---|
| `lib/auth/` | Authentication utilities |
| `lib/bane/` | Client-side BANE integration |
| `lib/firebase/` | Firebase client config |
| `lib/locations/` | Location data services |
| `lib/overhud/` | OverHUD data layer |
| `lib/pdi/` | PDI (Portable Device Interface) |
| `lib/pipeline/` | Data pipeline utilities |
| `lib/stores/` | State stores (Zustand) |
| `lib/types/` | Shared type definitions |
| `lib/weather/` | Weather data services |

---

## 9. Data Layer

| File | Purpose |
|---|---|
| `src/data/adapter-layer.ts` | Data adapter abstraction |
| `src/data/integrity-guard.ts` | Data integrity verification |
| `src/data/normalized-metric-store.ts` | Metric normalization |
| `src/data/simulation-engine.ts` | Data simulation for testing |

---

## 10. Custom Hooks (7)

| Hook | Purpose |
|---|---|
| `use-mobile.tsx` | Responsive breakpoint detection |
| `use-panel-data.ts` | Panel data management |
| `use-toast.ts` | Toast notification system |
| `useSimulatedMetric.ts` | Simulated metric data |
| `useSpeechRecognition.ts` | Voice input (Web Speech API) |
| `useTextToSpeech.ts` | Text-to-speech (Google Cloud TTS) |
| `useWakeWordDetection.ts` | Wake word detection (Picovoice Porcupine) |

---

## 11. Context Providers (3)

| Context | Purpose |
|---|---|
| `LayoutContext.tsx` | Layout state management |
| `SplashContext.tsx` | Splash screen state |

---

## 12. Public Assets & Brand Files

| Asset | Type | Size |
|---|---|---|
| `Pb_SCINGULAR_Logo_White.svg` | Brand Logo | 936KB |
| `BANE_ZTI_logo_White.svg` | BANE Logo | 501KB |
| `BANE_ColorLogo1.svg` | BANE Color Logo | 300KB |
| `logo.png` | App Logo | 322KB |
| `logo.svg` | App Logo (vector) | 121KB |
| `Scing_ButtonIcon_White.svg` | Scing Icon | 42KB |
| `favicon.ico` | Favicon | 15KB |
| `background-images.json` | Background config | 363B |
| `background_photos/` | Directory | Background images |
| `images/` | Directory | General images |

---

## 13. Scripts & DevOps (10 scripts)

| Script | Purpose |
|---|---|
| `scripts/build.sh` | Production build |
| `scripts/deploy.sh` | Firebase deployment |
| `scripts/dev.sh` | Development startup |
| `scripts/setup.sh` | Environment setup |
| `scripts/test.sh` | Test runner |
| `scripts/syncDocsToWiki.js` | Docs → Wiki sync |
| `scripts/syncWikiToDocs.js` | Wiki → Docs sync |
| `scripts/qualityGateTranscript.js` | Quality gate report |
| `scripts/check-training-pdf-sync.sh` | Training PDF sync check |

---

## 14. Self-Test & Validation Tools (25 files)

Located in `tools/`, these are `.mjs` self-test harnesses for scing engine validation:

`attractors.selftest`, `bane.entitlements.selftest`, `canon-scan`, `devices.router.selftest`, `domains.moisture.selftest`, `expression.selftest`, `gradients.selftest`, `identity.selftest`, `lari.input_validation.selftest`, `lari.prism_graph.selftest`, `lari.weather.integration.selftest`, `orderFocus.selftest`, `posture.selftest`, `scing.ui.contracts.selftest`, `weather.severity.selftest`, `weather.ui.selftest`, `scing_quality_lockdown_gen`, `scing_srt_full_gen`, `scing_subengine_lifecycle_gen`, `vsci-cb-final`, `vsci_cb_fei_canon`, `lfcb_phase_commit_push`, `obs_smoke_emit`, `VSCI_CB_SRT_Scaffold.bat`

---

## 15. Canonical Documentation (60+ files)

### 15.1 Core Architecture Docs

| Document | Domain |
|---|---|
| `AIP-PROTOCOL.md` | Augmented Intelligence Protocol |
| `BANE-SECURITY.md` | Security & Audit Framework |
| `SCING-INTERFACE.md` | Scing UI Protocol |
| `SCINGULAR-AUTHORITY-MODEL.md` | Authority Chain |
| `SCINGULAR-ECOSYSTEM.md` | Full Ecosystem Map |
| `ARCHITECTURE.md` | System Architecture |
| `SECRETS-MANAGEMENT.md` | Secret Handling |
| `ISDC-PROTOCOL-2025.md` | ISDC Protocol |
| `LEGAL-FRAMEWORK.md` | Legal Framework |
| `DEVELOPMENT.md` | Development Guide |
| `API.md` | API Reference |
| `UX-GUIDELINES.md` | UX Standards |
| `TESTING.md` | Testing Strategy |
| `QUICK-START.md` | Quick Start Guide |
| `ROADMAP.md` | Feature Roadmap |

### 15.2 Inspection Codex (ICB Series — 24 documents)

`ICB-01` through `ICB-24`: Comprehensive inspection codex covering core schema, jurisdiction, legal foundations, lifecycle, evidence integrity, risk scoring, compliance tracking, inspector credentialing, reporting, ethics, security, audit, local ordinances, version control, training, automation, interoperability, data retention, resilience, governance, scalability, IP provenance, validation, and certification.

### 15.3 Map Context Codex (MCB Series — 7 documents)

`MCB-01` through `MCB-07`: Map context core schema, jurisdiction resolution, authority code indexing, risk overlays, parcel zoning, offline field resilience, and GIS evidence binding.

### 15.4 Canon & Embodiment Docs

| Document | Purpose |
|---|---|
| `EMBODIMENT-MODES-CANON.md` | Scing embodiment modes |
| `SCING-EMBODIMENT-POSITIONING-CANON.md` | Embodiment positioning |
| `SRT-AVATAR-STATE-TAXONOMY.md` | SRT avatar states |
| `FAILOVER-DEGRADATION-CANON.md` | Failover protocols |
| `FILE-EXTENSION.md` | `.sg*` file format spec |
| `AI-ASSISTANT-ACCESS.md` | AI assistant integration |
| `SCB-LINE-CLOSURE.md` | SCB line closure |

---

## 16. Legal & Governance (12 documents)

| Document | Purpose |
|---|---|
| `EULA.md` | End-User License Agreement |
| `PRIVACY_POLICY.md` | Privacy Policy |
| `TERMS_OF_USE.md` | Terms of Use |
| `SECURITY_POLICY.md` | Security Policy |
| `DATA_PROCESSING_ADDENDUM.md` | Data Processing Addendum |
| `ENTERPRISE_SERVICE_AGREEMENT.md` | Enterprise Service Agreement |
| `PARTNER_LICENSE_AGREEMENT.md` | Partner License Agreement |
| `CONTRIBUTOR_LICENSE_AGREEMENT.md` | CLA |
| `TRADEMARK_GUIDELINES.md` | Trademark Guidelines |
| `PRELIMINARY_PATENT_DRAFT.md` | Patent Draft (17KB) |
| `IMPLEMENTATION_CHECKLIST.md` | Legal Implementation Checklist |

---

## 17. Configuration & Build

| File | Purpose |
|---|---|
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS theme |
| `tsconfig.json` | TypeScript configuration |
| `firebase.json` | Firebase hosting/rules |
| `firestore.rules` | Firestore security rules (7KB) |
| `firestore.indexes.json` | Firestore indexes |
| `storage.rules` | Firebase Storage rules |
| `apphosting.yaml` | Firebase App Hosting |
| `components.json` | Radix/shadcn UI config |
| `.eslintrc.json` | ESLint config |
| `eslint.config.cjs` | ESLint flat config |
| `postcss.config.mjs` | PostCSS config |
| `.prettierrc` | Prettier config |
| `jest.config.cjs` | Jest testing config |
| `commitlint.config.js` | Commit lint rules |
| `mcp.json` | MCP server config |
| `.env.example` | Environment template (5.7KB) |
| `.npmrc` | NPM config |
| `.nvmrc` | Node version (v20) |
| `.version` | Version file |

---

## 18. Third-Party Dependency Summary (67 packages)

### Production (50 packages)

| Category | Packages |
|---|---|
| **Framework** | `next`, `react`, `react-dom` |
| **Firebase** | `firebase`, `firebase-admin` |
| **AI/ML** | `genkit`, `@genkit-ai/core`, `@genkit-ai/googleai`, `@genkit-ai/dotprompt`, `@genkit-ai/flow`, `openai` |
| **Google Cloud** | `@google-cloud/text-to-speech`, `@googlemaps/js-api-loader`, `@react-google-maps/api` |
| **UI Framework** | 22× `@radix-ui/*`, `@headlessui/react`, `lucide-react`, `@heroicons/react` |
| **Animation** | `framer-motion` |
| **3D** | `three` |
| **Charts** | `recharts` |
| **Forms** | `react-hook-form`, `@hookform/resolvers`, `zod` |
| **State** | `zustand` |
| **Layout** | `react-grid-layout`, `embla-carousel-react` |
| **Communication** | `stream-chat`, `stream-chat-react`, `axios` |
| **Voice** | `@picovoice/porcupine-web`, `@picovoice/web-voice-processor` |
| **Hardware** | `serialport` |
| **Media** | `exifr`, `wav` |
| **Storage** | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| **Styling** | `tailwind-merge`, `tailwindcss-animate`, `class-variance-authority`, `clsx` |
| **Time** | `date-fns` |
| **Toasts** | `react-hot-toast`, `react-day-picker` |

### Dev Dependencies (17 packages)

`@next/bundle-analyzer`, `@tailwindcss/typography`, `@types/google.maps`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three`, `@types/wav`, `@types/react-grid-layout`, `@svgr/webpack`, `postcss`, `tailwindcss`, `typescript`, `webpack-bundle-analyzer`, `eslint-config-next`

---

## 19. Governance Files

| File | Purpose |
|---|---|
| `CODE_OF_CONDUCT.md` | Community code of conduct |
| `CONTRIBUTING.md` | Contribution guidelines (13KB) |
| `COPYRIGHT` | Copyright notice |
| `LICENSE` | License terms |
| `NOTICE` | Legal notices |
| `TRADEMARK.md` | Trademark rules |
| `LEGAL.md` | Legal overview |
| `PATENT_PREP.md` | Patent preparation |
| `PR_REVIEW_INSTRUCTIONS.md` | PR review process |
| `VERSIONING.md` | Versioning strategy |
| `CHANGELOG.md` | Release changelog |
| `ROADMAP.md` | Product roadmap |
| `CHATGPT-ACCESS.md` | ChatGPT integration rules |

---

## 20. UTCB / FBS Response Configs (4 YAML files)

| File | Purpose |
|---|---|
| `FBS-UTCB-RESPONSE.yaml` | FBS UTCB standard response (8KB) |
| `FBS-UTCB-DRONE-REPAIR-RESPONSE.yaml` | Drone repair response (4KB) |
| `FBS-UTCB-WORKSTATION-PLUS-REPAIR-RESPONSE.yaml` | Workstation repair response (3KB) |
| `UDCB_RESPONSE_OVERHUD_PHASE1.yaml` | OverHUD Phase 1 response (2KB) |
| `src/utcb.yaml` | Master UTCB config (39KB) |
| `src/utcbGovernance.yaml` | UTCB governance rules (2KB) |

---

## 21. Summary Statistics

| Metric | Count |
|---|---|
| **Next.js Routes** | 25 |
| **UI Components** | 80+ |
| **Radix UI Primitives** | 39 |
| **AI/Genkit Flows** | 27 |
| **Scing Engine Modules** | 32 directories, 144+ files |
| **Internal Packages** | 5 |
| **Custom Hooks** | 7 |
| **Context Providers** | 3 |
| **Canonical Docs** | 60+ |
| **Legal Documents** | 12 |
| **Self-Test Tools** | 25 |
| **Scripts** | 10 |
| **Public Brand Assets** | 8 files + 2 dirs |
| **Config Files** | 20+ |
| **NPM Dependencies** | 67 |
| **YAML Response Configs** | 6 |

---

*This document constitutes a forensic-grade executive inventory of the OVERSCITE-Global workspace. All file counts, paths, and classifications are derived from direct filesystem inspection performed on 2026-03-20.*
