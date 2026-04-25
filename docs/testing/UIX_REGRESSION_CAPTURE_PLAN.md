# UIX Regression Capture Plan

## Purpose
Defines the strategy for capturing and validating the UIX of the SCIMEGA™ Unified Command Surface to prevent regression in authority visibility or operational safety.

## Current Truth-State
UIX is currently validated through manual operational walkthroughs and visual inspection of the authority/safety timeline.

## Canon Position
The UIX must satisfy the following "Sovereignty Requirements":
1. **Absolute Authority Visibility**: The active control authority (ARC, BANE, TEON) must always be visible.
2. **Safety Critical Alerts**: TEON violations must preempt all other UI states.
3. **Pilot Interrupt Accessibility**: The PIP (Pilot Interrupt Protocol) button must be physically accessible on the primary rail at all times.
4. **No-Execution Disclaimer**: The simulation boundary must be persistently signaled.

## Implementation Status
- **Unified Command Surface**: Consolidates all controls into a single view.
- **Authority Timeline**: Real-time display of governance state transitions.
- **Visual Cues**: Color-coded severity states for the command rail (Gray: Simulation, Red: TEON, Amber: BANE).

## Known Limitations
- **Responsive Scaling**: Some rails may experience crowding on low-resolution displays.
- **Dark Mode Only**: The UIX is currently optimized for a high-fidelity dark operational environment.

## Next Required Work
- **Visual Diff Testing**: Implement automated visual regression testing for the command surface.
- **Accessibility Audit**: Verify that all authority signals are distinguishable for users with color vision deficiencies.
