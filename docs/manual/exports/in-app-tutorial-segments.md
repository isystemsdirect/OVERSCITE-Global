# OVERSCITE In-App Tutorial Segments
# Version: 0.1 | Synchronized with Operator Manual v0.1
# Format: Segmented instructional blocks mapped to UI locations
# Usage: Import into onboarding overlay, tooltip system, or contextual help panels

---

## Segment 1: Scing Panel
**UI Location:** Top Command Bar — center element (click to expand)

OVERSCITE SCING PANEL

The Scing Panel is your primary way to communicate with the OVERSCITE system. Click the gold-accented bar in the center of the Top Command Bar to open it. Type requests, ask questions, or issue commands — Scing will coordinate the appropriate system response.

Scing interprets your intent and routes your request to the correct intelligence engine. It maintains conversational context across multiple messages, so you can ask follow-up questions without repeating yourself. Every response is presented for your review — Scing never executes a consequential action without your explicit approval.

The Scing Panel is strictly for interactive conversation. Security alerts, system health, and monitoring information appear in the OverHUD, not here.

---

## Segment 2: OverHUD
**UI Location:** Right-side panel — toggle via Top Command Bar utility actions (right)

OVERHUD — OPERATIONAL VERIFICATION HEADS-UP DISPLAY

The OverHUD is your passive observation surface. It displays system security status, BANE enforcement activity, and operational intelligence without requiring your interaction. Toggle it open from the Top Command Bar.

The OverHUD shows recent security decisions, threat-level indicators, and environment status. Unlike the Scing Panel, it does not accept input — it is designed for ambient awareness. You can keep both the Scing Panel and the OverHUD open simultaneously: Scing floats over the content area while the OverHUD occupies the right column.

If you see an alert in the OverHUD that requires action, open the Scing Panel and ask Scing about it. The OverHUD shows; Scing acts.

---

## Segment 3: Environment and Safety
**UI Location:** Sidebar — Weather route, Locations route

ENVIRONMENT AND SAFETY INTELLIGENCE

OVERSCITE integrates environmental data directly into your operational workflow. The Weather Command Center provides real-time atmospheric conditions, inspection-specific risk scoring, and safety classification — not a generic weather forecast.

The Inspection Risk Index (IRI) weights wind, precipitation, temperature, humidity, and UV exposure according to their impact on field work safety. The Guangel Safety Strip provides a green/red go/no-go classification. Both are advisory — they inform your decision without overriding your professional judgment.

---

## Segment 4: Weather Command
**UI Location:** Sidebar > Tools > Weather (/weather)

WEATHER COMMAND CENTER

The Weather Command Center organizes environmental intelligence across four tabs. The Overview tab displays current conditions, the IRI risk score, and the Roof Surface Temperature Model. The Live Radar tab provides precipitation visualization (requires API keys). The Safety and Risk tab consolidates all safety-relevant data into a single decision view. The 10-Day Forecast tab supports long-range scheduling.

The Roof Surface Temperature Model estimates surface temperatures for common roofing materials based on ambient conditions and solar radiation. This helps inspectors anticipate on-site conditions before arrival. All weather data feeds into SmartSCHEDULER for weather-aware scheduling proposals.

---

## Segment 5: Locations OverSCITE
**UI Location:** Sidebar > Locations

LOCATIONS OVERSCITE — GEOSPATIAL INTELLIGENCE

Locations OverSCITE layers operational data onto a geographic canvas. Toggle seven map layers independently — Users, Clients, Inspections, Devices, Teams, Weather, and Hazards — to compose the spatial view you need.

Click any map marker to open the Intelligence Drawer, which displays contextual data and available actions for the selected entity. The Operations Rail on the left provides navigation, pin-drop, measurement, and search tools. Full map functionality requires a configured Google Maps API key.

---

## Segment 6: Action Approval Flow
**UI Location:** Scing Panel interactions, Inspector Authority Gate

ACTION APPROVAL — HOW GOVERNED EXECUTION WORKS

Every consequential action in OVERSCITE follows a governed flow: you request, Scing coordinates, BANE validates your capability, LARI processes, BANE audits the output, and Scing presents the result for your review. You then approve or reject.

For the most consequential actions — such as finalizing an inspection report — you encounter the Inspector Authority Gate. This requires you to review each AI-generated advisory individually, confirm attestation checkboxes, and digitally sign the record. Once signed, the report is immutable. The system never executes a consequential action without your explicit authorization.

---

## Segment 7: Truth States
**UI Location:** Page Identity Band badges, data panel markers throughout the interface

TRUTH STATES — WHAT THE BADGES MEAN

Every data surface in OVERSCITE carries a truth-state badge indicating its maturity and reliability. There are five states:

LIVE — Real data, fully operational. Use with confidence.

PARTIAL — Architecture complete, partially connected. Explore, but verify limitations.

MOCK — Synthetic data for demonstration. Do not use for professional decisions.

CANDIDATE — System-generated proposal awaiting your review and approval.

ACCEPTED — Human-reviewed and approved. Locked, signed, and auditable.

No feature in OVERSCITE hides its implementation state. When you see a badge, trust it — it tells you exactly how real the data is.
