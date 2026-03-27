# Marketplace Truth-State Vocabulary
**UTCB-S V1.0 | Canonical Status Definitions — Both Planes**

This document is the authoritative reference for all status labels used across the OVERSCITE Global marketplace system. Status vocabulary must be semantically consistent and must not be casually blended between planes.

---

## Field Market Statuses (`FieldMarketStatus`)

| Status | Definition | Visible To | Action Allowed |
|---|---|---|---|
| `draft` | Job created but not submitted for review | Creator, org admin | Edit, submit |
| `review_required` | Submitted for policy/quality review | Reviewer, org admin | Review, approve, block |
| `live` | Published and discoverable in the market feed | All eligible actors | View, offer, claim |
| `partial` | Published in incomplete state with disclosed gaps | All eligible actors | View (read-only sections disclosed) |
| `offered` | A dispatch offer has been issued to an agent | Dispatcher, agent, org admin | Accept, decline, counter |
| `accepted` | Agent accepted the offer; not yet assigned | Dispatcher, org admin | Confirm assignment |
| `assigned` | Formally assigned and committed | All parties | Track, in-progress update |
| `in_progress` | Active work underway | All parties | Status update, evidence capture |
| `completed` | Work finished — payout not yet released | Dispatcher, finance_admin | Payout preparation |
| `under_review` | Under post-completion compliance review | Reviewer, finance_admin | Review action |
| `closed` | Job closed with no further action | Creator, org admin | Archive |
| `blocked` | Systemic policy or compliance block | Admin, compliance_reviewer | Review, unblock with audit |
| `archived` | Historically preserved — no active state | Admin | View only |

**Prohibited conflations:**
- `offered` must not appear as `assigned`
- `completed` must not appear as `payout_released`
- `draft` must not appear in the public feed

---

## Marketplace Statuses (`MarketplaceStatus`)

| Status | Definition | Disclosure Required | Visible To |
|---|---|---|---|
| `draft` | Product under construction | None — not public | Publisher, admin |
| `review_required` | Submitted for approval | None — not public | Reviewer, publisher |
| `live` | Available for purchase/licensing | None | All eligible buyers |
| `beta` | Available with stability caveats | "Beta — functionality may change" | All eligible buyers |
| `experimental` | Early access — not production-ready | "Experimental — not production-ready" | Invited or opted-in users |
| `restricted` | Access limited — requires approval or plan | "Restricted access" | Eligible requesters |
| `enterprise_only` | Requires enterprise contract review | "Enterprise — approval required" | Enterprise-tier orgs |
| `deprecated` | Superseded — active use discouraged | "Deprecated — migrate to [replacement]" | Current entitlement holders |
| `archived` | End of life — no longer available | "Archived" | Admin, legacy holders |
| `blocked` | Policy, security, or compliance block | "Blocked — contact support" | Admin only |

**Prohibited conflations:**
- `experimental` must never appear without its disclosure label
- `draft` must never appear as live commercial availability
- `beta` does not imply support SLA parity with `live`
- `blocked` must not be visually softened

---

## Entitlement Statuses (`EntitlementStatus`)

| Status | Definition | Feature Access | Display |
|---|---|---|---|
| `pending` | Entitlement record created — awaiting backend activation | **None** | "Pending Activation" |
| `active` | Entitlement activated by server-authoritative Cloud Function | **Yes** | "Active" |
| `trial` | Active with time-limited trial scope | **Yes (scoped)** | "Trial Active — expires [date]" |
| `suspended` | Temporarily revoked pending investigation | **No** | "Suspended — contact support" |
| `revoked` | Permanently revoked with immutable audit record | **No** | "Revoked" |
| `expired` | Entitlement period ended | **No** | "Expired — renew to restore access" |

**Critical invariant:** `pending` is NOT `active`. Displaying pending as active is a governance violation.

---

## Order Statuses (`OrderStatus`)

| Status | Definition |
|---|---|
| `draft` | Order created but not submitted for payment |
| `pending_payment` | Payment initiated — awaiting authorization |
| `payment_authorized` | Payment authorized — not yet captured |
| `payment_captured` | Payment captured — fulfillment in progress |
| `fulfillment_pending` | Entitlement or assignment fulfillment queued |
| `fulfilled` | Order complete — entitlement or assignment active |
| `under_review` | Order flagged for compliance or fraud review |
| `refunded` | Order reversed with audit lineage |
| `disputed` | Dispute opened — hold state active |
| `cancelled` | Order cancelled — no charge |
| `blocked` | Order blocked by compliance or policy gate |

---

## Payout Statuses (`PayoutStatus`)

| Status | Definition |
|---|---|
| `pending` | Payout record created — hold conditions may apply |
| `on_hold` | Administrative hold |
| `dispute_hold` | Dispute in progress — payout blocked |
| `ready_for_release` | All conditions met — release authorized |
| `released` | Payout disbursed |
| `failed` | Release failed — retry or manual intervention required |
| `reversed` | Payout reversed with audit lineage |

**Critical invariant:** `completed_work` ≠ `released`. Platform release conditions must be met before release.

---

## Implementation Truthfulness Labels

Additional UI labels for surfaces where backend pipeline is incomplete:

| Label | Meaning |
|---|---|
| `[LIVE]` | Fully implemented — server-authoritative state |
| `[PARTIAL]` | Display layer functional — backend fulfillment incomplete |
| `[SCAFFOLD]` | Structure in place — implementation pending |
| `[REVIEW ONLY]` | Viewable — no action pathway yet wired |
| `[MOCK]` | Simulated data — not connected to production state |
