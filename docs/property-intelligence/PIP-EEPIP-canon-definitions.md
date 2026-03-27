# PIP / EEPIP Canon Definitions

This document defines the canonical terms and architectural boundaries for Property Intelligence in OVERSCITE, as governed by **UTCB-G (EEPIP Integration)** and SCINGULAR engineering principles.

## 1. Core Definitions

### PIP (Property Intelligence Profile)
- **Status**: Governing Truth-State
- **Description**: The primary internal, governed, versioned working property profile inside OVERSCITE.
- **Authority**: Under sole jurisdiction of the Imprinted User (Inspector/Director).
- **Persistence**: Managed as a versioned lineage where every state change is an auditable event.

### EEPIP (Existing External Property Intelligence Profile)
- **Status**: Advisory Augmentation
- **Description**: An optional, source-attributed, externally derived augmentation layer.
- **Authority**: No inherent authority. EEPIP data is considered a "Proposal" until explicitly ingested and accepted into the PIP by a human authority.
- **Usage**: Non-blocking; the absence or failure of EEPIP does not degrade PIP operations.

## 2. Process Definitions

### PIP-FV (Property Intelligence Profile Freshness Verification)
- **Action**: A background check comparing the active PIP against external sources.
- **Result**: Advisory alert of "External Changes Detected." It does **not** mutate the PIP.

### Delta Packet
- **Action**: The technical comparison of EEPIP candidate information against the current PIP baseline.
- **Result**: A structured list of **Proposed Changes** awaiting human review.

### EEPIP Ingestion
- **Action**: The human-approved process of merging validated Delta Packet items into the PIP.
- **Result**: Creation of a **New PIP Version** and an entry in the **Property Audit Log**.

## 3. Boundary Rules

1. **Fetch_Is_Not_Ingestion**: Retrieving data (Fetch) only creates a candidate state. It is not part of the PIP until processed.
2. **Ingestion_Is_Not_Acceptance**: Building a Delta Packet (Ingestion) only stages changes for review. Only human approval marks them as "Accepted."
3. **Freshness_Is_Advisory**: Detecting a change in external sources is a notification of availability, not a forced update of internal truth.
4. **Human_In_The_Loop**: No mutation of PIP state occurs without explicit authorization from an accountable human user.
