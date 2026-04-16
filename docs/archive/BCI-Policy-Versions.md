# BCI Policy Version Registry

## Current Production Version: 1.1.00

### History

| Version | Date | Changes |
| :--- | :--- | :--- |
| **1.1.00** | 2026-04-14 | Initial foundational build. Operation/Context gating implemented. |
| **1.0.00-baseline** | 2026-04-13 | Preliminary posture validation (manual checks). |

### Policy 1.1.00 Ruleset
- Mandatory attribution for all SIGN/ENCRYPT/DECRYPT operations.
- Restriction of RSA-4096 to `ARCHIVAL_SEAL` role in `backend` environments.
- Default **DENY** for revoked identities or global scope requests.
- Escalation for high-risk archival operations.
