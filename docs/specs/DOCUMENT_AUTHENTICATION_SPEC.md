# Document Authentication Specification

## Purpose
Defines the cryptographic and procedural standards for authenticating DocuSCRIBE™ reports and SCIMEGA™ mission manifests within the SCINGULAR™ ecosystem.

## Current Truth-State
Documents are currently authenticated via SHA-256 content hashing and subsequent binding to the active ARC identity (user session). This creates a verifiable link between the content and the human authority. Full digital signing via hardware KMS is currently in the roadmap stage.

## Canon Position
### Core Authentication Metadata
- **Authentication ID (AuthID)**: A unique UUID generated at the moment of sealing, used for public verification lookups.
- **Issuer ID**: The identifier of the OVERSCITE™ workspace or organization originating the document.
- **ARC Signer State**: The verified identity and certification status of the human author (ARC-level binding).
- **Seal Workflow**: The governed process where a document transitions from `draft` to `sealed` state, triggered by an explicit human authorization gate.
- **Clearance Levels**: Metadata markers defining the sensitivity and required authority to view or verify the document.
- **Tamper Evidence**: Cryptographic chaining of document sections (headers, events, findings) to ensure any modification invalidates the seal.
- **Chain of Custody**: A sequential record of every human and system that has interacted with the document after sealing.

### Verification Methods
- **Verification Endpoint**: A public-facing or internal OVERSCITE™ URL used to validate an AuthID.
- **QR / Barcode Verification**: Printed representations of the AuthID and verification URL for field validation of physical report copies.

### Integration Points
- **DocuSCRIBE™ Integration**: Direct binding of inspection findings to the report's authentication seal.
- **OVERSCITE™ Report Export**: Automatic injection of authentication metadata and QR codes into derivative representations (PDF/HTML).

## Implementation Status
- **Content Hashing**: **IMPLEMENTED**. Active in DocuSCRIBE™ and LARI-ArcHive™ generators.
- **ARC Linking**: **IMPLEMENTED**. Metadata fields populated via active session.
- **Truth-Seal Service**: **PARTIAL**. Logic exists in `src/lib/lari-repo/truth-seal-service.ts` to generate seals and log audit events.
- **Seal Verification Service**: **PARTIAL**. Mock/Simulator implementation exists in `src/lib/lari-repo/seal-verification-service.ts`.
- **QR/Barcode Generation**: **MISSING**. Not yet implemented in export boundaries.
- **Hardware KMS Signing**: **SPEC_DEFINED / NEXT_WORK**. See [ARC Signature KMS Roadmap](../security/ARC_SIGNATURE_KMS_ROADMAP.md).
- **Public Verification Endpoint**: **MISSING**.

## Known Limitations
- **No Private-Key Signing**: Final digital signatures via user-held private keys (KMS) are not yet implemented.
- **Self-Contained Verification**: Verification currently requires access to the generating system's audit trail.

## Next Required Work [BETA BLOCKER]
- **QR Component**: Implement a reusable QR code generator for authentication headers.
- **Independent Verifier**: Create a standalone utility to verify `.sgtx` and `.sgarch` files without a live system connection.
- **KMS Integration**: Roadmap for hardware-backed signature keys.
- **Public Auth Gateway**: Deploy the `/verify` route for AuthID lookup.
