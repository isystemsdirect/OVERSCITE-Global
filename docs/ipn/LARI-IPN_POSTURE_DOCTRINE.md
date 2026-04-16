# LARI-IPN Posture Doctrine

## Core Law
OVERSCITE never releases base safety protocols. No posture bypasses BANE, relaxes identity binding, or suspends audit lineage. Posture may adapt; safety may not.

## Operational Posture States

### Aggressive (Default)
- **Meaning**: Default full-governance posture with maximum native IPN enforcement and strict route preference.
- **Constraints**: Enforces strictest capability bounds. Requires devices to be strictly SRT bound for high clearance.

### Controlled
- **Meaning**: Constrained interoperability posture when external networking conflicts exist but the safety core remains locked.
- **Constraints**: Accommodates environmental exceptions but preserves zero-trust admission gating.

### Controlled_Open
- **Meaning**: High-conflict interoperability posture when exterior VPN or external network constraints force compatibility concessions without releasing the safety core.
- **Constraints**: Requires explicit Director-level override due to high-risk profile.

## Visibility
IPN Postures are rendered truthfully in the OverHUD `IPNGovernancePanel`, displaying active protocol and policy versions, alongside BANE enforcement integrity.

## Revocation and Enforcement Boundaries

To preserve accountability and blast-radius control, IPN explicitly distinguishes between termination, diagnostic isolation, and environment adaptation:

### REVOKE
- **Classification**: Explicit Termination of Trust.
- **Semantics**: Immediately invalidates the cryptographic trust identity of the target (Device, Session, Workspace, or Global). It completely terminates connection and rejects subsequent re-auth attempts until a new provisioning cycle clears the ledger. It is irreversible short of a new lifecycle.
- **Execution Level**: Requires explicit ARC identity and logged Authority Basis. Global/Workspace scopes require Director-level authority.

### QUARANTINE
- **Classification**: Diagnostic Isolation.
- **Semantics**: Does not terminate trust but severely bounds transport capability to read-only diagnostics (`READ_TELEMETRY`, `REQUEST_CONFIG`). The entity is untrusted for data payload operations, but allowed to remain visible for inspection.
- **Execution Level**: Utilized during suspected anomaly investigation. Reversible upon clearance. 

### RESTRICT (Posture Downgrade)
- **Classification**: Environment Adaptation.
- **Semantics**: Does not revoke trust or quarantine the device. Forces the device target into a tighter operational bound (e.g., from `Aggressive` down to `Controlled` or limiting available transport channels) in response to environmental risk without severing the session.
- **Execution Level**: Normal BANE adaptive response.
