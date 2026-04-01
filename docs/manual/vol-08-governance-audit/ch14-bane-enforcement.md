# Chapter 14 — BANE Enforcement

*Volume 8: Governance & Audit | OVERSCITE Global User Manual*

---

## 14.1 BANE as an Enforcement Architecture

In Chapter 4, we introduced BANE as a component in the Scing–LARI–BANE triad. This chapter goes deeper — into the enforcement mechanics, the policy profiles, the classification system, and the phased hardening strategy that governs how BANE integrates across the platform.

BANE is not a feature. It is not a toggle. It is the **enforcement architecture** — the structural mechanism by which OVERSCITE ensures that every consequential action traverses a governance gate before executing. Understanding BANE in detail helps you understand why the system behaves as it does and why certain actions require more verification than others.

---

## 14.2 The Fail-Closed Principle

BANE operates on a **fail-closed** principle. When the system encounters an ambiguous situation — an unrecognized capability, an unclassified action, an unresolvable profile — it defaults to denial.

This principle is implemented concretely in the policy engine. The `policyForProfile()` function resolves policy profiles with a fallback to `bane_fog_v1` — the strictest available profile. If a profile ID is missing, misspelled, or not found in the registry, the system applies maximum enforcement rather than permitting the action.

**Why fail-closed matters for operators**: You may occasionally encounter a denial that seems unexpected — an action that you believe should be permitted is rejected. In these cases, the system is erring on the side of caution. The denial is logged as an SDR, and the reason is available for review. It is always preferable for the system to deny a legitimate action (which can be resolved by providing the correct capability) than to approve an illegitimate one.

---

## 14.3 The Classification System

Every action in OVERSCITE is classified into one of four categories. The classification determines the governance requirements:

### Read

**What it means**: Non-mutating data access. Viewing information without changing system state.

**Examples**: Looking up a building code section. Viewing current weather data. Reading an inspection record. Browsing the Scing Panel conversation history.

**Governance requirements**: Basic authentication only. BANE verifies that the requestor is authenticated but does not require capability tokens, governance receipts, or provenance tracking.

**Operator experience**: These actions feel instantaneous and frictionless. No approval gates, no confirmation dialogs.

### Write

**What it means**: State-changing operations that are reversible or bounded.

**Examples**: Creating a new inspection record. Adding a finding to an inspection. Scheduling a calendar booking. Updating client contact information.

**Governance requirements**: Authentication + pre-gate governance receipt + post-gate governance receipt + provenance tracking. BANE records that the action was requested, that it was permitted, and that it completed.

**Operator experience**: These actions proceed smoothly but generate audit records. You may see a brief confirmation indicator.

### Sensitive

**What it means**: Operations involving personally identifiable information (PII), compliance-critical data, or elevated access.

**Examples**: Accessing inspector credentials. Viewing financial records. Modifying user roles. Accessing security audit logs.

**Governance requirements**: All `write` requirements + elevated capability requirement (`tool:db_write`). BANE checks for additional capability tokens beyond basic invocation rights.

**Operator experience**: You may see a capability verification step. The action proceeds if your profile includes the required capabilities.

### Irreversible

**What it means**: Actions that cannot be undone once executed.

**Examples**: Finalizing an inspection report (locks content permanently). Publishing a report to a client. Revoking a user's access. Deleting a capability token.

**Governance requirements**: All `sensitive` requirements + additional capability (`tool:external_call`). Triple governance: pre-receipt, post-receipt, and provenance tracking, all with full audit metadata.

**Operator experience**: You will encounter explicit confirmation steps — checkbox attestations, digital signature buttons, and clear warnings about irreversibility. The Inspector Authority Gate (Chapter 11) is an example of an `irreversible` action's operator experience.

---

## 14.4 Capability Tokens

BANE uses a **capability-based authorization model** rather than traditional role-based access control (RBAC). The distinction matters:

**In RBAC**: You have a role (e.g., "Inspector"), and the role grants access to a set of resources. If you are an Inspector, you can access all inspector-level resources.

**In capability-based auth**: You hold specific capability tokens that grant specific permissions. Having the `inspection.view` capability does not automatically grant `inspection.finalize`. Each capability is explicitly granted and can be explicitly revoked.

This approach provides finer-grained control. Two inspectors can have different capability profiles — one may be authorized to finalize reports (`inspection.finalize`), while another may only be authorized to capture findings (`inspection.capture`). The system does not assume that all members of a role have identical permissions.

Common capability tokens in OVERSCITE:

| Token | Grants |
|-------|--------|
| `bane:invoke` | Basic system access (all operations require this) |
| `inspection.view` | Read access to inspection records |
| `inspection.capture` | Write access to add findings and evidence |
| `inspection.finalize` | Irreversible authority to sign and lock reports |
| `tool:db_write` | Elevated write access to governed collections |
| `tool:external_call` | Authority to trigger external integrations |
| `contractor.manage` | Write access to contractor party records |
| `calendar.schedule` | Write access to create and modify bookings |

---

## 14.5 Organizational Boundary Checks

BANE enforces identity-level boundary checks that prevent cross-organizational access:

**ARC identity verification**: Users with ARC (Accountable Responsible Contact) prefixed identities (`arc-*`) are subject to ARC-specific policy profiles. If a non-ARC user attempts to access an ARC-restricted capability profile, BANE forces strict mode regardless of the profile's default settings.

**OVERSCITE admin verification**: Administrative functions check for OVERSCITE admin identity (`os-admin-*` prefix). This prevents standard operators from accessing administrative surfaces even if they somehow navigate to the admin route.

These checks are implemented as identity-layer enforcement — they operate before the action classification system, creating a two-level security check: identity verification first, then capability verification.

---

## 14.6 The Hardening Map

BANE's integration across the platform follows a structured hardening progression. The current state of BANE integration is tracked in the Hardening Map:

### Fully Wrapped (✅)

These paths have complete governance: gate evaluation, capability checking, and pre/post governance receipts.

- `scing.chat` — All conversational orchestration passes through the governance gate
- All tool invocations (`scing_getSessionHistory`, `scing_updateContext`, `scing_healthCheck`) — Full BANE tool guard + receipts

### Endpoint-Protected (⚡)

These paths have BANE authentication at the entry point but do not have inline governance gates:

- `scing.boot` — Session creation is BANE-authenticated but the gate is not yet inline
- `scing.tools` — Read-only endpoint, no inner gate per policy (reads bypass receipt requirements)
- `aip.handleMessage` — Routes through the orchestrator, which has the gate

### Not Yet Implemented (⚠️)

These administrative paths are planned but not yet built. When implemented, they will require maximum governance:

- `admin.updatePolicy` — Must wrap with gate
- `admin.revokeSession` — Must wrap with gate
- `admin.deleteAuditRecords` — Should never exist; if needed, triple gate

### Anti-Drift Controls

BANE includes mechanisms to prevent governance drift over time:

1. **Default classification = `sensitive`**: Any unclassified action gets elevated scrutiny automatically
2. **`isClassified()` function**: Can detect unclassified action paths in testing
3. **Feature flags**: `SCING_GOVERNANCE_ENFORCE` and `SCING_GOVERNANCE_RECEIPTS` allow phased rollout
4. **Audit-only mode**: When `SCING_GOVERNANCE_ENFORCE=false`, the gate logs would-be denials but still permits — useful for testing

---

## 14.7 Demon Mode

Demon Mode is BANE's critical threat response mechanism. It activates when the system detects:

- A threat score exceeding 90 (on a 0–100 scale)
- A honeytoken access event (a trap resource that legitimate users should never access)
- Repeated policy violations from the same identity
- Patterns that match known attack signatures

When Demon Mode activates:

1. The affected component or session is immediately isolated
2. All capability tokens issued to the suspect identity are revoked
3. The active session is terminated
4. A comprehensive incident SDR is created with full forensic metadata
5. Administrative alerting is triggered

**For operators**: You are unlikely to ever encounter Demon Mode. It exists as a safety net for security events that fall well outside normal operational patterns. If you are ever affected by a Demon Mode activation, it means the system detected behavior from your identity that appeared highly anomalous. Contact an administrator to review the incident SDR and resolve the situation.

---

## 14.8 Chapter Summary

BANE enforcement operates through four classification levels (read, write, sensitive, irreversible) with progressively stricter governance requirements. It uses capability-based authorization rather than role-based access control. It fails closed — denying ambiguous requests rather than permitting them. And it includes a structured hardening map that tracks how deeply governance is integrated across every action path in the system.

For operators, BANE's enforcement manifests as confirmation steps for consequential actions, capability verification for sensitive operations, and the recognition that every action in the system is classified, gated, and recorded.

In the next chapter, we examine the audit and traceability system — SVR records, governance receipts, and how the system maintains an unbroken chain of custody.

---

*Previous: [Chapter 13 — SmartSCHEDULER™](../vol-07-scheduling/ch13-smart-scheduler.md)*  
*Next: [Chapter 15 — Audit & Traceability](ch15-audit-traceability.md)*
