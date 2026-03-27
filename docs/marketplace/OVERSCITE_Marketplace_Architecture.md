# OVERSCITE Global — Marketplace Architecture
**UTCB-S V1.0 | Canonical Reference | Implementation Status: LIVE (Phase 1 Foundation)**

---

## Overview

OVERSCITE Global operates two distinct commercial planes within a single governed ecosystem shell:

| Plane | Name | Domain |
|---|---|---|
| Plane 1 | **Field Market** | Labor/dispatch exchange for OVERSCITE-contracted field agents and operators |
| Plane 2 | **Marketplace** | Capability/entitlement commerce — LARI Keys, modules, and platform access |

These planes share identity (ARC/OVERSCITE), shell DNA, billing event architecture, BANE audit patterns, notification infrastructure, and entitlement ledger infrastructure. They must never be collapsed into a single generic commerce feed.

---

## System Bifurcation Doctrine

The following entities, status systems, workflows, and queues are **permanently separated**:

| Subject | Field Market | Marketplace |
|---|---|---|
| Core entity | JobListing | CapabilityProduct |
| Status type | `FieldMarketStatus` | `MarketplaceStatus` |
| Transaction | Labor transaction / payout | License / entitlement issuance |
| Moderation queue | `job_review_queue` | `product_review_queue` |
| Financial output | PayoutRecord | EntitlementRecord + OrderRecord |
| Reputation signals | Completion rate, reliability | Product adoption, stability |
| Actor context | Dispatch, field_agent, client_buyer | org_buyer, module_publisher, license_auditor |

**Prohibited collapse:**
- Single listing type for all marketplace entities
- Single status vocabulary across labor and licensing
- Single payment path ignoring transaction class
- Single moderation queue without trust-class distinction

---

## Shared Infrastructure (Governed)

| Layer | Shared Component |
|---|---|
| Identity | ARC/OVERSCITE context |
| Shell | Navigation, layout, design tokens |
| Billing | `market_billing_events` — event architecture only; charge semantics differ |
| Audit | `market_audit_events` — BANE-governed, Admin SDK append-only |
| Notifications | Event subscription via `notification_core` |
| Entitlement ledger | Shared collection; `order_plane` field distinguishes origin |

---

## Collection Registry

| Collection | Plane | Description |
|---|---|---|
| `market_jobs` | Field Market | Job listings |
| `market_job_offers` | Field Market | Dispatch offers |
| `market_agent_profiles` | Field Market | Field agent profiles |
| `market_availability` | Field Market | Agent availability windows |
| `market_reputation_packets` | Shared | Review/trust signals |
| `market_orders` | Shared | Commercial orders (both planes, `order_plane` field) |
| `market_transactions` | Shared | Transaction records |
| `market_payouts` | Field Market | Labor-side disbursements |
| `market_disputes` | Shared | Dispute records |
| `market_products` | Marketplace | Capability products |
| `market_product_versions` | Marketplace | Product version history |
| `market_lari_keys` | Marketplace | LARI Key tokens |
| `market_entitlements` | Marketplace | Access entitlement records |
| `market_billing_events` | Shared | Immutable billing events |
| `market_moderation_records` | Shared | Moderation/review records |
| `market_audit_events` | Shared | BANE audit events — Admin SDK write-only |

---

## BANE Gate Map

| Gate | Trigger | Key Checks |
|---|---|---|
| Gate 1 — Listing Visibility | job/product publish | actor role, field completeness, truth-state accuracy |
| Gate 2 — Assignment/Purchase Readiness | dispatch offer, checkout, license request | entity validity, eligibility, no compliance block |
| Gate 3 — Mutation Integrity | price change, payout/entitlement mutation | actor lineage, policy, audit write ready |
| Gate 4 — High Risk Review | standalone auth, enterprise grant, manual override | review authority, reason captured, evidence attached |

---

## Implementation Phases

| Phase | Scope | Status |
|---|---|---|
| Phase 1 | Types, service layer, docs, audit backbone | **COMPLETE** |
| Phase 2 | Field Market UI shell, offer/assignment flows | **COMPLETE** |
| Phase 3 | Marketplace UI shell, LARI Key manager | **COMPLETE** |
| Phase 4 | Orders, Payouts, Keys routes | **COMPLETE** |
| Phase 5 | Cloud Function scaffolds | **COMPLETE** |
| Phase 6 | Payment/entitlement backend pipeline wiring | **OUTSTANDING — backend required** |

---

## Technology Anchors

- Platform: TypeScript + Next.js + Firebase (Firestore + Cloud Functions)
- Auth: ARC identity via Firebase Auth
- Governance: BANE audit channel (`baneChannel.ts`, `policyEngine.ts`)
- Rules: `firestore.rules` — all market collections Admin-SDK-only for writes
