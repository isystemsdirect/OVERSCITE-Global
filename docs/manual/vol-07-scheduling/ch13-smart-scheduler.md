# Chapter 13 — SmartSCHEDULER™

*Volume 7: Scheduling | OVERSCITE Global User Manual*

---

## 13.1 Scheduling in Professional Field Work

Scheduling in the inspection and field operations industry is more complex than arranging appointments on a calendar. It involves:

- **weather sensitivity** — many inspections cannot be safely or accurately conducted in adverse conditions
- **geographic logistics** — route efficiency across multiple inspection sites
- **personnel qualification** — matching the right inspector (by license, certification, specialty) to the right job
- **equipment availability** — specialized instruments must be allocated per-job
- **client coordination** — property access, occupant presence, client representative availability
- **regulatory timing** — some inspections must occur within specific windows relative to construction milestones

SmartSCHEDULER™ is OVERSCITE's scheduling intelligence system, accessible through the Calendar route (`/calendar`). Its truth-state is **[FUNCTIONAL MVP]** — the scheduling interface is fully operational with persisted booking records, a data-driven grid, and validated team filtering.

---

## 13.2 The Calendar Interface

The Calendar route presents a structured scheduling surface with the following components:

**Grid View**: A time-based grid showing scheduled bookings across days, weeks, or months. Each booking block displays its title, time range, location, and status.

**Team Filtering**: The ability to filter the calendar view by team member, showing only the bookings assigned to a specific inspector or team. This is critical for organizations with multiple field teams operating simultaneously.

**Booking Records**: Each scheduled item is a `CalendarBooking` record containing:

| Field | Description |
|-------|-------------|
| `id` | Unique booking identifier |
| `title` | Descriptive title (e.g., "Site Inspection: 123 Industrial Way") |
| `start_at` | ISO 8601 start time |
| `end_at` | ISO 8601 end time |
| `location` | Physical address or virtual room identifier |
| `status` | Booking state: `confirmed`, `pending`, `cancelled`, `completed` |
| `linked_entity_type` | What kind of work: `inspection`, `meeting`, `operational_block` |
| `linked_entity_id` | Reference to the associated inspection, meeting, or operation |
| `created_by` | Human identity that created the booking |

### Linked Entities

Every booking can be linked to an operational entity. This linkage creates bidirectional context:
- From the Calendar, you can see that Tuesday's 9:00 AM booking is linked to Inspection #001
- From the Inspection record, you can see that it has a scheduled appointment on Tuesday at 9:00 AM

This cross-referencing eliminates the common problem of disconnected scheduling — where the calendar says one thing and the inspection system says another.

---

## 13.3 The Proposal vs. Approval Distinction

SmartSCHEDULER™ follows the same governance model as every other OVERSCITE system: **the system proposes, the human approves.**

When Scing assists with scheduling — "Scing, find me the best time to inspect 456 Oak Avenue this week" — the system evaluates available time slots, weather conditions (via the IRI from the Weather Command Center), travel time from other appointments, and inspector availability. It then **proposes** optimal scheduling options.

These proposals are [CANDIDATE] — suggested time slots that the operator evaluates. The system explains why each option was chosen:

- "Tuesday 10:00 AM — IRI is Low (0.18), no conflicts, 15-minute drive from prior appointment"
- "Wednesday 2:00 PM — IRI is Medium (0.52, wind gusts expected), but aligns with client's availability"
- "Thursday 9:00 AM — IRI is Low (0.12), optimal conditions, but conflicts with existing booking"

The operator selects the preferred option and confirms. Only then does the booking become a `confirmed` record. The system never books an appointment without human selection and confirmation.

---

## 13.4 Weather Integration

SmartSCHEDULER™ integrates with the Weather Command Center to provide weather-aware scheduling intelligence:

**Proactive advisories**: When weather conditions are forecast to deteriorate during a scheduled inspection, the system can surface an advisory in the OverHUD: "Tomorrow's 9:00 AM roofing inspection at 123 Main Street may face elevated wind conditions (IRI: Medium)."

**Scheduling optimization**: When proposing time slots, the system weighs IRI scores alongside other factors. A time slot with a Low IRI is preferred over an equivalent time slot with a Medium IRI, all else being equal.

**No auto-cancellation**: The system does not cancel, postpone, or reschedule appointments based on weather data. It alerts and advises. The operator decides whether to proceed, reschedule, or modify the inspection scope. This is a non-negotiable governance constraint.

---

## 13.5 Dependency Handling

Complex projects involve scheduling dependencies — one inspection cannot occur until a prior step is complete:

- A final inspection cannot be scheduled until the rough-in inspection has passed
- A re-inspection cannot be scheduled until the correction period has elapsed
- An occupancy inspection depends on the completion of fire, electrical, and plumbing inspections

SmartSCHEDULER™ tracks these dependencies through the `linked_entity_id` field and the associated inspection lifecycle state. If you attempt to schedule a final inspection for a project whose rough-in inspection is still [CANDIDATE], the system will flag the dependency conflict and recommend resolving it before proceeding.

Dependencies are advisory, not blocking — the system flags conflicts but does not prevent the operator from overriding if professional circumstances warrant it. The override is logged in the audit trail.

---

## 13.6 Booking Types

SmartSCHEDULER™ supports multiple booking types to reflect the variety of scheduled activities in field operations:

| Type | Description |
|------|-------------|
| `inspection` | A scheduled inspection tied to an inspection record |
| `meeting` | A governance review, client meeting, or team briefing |
| `operational_block` | A reserved time block for equipment maintenance, training, or administrative work |

Each type uses the same booking data structure but may display differently in the calendar grid — inspections show risk indicators, meetings show participant counts, and operational blocks show their purpose categorization.

---

## 13.7 Chapter Summary

SmartSCHEDULER™ provides intelligent, weather-aware scheduling that links appointments to operational entities, supports dependency tracking, and integrates weather risk data into scheduling decisions. It proposes optimal time slots but never commits them without human approval. It flags weather risks and scheduling conflicts but never auto-cancels or auto-reschedules.

The scheduling system demonstrates OVERSCITE's governance model applied to time management: the system is maximally informative without being independently consequential.

In the next chapter, we examine BANE enforcement in detail — how the security framework operates at every governance gate in the system.

---

*Previous: [Chapter 12 — The Contractor Division](../vol-06-operational-workflows/ch12-contractor-division.md)*  
*Next: [Chapter 14 — BANE Enforcement](../vol-08-governance-audit/ch14-bane-enforcement.md)*
