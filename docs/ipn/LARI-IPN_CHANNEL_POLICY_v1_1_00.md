# LARI-IPN Channel Policy v1.1.00

## Channel Scoping Rules

### 1. Telemetry
- **Posture**: Least restrictive.
- **Access**: `TRUSTED`, `DEGRADED`, `UNKNOWN`, `QUARANTINED`.
- **Constraint**: Read-mostly environment parameters and sensor baselines.

### 2. Media
- **Posture**: Moderate sensitivity.
- **Access**: `TRUSTED`, `DEGRADED`.
- **Constraint**: Strict identity-bound token required for transit initialization.

### 3. Config
- **Posture**: High sensitivity.
- **Access**: `TRUSTED`, `QUARANTINED`.
- **Constraint**: Requires BANE review. Configuration push logic is structurally decoupled from hardware manipulation.

### 4. Control
- **Posture**: Maximum sensitivity.
- **Access**: `TRUSTED` ONLY.
- **Constraint**: Direct hardware execution. Strict requirement for `EXECUTE_COMMAND` session scope approval by BANE authorization engine. Fails unconditionally if posture dips.
