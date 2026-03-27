# Scing Cloud Core — Hardening Map

> UTCB-G: Scing Governance Wrap, BANE Entry Gate, and Canon-Safe Hardening
> Date: 2026-03-22
> Authority: Director Anderson → Scing → Antigravity (ArcHive™ DL)

## Action Path Inventory

### Legend
- ✅ **Wrapped** — governance gate evaluates, receipts emitted, capabilities checked
- ⚡ **Endpoint-protected** — BANE `enforceBaneCallable` at entry, no inner gate
- ⚠️ **Unwrapped** — exists but not yet governed beyond auth

### Cloud Function Endpoints

| Endpoint | Classification | Gate Status | Notes |
|----------|---------------|-------------|-------|
| `scing.boot` | write | ⚡ Endpoint-protected | BANE auth + session ownership. Gate insertion point: inside `scingBoot` handler |
| `scing.chat` | write | ✅ **Wrapped** | Gate evaluates before orchestration; pre/post receipts |
| `scing.tools` | read | ⚡ Endpoint-protected | Read-only, BANE auth only. No gate needed per policy |
| `aip.handleMessage` | write | ⚡ Endpoint-protected → ✅ | Routes through orchestrator which has gate |
| `healthCheck` | read | ⚡ Endpoint-protected | System health, no sensitive data |

### Tool Invocations

| Tool | Classification | Gate Status | Notes |
|------|---------------|-------------|-------|
| `scing_getSessionHistory` | read | ✅ **Wrapped** | Gate + BANE tool guard + receipts |
| `scing_updateContext` | write | ✅ **Wrapped** | Gate + BANE tool guard + receipts |
| `scing_healthCheck` | read | ✅ **Wrapped** | Gate + BANE tool guard + receipts |

### Internal Operations

| Operation | Classification | Gate Status | Notes |
|-----------|---------------|-------------|-------|
| `session.create` | write | ⚡ Via endpoint | Admin SDK only; classified but gate not inline |
| `session.restore` | read | ⚡ Via endpoint | Ownership validated in sessionManager |
| `session.updateContext` | write | ⚡ Via endpoint | Admin SDK only |
| `session.appendMessage` | write | N/A | Internal — only called by orchestrator after gate |
| `audit emit` | write | N/A | Append-only; self-governance not applicable |
| `governance receipt emit` | write | N/A | Append-only; self-governance not applicable |

### Future / Admin Paths (Not Yet Implemented)

| Path | Classification | Status | Insertion Point |
|------|---------------|--------|----------------|
| `admin.updatePolicy` | irreversible | ⚠️ Not implemented | Must wrap with gate when built |
| `admin.revokeSession` | irreversible | ⚠️ Not implemented | Must wrap with gate when built |
| `admin.deleteAuditRecords` | irreversible | ⚠️ Not implemented | Should never exist; if needed, triple gate |
| `admin.deployFunction` | irreversible | ⚠️ Not implemented | Out of runtime scope |

---

## Governance Layer Summary

### What Is Wrapped

1. **Orchestrator entry** (`scing.chat`) — gate evaluates action, checks capabilities, emits pre/post receipts
2. **All tool invocations** — gate evaluates per-tool classification, BANE tool guard enforces capability, pre/post receipts emitted
3. **Audit trail** — operational events linked to governance receipts via `governanceRef`

### What Remains Open

1. **`scing.boot`** — endpoint-level BANE enforcement only (session creation). Gate insertion ready but not inline.
2. **`scing.tools`** — read-only endpoint, no inner gate per policy (read classification bypasses gate receipt requirements)
3. **Internal session operations** — called only via Admin SDK from governed code paths; not independently gated

### Anti-Drift Controls

1. **Default classification = `sensitive`** — any unclassified action gets elevated scrutiny
2. **`isClassified()` function** — can be used in CI/testing to detect unclassified action paths
3. **Feature flags** — `SCING_GOVERNANCE_ENFORCE` and `SCING_GOVERNANCE_RECEIPTS` allow phased rollout
4. **Audit-only mode** — when `SCING_GOVERNANCE_ENFORCE=false`, gate logs would-be denials but permits

---

## BANE Insertion Points (Future Hardening)

| Component | Current | Future BANE Integration |
|-----------|---------|------------------------|
| Action gate | Rule-based capability check | Swap to `liveBaneEngine.evaluate()` for verdict-based decisions |
| Governance receipts | Firestore append-only | Add BANE WORM integrity hashing on receipt write |
| Tool registry | Static capability requirement | Dynamic policy from BANE policy profiles |
| Session manager | Ownership validation only | Session-level policy snapshots with entitlement checks |
| Audit emitter | Append-only events | BANE SDR (Structured Decision Record) integration |
| System prompt | Hardcoded string | Governed config with versioning and audit trail |

## Capability Escalation by Classification

| Classification | Required Capabilities | Pre-Receipt | Post-Receipt | Provenance |
|---------------|----------------------|-------------|--------------|------------|
| `read` | `bane:invoke` | No | No | No |
| `write` | `bane:invoke` | Yes | Yes | Yes |
| `sensitive` | `bane:invoke`, `tool:db_write` | Yes | Yes | Yes |
| `irreversible` | `bane:invoke`, `tool:db_write`, `tool:external_call` | Yes | Yes | Yes |

---

## Canon Preservation Confirmation

- Scing remains orchestration presence — **not enforcement sovereign**
- BANE enforces boundaries — **does not become independent ruler**
- Governance layer is **separable** from orchestration logic
- Human authority remains **explicit and final**
- All governance language uses **neutral policy terms** — no canon-conflicting terminology
- No autonomous authority introduced — gate enforces **configured policy**, not self-determined rules
