# Chapter 17 — Known Limitations

*Volume 9: User Responsibility | OVERSCITE Global User Manual*

---

## 17.1 Implementation Honesty

This chapter documents features and capabilities that are partially implemented, under development, or operating with simulated data. This is not a deficiency list — it is a transparency commitment. Every evolving platform has surfaces that are ahead of or behind their ideal state. OVERSCITE's difference is that it tells you exactly where those surfaces are.

The information in this chapter is current as of the date of publication and is derived from the platform's Implementation Truth Matrix.

---

## 17.2 Partially Implemented Features

### LARI Engine Suite

The LARI engine suite contains six engines. As of this writing, their maturity varies:

| Engine | Status | What Works | What Is Pending |
|--------|--------|------------|-----------------|
| LARI-Reasoning | [LIVE] | Report generation, code lookup, multi-step workflows | Advanced multi-engine orchestration |
| LARI-Vision | [PARTIAL] | Interface scaffolding | Full computer vision API integration |
| LARI-Mapper | [PARTIAL] | Spatial reasoning types | Full geospatial processing pipeline |
| LARI-Guardian | [PARTIAL] | BANE-Watcher event structure | Real-time anomaly detection algorithms |
| LARI-Narrator | [PARTIAL] | Natural language synthesis types | Full narrative generation pipeline |
| LARI-Fi | [PARTIAL] | Financial event classification types | Full financial intelligence processing |

**Practical impact**: Report generation and code intelligence are fully functional. Image analysis, spatial processing, and advanced narrative generation are architecturally defined but pending full integration.

### Live Radar (Weather)

The Weather Command Center's Live Radar tab displays the interface structure and visual design but requires external Doppler API keys for real radar data. The current view clearly indicates this requirement rather than displaying simulated radar imagery.

### Locations OverSCITE

The geospatial system's full functionality depends on a Google Maps API key configuration. All five interface components (Command Bar, Operations Rail, Layer Panel, Map Canvas, Intelligence Drawer) are architected and responsive, but the map canvas renders only when the API key is provided.

### Messaging

The Messaging route is transitioning from an initial loading state to a thread-based architecture. The interface is in active development. Communication functionality should be considered a bounded shell.

---

## 17.3 Mock Data Surfaces

The following routes currently operate with seed data or mock services rather than live data connections:

| Surface | Data Source | Nature of Mock Data |
|---------|-------------|---------------------|
| Inspections table | `mockData.ts` | Realistic inspection records with findings |
| Calendar bookings | `calendar-service.ts` seed | Sample bookings (inspection, meeting, operational block) |
| Library documents | `library-service.ts` | Simulated document records with upload functionality |
| Financial records | `finance-service.ts` | Representative billing and subscription data |
| Dashboard panels | Static/service | Combination of live data and structural panels |

**Important**: Although the underlying data is simulated, the *logic* that processes it is real. The Calendar's team filtering works on mock bookings the same way it will work on live bookings. The Library's upload flow exercises the same component chain that production uploads will use. The difference is the data source, not the logic.

---

## 17.4 Deferred Features

The following features exist as visual shells but are not yet interactive:

| Feature | Route | Current State |
|---------|-------|---------------|
| Admin dashboard | `/admin` | Static health placeholders, non-functional toggles |
| Community | `/community` | Read-only visibility, no social interactions |
| Social | `/social` | Interface shell only |
| Dynamic Dash | `/dynamic-dash` | Custom dashboard framework, configuration tools pending |

These surfaces are labeled with [DEFERRED SHELL] truth-state badges in the interface. Buttons and interactive elements clearly indicate that the feature is not yet available.

---

## 17.5 Infrastructure Limitations

### Authentication Providers

Currently, OVERSCITE supports email/password authentication through Firebase Auth. Additional providers (Google, Microsoft, SSO) are architecturally supported but not yet configured for production use.

### Offline Capability

OVERSCITE does not currently support offline data capture. All operations require active network connectivity. Future SRT enhancements may introduce client-side data buffering with sync-on-reconnect, but this capability is not yet implemented.

### Mobile Applications

OVERSCITE is currently a responsive web application optimized for desktop and tablet viewports. Native mobile applications (iOS, Android) are planned but not yet available. The web interface adapts to mobile screen sizes through responsive layout, but certain features (particularly Locations OverSCITE and the multi-column Dashboard) are best experienced on larger screens.

### Multi-Tenant Architecture

The current deployment model supports a single organization per instance. Multi-tenant architecture with organizational isolation, cross-tenant data boundaries, and per-tenant BANE policy profiles is planned for future releases.

---

## 17.6 How to Read This Chapter

This chapter should not discourage you from using OVERSCITE's capabilities. It should calibrate your expectations so that you are never surprised by the state of a feature.

**If a feature is marked [LIVE]**, use it with confidence. It is operational and connected to real data sources.

**If a feature is marked [FUNCTIONAL MVP]**, use it knowing that the core logic works but some advanced capabilities are still developing.

**If a feature is marked [PARTIAL]**, explore it to understand what it will become, but do not rely on it for production decisions.

**If a feature is marked [DEFERRED SHELL]**, recognize it as a placeholder that indicates the system's future direction.

The platform's truth-state system ensures that this calibration is always visible — you do not need to memorize this chapter, because the interface itself communicates feature maturity at every surface.

---

## 17.7 Chapter Summary

OVERSCITE is an evolving platform with surfaces at varying maturity levels. LARI-Reasoning and the Weather Command are fully operational. Other LARI engines, the Live Radar, and Locations depend on external integrations. Several routes operate with mock data through real processing logic. And some features exist as deferred shells awaiting implementation.

The platform communicates all of this honestly through its truth-state system, its interface badges, and this chapter. Transparency about limitations is itself a governance feature — it prevents the most dangerous kind of software use: reliance on capabilities that do not yet exist.

---

*Previous: [Chapter 16 — What The System Does Not Do](ch16-what-system-does-not-do.md)*  
*Next: [Chapter 18 — Quick Start Guide](../vol-10-quick-start-reference/ch18-quick-start.md)*
