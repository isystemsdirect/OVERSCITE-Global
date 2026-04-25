# .sg* File Family Specification

## Overview
The .sg* file family is the native file ecosystem for the SCINGULAR™ platform. Each file type serves a specific governance, intelligence, or operational purpose.

## File Types
### .sgcb — Native Control Block
The native serialization format for Control Blocks (CBs). Replaces external YAML CBs for internal system use.
- Binary-efficient, schema-validated, and version-tracked.
- See [SGCB Protocol Spec](SGCB_PROTOCOL_SPEC.md).

### .sgr — Reports
DocuSCRIBE™ native report format. Contains document content, authentication data, witness markings, and ArcHive™ seal references.

### .sgi — Identity Capsules
ARC identity capsules containing verified human identity, certification status, and authorization scope. Encrypted at rest.

### .sge — Encrypted Envelopes
General-purpose encrypted containers for sensitive data transport. Uses SCINGULAR™ key management.

### .sgx — Knowledge Graphs
Structured knowledge representations used by LARI engines for domain intelligence, methodology graphs, and relationship mapping.

## MIME Mapping
| Extension | MIME Type | Handler |
| :--- | :--- | :--- |
| .sgcb | application/vnd.scingular.cb | SGCB Protocol Engine |
| .sgr | application/vnd.scingular.report | DocuSCRIBE™ |
| .sgi | application/vnd.scingular.identity | ARC Identity Service |
| .sge | application/vnd.scingular.envelope | Encryption Service |
| .sgx | application/vnd.scingular.knowledge | LARI Knowledge Engine |

## Import/Export Validation
All .sg* files undergo schema validation on import and integrity verification on export. Invalid files are rejected with diagnostic output.

## Native vs. External Trust States
- **Native (.sg*)**: Fully trusted within the SCINGULAR™ ecosystem. Integrity verified by LARI-ArcHive™.
- **External (YAML, JSON, etc.)**: Treated as untrusted until validated and converted to native format.
