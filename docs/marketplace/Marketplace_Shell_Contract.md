# Marketplace Shell Contract
**UTCB-S V1.0 | UI/UX Design and Interaction Governance**

---

## Navigation Doctrine

Top-level navigation entries for the marketplace system are **canonical and stable**. They must not be renamed, reordered, or collapsed without explicit Director instruction.

| Entry | Route | Plane |
|---|---|---|
| Field Market | `/field-market` | Plane 1 |
| Marketplace | `/marketplace` | Plane 2 |
| Orders | `/orders` | Shared |
| Payouts | `/payouts` | Plane 1 |
| Keys & Entitlements | `/keys` | Plane 2 |

---

## Field Market Shell — Required Regions

Every Field Market page must maintain these regions in consistent layout:

1. **Top Command Bar** — PageHeader with plane identifier, truth-state badge, and primary actions
2. **Market Filter / Coverage Selector** — job type, geo, urgency, status, credential filters
3. **Opportunity Feed / Map / Schedule Region** — JobListing cards with FieldMarketStatus badges
4. **Offer / Dispatch / Assignment Panel** — Accept/decline/counter controls (BANE-gated)
5. **Reputation / Compliance Context Panel** — Agent trust signals, credential verification

---

## Marketplace Shell — Required Regions

Every Marketplace page must maintain these regions in consistent layout:

1. **Top Command Bar** — PageHeader with plane identifier, truth-state badge, and primary actions
2. **Capability Catalog / Category Selector** — Product type filter, compatibility filter
3. **Product Detail Region** — Product card with pricing, entitlement scope, governance annotations
4. **Purchase / License / Entitlement Panel** — Order flow or approval-required flow (BANE-gated)
5. **Compatibility / Governance / Truth-State Context Panel** — Disclosure of requirements, version, restrictions

---

## Card Hierarchy

### Field Market Job Card (`FieldMarketStatus` badge mandatory)
- Job type icon + title
- Org/client context
- Location + geo distance (when available)
- Schedule window
- Payout display (gross — fee → net)
- Status badge (`FieldMarketStatus`)
- Urgency indicator
- Primary action: View Details / Submit Interest / Accept Offer (role-governed)

### Marketplace Product Card (`MarketplaceStatus` badge mandatory)
- Product type icon + name
- Publisher org
- Pricing model display (one-time / subscription / enterprise-review)
- Entitlement scope summary
- Compatibility requirements (plan tier, role, LARI Key)
- Status badge (`MarketplaceStatus`)
- Primary action: View / Request / Purchase (role and eligibility governed)

---

## Action Hierarchy

Consistent across both planes — actions ordered by commitment level:

1. **View / Browse** — no commitment, always available
2. **Express Interest / Add to Consideration** — soft signal, reversible
3. **Request Access / Submit Interest** — formal request, routed to review
4. **Accept / Purchase / License** — binding commitment (BANE Gate 2 required)
5. **Approve / Override / Revoke** — administrative / high-risk (BANE Gate 3 or 4 required)

Button meaning must not vary by route. `Accept` always means accept. `Purchase` always means initiate purchase.

---

## Truth-State Label Standards

All status badges must use the canonical vocabulary from `Marketplace_Truth_State_Vocabulary.md`.

- Never display `draft` in a public feed
- Never soften `blocked` to "unavailable" or "coming soon"
- Never display `experimental` without an explicit disclosure notice
- Never display `pending` entitlement as `active`
- Always use `[PARTIAL]` or `[SCAFFOLD]` labels on surfaces where backend pipeline is unimplemented

---

## Uniformity Rules

| Rule | Applies To |
|---|---|
| Both planes must feel native to the same sovereign ecosystem | All routes |
| Field Market must feel operational and dispatch-grade | `/field-market` |
| Marketplace must feel controlled, premium, and capability-grade | `/marketplace`, `/keys` |
| Neither plane may devolve into generic startup marketplace aesthetics | All routes |
| Empty/loading/blocked states must follow the same doctrine | All routes |
| Hover states and micro-interactions must be consistent | All cards and buttons |

---

## Anti-Drift Rules

- Do not let Field Market become visually casual or consumer-grade
- Do not let capability commerce become decorative fluff
- Do not vary button meanings between routes
- Do not change review-state wording between job and product flows
- Do not introduce plane-specific color semantics that conflict with the design system
- Maintain premium operational identity across desktop, tablet, and mobile
