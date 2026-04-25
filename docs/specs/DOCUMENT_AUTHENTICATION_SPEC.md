# Document Authentication Specification

## Purpose
Defines the cryptographic and procedural standards for authenticating DocuSCRIBE™ reports and SCIMEGA™ mission manifests within the SCINGULAR™ ecosystem.

## Current Truth-State
Documents are currently authenticated via SHA-256 content hashing and subsequent binding to the active ARC identity (user session). This creates a verifiable link between the content and the human authority.

## Canon Position
Every authenticated artifact must contain:
1. **Content Hash**: An immutable fingerprint of the document data.
2. **ARC Identity Binding**: The unique ID of the certified human author/pilot.
3. **IU Imprint Timestamp**: The precise moment of intellectual authorization.
4. **BFI Verdict**: The BANE/TEON clearance status at the time of generation.

## Implementation Status
- **Content Hashing**: Active in DocuSCRIBE™ and LARI-ArcHive™ generators.
- **ARC Linking**: Metadata fields populated via active session.
- **Verification UI**: Basic "Verified" status indicator implemented in report views.

## Known Limitations
- **No Private-Key Signing**: Final digital signatures via user-held private keys are not yet implemented.
- **Self-Contained Verification**: Verification currently requires access to the generating system's audit trail.

## Next Required Work
- **Independent Verifier**: Create a standalone utility to verify `.sgdoc` and `.sgarch` files without a live system connection.
- **KMS Integration**: Roadmap for hardware-backed signature keys (Step 5 of Security Batch).
