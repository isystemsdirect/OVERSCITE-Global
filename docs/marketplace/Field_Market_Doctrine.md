# Field Market Doctrine
**UTCB-S V1.0 | Plane 1: Labor/Dispatch Exchange**

---

## Classification

The Field Market is the labor/dispatch exchange for active OVERSCITE-contracted field agents and operators. It is an operationally sensitive, human-accountable work-routing environment — not a general freelancer platform.

**Trust class:** Labor exchange — dispatch-governed, org-bound, geo-aware, payout-bearing.

---

## Entity Model

| Entity | Collection | Description |
|---|---|---|
| `JobListing` | `market_jobs` | Work opportunity with location, schedule, payout, credential requirements |
| `DispatchOffer` | `market_job_offers` | Governed assignment proposal to a specific agent |
| `FieldAgentProfile` | `market_agent_profiles` | Operator profile with credentials, geo coverage, availability |
| `AgentAvailability` | `market_availability` | Schedule windows and territory definition |
| `ReputationPacket` | `market_reputation_packets` | Review/performance/trust signals |
| `PayoutRecord` | `market_payouts` | Labor disbursement record — payout release requires backend pipeline |

---

## Job Lifecycle States (`FieldMarketStatus`)

```
draft → review_required → live → offered → accepted → assigned → in_progress → completed → closed
                                                     → declined  (back to live/offered)
                    → blocked (policy gate failure)
                    → archived
```

**Invariants:**
- `offered` ≠ `assigned` (offer must be accepted and committed)
- `completed` ≠ `payout_released` (hold conditions may apply)
- `draft` must not appear as live commercial availability
- `blocked` is systemic — not visually softened to "unavailable"

---

## Offer and Assignment Flow

1. Job published (Gate 1 passed) → status: `live`
2. Dispatcher issues `DispatchOffer` (Gate 2 passed) → offer status: `offered`
3. Agent accepts offer (Gate 2 passed) → job status: `accepted`, offer status: `accepted`
4. Assignment committed → job status: `assigned`
5. Work completed → job status: `completed`
6. Payout prepared (Gate 3 passed) → `PayoutRecord.release_state: ready_for_release`
7. Payout released (backend pipeline) → `PayoutRecord.release_state: released`

---

## Matching and Recommendation Doctrine

Matching is **assistive and bounded**. The system scores fit but must not self-bind assignments.

**Allowed factors:** geo proximity, availability fit, credential fit, equipment/modality fit, response reliability, org preference, urgency weighting.

**Prohibited:** opaque self-authorizing assignment, undisclosed exclusion logic, unreviewable punitive down-ranking.

---

## Trust and Reputation

Field Market reputation signals are **labor-specific** and must not be blended with Marketplace product ratings.

| Signal | Meaning |
|---|---|
| Completion rate | % of accepted jobs completed without cancellation |
| Avg response hours | Time to accept/decline offers |
| Cancellation count | Total cancellations (visible with context) |
| Review count & rating | Verified post-job reviews only |

Reputation signals must remain reviewable. They must not become hidden authority that silently excludes agents.

---

## Financial Doctrine

- **Price computation is server-authoritative.**
- Platform fees must be transparent before commitment (`platform_fee_model.disclosed_to_agent: true`).
- Estimated payout must disclose hold/review conditions.
- Payout release requires backend payment pipeline integration — client display is `[PARTIAL]`.

**Financial truthfulness:**
- Pending ≠ settled
- Completed work ≠ payout released
- Dispute hold state is visible to authorized financial actors only

---

## BANE Gates for Field Market

| Action | Gate | Required |
|---|---|---|
| job publish | Gate 1 | Actor role, field completeness, truth-state |
| issueDispatchOffer | Gate 2 | Entity valid, agent eligibility, no compliance block |
| acceptJobOffer | Gate 2 | Entity valid, org context |
| price/fee change | Gate 3 | Actor lineage, reason, audit write |
| payout release | Gate 3 | Actor lineage, policy validity |
| manual payout override | Gate 4 | Review authority, reason, evidence |
| dispute resolution | Gate 4 | Review authority, reason, evidence |

---

## Security Requirements

- Org-scoped data isolation: agents see offers addressed to them; clients see their org's jobs
- Financial and payout boundaries protected: payout details visible to authorized roles only
- Anti-enumeration: private or restricted job listings must not be discoverable by non-authorized actors
