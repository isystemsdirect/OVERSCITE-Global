# Capability Marketplace Doctrine
**UTCB-S V1.0 | Plane 2: Capability/Entitlement Commerce**

---

## Classification

The Marketplace is the capability/entitlement commerce layer for OVERSCITE Global. It is a controlled, premium, entitlement-bearing product environment — not a consumer app store.

**Trust class:** Capability commerce — entitlement-bearing, governance-gated, version-disciplined.

---

## Entity Model

| Entity | Collection | Description |
|---|---|---|
| `CapabilityProduct` | `market_products` | Sellable module, feature pack, or platform access artifact |
| `LariKey` | `market_lari_keys` | Entitlement-bearing capability token |
| `OrderRecord` | `market_orders` | Commercial transaction (order_plane: 'marketplace') |
| `EntitlementRecord` | `market_entitlements` | Access outcome of a capability purchase |
| `ModerationRecord` | `market_moderation_records` | Product review, policy block, fraud flag |

---

## Product Types (`CapabilityProductType`)

- `lari_key` — LARI Key entitlement artifact
- `workflow_pack` — Governed workflow unlock
- `compliance_pack` — Compliance module
- `export_pack` — Data export capability
- `premium_analytics_module` — Advanced analytical layer
- `enterprise_connector` — Governance-gated system integration
- `standalone_deployment_tier` — Platform commercialization authorization layer
- `developer_integrator_package` — Developer/integrator access

---

## Product Lifecycle States (`MarketplaceStatus`)

```
draft → review_required → live → (continued availability)
                                  → beta
                                  → experimental
                                  → restricted
                                  → enterprise_only
                        → deprecated → archived
                        → blocked
```

**Invariants:**
- `draft` must not appear as live commercial availability
- `experimental` must be visibly disclosed — never represented as stable
- `beta` carries explicit stability caveats
- `blocked` is systemic — policy, security, or compliance failure
- `deprecated` must state what replaced it

---

## Entitlement Lifecycle (`EntitlementStatus`)

```
[order fulfilled] → pending → active → [feature access granted]
                           → trial  → active or expired
                           → suspended → active (if reinstated) or revoked
                           → expired → (renewal_state: manual_renew_pending)
                           → revoked (immutable — requires audit trail)
```

**Critical invariants:**
- `pending` is NOT `active` — never display pending as active
- Entitlement activation must be server-authoritative (Cloud Function)
- Client-side optimistic entitlement state is prohibited
- `revoked` is immutable — requires `revoked_by_arc_id` and `revoked_reason`

---

## LARI Key Manager

LARI Keys are governed entitlement tokens tied to specific capability products.

| Function | Implementation Status |
|---|---|
| Key issuance | `activateEntitlement` Cloud Function (SCAFFOLD) |
| Key inventory display | Field read from `market_lari_keys` (LIVE) |
| Org assignment | Via Cloud Function (SCAFFOLD) |
| Activation | Gate 3 + Cloud Function (SCAFFOLD) |
| Revocation | Gate 3 + Cloud Function, requires reason + audit (SCAFFOLD) |
| Dependency checks | Displayed from `dependency_keys` field (LIVE) |

---

## Standalone Deployment Authorization

The Standalone Commercial Layer governs enterprise platform commercialization requests. It is **not a self-service purchase flow**.

1. Requester submits `StandaloneAuthorizationRequest`
2. Request enters `standalone_authorization_queue`
3. `compliance_reviewer` or `enterprise_sales_admin` conducts Gate 4 review
4. Evidence attached, reason captured — immutable record created
5. If approved: `contract_ref` populated, deployment authorization issued
6. [SCAFFOLD] — full approval pipeline wired via Cloud Function; currently review placeholder

---

## Discovery Ranking Doctrine

**Allowed factors:** compatibility, plan relevance, org type relevance, version maturity, usage signal, admin-pinned priority.

**Prohibited:**
- Misrepresenting experimental products as stable
- Burying required governance disclosures
- Hiding compatibility warnings behind rating signals

---

## Pricing Doctrine

- Price computation is **server-authoritative**
- Fees transparent before commitment
- One-time vs. subscription vs. enterprise-contract must be clearly disclosed
- Approval-required products must route to approval flow — not immediate checkout

---

## Publisher and Product Admin

`module_publisher` role may create/update products within their org. State changes to `live` require Gate 1 (Listing Visibility) to pass. Policy review may be triggered by the `product_review_queue`.

---

## BANE Gates for Marketplace

| Action | Gate | Required |
|---|---|---|
| product publish | Gate 1 | Actor role, field completeness, truth-state accurate |
| checkout/license request | Gate 2 | Entity valid, buyer eligibility, no compliance block |
| entitlement activation | Gate 3 | Actor lineage, policy, audit write |
| key revocation | Gate 3 | Actor lineage, reason, audit write |
| enterprise access grant | Gate 4 | Review authority, reason, evidence |
| standalone authorization | Gate 4 | review authority, reason, evidence, contract ref |
| manual entitlement override | Gate 4 | Review authority, reason, evidence |
