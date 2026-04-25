# Truth-State Registry

## Purpose
The Truth-State Registry is the canonical source for identifying which system components are operating in "Truth" mode (live/authenticated) vs "Simulation" or "Dry-Link" modes.

## Current Truth-State
In v0.1.2, the entire execution substrate is restricted to **SIMULATION** and **DRY-LINK**. The registry ensures that no component accidentally assumes it has live authority.

## Canon Position
### Operational Tiers
1. **TRUTH**: Live data, live execution, authenticated human authority. (Inactive for hardware).
2. **DRY-LINK**: Live metadata/telemetry, blocked execution, authenticated human authority.
3. **SIMULATION**: Mock data, blocked execution, virtual authority.

## Implementation Status
| Component | Registry Status | Authority Mode |
| :--- | :--- | :--- |
| **DocuSCRIBE™** | **TRUTH** | ARC-Authenticated |
| **OVERSCITE™** | **TRUTH** | ARC-Authenticated |
| **SCIMEGA™ DOS** | **SIMULATION** | Virtual / Mocked |
| **TelePort Bridge** | **DRY-LINK** | Activation-Aware |
| **Reality Bridge** | **LOCKED** | Physically Disabled |

## Known Limitations
- **Manual Enforcement**: While BANE checks the registry, some components still rely on static environment flags (e.g., `NEXT_PUBLIC_SIM_MODE`).

## Next Required Work
- **Dynamic Registry**: Implement a runtime "Truth Server" that components must poll for their current operational tier.
- **Hardware Interlock**: Link the physical interlock state directly to the Truth-State Registry.
