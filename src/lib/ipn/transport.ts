import { IPNTransportRequest } from './types';
import { createPayloadHash } from './crypto';

export async function constructTransportRequest(
    sessionId: string,
    channelType: 'TELEMETRY' | 'CONTROL' | 'MEDIA' | 'CONFIG',
    source: string,
    target: string,
    requestedAction: 'READ_TELEMETRY' | 'SEND_COMMAND' | 'REQUEST_CONFIG' | 'STREAM_MEDIA' | 'ESTABLISH_PEERING',
    payloadOrRef: any
): Promise<IPNTransportRequest> {
    
    const payloadHash = await createPayloadHash(payloadOrRef);

    return {
        id: `tr-${Date.now().toString(36)}`,
        sessionId,
        channelType,
        payloadRef: typeof payloadOrRef === 'string' ? payloadOrRef : undefined,
        payloadHash,
        source,
        target,
        requestedAction,
        routeClass: 'GOVERNED_RELAY_V1',
        requestedAt: new Date()
    };
}
