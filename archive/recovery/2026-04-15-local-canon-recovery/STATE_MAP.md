# SCINGULAR Recovery State Map
**ID:** UTCB-S__20260416-111800Z__MAP

## Commit Map
| Hash | Role | Branch / Tag Source |
| :--- | :--- | :--- |
| `0eb6c91` | **Synchronized Tip** | `main`, `recovery/post-sync-0eb6c91` |
| `7aeafa5` | **Canon Snapshot** | `v0.4.15-canonlock`, `recovery/local-snapshot-7aeafa5` |
| `2b1427a` | **Baseline Reference** | `recovery/pre-versioning-2b1427a` |

## Lineage Diagram (Conceptual)
```text
(Baseline) 2b1427a
     |
     v
(Snapshot) 7aeafa5  <-- v0.4.15-canonlock (Target Truth)
     |
     |   [Remote Synchronization Event]
     |   (Rebase / Merge / Inject)
     v
(Sync Tip) 0eb6c91  <-- current main (Integrated State)
```

## Branch Definitions
- `recovery/post-sync-0eb6c91`: Freezes the state after remote integration. Used for "what we have now" analysis.
- `recovery/local-snapshot-7aeafa5`: Freezes the required local-canon target. Used for "what we must restore" analysis.
- `recovery/pre-versioning-2b1427a`: Holds the earlier local starting point for lineage continuity checks.

---
*Capture verified by ATG Unit*
