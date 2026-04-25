# SRT Universal Capture Doctrine

## Purpose
Defines the doctrine for Sensor-Reality-Truth (SRT) capture, ensuring that all data captured from the physical world is attributable, high-integrity, and forensic-ready.

## Current Truth-State
SRT capture is currently implemented via DocuSCRIBE™ (human-guided capture) and SCIMEGA™ (simulated/dry-link telemetry capture).

## Canon Position
The SRT doctrine requires:
- **Direct Witnessing**: Every data point must be witnessed by a governed engine (LARI-ArcHive™).
- **Contextual Binding**: Data without location, time, and human authority (ARC) is considered "Unverified" and rejected for forensic use.
- **Truth-State Integrity**: Sensors must operate under BANE oversight to prevent spoofing or unauthorized manipulation.

## Implementation Status
- **DocuSCRIBE™ Integration**: All report artifacts are SRT-compliant by default.
- **SCIMEGA™ Replay**: Uses SRT-captured manifests for mission review.
- **LARI-ArcHive™ Binding**: The core engine for enforcing SRT integrity on outbound data.

## Known Limitations
- **No Hardware Sensor Validation**: In v0.1.2, we cannot verify the physical integrity of a sensor (e.g., detecting a blocked camera).
- **Simulation Reliance**: High-fidelity SRT testing currently relies on the accuracy of the SCIMEGA™ simulation environment.

## Next Required Work
- **Sensor Fingerprinting**: Implement logic to uniquely identify and verify individual sensors via their hardware signatures.
- **Forensic Hash-Chain**: Implement a rolling hash-chain for real-time telemetry to prevent mid-session data tampering.
