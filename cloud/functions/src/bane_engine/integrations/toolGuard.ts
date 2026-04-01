import type { BaneInput } from '../types';
import type { BaneRuntimeConfig } from '../runtime/config';
import { createLiveBaneEngine } from '../runtime/liveBaneEngine';
import { getCurrentUTC } from './timeSync';
import { appendChainedAuditLog } from '../storage/auditChain';
import { BANE_POLICY_PROFILES } from '../policy/profiles';
import crypto from 'node:crypto';

export type ToolCallContext = {
  toolName: string;
  payloadText: string;
  identityId?: string;
  sessionId?: string;
  ipHash?: string;
  capabilities?: string[];
  sessionIntegrity?: { nonceOk?: boolean; signatureOk?: boolean; tokenFresh?: boolean };
  requiredCapability: string;
};

export type ToolGuardDecision =
  | { ok: true; traceId: string }
  | { ok: false; traceId: string; message: string };

export function makeBaneToolGuard(config: BaneRuntimeConfig) {
  const engine = createLiveBaneEngine(config);
  const profile = BANE_POLICY_PROFILES[config.profileId];
  const enforceStrictTime = profile?.defaults?.enforceStrictTime ?? false;
  const maxDriftMs = profile?.defaults?.maxDriftMs ?? 1000;

  return async function guard(ctx: ToolCallContext): Promise<ToolGuardDecision> {
    const timeSync = await getCurrentUTC();

    if (enforceStrictTime) {
      if (!timeSync.synchronized || timeSync.offsetMs > maxDriftMs) {
        const drift = Math.round(timeSync.offsetMs);
        return {
          ok: false,
          traceId: 'unverified-time',
          message: `Time sync failure. Clock drift (${drift}ms) exceeds max allowable boundary.` 
        };
      }
    }

    const input: BaneInput = {
      text: ctx.payloadText,
      req: {
        route: `tool:${ctx.toolName}`,
        requiredCapability: ctx.requiredCapability,
        auth: {
          identityId: ctx.identityId,
          sessionId: ctx.sessionId,
          ipHash: ctx.ipHash,
          capabilities: ctx.capabilities,
          isAuthenticated: Boolean(ctx.identityId),
          sessionIntegrity: ctx.sessionIntegrity,
        },
      },
    };

    const out = engine.evaluate(input);

    if (config.store) {
      try {
        await appendChainedAuditLog(config.store, {
          at: new Date(timeSync.utc).getTime(),
          traceId: out.traceId,
          route: input.req?.route ?? 'unknown',
          requiredCapability: input.req?.requiredCapability,
          identityId: input.req?.auth?.identityId,
          verdict: out.verdict,
          severity: out.severity,
          enforcementLevel: out.enforcementLevel,
          inputHash: crypto.createHash('sha256').update(input.text).digest('hex'),
          findingsSummary: out.findings.map(f => ({
            id: f.id,
            severity: f.severity,
            verdict: f.verdict
          }))
        });
      } catch (e) {
        // Continue fallback processing
      }
    }

    const isRefused = 
      out.verdict === 'REFUSE' || 
      out.verdict === 'REFUSE_AND_LOG' || 
      out.verdict === 'REFUSE_CONTAIN_ESCALATE_TO_IU' || 
      out.verdict === 'PAUSE_FOR_VERIFICATION';

    if (isRefused) {
      return {
        ok: false,
        traceId: out.traceId,
        message: out.publicMessage ?? 'Tool invocation blocked by policy.'
      };
    }

    return { ok: true, traceId: out.traceId };
  };
}
