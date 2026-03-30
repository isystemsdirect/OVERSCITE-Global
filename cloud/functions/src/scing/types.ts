/**
 * Scing Cloud Core — Typed Interfaces
 *
 * Canonical contracts for session state, messages, tool definitions,
 * orchestrator request/response, and audit events.
 *
 * Canon note: Scing = human-facing interface presence and orchestration shell.
 * These types describe the *cloud runtime body* — not the identity itself.
 */

import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import {
  EngineFinding,
  EngineTrace,
  EngineVerdict,
} from '../scing_engine/engine/logicContracts';

export {
  EngineFinding,
  EngineTrace,
  EngineVerdict,
};
import { ReportBlock } from './governance/reportCompiler';

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export type ScingSessionStatus = 'active' | 'idle' | 'ended';

export interface ScingSession {
  /** Firestore document ID */
  id: string;
  /** Owner (Firebase Auth UID) */
  userId: string;
  /** Human-readable session title (auto-generated or user-set) */
  title: string;
  status: ScingSessionStatus;
  /** Arbitrary context metadata the orchestrator may carry across turns */
  context: Record<string, unknown>;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

/** Payload for creating a new session (omits server-generated fields). */
export type ScingSessionCreate = Pick<ScingSession, 'userId' | 'title' | 'context'>;

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export type ScingMessageRole = 'user' | 'assistant' | 'system';

export interface ScingToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  durationMs?: number;
  traceId?: string;
}

export interface ScingMessage {
  /** Firestore document ID */
  id: string;
  sessionId: string;
  role: ScingMessageRole;
  content: string;
  toolCalls?: ScingToolCall[];
  /** Audit trail reference */
  auditRef?: string;
  timestamp: Timestamp | FieldValue;
}

/** Payload for appending a message (omits server-generated fields). */
export type ScingMessageAppend = Omit<ScingMessage, 'id' | 'timestamp'>;

// ---------------------------------------------------------------------------
// Tool Registry
// ---------------------------------------------------------------------------

export type ActionClassification = 'read' | 'write' | 'sensitive' | 'irreversible';

export interface ScingToolDefinition {
  /** Unique tool identifier (lowercase, underscore-separated) */
  name: string;
  /** Human-readable description */
  description: string;
  /** BANE capability required to invoke (e.g. 'tool:db_read') */
  requiredCapability: string;
  /** Action classification for governance gate evaluation */
  actionClassification: ActionClassification;
  /** JSON Schema describing expected input */
  inputSchema: Record<string, unknown>;
  /** JSON Schema describing expected output */
  outputSchema: Record<string, unknown>;
  /** Governance tags for categorization and filtering */
  tags: string[];
}

export interface ScingToolInvocation {
  toolName: string;
  input: Record<string, unknown>;
  output: unknown;
  durationMs: number;
  traceId: string;
  /** Whether the invocation succeeded */
  ok: boolean;
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Orchestrator Request / Response
// ---------------------------------------------------------------------------

export interface ScingOrchestratorRequest {
  /** Session to operate within */
  sessionId: string;
  /** The user's message */
  message: string;
  /** Optional override for context sent to the model */
  contextOverride?: Record<string, unknown>;
}

export interface ScingOrchestratorResponse {
  /** Generated assistant message */
  message: string;
  /** Tool invocations performed during this turn */
  toolInvocations: ScingToolInvocation[];
  /** Audit event IDs emitted during this turn */
  auditTrail: string[];
  /** Session mutations applied (context patches) */
  sessionMutations: Record<string, unknown>;
  /** Canonical truth artifacts surfaced during this turn */
  findings?: EngineFinding[];
  /** Execution traces from all engines invoked */
  traces?: EngineTrace[];
  /** Governance verdicts rendered during this turn */
  verdicts?: EngineVerdict[];
  /** Compiled report blocks for interface rendering */
  reportBlocks?: ReportBlock[];
}

// ---------------------------------------------------------------------------
// Audit Events
// ---------------------------------------------------------------------------

export type ScingEventType =
  | 'session.created'
  | 'session.restored'
  | 'session.ended'
  | 'orchestrate.request'
  | 'orchestrate.response'
  | 'tool.invoked'
  | 'tool.error'
  | 'governance.gate.permit'
  | 'governance.gate.deny'
  | 'governance.receipt.pre'
  | 'governance.receipt.post';

export interface ScingAuditEvent {
  /** Firestore document ID */
  id?: string;
  type: ScingEventType;
  sessionId: string;
  userId: string;
  metadata: Record<string, unknown>;
  timestamp: Timestamp | FieldValue;
}
