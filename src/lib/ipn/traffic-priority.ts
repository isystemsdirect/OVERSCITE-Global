import { IPNRecommendationEvent } from './types';
import { createRecommendation } from './recommendation-engine';

export function analyzeTrafficPriority(
    networkPressure: number,
    isRebelLinked: boolean
): IPNRecommendationEvent | null {
    
    if (networkPressure > 70) {
        if (isRebelLinked) {
            return createRecommendation(
                'TRAFFIC_PRIORITY',
                'Network conflict pressure high. Recommend freezing MEDIA streams to preserve REBEL Telemetry transit.',
                90,
                'conflict_pressure_calc'
            );
        } else {
             return createRecommendation(
                'COMPUTATIONAL_ADVISORY' as any, // Mapped generic fallback
                'High pressure. Recommend dialing back non-essential channel requests.',
                70,
                'conflict_pressure_calc'
            );
        }
    }
    return null;
}
