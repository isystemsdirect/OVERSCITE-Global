# SRT Universal Capture Doctrine

## Definition
SRT (Sensor & Remote Telemetry) is the universal capture discipline for all data input within the OVERSCITE™ ecosystem.

## Core Principle: No Interpretation
SRT's sole purpose is the **faithful capture and transport of raw sensor data**. SRT does not interpret, classify, or assess. Interpretation is the domain of LARI engines; assessment is the domain of humans.

## Capture Boundaries
- **Optical**: Raw pixel data, metadata, and exposure parameters.
- **Atmospheric**: Temperature, humidity, pressure, and wind signals.
- **Kinetic**: Acceleration, velocity, and orientation data.
- **Positioning**: Global and local spatial coordinates.
- **Identity**: Biometric, cryptographic, and proximity-based identity signals.

## Evidentiary Chain
SRT-captured data is immediately bound to:
- **Timestamp**: High-precision temporal reference.
- **Location**: Verified spatial reference.
- **Device ID**: Verified hardware source.
- **Operator ID**: The ARC identity responsible for the capture event.

## Witness Integrity
Captured data is hashed and passed to LARI-ArcHive™ for witness recording. Any modification to the data post-capture is detectable via the ArcHive™ record.

## SRT-to-LARI Handover
SRT delivers "Raw Capture Packets" to LARI. LARI then performs analysis (pattern recognition, anomaly detection) to generate "Intel Signals."

## SRT-to-BANE Audit
BANE audits the capture process to ensure compliance with mission parameters and privacy constraints. Unauthorized capture events are blocked and logged.
