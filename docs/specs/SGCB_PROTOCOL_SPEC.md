# SGCB Protocol Specification

## Purpose
The .sgcb format is the native Control Block file class for the SCINGULAR™ platform, replacing external YAML CB representations for internal system operations.

## Format
- Binary-efficient with embedded schema validation.
- Version-tracked with lineage metadata.
- Supports cryptographic signing via ARC identity.

## Relationship to External YAML CBs
External YAML CBs (UTCB, UDCB, etc.) remain the human-readable directive format. .sgcb files are the machine-optimized internal representation. Conversion between formats is bidirectional and lossless.

## ArcHive™ Spelling
The ArcHive™ trademark spelling is preserved in all SGCB metadata fields. No normalization to "Archive" is permitted.
