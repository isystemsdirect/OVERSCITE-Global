# Orders, Entitlements, and Payouts Model
**UTCB-S V1.0 | Financial Architecture and Lifecycle Governance**

---

## Financial Architecture Overview

The OVERSCITE Global marketplace financial system operates across two transaction planes:

| Plane | Transaction Type | Outcome |
|---|---|---|
| Field Market | Labor transaction + payout | `PayoutRecord` disbursement to field agent |
| Marketplace | Capability purchase + license | `EntitlementRecord` activation for buyer/org |

Both planes produce `OrderRecord` and `BillingEvent` records. The `order_plane` field distinguishes their origin. Financial state must be server-authoritative at all stages.

---

## Payment Doctrine

**Server-authoritative rule:** No financial state is valid from client-side assertion alone.

| Assertion | Reality | Required |
|---|---|---|
| "Payment pending" | Payment not yet captured | Display as `pending_payment` only |
| "Payment authorized" | Authorization is not capture | Display as `payment_authorized` with disclosure |
| "Order fulfilled" | Entitlement not yet active until backend confirms | Await `payment_captured` + Cloud Function result |
| "Payout ready" | Payout not released until platform conditions met | Display `ready_for_release` — not `released` |
| "Entitlement active" | Entitlement not active until `activateEntitlement` Cloud Function confirms | Display `pending` until server write |

---

## Order Lifecycle

```
draft → pending_payment → payment_authorized → payment_captured →
  fulfillment_pending → fulfilled

(Deviations)
  any state → under_review → resolved
  any state → disputed → refunded | resolved
  draft | pending_payment → cancelled
  any state → blocked (policy/compliance gate failure)
```

### Field Market Order
- Line items reference `job_id`
- Fulfillment = assignment confirmed + work completed
- Post-fulfillment: triggers `closeJobAndPreparePayout` Cloud Function
- Payout pipeline separate from order record

### Marketplace Order
- Line items reference `product_id`
- Fulfillment = `activateEntitlement` Cloud Function success
- Entitlement record linked via `entitlement_ref`

---

## Entitlement Lifecycle

```
[Cloud Function: activateEntitlement] →
  EntitlementRecord created (status: pending) →
  Backend validation passes →
  status: active / trial →
  (renewal_state: auto_renew | manual_renew_pending | none)
  → expired / suspended / revoked
```

**Revocation protocol:**
1. `revoke_entitlement` requested by authorized role
2. Gate 3 (Mutation Integrity) evaluated
3. Cloud Function `revokeEntitlement` writes audit event
4. `EntitlementRecord.status` set to `revoked`
5. `revoked_by_arc_id`, `revoked_reason`, `revoked_at` populated — immutable

---

## Payout Pipeline (Field Market)

```
Job completed → closeJobAndPreparePayout Cloud Function:
  1. Compute gross_amount, platform_fee, net_amount
  2. Create PayoutRecord (status: pending | on_hold)
  3. Apply hold_period_days if required
  4. Dispute check — if open: status → dispute_hold
  5. All conditions met → status: ready_for_release
  6. Finance admin authorizes release (Gate 3)
  7. Backend payment provider executes → status: released
  [SCAFFOLD] — payment provider integration required for production
```

---

## Billing Events

`market_billing_events` is an **immutable, append-only** ledger written by Cloud Functions via Admin SDK.

| Event Type | Trigger |
|---|---|
| `price_computed` | Order created with line item totals |
| `payment_authorized` | Payment authorization recorded |
| `payment_captured` | Payment captured |
| `payment_failed` | Payment attempt failed |
| `refund_initiated` | Refund request submitted |
| `refund_completed` | Refund completed |
| `dispute_opened` | Dispute initiated |
| `dispute_resolved` | Dispute closed |
| `fee_computed` | Platform fee computed |
| `payout_computed` | Net payout computed |
| `payout_released` | Payout disbursed |

Each event carries `order_id`, `actor_id`, `amount`, `currency`, `timestamp`.

---

## Dispute and Hold State

- Dispute hold state is visible to authorized financial actors only (`finance_admin`, `platform_super_admin`)
- `dispute_hold` on `PayoutRecord` prevents release
- Dispute resolution requires Gate 4 (High Risk Review) — reason + evidence required
- All dispute actions produce immutable audit events
- Resolution does not automatically release payout — release is a separate governed action

---

## Refund and Reversal

- Refunds preserve audit lineage — no silent reversals
- Refund path: Gate 3 (actor lineage, reason captured) → Cloud Function → `OrderRecord.status: refunded` + `BillingEvent`
- For Field Market: if work was completed, partial refund conditions may apply (defined in `payout_terms`)
- `reversed` PayoutRecord requires `revoked_reason` and actor identification

---

## Implementation Truthfulness Summary

| Feature | Status | Disclosure |
|---|---|---|
| Order display (read) | `[LIVE]` | Reads from `market_orders` |
| Payment capture (write) | `[SCAFFOLD]` | Requires payment provider integration |
| Entitlement activation | `[SCAFFOLD]` | `activateEntitlement` Cloud Function stub |
| Payout computation | `[SCAFFOLD]` | `closeJobAndPreparePayout` Cloud Function stub |
| Payout release | `[SCAFFOLD]` | Payment provider disbursement not yet wired |
| Billing events | `[SCAFFOLD]` | Written by Cloud Function stubs — provider not wired |
