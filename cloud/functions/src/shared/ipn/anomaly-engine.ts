import { IPNAnomalyEvent } from './types';

export function determineAnomalySeverity(category: string, confidence: number): 'low' | 'medium' | 'high' | 'critical' {
    if (category === 'identity' || category === 'signature_mismatch') {
        return confidence > 80 ? 'critical' : 'high';
    }
    
    if (category === 'conflict_pressure' || category === 'rebel_stability') {
        return confidence > 60 ? 'high' : 'medium';
    }

    if (category === 'traffic_burst' || category === 'heartbeat') {
        return 'medium';
    }

    return 'low';
}

export function classifyAnomaly(rawSignalData: any): IPNAnomalyEvent {
    // Advisory Generation. Not an executed state. 
    // In actual implementation, data routes to LARI-engine prompts.
    
    const category = rawSignalData.inferredCategory || 'posture_drift';
    const confidence = rawSignalData.confidenceScore || 45;

    return {
        id: `anm-${Date.now()}`,
        category: category,
        severity: determineAnomalySeverity(category, confidence),
        confidenceScore: confidence,
        evidenceSummary: rawSignalData.evidence || 'No definitive evidence bound.',
        recommendedAction: 'Requires operator classification review.',
        requiresBaneReview: true,
        requiresHumanReview: true,
        detectedAt: new Date()
    };
}
