# ArcHive™ Vault Specification

## Purpose
Defines the structure and security requirements for the ArcHive™ Vault, the long-term, high-integrity storage repository for `.sgarch` and `.sgdoc` artifacts.

## Current Truth-State
Archiving is currently implemented as local file persistence and OVERSCITE™ workspace storage. The concept of an immutable "Vault" is in the architectural modeling phase.

## Canon Position
The ArcHive™ Vault must satisfy the following:
1. **Immutability**: Once an artifact is vaulted, it cannot be modified or deleted without a multi-party BANE authorization.
2. **Attributability**: All access and retrieval attempts must be ARC-authorized and logged.
3. **Integrity-Aware**: The vault must continuously verify the cryptographic hashes of its contents to detect data degradation (bit-rot).

## Implementation Status
- **Local Persistence**: Mission manifests are saved to local indexedDB for replay.
- **OVERSCITE™ Sync**: Basic upload of mission results to the organizational workspace.
- **WORM-like logic**: The system prevents overwriting existing mission IDs.

## Known Limitations
- **No Physical WORM**: Underlying storage is standard cloud/disk storage, not true Write-Once-Read-Many hardware.
- **Manual Cleanup**: Expired or non-essential records still require manual deletion policies.

## Next Required Work
- **Vault Verification Service**: Implement a background service that crawls the archive vault and verifies every manifest hash against its recorded signature.
- **Retention Policies**: Define and implement automated data retention and pruning rules.
