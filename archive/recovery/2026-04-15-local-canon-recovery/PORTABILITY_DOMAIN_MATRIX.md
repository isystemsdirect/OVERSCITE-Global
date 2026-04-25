# Portability Domain Matrix

**Execution Batch:** UTCB-S__20260416-141500Z__SCING__011

## Matrix Overview

### 1. NOAA Weather
| Artifact Space | Active (`isystemsdirect`) | Alternate (`g:\SCINGULAR-Global`) | Analysis |
|---|---|---|---|
| `src/app/api/weather/*` | Missing | Present | Missing routing layer in Active. |
| `src/lib/weather/providers/*` | Missing | Present | Fully implemented in Alternate. |
| `src/lib/weather/*.ts` | Empty stubs / partials | Fully Implemented | Alternate has complete implementation. |

### 2. Shell Contract
| Artifact Space | Active (`isystemsdirect`) | Alternate (`g:\SCINGULAR-Global`) | Analysis |
|---|---|---|---|
| `src/components/shell/PageIdentityBand.tsx` | Missing | Present | Alternate contains specific unmerged shell bands. |
| `src/lib/contracts/truth-state-contract.ts` | Present | Present | Requires diff to determine superior implementation. |
| Other shell components | Present | Present | Symmetrical presence, content delta needs checking. |

### 3. Inspections Stack
| Artifact Space | Active (`isystemsdirect`) | Alternate (`g:\SCINGULAR-Global`) | Analysis |
|---|---|---|---|
| `src/components/inspections/` lanes & widgets | Present (Advanced) | Missing | Active repo has significantly advanced structures (`audit-trail-lane`, `recognition-truth-state-badge`). |
| Root inspection paths | Present | Present | Symmetrical. Active repo appears to be further ahead natively. |

### 4. Contractor Stack
| Artifact Space | Active (`isystemsdirect`) | Alternate (`g:\SCINGULAR-Global`) | Analysis |
|---|---|---|---|
| `src/components/contractor/ContractorAdvisoryRegion.tsx` | Present | Missing | Active repo has new structure. |
| `PartyIntake`, `ProposalDrafting`, `GovernanceSetup` | Present | Present | Both have files. Will need to inspect for logic gaps (e.g., missing toast/notification logic in Active). |

### 5. Recognition Stack
| Artifact Space | Active (`isystemsdirect`) | Alternate (`g:\SCINGULAR-Global`) | Analysis |
|---|---|---|---|
| `src/lib/services/recognition-orchestration.ts` | Present | **Missing** | Recognition stack exists predominantly/only in the Active Repo. |
