# Truth-State Registry

## Current System Truth-State [v0.1.2]
| Domain | Active State | Authority | Notes |
| :--- | :--- | :--- | :--- |
| Flight Control | SIMULATION | BANE/TEON | High-fidelity physics-based models |
| Telemetry | DRY-LINK | ARC Authorized | Metadata-only intake from TelePort |
| Autonomy | SIMULATION | BANE/TEON | Pilot Interrupt / Anchor Hold active |
| ArcHive™ | DEVELOPMENT | LARI-ArcHive™ | localStorage vault (non-persistent) |
| ARC Identity | DEVELOPMENT | Hash-Binding | Deterministic hash (non-KMS) |
| Environment | SIMULATION | Weather Intel | Seeded atmospheric conditions |

## Locked Transitions
- **C2 Command Send**: LOCKED (BANE Enforcement)
- **Hardware Provisioning**: LOCKED (Reality Bridge)
- **Live Autonomy**: LOCKED (Director Policy)

## Registry Verification
The truth-state registry is the authoritative source for system-wide state reporting. Any deviation in UI or audit logs from this registry must be corrected as architectural drift.
