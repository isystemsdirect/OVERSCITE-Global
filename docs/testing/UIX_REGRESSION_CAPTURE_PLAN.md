# UIX Regression Capture Plan

## Objective
Establish a visual and functional regression baseline for the unified SCIMEGA™ / OVERSCITE™ command surface.

## Core Surfaces
1. **Pilot Intelligence Surface**: Primary mission control and telemetry visualization.
2. **XSCITE™ Drone Builder**: Configuration and capability validation panels.
3. **OverHUD / OverFLIGHT**: Truth-state, status, and distributed flight rails.
4. **DocuSCRIBE™ Document Panel**: Main editing surface and supporting rails.

## Capture Requirements
- **Resolution**: 1920x1080 (HD) and 3840x2160 (4K).
- **Themes**: Dark Mode (Primary).
- **States**: Idle, Active Mission, Alert/Constraint, Pilot Interrupt, Document Editing.
- **Responsive Breakpoints**: Desktop (Wide), Desktop (Standard), Tablet (Portrait).

## Verification Checks
- **Hierarchy Integrity**: Does the primary work region dominate?
- **Restraint Grammar**: Is there unnecessary visual noise or glowing?
- **Yielding Behavior**: Do side rails and OverHUD collapse properly before the work area?
- **Typography Alignment**: Are font sizes and weights consistent with OVERSCITE™ canon?
- **Status Truthfulness**: Does the UI accurately reflect the underlying truth-state (SIM/DRY-LINK)?

## Tooling
- Automated screenshot capture via Playwright/Puppeteer.
- Manual verification for kinetic transitions and animations.
- ArcHive™ witness records for UI state snapshots.
