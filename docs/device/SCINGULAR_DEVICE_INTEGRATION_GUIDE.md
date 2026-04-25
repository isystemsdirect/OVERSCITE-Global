# SCINGULAR™ Device Integration Guide

## Purpose
Provides the architectural and protocol requirements for integrating physical hardware devices (drones, sensors, controllers) into the SCINGULAR™ ecosystem.

## Current Truth-State
Hardware integration is currently restricted to **Dry-Link** (metadata-only) and **Simulation** modes. There is no active command pathway to physical devices.

## Canon Position
### SCIMEGA™ Physical Laboratory (PL)
The Physical Laboratory is the governed physical laboratory environment where hardware embodiment and device modeling are represented.

### Integration Requirements
1. **Adaptive Profile**: Every device must have a SCIMEGA™ PL profile defining its capabilities and communication channels.
2. **Safety-Signal Priority**: All devices must support the Pilot Interrupt Protocol (PIP) and TEON safety overrides.
3. **Identity Binding**: Every device session must be bound to an ARC-certified operator.
4. **Dry-Link Compliance**: Devices must operate in a metadata-only mode until the Reality Bridge is explicitly unlocked.

## Implementation Status
- **PL Boundary Modeling**: Implemented in `src/lib/scimega/pl/`.
- **TelePort Nodes**: WebSocket bridge for inbound telemetry is active.
- **Protocol Stubs**: MAVLink and MSP message structures are modeled for simulation.

## Known Limitations
- **No Command Outbound**: All `sendCommand` paths are logically and physically locked.
- **Limited Sensor Profiles**: Only a subset of DJI and ArduPilot sensors are currently modeled.

## Next Required Work
- **Hardware Profile Registry**: Create a centralized repository of validated device profiles for the XSCITE™ builder.
- **Protocol Verification**: Implement automated bit-level verification for simulated MAVLink messages.
