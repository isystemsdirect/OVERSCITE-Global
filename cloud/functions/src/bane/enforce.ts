import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { baneHttpGuard } from '../bane_engine/server/baneGuards';

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? {});
  } catch {
    return '';
  }
}

function capsForRole(role: string | undefined): string[] {
  const r = (role ?? '').toLowerCase();
  if (r === 'admin') return ['bane:invoke', 'tool:db_read', 'tool:db_write', 'tool:external_call'];
  if (r === 'inspector') return ['bane:invoke', 'tool:db_read', 'tool:db_write'];
  if (r === 'viewer') return ['bane:invoke', 'tool:db_read'];
  return ['bane:invoke'];
}

async function resolveRoleFromFirestore(uid: string): Promise<string | undefined> {
  const snap = await admin.firestore().collection('users').doc(uid).get();
  const data = snap.data() as Record<string, unknown> | undefined;
  const role = snap.exists ? data?.role : undefined;
  return typeof role === 'string' ? role : undefined;
}

export async function resolveCapabilities(params: {
  uid: string;
  token?: Record<string, unknown>;
}): Promise<string[]> {
  const tokenData = params.token as Record<string, unknown> | undefined;
  const tokenRole = typeof tokenData?.role === 'string' ? String(tokenData.role) : undefined;
  const tokenCaps = Array.isArray(tokenData?.caps) 
    ? (tokenData.caps as unknown[]).map(String) 
    : null;
  if (tokenCaps && tokenCaps.length > 0) return ['bane:invoke', ...tokenCaps];

  const role = tokenRole ?? (await resolveRoleFromFirestore(params.uid));
  return capsForRole(role);
}

export async function enforceBaneCallable(params: {
  name: string;
  data: unknown;
  ctx: functions.https.CallableContext;
}): Promise<{ traceId: string; uid: string; capabilities: string[] }> {
  const uid = params.ctx.auth?.uid;

  // Run BANE even on unauthenticated attempts (fail-closed + traceId).
  if (!uid) {
    const decision = await baneHttpGuard({
      path: `fn:${params.name}`,
      bodyText: safeJson(params.data),
      identityId: undefined,
      capabilities: undefined,
      sessionIntegrity: { nonceOk: false, signatureOk: false, tokenFresh: false },
    });

    const traceId = decision.ok ? 'unknown' : decision.traceId;
    throw new functions.https.HttpsError('unauthenticated', 'NO_AUTH', { traceId });
  }

  const authData = params.ctx.auth as Record<string, unknown> | undefined;
  const capabilities = await resolveCapabilities({ uid, token: authData?.token as Record<string, unknown> | undefined });

  // Extract BANE metadata for replay protection
  const data = params.data as any;
  const nonce = data?._bane_nonce;
  const clientSequence = typeof data?._bane_seq === 'number' ? data._bane_seq : undefined;

  const decision = await baneHttpGuard({
    path: `fn:${params.name}`,
    bodyText: safeJson(params.data),
    identityId: uid,
    capabilities,
    nonce,
    clientSequence,
    sessionIntegrity: { nonceOk: true, signatureOk: true, tokenFresh: true },
  });

  if (!decision.ok) {
    const code = decision.retryAfterMs ? 'resource-exhausted' : 'permission-denied';
    throw new functions.https.HttpsError(code as functions.https.FunctionsErrorCode, decision.message, {
      traceId: decision.traceId,
      retryAfterMs: decision.retryAfterMs ?? null,
    });
  }

  return { traceId: decision.traceId, uid, capabilities };
}


export async function enforceBaneHttp(params: {
  req: functions.https.Request;
  res: functions.Response<Record<string, unknown>>;
  name: string;
  identityId?: string;
  capabilities?: string[];
  bodyText?: string;
}): Promise<{ ok: true; traceId: string } | { ok: false }> {
  const headers: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(params.req.headers)) {
    headers[k] = Array.isArray(v) ? v[0] : v;
  }

  const decision = await baneHttpGuard({
    path: params.req.path ? String(params.req.path) : `http:${params.name}`,
    headers,
    bodyText: params.bodyText ?? '',
    identityId: params.identityId,
    capabilities: params.capabilities,
    nonce: headers['x-bane-nonce'],
    clientSequence: headers['x-bane-seq'] ? parseInt(headers['x-bane-seq'], 10) : undefined,
    sessionIntegrity: params.identityId
      ? { nonceOk: true, signatureOk: true, tokenFresh: true }
      : { nonceOk: false, signatureOk: false, tokenFresh: false },
  });

  if (!decision.ok) {
    params.res.setHeader('x-bane-trace-id', decision.traceId);
    if (decision.retryAfterMs) {
      params.res.setHeader('retry-after', String(Math.ceil(decision.retryAfterMs / 1000)));
    }
    params.res.status(decision.status).json({ 
      ok: false, 
      message: decision.message, 
      traceId: decision.traceId 
    });
    return { ok: false };
  }

  params.res.setHeader('x-bane-trace-id', decision.traceId);
  return { ok: true, traceId: decision.traceId };
}
