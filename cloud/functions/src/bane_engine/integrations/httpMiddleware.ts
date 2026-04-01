import type { BaneInput } from '../types';
import type { BaneRuntimeConfig } from '../runtime/config';
import { createLiveBaneEngine } from '../runtime/liveBaneEngine';
import { getCurrentUTC } from './timeSync';
import { appendChainedAuditLog } from '../storage/auditChain';
import { BANE_POLICY_PROFILES } from '../policy/profiles';
import crypto from 'node:crypto';

export type BaneHttpRequest = {
  path?: string;
  headers?: Record<string, string | undefined>;
  bodyText?: string;
  identityId?: string;
  sessionId?: string;
  ipHash?: string;
  capabilities?: string[];
  nonce?: string;
  clientSequence?: number;
  sessionIntegrity?: { nonceOk?: boolean; signatureOk?: boolean; tokenFresh?: boolean };
};

export type BaneHttpDecision =
  | { ok: true; traceId: string }
  | { ok: false; status: number; message: string; traceId: string; retryAfterMs?: number };

export function makeBaneHttpGuard(config: BaneRuntimeConfig) {
  const engine = createLiveBaneEngine(config);
  const profile = BANE_POLICY_PROFILES[config.profileId];
  const enforceStrictTime = profile?.defaults?.enforceStrictTime ?? false;
  const maxDriftMs = profile?.defaults?.maxDriftMs ?? 1000;

  return async function guard(req: BaneHttpRequest): Promise<BaneHttpDecision> {
    const timeSync = await getCurrentUTC();

    if (enforceStrictTime) {
      if (!timeSync.synchronized || timeSync.offsetMs > maxDriftMs) {
        return {
          ok: false,
          status: 403,
          message: `Time sync failure. Clock drift (${Math.round(timeSync.offsetMs)}ms) exceeds boundary.`,
          traceId: 'unverified-time'
        };
      }
    }

    // Replay Protection (Strict Sequence Enforcement)
    if (config.store && req.identityId && req.clientSequence !== undefined) {
      const lastSeq = await config.store.getLastSequenceForIdentity(req.identityId);
      if (req.clientSequence <= lastSeq) {
        return {
          ok: false,
          status: 403,
          message: 'Security protocol violation: Replay detected (stale or duplicate sequence).',
          traceId: 'replay-detected'
        };
      }
    }

    const input: BaneInput = {
      text: req.bodyText ?? '',
      req: {
        route: req.path ?? 'http:unknown',
        requiredCapability: 'bane:invoke',
        auth: {
          identityId: req.identityId,
          sessionId: req.sessionId,
          ipHash: req.ipHash,
          capabilities: req.capabilities,
          isAuthenticated: Boolean(req.identityId),
          nonce: req.nonce,
          clientSequence: req.clientSequence,
          sessionIntegrity: req.sessionIntegrity,
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
          findingsSummary: out.findings.map(f => ({ id: f.id, severity: f.severity, verdict: f.verdict }))
        });
      } catch (e) {
        // Audit failures strictly continue to avoid deadlocking execution, though system might flag in real world.
      }
    }

    if (out.verdict === 'REFUSE' || out.verdict === 'REFUSE_AND_LOG' || out.verdict === 'REFUSE_CONTAIN_ESCALATE_TO_IU') {
      const status = out.enforcementLevel === 4 ? 423 : out.enforcementLevel === 5 ? 403 : 403;
      return {
        ok: false,
        status,
        message: out.publicMessage ?? 'Access denied by policy.',
        traceId: out.traceId,
        retryAfterMs: out.throttle && out.throttle.action === 'block' ? out.throttle.retryAfterMs : undefined,
      };
    }

    if (out.verdict === 'PAUSE_FOR_VERIFICATION') {
      return {
        ok: false,
        status: 401,
        message: out.publicMessage ?? 'Additional authorization required.',
        traceId: out.traceId,
      };
    }

    return { ok: true, traceId: out.traceId };
  };
}
