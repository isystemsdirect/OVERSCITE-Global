# OVERSCITE Global — Implementation Truth Matrix

| Route | Classification | Current Maturity | Key Weakness | Target State |
| :--- | :--- | :--- | :--- | :--- |
| `/library` | Tier 1 | Partial System | Mock upload/view actions; no record persistence. | Functional Document Registry MVP |
| `/calendar` | Tier 1 | Partial System | Randomized transient grid; non-functional booking link. | Persisted Operational Scheduler |
| `/finances` | Tier 1 | Mocked Interface | Mock billing/invoice list; fake CTA buttons. | Bounded Billing Visibility Surface |
| `/messaging` | Tier 2 | Empty Shell | Infinite loading spinner; no thread list. | Bounded Message Thread Shell |
| `/admin` | Tier 2 | Partial System | "Coming soon" placeholder for health stats. | Operational Observability Panel |
| `/marketplace`| Tier 3 | Mocked Interface | Fake purchase flow; decorative listing. | Capability & Access Registry |
| `/community` | Tier 4 | Mocked Interface | Fake social interactions (Post, Like). | Read-only / Deferred Shell |
| `/social` | Tier 4 | Mocked Interface | Fake social interactions (Post, Like). | Read-only / Deferred Shell |

## Surface Status Definitions
- **Functional MVP**: Real data persistence, wired actions, and audit-bearing state mutation.
- **Bounded Shell**: Truthful UI with limited, honestly-labeled actions (e.g., "Read Only").
- **Deferred Shell**: Non-deceptive placeholder with clearly labeled inactivity.
