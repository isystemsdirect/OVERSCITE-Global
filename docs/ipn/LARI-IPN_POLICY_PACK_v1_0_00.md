# LARI-IPN Policy Pack
**Version**: `BIPN-PACK-2026.04.11-r01`
**Status**: Active

## Overview
This policy pack governs the initial transport ruleset for the LARI-IPN Governed Relay MVP. These rules are injected into BANE to provide deterministic boundaries for session enablement and relaying operations.

## Enforced Rules
| ID | Rule Designation | Assigned Action |
|---|---|---|
| R001 | `REQUIRE_ARC_IDENTITY` | `BLOCK_IF_MISSING` |
| R002 | `REQUIRE_BANE_AUTHORIZATION` | `BLOCK_IF_MISSING` |
| R003 | `LOCK_SAFETY_CORE` | `ENFORCE_STATIC` |
| R004 | `PROHIBIT_AUTONOMOUS_MESH` | `BLOCK` |

## Enforcement Behavior
Any IPN transport request failing a `BLOCK` or `BLOCK_IF_MISSING` assignment is decisively dropped, and a corresponding `DENY` event is hashed sequentially down the Audit line.
