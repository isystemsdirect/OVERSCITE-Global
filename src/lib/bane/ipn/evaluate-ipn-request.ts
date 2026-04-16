import { IPNTransportRequest } from '../../../ipn/types';

export function evaluateTransportRequest(request: IPNTransportRequest, policyPackVersion: string, currentPosture: string): { decision: 'ALLOW' | 'DENY' | 'CONSTRAIN' | 'REVIEW_REQUIRED', reason: string } {
    // Phase 1 Governed Relay logic
    // We enforce default deny unless explicitly proven safe
    
    if (request.requestedAction === 'SEND_COMMAND') {
        // Direct unregulated control commands are blocked in Phase 1 MVP
        if (currentPosture === 'CONTROLLED_OPEN') {
           return { decision: 'DENY', reason: 'High-conflict posture actively blocks direct commands.' };
        }
        return { decision: 'REVIEW_REQUIRED', reason: 'BANE explicit review required for consequential commands.' };
    }
    
    if (request.requestedAction === 'READ_TELEMETRY') {
        return { decision: 'ALLOW', reason: 'Telemetry read operations permitted within granted scope.' };
    }
    
    // Default fallback
    return { decision: 'DENY', reason: 'BANE Zero-Trust Default: Unrecognized or unsanctioned transport attempt' };
}
