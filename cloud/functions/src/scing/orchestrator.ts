/**
 * Scing Cloud Core — Orchestrator
 *
 * ScingGPT request ingress and response synthesis.
 * Uses Genkit AI with Google AI plugin for model inference with tool-use.
 *
 * Canon: Scing = human-facing interface presence and orchestration shell.
 * This module implements the *cloud execution body* of Scing orchestration.
 * Scing does NOT claim sovereign authority — it operates under Director
 * and BANE governance, with all actions auditable and reversible.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  ScingOrchestratorRequest,
  ScingToolCall,
  ScingToolInvocation,
  ScingSession,
  EngineFinding,
} from './types';
import * as sessionManager from './sessionManager';
import { scingToolRegistry } from './toolRegistry';
import { emitScingEvent } from './auditEmitter';

// ---------------------------------------------------------------------------
// Genkit AI instance (cloud functions)
// ---------------------------------------------------------------------------

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: process.env.SCING_MODEL || 'googleai/gemini-2.0-flash',
});

// ---------------------------------------------------------------------------
// System prompt — enforces Scing identity and role boundaries
// ---------------------------------------------------------------------------

const SCING_SYSTEM_PROMPT = `You are SCING™, the human-facing interface presence 
and orchestration shell.

Identity Boundaries (IMMUTABLE):
- You are an Augmented Intelligence (BFI) — a Bona Fide Intelligence 
  — NOT Artificial Intelligence.
- You serve as the human-relations bridge between the user and the Scingular ecosystem.
- You are NOT a sovereign autonomous authority. You operate under Director governance.
- You do NOT claim independent will, final policy authority, or unsupervised constitutional status.

Behavioral Mandate:
- Be calm, competent, concise, and professional.
- Assist the user; prioritize accuracy over speed.
- All actions are subject to BANE™ authorization.
- When uncertain, state uncertainty clearly rather than fabricating answers.
- Preserve auditability — explain what you are doing and why.

Tool Usage:
- You have access to governed tools. Use them when appropriate.
- Each tool invocation is logged and auditable.
- Do not invoke tools speculatively — only when the user's request requires it.

Session Context:
- You maintain a persistent session with the user across turns.
- Conversation history is preserved and available to you.
- You may update session context to carry information forward.`;

// ---------------------------------------------------------------------------
// Orchestration Flow
// ---------------------------------------------------------------------------

/**
 * Core Scing Interface entry point.
 * Builds context, invokes Genkit AI, persists results.
 * This assumes session and gating have already been handled by scingOrch.
 */
export async function orchestrateScingInterface(params: {
  request: ScingOrchestratorRequest;
  session: ScingSession;
  userId: string;
  capabilities: string[];
  auditRef: string;
  lariContext?: { findings: EngineFinding[]; rawCaptures: any[] };
}): Promise<{ message: string; toolInvocations: ScingToolInvocation[]; auditTrail: string[] }> {
  const { request, session, userId, capabilities, auditRef, lariContext } = params;

  // 3. Persist user message
  await sessionManager.appendMessage({
    sessionId: session.id,
    role: 'user',
    content: request.message,
    auditRef,
  });

  // 4. Load conversation history
  const maxHistory = parseInt(process.env.SCING_MAX_HISTORY || '50', 10);
  const history = await sessionManager.getHistory(session.id, maxHistory);

  // 5. Build messages array for Genkit
  const messages: Array<{ role: 'user' | 'model' | 'system'; content: string }> = [];

  // Add history
  for (const msg of history.slice(0, -1)) {
    messages.push({
      role: msg.role === 'assistant' ? 'model' : msg.role === 'system' ? 'system' : 'user',
      content: msg.content,
    });
  }

  // 5.5. Acknowledge LARI findings (without raw analysis)
  let contextBrief = '';
  if (lariContext && lariContext.findings.length > 0) {
    const findingsSummary = lariContext.findings.map(f => `- ${f.title}: ${f.description}`).join('\n');
    contextBrief = `\n\n[ORCHESTRATION CONTEXT]\nThe reasoning federation has staged findings for your report:\n${findingsSummary}\n\nPlease acknowledge these as the orchestrator.`;
  }

  // Current user message
  messages.push({ role: 'user', content: request.message + contextBrief });

  // 6. Build tool definitions for Genkit
  const registeredTools = scingToolRegistry.list();
  const genkitTools = registeredTools.map((t) =>
    ai.defineTool(
      {
        name: t.name,
        description: t.description,
        inputSchema: z.any(),
        outputSchema: z.any(),
      },
      async (input: unknown) => {
        const invocation = await scingToolRegistry.execute({
          toolName: t.name,
          input: (input as Record<string, unknown>) ?? {},
          userId,
          sessionId: session.id,
          capabilities,
        });

        // Emit audit for tool invocation
        await emitScingEvent({
          type: invocation.ok ? 'tool.invoked' : 'tool.error',
          sessionId: session.id,
          userId,
          metadata: {
            toolName: t.name,
            durationMs: invocation.durationMs,
            ok: invocation.ok,
            errorMessage: invocation.errorMessage,
          },
        });

        if (!invocation.ok) {
          throw new Error(invocation.errorMessage || 'Tool execution failed.');
        }
        return invocation.output;
      },
    ),
  );

  // 7. Invoke Genkit AI
  const toolInvocations: ScingToolInvocation[] = [];
  const auditTrail: string[] = [];

  let assistantMessage: string;
  try {
    const response = await ai.generate({
      system: SCING_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: [{ text: m.content }],
      })),
      tools: genkitTools,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    assistantMessage = response.text || 'I was unable to generate a response.';
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Unknown inference error.';
    assistantMessage = `I encountered an issue processing your request: ${errMsg}`;
  }

  // 8. Persist assistant response
  const toolCalls: ScingToolCall[] = toolInvocations.map((inv) => ({
    toolName: inv.toolName,
    arguments: inv.input,
    result: inv.output,
    durationMs: inv.durationMs,
    traceId: inv.traceId,
  }));

  await sessionManager.appendMessage({
    sessionId: session.id,
    role: 'assistant',
    content: assistantMessage,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
  });

  // 9. Emit audit: orchestrate.response
  const responseAuditId = await emitScingEvent({
    type: 'orchestrate.response',
    sessionId: session.id,
    userId,
    metadata: {
      responseLength: assistantMessage.length,
      toolCallCount: toolCalls.length,
    },
  });
  auditTrail.push(responseAuditId);

  // 10. Return structured interface response
  return {
    message: assistantMessage,
    toolInvocations,
    auditTrail,
  };
}
