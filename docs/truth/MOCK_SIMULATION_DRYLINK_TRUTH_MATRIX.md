# Mock / Simulation / Dry-Link Truth Matrix

## Purpose
This matrix clarifies the data-source and authority distinctions between Mock, Simulation, and Dry-Link modes within the SCIMEGA™ and OVERSCITE™ platforms.

## Current Truth-State
Terminology has occasionally drifted; this matrix establishes the definitive boundaries as of v0.1.2.

## Canon Position
| Feature | Mock | Simulation | Dry-Link |
| :--- | :--- | :--- | :--- |
| **Data Source** | Hardcoded/Static | Synthetic/Generative | Real Hardware (Live) |
| **Telemetry** | None | Simulated Stream | Inbound (Read-Only) |
| **Command Out** | Blocked | Blocked | Blocked (Logical Lock) |
| **Hardware** | Absent | Virtual Profile | Physical Node Present |
| **Audit Log** | Local Only | LARI-ArcHive™ Generated | LARI-ArcHive™ Witnessed |

### Key Distinctions
- **Simulation** is used for mission rehearsal and training.
- **Dry-Link** is used for hardware-in-the-loop validation without execution.
- **Mock** is used exclusively for localized development and UI testing.

## Implementation Status
- **Simulation Engine**: Fully active in SCIMEGA™ mission builder.
- **Dry-Link Bridge**: Implemented for TelePort hardware via WebSocket telemetry feed.
- **Logic Gates**: BANE enforcement of these tiers is active in `src/lib/scimega/drylink/`.

## Known Limitations
- **Latency Modeling**: Simulation does not currently model network latency; Dry-Link does.
- **Partial Modes**: Components cannot currently operate in "Mixed" modes (e.g., Simulated FC with Live GPS).

## Next Required Work
- **Unified Mode Toggle**: Consolidate mode selection into a single, high-fidelity UI switch with mandatory BANE acknowledgment.
