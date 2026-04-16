import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { BCIBenchmarkService } from '../shared/bane/crypto/benchmark';
import { enforceBaneCallable } from '../bane/enforce';

/**
 * BCI runCryptoBenchmark EntryPoint (V2)
 * 
 * Non-production route for qualifying runtime tolerance.
 */
export const bciRunCryptoBenchmark = onCall(async (request) => {
    // Strict admin gate for benchmark tools
    const gate = await enforceBaneCallable({ 
        name: 'bciRunCryptoBenchmark', 
        data: request.data, 
        ctx: request as any 
    });

    if (!gate.capabilities.includes('admin') && !gate.capabilities.includes('inspector')) {
        throw new HttpsError('permission-denied', 'Benchmark tools require admin/inspector capability');
    }

    const primitive = request.data.primitive;
    if (!primitive) {
        throw new HttpsError('invalid-argument', 'primitive required');
    }

    try {
        const results = await BCIBenchmarkService.runSuite(primitive);
        return {
            ok: true,
            primitive,
            results,
            environment: 'backend-node-20'
        };
    } catch (e: any) {
        throw new HttpsError('internal', e.message);
    }
});
