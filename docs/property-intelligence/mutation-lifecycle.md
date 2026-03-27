# EEPIP Mutation Lifecycle

This diagram and lifecycle description define the transition of property intelligence from external candidate status to governed internal truth.

```mermaid
graph TD
    subgraph External_Service_Layer
        S1[Assessor API]
        S2[Zoning API]
        S3[Hazards API]
    end

    subgraph Candidate_Layer
        Fetch[EEPIP Fetch / Layer 1]
        Normalize[Normalization / Layer 2]
        Candidate[EEPIP Candidate Data]
    end

    subgraph Governance_Layer
        Delta[Delta Packet Construction]
        Review[Human Review Drawer]
        Decision{User Decision}
    end

    subgraph PIP_Authority_Layer
        Apply[Atomic Apply / Transaction]
        Audit[Audit Log Entry]
        NewVersion[New PIP Version / V+1]
        Baseline[Active PIP Baseline]
    end

    %% Flow
    S1 & S2 & S3 --> Fetch
    Fetch --> Normalize
    Normalize --> Candidate
    Candidate --> Delta
    Delta --> Review
    Review --> Decision
    Decision -- Accept Selected --> Apply
    Decision -- Decline/Dismiss --> Audit
    Apply --> Audit
    Apply --> NewVersion
    NewVersion --> Baseline
    Baseline -- Freshness Check --> Fetch
```

## 1. Lifecycle States

1. **Disconnected/Unconnected**: No external data has been requested or linked for this property.
2. **Proposed**: Data has been fetched but has not yet been reviewed or compared.
3. **Pending Review**: A Delta Packet has been constructed; changes are awaiting user approval.
4. **Partially Ingested**: The user accepted a subset of the proposed changes.
5. **Fully Ingested**: The user accepted all proposed changes.
6. **Accepted into PIP**: The point at which proposed changes are committed and the PIP version increments.
7. **Declined/Dismissed**: The user has explicitly rejected or deferred the proposed changes.

## 2. Integrity Rule
Proposed data (from the **Candidate Layer**) must never be rendered as truth in the **PIP Authority Layer** without passing through the **Human Review** decision gate.
