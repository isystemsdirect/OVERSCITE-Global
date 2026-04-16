import { IPNSession } from './types';

export async function issueSession(
    arcId: string,
    workspaceId: string,
    sourceDeviceId: string,
    targetDeviceId: string,
    requestedScope: string[],
    baneDecisionId: string,
    ttlMinutes: number = 60
): Promise<IPNSession> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMinutes * 60000);

    const session: IPNSession = {
        id: `sess-${Date.now().toString(36)}`,
        arcId,
        workspaceId,
        sourceDeviceId,
        targetDeviceId,
        trustState: 'GRANTED',
        requestedScope,
        grantedScope: requestedScope, // In Phase 1, we grant what was validated by BANE
        createdAt: now,
        expiresAt,
        baneDecisionId
    };

    return session;
}

export function isSessionExpired(session: IPNSession): boolean {
    return new Date() > session.expiresAt;
}

export function isValidSessionScope(session: IPNSession, requiredScope: string): boolean {
    return session.grantedScope.includes(requiredScope) && !isSessionExpired(session) && session.trustState === 'GRANTED';
}
