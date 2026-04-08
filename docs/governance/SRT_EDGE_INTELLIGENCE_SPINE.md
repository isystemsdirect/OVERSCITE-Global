# SRT Edge Intelligence Spine Doctrine

> **Authority:** Director Anderson  
> **CDG:** Scing  
> **CB Reference:** UTCB-S__20260408-000000Z__SCING__004  
> **Status:** LOCKED CANON

---

## 1. Core Principle

The edge layer (Firebase / Google Cloud Functions) is elevated into a **sovereign orchestration spine** for accepted SRT media intake. It governs intake transitions, accepted-only queueing, per-image analysis relay, BANE verification sealing, export assembly, retry discipline, and audit lineage. 

**It does NOT grant autonomous authority to any engine.** It choreographs backend transitions; the human remains the sole locus of authority.

## 2. Transition Truth Authority

The client UI captures intent, but the edge functions govern transition truth. 
- Only accepted images become analyzable work items.
- Edge layer routes work to engines but relies on BANE verification gates before allowing state advancement.
- Exports are assembled from canonical structured records in backend databases only.

## 3. The One Image, One Lifecycle Law

Every accepted image routes through its own sovereign processing lifecycle, provenance identity, state history, findings set, verification binding, and audit chain. Candidate captures are specifically excluded from full engine analysis paths. Batch captures remain separate entities through processing pipelines.

### 3.1 Selective Analysis & Token Conservation (CB-005)
Acceptance of a candidate image stores the object, locking that source media record into an `accepted_unanalyzed` resting state. Analysis—and by extension, the expenditure of backend inference tokens—does NOT happen automatically. Engine routing demands an explicit `accepted_analysis_requested` hook triggered directly by human or authorized governed sequence. Unanalyzed images remain completely valid placement data for operational logic.

## 4. Execution State Machine

**Accepted Execution States** strictly transition via `advanceSrtRecordState.ts` monotonically:
1. `accepted_pending_queue` 
2. `intake_in_progress`
3. `stored_source`
4. `derivative_generation_pending` | `derivative_generation_complete`
5. `accepted_unanalyzed` (RESTING)
6. `accepted_analysis_requested` (TRIGGER)
7. `analysis_pending`
8. `analysis_in_progress`
9. `analysis_complete`
10. `findings_recorded`
11. `verification_pending`
12. `verification_bound`
13. `export_ready`
14. `export_generated`

**Exception Paths:**
- `quarantined_failure`: Holds the pipeline pending human review without corrupting the unverified record.
- `retry_scheduled`: Transient failures retry without stepping backwards in the truth machine.
- `terminal_failure`: Blocks the pipeline, requiring manual restart logic via engineering escalation.
