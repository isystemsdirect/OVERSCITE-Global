# SCIMEGA™ Definitions Index

## Core Systems
- **SCIMEGA™**: The Operating System + hardware execution substrate. It provides the foundational capability to interface with and drive drone hardware under strict governance.
- **SCIMEGA™ DOS**: The Disk Operating System layer of SCIMEGA™, managing file storage, manifest persistence, and low-level resource allocation.
- **XSCITE™ Drone Builder**: The OVERSCITE-side command and build surface used to design, configure, and validate drone profiles before mission deployment.
- **Scing Interface**: The upstream Intellectual Unit (IU) interface presence that provides guidance, assistance, and oversight to the human operator.

## Autonomy & Governance (BFI Stack)
- **BFI-Governed Flight Autonomy**: Full automation that is permitted only when it is IU-authorized, BANE-gated, TEON-constrained, and pilot-interruptible.
- **BANE Automation Authority Gate**: The integrity enforcement layer that monitors system truth-state and blocks unauthorized or unsafe autonomous transitions.
- **TEON Flight Safety Envelope**: The kinetic constraint arbitration layer that enforces physical safety boundaries and time-based execution integrity.
- **Pilot Interrupt Protocol (PIP)**: The high-priority mechanism that allows an accountable human to immediately reclaim control from any autonomous mode.
- **Anchor Hold**: A specific BFI-governed mode that maintains a fixed spatial position under BANE/TEON oversight.

## Identity & Authorization
- **ARC (Authority, Responsibility, & Certification)**: The identity binding layer that ensures all high-impact actions are attributed to a certified human.
- **IU Imprint Binding**: The unique cryptographic link between a human's intellectual presence (IU) and the system interface (Scing).

## Communication & Boundaries
- **PL Boundary (Policy Layer)**: The explicit expression of governance constraints and operational rules within the system.
- **Dry-Link**: An activation-aware metadata-only synchronization boundary. It allows real-time telemetry intake without enabling hardware command execution.
- **Reality Bridge**: The controlled and currently non-executing interface between the virtual command surface and physical drone hardware.

## Intelligence Engines
- **ArcHive™**: The governance-anchored witness and archival engine.
- **LARI-ArcHive™**: A super-advanced LARI (Layered Adaptive Resource Intelligence) engine responsible for mission packaging and witness-record generation.
- **ArcHive DL / ArcHive PL**: Expressions of the ArcHive™ engine's governance (Data Link / Policy Layer), not independent authority sources.
