# Scing Cloud Core — Architecture Decision Document

> UTCB-G: Scing Cloud Core Bring-Up and Orchestration Activation  
> Date: 2026-03-21  
> Authority: Director Anderson → Scing → Antigravity (ArcHive™ DL)

## Overview

Scing Cloud Core is the minimum viable governed runtime body that enables ScingGPT to function as the active orchestration layer within the SCINGULAR intelligence stack. It provides:

1. **Authenticated session continuity** — Firestore-backed sessions with ownership validation
2. **Model gateway** — Genkit AI with Google AI plugin for inference with tool-use
3. **Tool registry** — Data-driven, extensible tool capability map with BANE governance
4. **Audit emission** — Append-only structured events for later BANE wrapping
5. **Live backend integration** — AIP handler routed through Scing orchestrator

## Module Layout

```
cloud/functions/src/scing/
├── types.ts          # Typed interfaces for all contracts
├── sessionManager.ts # Firestore session lifecycle (Admin SDK)
├── orchestrator.ts   # ScingGPT request ingress + response synthesis
├── toolRegistry.ts   # MCP-style tool registry + BANE execution wrapping
├── auditEmitter.ts   # Append-only audit event emission
└── index.ts          # Router: scingBoot, scingChat, scingTools
```

## Cloud Function Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `scing.boot` | Callable | Create or restore a session |
| `scing.chat` | Callable | Send message through orchestrator |
| `scing.tools` | Callable | List available governed tools |

All endpoints enforce BANE authentication via `enforceBaneCallable`.

## Session Lifecycle

```
User → scingBoot(sessionId?) → Session Manager
  ├─ New: createSession → scingSessions/{id}
  └─ Restore: getSession → validate ownership → return

User → scingChat(sessionId, message) → Orchestrator
  1. Validate session ownership
  2. Emit audit: orchestrate.request
  3. Persist user message to scingSessions/{id}/messages/
  4. Load conversation history window
  5. Build system prompt (enforces Scing identity boundaries)
  6. Invoke Genkit AI with tool definitions
  7. Execute tool calls through registry (BANE-wrapped)
  8. Persist assistant response
  9. Emit audit: orchestrate.response
  10. Return typed response
```

## Tool Registry Design

Tools are data-driven — registered at boot time via `ScingToolRegistry.register()`. Each tool defines:
- Input/output JSON schemas
- Required BANE capability
- Governance tags

Execution wraps all calls through `runGuardedTool` from the existing BANE tool boundary module.

**Built-in tools:**
- `scing_getSessionHistory` — retrieve conversation messages
- `scing_updateContext` — patch session context metadata
- `scing_healthCheck` — system health status

**Extension point:** LARI and BANE can register additional tools by importing `scingToolRegistry` and calling `.register()` — no orchestrator modifications needed.

## Firestore Collections

| Collection | Access | Purpose |
|------------|--------|---------|
| `scingSessions/{id}` | Owner read, Admin SDK write | Session metadata |
| `scingSessions/{id}/messages/{msgId}` | Owner read, Admin SDK write | Conversation messages |
| `audit/scingEvents/events/{id}` | Admin SDK only | Audit trail |

## Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| Genkit AI (not raw OpenAI SDK) | Aligns with existing frontend AI patterns; built-in tool-use |
| Subcollection for messages | Cleaner ownership rules, natural pagination, better than flat collection |
| Data-driven tool registry | Extensible for LARI/BANE without core modifications |
| Firestore audit events | Consistent with existing `audit/baneEvents` patterns |
| Node 20 for cloud functions | Genkit requires Node 20+ |

## LARI/BANE Extension Points

The architecture is designed so LARI and BANE can attach without major rewrite:

- **LARI tools:** Register domain-specific tools into `scingToolRegistry` (e.g., `lari_analyzeImage`, `lari_generateReport`)
- **BANE hardening:** Wrap `auditEmitter` with BANE WORM integrity checks; add policy enforcement to tool execution pipeline
- **Session governance:** Add session-level policy snapshots via existing `policySnapshots` pattern

## Canon Preservation

- Scing remains interface/orchestration presence — system prompt enforces this invariant
- No autonomous authority claimed — all actions auditable and BANE-governed
- No canon naming, trademark, or authority chain mutations
- All implementation is additive — no existing files were deleted or architecturally altered
