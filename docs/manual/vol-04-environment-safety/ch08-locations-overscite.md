# Chapter 8 — Locations OverSCITE

*Volume 4: Environment & Safety | OVERSCITE Global User Manual*

---

## 8.1 The Geospatial Intelligence Surface

Field operations are inherently spatial. Inspectors travel between properties. Teams are distributed across geographic regions. Clients' assets occupy physical locations. Hazards are tied to specific coordinates. Weather varies by locality.

The **Locations OverSCITE** module is OVERSCITE's geospatial intelligence surface — a map-based operational environment that overlays inspection data, team positions, client properties, device locations, and environmental hazards onto a unified geographic canvas. Its truth-state is **[PARTIAL]** — the interface architecture is complete, including all sub-components, but full operation requires a configured Google Maps API key.

---

## 8.2 Accessing Locations OverSCITE

The Locations system is available through the sidebar navigation. When the required Google Maps API key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) is not configured, the system displays a clear, non-deceptive error message: "Google Maps API Key Missing — Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment."

This is another instance of OVERSCITE's truth-state philosophy in action. Rather than rendering a static image that looks like a map, the system tells you exactly what is needed to activate the feature.

---

## 8.3 Interface Architecture

When fully configured, Locations OverSCITE presents a five-component layout:

```
┌───────────────────────────────────────────────────────────┐
│              Locations Command Bar                         │
│  [Search: ________________________________]  [Filters]   │
├──┬─────────┬──────────────────────────┬───────────────────┤
│  │  Ops    │                          │   Intelligence    │
│  │  Rail   │      Map Canvas          │     Drawer        │
│  │         │                          │                   │
│  │  [🧭]   │   ┌──────────────────┐   │   Selected:       │
│  │  [📍]   │   │                  │   │   [Entity Name]   │
│  │  [📐]   │   │  Google Maps     │   │                   │
│  │  [🔍]   │   │  Canvas          │   │   Type: Client    │
│  │         │   │                  │   │   Status: Active   │
│  ├─────────┤   │  [Markers]       │   │   Last Visit: ... │
│  │  Layer  │   │  [Overlays]      │   │                   │
│  │  Panel  │   │  [Clusters]      │   │   [Actions]       │
│  │         │   └──────────────────┘   │                   │
│  │ ☑ Users │                          │                   │
│  │ ☑ Clien │                          │                   │
│  │ ☑ Inspe │                          │                   │
│  │ ☑ Devic │                          │                   │
│  │ ☐ Teams │                          │                   │
│  │ ☐ Weath │                          │                   │
│  │ ☐ Hazar │                          │                   │
└──┴─────────┴──────────────────────────┴───────────────────┘
```

### The Locations Command Bar

A horizontal toolbar above the map providing:
- **Search field**: Geocoding and entity search. Type an address, a property name, or a team member's name to locate it on the map.
- **Filter controls**: Refine visible markers and overlays based on entity type, status, date range, or other metadata.

### The Operations Rail

A narrow vertical toolbar on the far left providing map interaction tools:
- **Navigate** (compass icon): Default tool — pan and zoom the map
- **Pin** (pin icon): Drop a manual pin at a specific location
- **Measure** (ruler icon): Distance and area measurement tool
- **Search** (magnifier icon): Focused search within visible bounds

The active tool is highlighted. Only one tool is active at a time.

### The Layer Toggle Panel

A vertical panel (264 pixels wide, visible on medium and larger screens) providing checkboxes for map layer visibility. Each layer controls a category of map markers:

| Layer | Default | Description |
|-------|---------|-------------|
| **Users** | ☑ On | Team member positions (where applicable) |
| **Clients** | ☑ On | Client property locations and associated metadata |
| **Inspections** | ☑ On | Inspection sites with status-color-coded markers |
| **Devices** | ☑ On | Connected device locations (future: SRT devices) |
| **Teams** | ☐ Off | Team territory boundaries and coverage zones |
| **Weather** | ☐ Off | Weather overlay with precipitation and wind data |
| **Hazards** | ☐ Off | Known hazard zones (flood plains, industrial areas) |

Layers can be toggled independently, allowing you to compose exactly the view you need. Showing only "Inspections" and "Weather" creates a focused view of where your inspections are and what weather conditions apply to each location.

### The Map Canvas

The central map area renders a Google Maps instance with:
- Standard map interaction (pan, zoom, tilt, rotate)
- Custom markers for each active layer, styled with OVERSCITE's visual design language
- Cluster groups when zoom level produces too many individual markers
- Click interaction on markers to select entities

### The Intelligence Drawer

A right-side panel (320 pixels wide, visible on extra-large screens) that displays contextual intelligence for the currently selected map entity.

When you click a marker on the map, the Intelligence Drawer populates with:
- **Entity name** and type (Client, Inspection, User, Device)
- **Address** and geographic coordinates
- **Status** (active, scheduled, completed, archived)
- **Last activity** timestamp
- **Related records** (inspections at this location, assigned team, etc.)
- **Available actions** (navigate to inspection, contact client, schedule visit)

The Intelligence Drawer transforms the map from a passive visualization into an operational command surface. You can see a client's property on the map, click it, review the associated inspection history in the Intelligence Drawer, and take action — all without navigating away from the Locations interface.

---

## 8.4 Practical Use Cases

### Use Case 1: Route Planning

An inspector with five inspections scheduled for the day opens Locations OverSCITE with the "Inspections" layer enabled. The five inspection locations appear on the map, color-coded by status. The inspector can visually assess the optimal travel route, check for geographic clustering that allows efficient sequencing, and toggle the "Weather" layer to see if any locations face adverse conditions.

### Use Case 2: Coverage Assessment

A team manager opens Locations with the "Teams" layer enabled to review territory coverage. The map shows team boundaries and member positions, revealing gaps in coverage or areas where teams overlap. The manager can use this view to inform resource reallocation or new hire placement decisions.

### Use Case 3: Hazard Awareness

Before dispatching a team to a new property, the dispatcher enables the "Hazards" layer to check whether the location falls within known hazard zones (flood plains, seismic zones, industrial contamination areas). This pre-dispatch awareness prevents surprises in the field and demonstrates due diligence in team safety.

### Use Case 4: Client Portfolio View

A regional manager enables only the "Clients" layer to see the geographic distribution of their client portfolio. Clicking individual client markers reveals inspection history, outstanding issues, and scheduling status through the Intelligence Drawer. This spatial view often reveals patterns that are invisible in tabular data — geographic clustering of similar building types, regional variation in inspection frequency, or underserved areas.

---

## 8.5 Current Truth State

Locations OverSCITE is in a **[PARTIAL]** implementation state. The following aspects are complete:

- ☑ Full five-component interface architecture
- ☑ Layer toggle system with seven defined layers
- ☑ Operations rail with four tools
- ☑ Command bar with search stub
- ☑ Intelligence drawer with entity detail pattern
- ☑ Responsive layout (panel auto-hiding on smaller viewports)

The following aspects require external configuration or further integration:

- ☐ Google Maps API key configuration (required for map rendering)
- ☐ Geocoding API connection (for address-to-coordinates conversion)
- ☐ Live entity data integration (currently, entity positions are structural)
- ☐ Real-time position tracking for team members and devices
- ☐ Hazard zone data source integration

When the API key is configured, the map canvas renders and the interface becomes fully interactive. The layer panel, operations rail, and intelligence drawer function regardless of map status — their state management is independent of the map rendering engine.

---

## 8.6 Chapter Summary

Locations OverSCITE is OVERSCITE's geospatial command surface. It layer operational data — inspections, clients, teams, devices, weather, and hazards — onto a geographic canvas that supports spatial reasoning about field operations. The intelligence drawer converts passive map viewing into active operational decision-making by providing contextual data and actions for each map entity.

The system is architecturally complete with seven map layers, four interaction tools, and a structured intelligence drawer. Full activation requires Google Maps API configuration, which the system communicates honestly rather than masking with fake map imagery.

This concludes Volume 4 and Phase A of the manual. In Volume 5, we examine the SRT data pipeline and the truth-state system that governs data integrity across the platform.

---

*Previous: [Chapter 7 — Weather Command](ch07-weather-command.md)*  
*Next: [Chapter 9 — The SRT System](../vol-05-data-sensors/ch09-srt-system.md)*
