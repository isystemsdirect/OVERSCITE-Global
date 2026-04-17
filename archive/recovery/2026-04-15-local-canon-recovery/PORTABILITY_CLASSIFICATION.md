# Portability Classification

**Execution Batch:** UTCB-S__20260416-141500Z__SCING__011

## Classifications by Domain

### 1. NOAA Weather
- **Alternate Repo (`src/app/api/weather`, `src/lib/weather/providers`):** `forward-advancement`
- **Alternate Repo (`src/lib/weather/*.ts`):** `forward-advancement`
- **Active Repo (`src/lib/weather/*.ts` empty stubs):** `orphan-fragment` (To be overwritten by alternate)
*Verdict: Full transplant of weather directories from Alternate to Active.*

### 2. Shell Contract
- **Alternate Repo (`src/components/shell/PageIdentityBand.tsx`):** `accepted-remote-structure`
- **Alternate Repo (Other Shell Components):** `legacy-regression` / `hybrid-integrated-truth`
- **Active Repo (Shell Components):** `hybrid-integrated-truth` (Active holds current Next.js App Router context)
*Verdict: Transplant only `PageIdentityBand.tsx` and selectively merge any identified logic deltas in shared shell components.*

### 3. Inspections Stack
- **Alternate Repo (`src/components/inspections`, `src/app/(authenticated)/inspections`):** `legacy-regression`
- **Active Repo (Inspections):** `forward-advancement`
*Verdict: Active repo has advanced significantly past the alternate repo. No transplant required; maintaining Active as canon truth.*

### 4. Contractor Stack
- **Alternate Repo (PartyIntake, workflow files):** `accepted-local-candidate` (pending diff for specific workflow logic and toast implementations)
- **Active Repo (Contractor Stack):** `hybrid-integrated-truth`
*Verdict: Perform targeted file comparison (`diff`) to port over workflow implementation logic into the active files without overwriting the active structure entirely.*

### 5. Recognition Stack
- **Alternate Repo (Recognition):** `orphan-fragment` / `legacy-regression` (Doesn't exist)
- **Active Repo (Recognition):** `forward-advancement`
*Verdict: Active repo holds the advanced, thread-native fixes. No transplant required.*
