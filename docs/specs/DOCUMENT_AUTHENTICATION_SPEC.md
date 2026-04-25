# Document Authentication Specification

## Report Authentication ID
Every exported DocuSCRIBE™ document receives a unique authentication ID that serves as its primary identifier across the verification chain.

## Issuer ID
The organizational entity (OVERSCITE™ workspace) that issued the document. Bound to the workspace identity, not an individual.

## ARC Signer
The accountable human (ARC identity) who authorized and sealed the document. Multiple signers may be required for multi-party reports.

## Seal Workflow
1. Document is finalized in DocuSCRIBE™.
2. Scing performs automated compliance check.
3. ARC signer reviews and applies digital seal.
4. LARI-ArcHive™ generates witness record and cryptographic hash.
5. Document enters immutable state.

## QR/Barcode Strategy
Exported documents include a QR code or barcode linking to the public verification endpoint. Scanning the code retrieves the authentication status and seal integrity.

## Public Verification Endpoint
A publicly accessible endpoint that validates a document's authentication ID, confirms seal integrity, and returns the verification status without exposing document content.

## Clearance Levels
Documents may carry clearance levels restricting who can view, verify, or export them. Clearance is enforced by OVERSCITE™ workspace policies.

## Tamper Evidence
Any modification to a sealed document invalidates its cryptographic hash. LARI-ArcHive™ witness records provide forensic evidence of the original state.

## Chain-of-Custody
The complete provenance of a document — from creation through every review, edit, seal, and export — is recorded in the ArcHive™ audit trail.

## DocuSCRIBE™ Integration
Authentication is a native DocuSCRIBE™ capability, not an external add-on. The seal workflow is integrated into the document finalization process.

## OVERSCITE™ Report Export
Exported reports carry embedded authentication data. The export process is BANE-governed and logged.
