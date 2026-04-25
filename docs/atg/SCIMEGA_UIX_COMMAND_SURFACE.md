# SCIMEGA™ UIX Command Surface Definition

## Overview
The SCIMEGA™ UIX Command Surface is the unified operator interface for all drone orchestration, governance visibility, and mission management. It replaces the earlier tab-based navigation model with a single, high-fidelity command surface that prioritizes operational clarity and authority transparency.

## Command Surface Model
The command surface is structured into three sovereign regions:

### 1. Primary Work Region (Center)
The dominant visual area. Displays the currently active domain panel (Builder, Telemetry, Replay, ArcHive™, Dry-Link, Physical Laboratory). The operator's attention is directed here first. Content changes based on domain selection from the grouped command rail.

### 2. Grouped Command Rail (Left)
A vertically organized, domain-grouped control rail. Each group represents a SCIMEGA™ operational domain. Groups are collapsible and icon-first where safe. Active domain is highlighted; inactive domains recede visually. Groups include:
- **Build**: XSCITE™ Builder and capability configuration.
- **Govern**: BANE truth-state, TEON envelope, ARC identity.
- **Observe**: Telemetry intake, Dry-Link status, sensor feeds.
- **Record**: ArcHive™ manifests, replay, audit trail.
- **Simulate**: Terminal simulation, training sandbox.

### 3. Severity-Aware Right Rail
A contextual status column that displays system truth-state, authority flow events, and safety indicators. Uses severity-aware coloring:
- **Blue**: SIMULATION mode active.
- **Amber**: DRY-LINK mode active.
- **Red**: Safety violation or BANE block.
- **Green**: All systems nominal within current posture.

## Authority Visibility
Every command action on the surface is annotated with its authority provenance:
- **Who authorized it** (ARC identity).
- **What governance gates were traversed** (BANE validation, TEON constraint check).
- **What Scing advisory was active** at the time of execution.

The **Authority Flow Trace** component renders this as a real-time timeline within the right rail.

## Scing Presence
Scing is not a sidebar assistant. It is a **dynamic advisory presence** integrated directly into the command surface:
- Contextual alerts appear inline when critical authority or safety decisions are required.
- Scing advisory state is visible in the right rail at all times.
- Scing does not compete with the primary work region; it supports it.

## Operator Experience Rules
1. **Work is the star**: The primary domain panel dominates attention.
2. **Shell does not compete**: Command rail and right rail are subordinate to the work region.
3. **No alert theater**: Status indicators are truthful, not performative.
4. **No decorative motion**: All animation serves operational clarity.
5. **Authority is always visible**: The operator never guesses who authorized what.
6. **Posture is always declared**: The system's current mode (SIMULATION, DRY-LINK, LIVE-LOCKED) is displayed prominently and cannot be hidden.

## Transition History
| Phase | Interface Model | Rationale |
| :--- | :--- | :--- |
| Early Prototype | Tabbed panels | Rapid iteration. |
| Phase 8–10 | Multi-panel with sidebar | Domain expansion outgrew tabs. |
| Phase 11–12 | Unified Command Surface | Authority visibility and operational unity required consolidation. |
