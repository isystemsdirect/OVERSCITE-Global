/**
 * Scing Cloud Core — Tool Registry
 *
 * Governed MCP-style tool capability map. Tools are data-driven and
 * registered at boot time. Execution wraps calls through BANE-compatible
 * governance boundaries using the existing `runGuardedTool` pattern.
 *
 * Extension point: LARI and BANE subsystems can register additional tools
 * without modifying orchestrator core.
 */

import { ScingToolDefinition, ScingToolInvocation } from './types';
import { runGuardedTool } from '../../../../scing/bane/server/toolBoundary';
import {
  evaluateActionGate,
  emitPostGateReceipt,
  buildActorContext,
} from './governance';

// ---------------------------------------------------------------------------
// Tool handler type
// ---------------------------------------------------------------------------

export type ScingToolHandler = (
  input: Record<string, unknown>,
  context: { userId: string; sessionId: string },
) => Promise<unknown>;

interface RegisteredTool {
  definition: ScingToolDefinition;
  handler: ScingToolHandler;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

class ScingToolRegistry {
  private tools = new Map<string, RegisteredTool>();

  /**
   * Register a tool with its definition and handler.
   * Duplicate names overwrite — intentional for hot-reload scenarios.
   */
  register(definition: ScingToolDefinition, handler: ScingToolHandler): void {
    this.tools.set(definition.name, { definition, handler });
  }

  /** List all registered tool definitions (safe to expose to clients). */
  list(): ScingToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  /** Get a single tool definition by name. */
  get(name: string): ScingToolDefinition | undefined {
    return this.tools.get(name)?.definition;
  }

  /**
   * Execute a tool by name through BANE governance wrapping.
   * Returns a typed invocation record suitable for audit logging.
   */
  async execute(params: {
    toolName: string;
    input: Record<string, unknown>;
    userId: string;
    sessionId: string;
    capabilities: string[];
  }): Promise<ScingToolInvocation> {
    const registered = this.tools.get(params.toolName);
    if (!registered) {
      return {
        toolName: params.toolName,
        input: params.input,
        output: null,
        durationMs: 0,
        traceId: '',
        ok: false,
        errorMessage: `Unknown tool: ${params.toolName}`,
      };
    }

    // --- Governance gate evaluation ---
    const actor = buildActorContext({
      userId: params.userId,
      sessionId: params.sessionId,
      capabilities: params.capabilities,
    });

    const gateDecision = await evaluateActionGate({
      action: params.toolName,
      actor,
      classification: registered.definition.actionClassification,
      metadata: { inputPreview: JSON.stringify(params.input).slice(0, 200) },
    });

    if (!gateDecision.permitted) {
      return {
        toolName: params.toolName,
        input: params.input,
        output: null,
        durationMs: 0,
        traceId: gateDecision.traceId,
        ok: false,
        errorMessage: `Governance gate denied: ${gateDecision.reason}`,
      };
    }

    const start = Date.now();
    try {
      const result = await runGuardedTool({
        toolName: params.toolName,
        requiredCapability: registered.definition.requiredCapability,
        payloadText: JSON.stringify(params.input),
        identityId: params.userId,
        capabilities: params.capabilities,
        exec: () =>
          registered.handler(params.input, {
            userId: params.userId,
            sessionId: params.sessionId,
          }),
      });

      // --- Post-execution governance receipt ---
      await emitPostGateReceipt({
        action: params.toolName,
        classification: registered.definition.actionClassification,
        actor,
        traceId: gateDecision.traceId,
        success: true,
        metadata: { durationMs: Date.now() - start },
      });

      return {
        toolName: params.toolName,
        input: params.input,
        output: result,
        durationMs: Date.now() - start,
        traceId: gateDecision.traceId,
        ok: true,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Tool execution failed.';

      // --- Post-execution governance receipt (failure) ---
      await emitPostGateReceipt({
        action: params.toolName,
        classification: registered.definition.actionClassification,
        actor,
        traceId: gateDecision.traceId,
        success: false,
        metadata: { error: message, durationMs: Date.now() - start },
      });

      return {
        toolName: params.toolName,
        input: params.input,
        output: null,
        durationMs: Date.now() - start,
        traceId: gateDecision.traceId,
        ok: false,
        errorMessage: message,
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton registry instance + built-in tools
// ---------------------------------------------------------------------------

export const scingToolRegistry = new ScingToolRegistry();

// ---- Built-in tool: scing_getSessionHistory ----
import { getHistory } from './sessionManager';

scingToolRegistry.register(
  {
    name: 'scing_getSessionHistory',
    description: 'Retrieve recent conversation messages from the current session.',
    requiredCapability: 'tool:db_read',
    actionClassification: 'read',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max messages to retrieve (default 20).' },
      },
    },
    outputSchema: {
      type: 'object',
      properties: {
        messages: { type: 'array', items: { type: 'object' } },
      },
    },
    tags: ['session', 'history', 'built-in'],
  },
  async (input, ctx) => {
    const limit = typeof input.limit === 'number' ? input.limit : 20;
    const messages = await getHistory(ctx.sessionId, limit);
    return { messages };
  },
);

// ---- Built-in tool: scing_updateContext ----
import { updateSessionContext } from './sessionManager';

scingToolRegistry.register(
  {
    name: 'scing_updateContext',
    description: 'Update session context metadata with new key-value pairs.',
    requiredCapability: 'tool:db_write',
    actionClassification: 'write',
    inputSchema: {
      type: 'object',
      properties: {
        updates: { type: 'object', description: 'Key-value pairs to patch into session context.' },
      },
      required: ['updates'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
      },
    },
    tags: ['session', 'context', 'built-in'],
  },
  async (input, ctx) => {
    const updates =
      typeof input.updates === 'object' && input.updates !== null
        ? (input.updates as Record<string, unknown>)
        : {};
    await updateSessionContext(ctx.sessionId, updates);
    return { ok: true };
  },
);

// ---- Built-in tool: scing_healthCheck ----
scingToolRegistry.register(
  {
    name: 'scing_healthCheck',
    description: 'Check the health status of the Scing Cloud Core runtime.',
    requiredCapability: 'bane:invoke',
    actionClassification: 'read',
    inputSchema: { type: 'object', properties: {} },
    outputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        service: { type: 'string' },
        timestamp: { type: 'string' },
      },
    },
    tags: ['system', 'health', 'built-in'],
  },
  async () => {
    return {
      status: 'healthy',
      service: 'Scing Cloud Core',
      timestamp: new Date().toISOString(),
    };
  },
);
