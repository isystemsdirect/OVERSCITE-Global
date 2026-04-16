# RECOGNITION STACK GOVERNANCE
## OVERSCITE Inspections Division

**Status:** Phase 5 Governance Hardening Active 
**Authority:** Director Anderson | CDG: Scing  
**Enforcement Layer:** BANE  
**Authoring Authority:** ArcHive™  
**Batch Ref:** UTCB-S__20260415-161500Z__SCING__RECOG005

---

## Governing Principle

No recognition logic may enter production without passing through the ArcHive™ authoring
lifecycle and BANE policy validation. This applies to:

- New domain taxonomy entries
- New drawing symbols or symbol packs
- Confidence threshold changes
- Verification gate policy changes
- Model routing changes
- New engine additions

---

## Lifecycle: Proposal → Deploy

```
PROPOSE  →  REVIEW  →  VALIDATE  →  APPROVE  →  DEPLOY  →  MONITOR  →  ROLLBACK
```

| Stage | Owner | Required Artifacts |
|-------|-------|--------------------|
| Propose | Any authorized contributor | Proposal document in ArcHive™ |
| Review | CDG (Scing) / Director  - Denied Activation: Requesting party lacks sufficient BANE clearance or device confidence score.

### 8. Operational Integration & Advisory Downstream
*Phase 6 — Full Operational Intelligence Activation*

The recognition stack serves as an advisory spine for downstream operational surfaces. 

#### 8.1. Advisory Downstream Contract (ADC)
1. **Passive Nature**: All recognition-derived findings (hazards, readiness, urgency) are strictly passive.
2. **Authority Decoupling**: Downstream systems (SmartSCHEDULER, WeatherCommand) must read advisories but are PROHIBITED from executing autonomous scheduling or dispatch based on these findings.
3. **Provencance Binding**: Every advisory must link back to the source Inspection Packet and analysis trace.

#### 8.2. Drift-to-Proposal Workflow
1. **Detection**: Monitoring service clusters unknown objects and identifies taxonomic drift.
2. **Proposal**: Human operator reviews cluster and generates a `ControlPlaneProposalPacket` with rationale.
3. **BANE Gate**: The proposal is staged in the ArcHive™ Control Plane.
4. **Activation**: Multi-party authorization (per Section 7.2) required to merge new classes into production taxonomy.

### 9. System Integrity & Failure Modes
#### 9.1. Fail-Closed Posture
If the ArcHive control plane is unreachable or BANE validation fails, the system reverts to the "Locked Canon" state. No new recognitions or taxonomic expansions are permitted until connectivity and authority are restored.

#### 9.2. Emergency Rollback
The Director or authorized Governance Unit may trigger a global `ROLLBACK` of the control plane to the last known stable configuration. This action bypasses the standard proposal queue but mandates a "Witnessed Execution" audit log.

---

## Proposal-Bound Items

The following classes of change ALWAYS require a formal proposal before production deployment:

| Category | Examples |
|----------|---------|
| New domain taxonomy entries | New defect types, new equipment classes, new pest evidence classes |
| Drawing symbol additions | New GD&T symbols, new MEP device symbols, new structural callouts |
| Drawing standards expansions | Adding ASHRAE references, adding IBC code tables |
| Inspection label sets | New finding categories, new severity tiers |
| Confidence thresholds | Adjusting score-to-band mappings |
| Verification rules | Changes to what triggers `review_required` state |
| New engine additions | Any new LARI_* engine or sub-engine |
| Model routing changes | Changing which model executes which pass |

---

## ArcHive™ Control Panels (Phase 5 Full Activation)

| Control Panel | Purpose |
|--------------|---------|
| Recognition Taxonomy Registry | Central registry of all domain taxonomy versions |
| Domain Pack Manager | Manage and deploy domain-specific recognition packs |
| Drawing Symbol Library Control | Add, review, and retire drawing symbols |
| Pest Signature Pack Control | Update pest evidence classes and infestation signatures |
| Industrial Equipment Classifier Control | Manage industrial equipment taxonomy packs |
| Occlusion Policy Control | Govern visibility-limit propagation rules and thresholds |
| Model Routing and Threshold Control | Assign engines to passes; set confidence thresholds |
| Verification Gate Policy Control | Set conditions that govern `verified_by_overscite` advancement |

---

## BANE Policy Enforcement Points

BANE enforces zero-trust validation at every consequential state transition in the recognition pipeline.

| Transition | BANE Action |
|-----------|------------|
| `accepted_unanalyzed` → `accepted_analysis_requested` | Verify requester authorization |
| `analysis_in_progress` → `analysis_complete` | Validate packet integrity and pass completeness |
| `analysis_complete` → `verification_pending` | Confirm governed analysis path completed |
| `verification_pending` → `verified_by_overscite` | Require human authority record + policy check |
| Any state → `review_required` | Always allowed; no restriction on escalation to review |
| Finding creation | Validate three-layer structure completeness |
| Taxonomy deployment | Validate proposal approval chain before activation |

**Fail-closed posture:** Any transition without a valid BANE decision record is blocked.

---

## Monitoring Requirements

The following signals must be continuously monitored post-deployment:

| Signal | Purpose |
|--------|---------|
| False positive / false negative review queue | Identify recognition quality regressions |
| Unknown object frequency by domain | Track unresolved unknowns for taxonomy expansion needs |
| Occlusion miss rate | Detect cases where occlusion was missed, degrading confidence |
| Drawing parse confidence drift | Identify symbol library gaps and image quality challenges |
| Domain-pack deployment results | Verify new packs improve recognition without regressions |
| Token consumption by pass type | Enforce compute discipline and tier governance |
| Verification approval latency | Monitor bottlenecks in human review pipeline |

---

## Learning Policy

When engine output generates new observations that do not match existing taxonomy:

1. Flag as `unknown_object_present` or `indeterminate` — NOT as a known class
2. Surface in the Unknown Object Frequency monitoring queue
3. If pattern recurs, create a formal taxonomy expansion proposal
4. Proposal passes full lifecycle before any new class is added to production taxonomy

**Hard Rule:** Learning-derived expansions remain proposal-bound. No autonomous taxonomy mutation.

---

## Taxonomy Version Pinning

Every `InspectionRecognitionPacket` carries a `taxonomyVersion` field that anchors it to
the exact taxonomy version active at time of analysis. This ensures:

- Historical packets remain interpretable even after taxonomy updates
- Audit queries can filter by taxonomy version
- Regressions can be traced to specific taxonomy changes

Taxonomy versions are immutable once deployed. Corrections require a new version, not a patch.

---

## Rollback Playbook

If a monitoring signal indicates a production regression:

1. Director or CDG initiates a rollback request in ArcHive™
2. BANE validates the rollback authorization
3. Prior taxonomy version is restored as the active version
4. Affected packets are flagged for re-review (not automatically re-analyzed)
5. Root cause analysis is documented in ArcHive™
6. A corrective proposal is submitted before re-deploying the rolled-back version
