# Dual-Repo State Map

## Overview
This document catalogs the state discrepancy between the active working structure (`g:\GIT\isystemsdirect\SCINGULAR-Global`) and the legacy implementation trace (`g:\SCINGULAR-Global`).

### Active Repo (`g:\GIT\isystemsdirect\SCINGULAR-Global`)
- **Status:** Head Branch tracking modernization of system routing, advanced shell gating, and App Router stability.
- **Unstaged changes at fork point:** Several dashboard panels and archive components were dirty, establishing that active development has continued here.
- **Missing Elements:**
  - `src/app/api/weather/` and comprehensive NWS normalization architecture entirely absent or empty stub.
  - Comprehensive inspection component tracking matrices missing.
  - Detailed contractor `PartyIntake` logic missing from the `components/contractor` tree.

### Alternate Repo (`g:\SCINGULAR-Global`)
- **Status:** Static implementation baseline capturing work completed prior to April 15th logic branch out. Contains untracked or unmerged implementation files.
- **Stranded Elements:**
  - `src/lib/weather/` fully realized with providers and registries.
  - Extensive `src/components/contractor` logic implementation.
  - Unmapped shell artifacts intended to fulfill UI consistency.
  - Broad dashboard configurations missing upstream.

## Orchestration Matrix Setup
All components derived from the Alternate Repo will undergo strict file-by-file alignment reviews against the Active Repo structure. Any component causing architectural collapse of the Next.js App Router pattern will be rewritten to conform.
