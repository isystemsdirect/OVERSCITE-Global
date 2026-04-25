# ArcHive™ Manifest File Specification

## Purpose
ArcHive™ manifests are immutable witness records that encapsulate mission parameters, telemetry history, authority signatures, and cryptographic integrity proofs.

## Structure
- **Header**: Manifest ID, version, creation timestamp, ARC signer.
- **Payload**: Mission parameters, telemetry snapshots, BANE audit events, TEON constraint records.
- **Signatures**: ARC identity binding, LARI-ArcHive™ witness hash.
- **Seal**: Immutability seal indicating the manifest has been finalized.

## Lifecycle
1. **Open**: Manifest is being populated during an active session.
2. **Sealed**: Manifest is finalized with cryptographic integrity proof.
3. **Archived**: Manifest is stored in the ArcHive™ vault.

## ArcHive™ Spelling
The "ArcHive™" trademark spelling is used exactly throughout all manifest metadata, file headers, and documentation. No normalization to "Archive" is permitted.
