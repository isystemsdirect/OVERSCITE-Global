import * as functions from 'firebase-functions';
import { createRevocationEvent } from '../shared/ipn/revocation';
import { evaluateRevocationScopeAllowed } from '../shared/bane/ipn/evaluate-revocation-scope';
import { constructAuditRecord } from '../shared/ipn/audit';

export const revokeDevice = functions.https.onCall(async (data: any, context: any) => {
    // 1. Request Parse & Actor Validation
    if (!context?.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'ARC-bound identity required');
    }

    const { deviceId, reason, authorityBasis, requestedScope } = data;
    if (!deviceId) throw new functions.https.HttpsError('invalid-argument', 'Target Device ID is required');

    const scopeToRequest = requestedScope || 'DEVICE';
    const declaredAuthority = authorityBasis || 'Operator Command';
    const actorRoleContext = context.auth.token || {};

    // 2. Target Normalization & BANE Evaluation
    const evaluation = evaluateRevocationScopeAllowed(
        context.auth.uid,
        scopeToRequest,
        actorRoleContext,
        declaredAuthority
    );

    // 3. Evaluated Scope Derivation & Pre-execution State (Reject Path)
    if (!evaluation.allowed) {
        await constructAuditRecord(
            'null-session', 
            context.auth.uid, 
            'DEVICE_REVOKE_REQUEST', 
            'DENY', 
            evaluation.reason,
            undefined, // requestId
            deviceId,
            scopeToRequest,
            evaluation.evaluatedScope || undefined,
            undefined, // executedScope
            declaredAuthority,
            reason || 'Unknown',
            evaluation.resultState,
            'IPN_POSTURE_DOCTRINE'
        );
        throw new functions.https.HttpsError('permission-denied', evaluation.reason);
    }

    // 4. Execution
    const executedScope = evaluation.evaluatedScope!;
    const event = createRevocationEvent(executedScope, deviceId, reason || 'Operator Terminated', context.auth.uid);
    // Annotate supplementary audit details as required by tightened types
    event.policyReference = 'IPN_POSTURE_DOCTRINE_REVOCATION';
    event.authorityBasis = declaredAuthority;

    functions.logger.info(`DEVICE REVOCATION EXECUTED BY ${context.auth.uid} for Target ${deviceId} [Scope: ${executedScope}] under ${declaredAuthority}`);
    
    // Commit to Firestore / ipn_devices -> postureState = BLOCKED, ipn_audit insert.
    
    // 5. Final Audit Construction & Result Emission
    const auditRecord = await constructAuditRecord(
        'device-bound-session',
        context.auth.uid, 
        'DEVICE_REVOKE_REQUEST', 
        'ALLOW', 
        evaluation.reason,
        undefined, // requestId
        deviceId,
        scopeToRequest,
        evaluation.evaluatedScope || undefined,
        executedScope,
        declaredAuthority,
        reason || 'Operator Terminated',
        evaluation.resultState,
        'IPN_POSTURE_DOCTRINE_REVOCATION'
    );

    return { success: true, event, auditRecord };
});
