---
name: Boundary Audit
description: Detect architecture drift, naming drift, trust-boundary collapse, or accidental system convergence.
---

# Boundary Audit Skill

## Purpose

Systematically detect and report architecture drift, naming drift, trust-boundary collapse, or accidental system convergence within the SCINGULAR workspace. This skill ensures that canonical separations defined by SCINGULAR doctrine remain intact.

## When to Use

- After substantial code changes that touch multiple domains
- When reviewing unfamiliar areas of the codebase
- Before major releases or milestone assessments
- When suspecting that architectural layers may have been silently collapsed
- When onboarding a new engineering surface or integration
- Periodically as a governance health check

## Audit Areas

### 1. Identity vs. Workspace
- **ARC** (accountable human identity) must remain distinct from **SCINGULAR** (organizational workspace/environment)
- Check for code that conflates user identity with workspace configuration
- Verify auth flows separate personal identity from organizational context
- **Violation Pattern**: User profile data mixed into workspace config objects

### 2. Interface vs. Architecture
- **Scing** (interface presence / UI protocol) must remain distinct from **Scingular** (broader sovereign system)
- Check for code or docs that use "Scing" to mean the entire system
- Verify UI components don't contain backend orchestration logic
- **Violation Pattern**: Scing component directly calling LARI engines without AIP mediation

### 3. Protocol vs. Product
- **AIP** (communication protocol) must remain distinct from product features
- **ISDC** (inspection data protocol) must remain distinct from generic data services
- Check for protocol logic embedded in product-specific components
- **Violation Pattern**: AIP message types defined inside a specific feature module

### 4. Capture vs. Intelligence
- **SRT** (sensor/capture input) must remain distinct from **LARI** (reasoning/intelligence)
- Check for capture components that contain analysis logic
- Verify sensor data flows through proper channels before analysis
- **Violation Pattern**: Camera component running ML inference directly

### 5. Enforcement vs. Presentation
- **BANE** (constraint/integrity enforcement) must remain distinct from UI presentation
- Check for security logic embedded in display components
- Verify enforcement decisions are made server-side, not client-side only
- **Violation Pattern**: BANE policy checks implemented only in React components

## Steps

1. **Select audit scope** — Identify the files, modules, or domains to audit
2. **Check each audit area** — Review code and docs for violations in each category
3. **Catalog findings** — List each drift or violation with file location and description
4. **Classify severity** — Low (naming inconsistency), Medium (boundary blur), High (layer collapse)
5. **Recommend remediation** — Specific actions to restore proper separation
6. **Produce report** — Following `.agents/rules/30-reporting.md` format

## Deliverables

- **Boundary audit report** with findings per audit area
- **Severity classification** for each finding
- **Remediation recommendations** with specific file references
