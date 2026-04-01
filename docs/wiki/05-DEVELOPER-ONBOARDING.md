# OVERSCITE Developer Onboarding (Ultra-Grade)

## 1. Purpose
Define the mandatory engineering standards and developer doctrine for the SCINGULAR™ platform. This is not open-ended onboarding. It is a locked doctrine detailing how development occurs within the boundaries of BANE and LARI nodes to maintain absolute system integrity.

## 2. Principle
The SCINGULAR™ toolset augments human intent; it does not replace it. The system is heavily governed, strictly layered, and deterministic. All development must respect the Node and Bridge Port canon. Developers are building infrastructure, not arbitrary features.

## 3. Canonical Implementation Patterns
- **Strict Port Traversal**: Every feature must traverse a named Bridge Port for intent propagation.
- **BANE-Bounded Logic**: The terminal step of any capability must always terminate at a BANE-level validation gate.
- **Audit-Traceable Synthesis**: Every decision or analysis must possess a clear lineage documented in the audit synchronous log.

## 4. Prohibited Development Patterns
- **Layer Collapse (Flattening)**: Writing code that interacts directly between `NODE_SCING_INTERFACE_001` and `NODE_OVERSCITE_RUNTIME_001`.
- **BANE Bypass**: Implementing mutations that skip the mandatory validation flow.
- **Hidden Capability**: Introducing unmapped engine logic in LARI or BANE layers.
- **Autonomy Heuristics**: introducing self-executing automation that activates without human anchoring.
- **Implicit Flow Definitions**: Passing state transitions without documenting the flow. All state transitions must be structurally bound to a Port.

## 5. Layer Integrity Rules
- No reasoning engine (`NODE_LARI_CORE_001`) may possess the authority to write to the database.
- Orchestration (`NODE_SCINGULAR_CORE_001`) and Execution (`NODE_OVERSCITE_RUNTIME_001`) must remain functionally distinct and never be merged into a single cognitive block.
- All cognitive operations must be attributable to a specific LARI node.

## 6. Governance Obligations
Every developer is obligated to:
- Anchor all features to a human-intent origin.
- Ensure all interactions are identity-bound at each layer traversal.
- Implement explicit audit logging for every high-impact mutation.

## 7. Node/Port-Aware Implementation Guidance
Developers implement features by building discrete functional components that map to established Architecture Layers.
- A feature in `NODE_SCING_INTERFACE_001` must serialize its intent string and deliver it successfully across `PORT_SCING_TO_SCINGULAR_001`.
- Interaction logic must call out its targeted Bridge Port explicitly in the component's metadata.

## 8. Violation Warnings
Code submissions and pull requests are checked by automated static analysis.
- **Bypass Detection**: Any attempt to route directly into `NODE_OVERSCITE_RUNTIME_001` bypassing BANE results in immediate rejection.
- **Architectural Drift**: Features that fail to specify their Node/Port mapping will be blocked.

## 9. Developer Contribution Flow (Extraction)
The execution path for feature submission and validation.

```flow
[FLOW_ID: FLOW_DEV_CONTRIBUTION_VETTING_001]
1. `NODE_HUMAN_001` (Developer)
2. `PORT_HUMAN_TO_ARC_001` (Credentialing)
3. `NODE_ARC_001` (Accountable Identity)
4. // Code Submission
5. `NODE_LARI_COMPLIANCE_001` (Rule & Policy Verification)
6. `NODE_BANE_CORE_001` (Boundary & Token Validation)
7. `NODE_SCINGULAR_CORE_001` (System Integration)
```

## 10. Final Principle
Operational truth is the only acceptable code quality. If a feature obscures the audit trail or the intent origin, it is a failure of engineering and will be rejected.
