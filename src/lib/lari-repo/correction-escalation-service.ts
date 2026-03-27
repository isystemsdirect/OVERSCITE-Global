// src/lib/lari-repo/correction-escalation-service.ts
import { FindingOverlay, CorrectionRecord, CorrectionEscalation, Severity, Geometry } from './types';
import { auditService } from './audit-service';
import { v4 as uuidv4 } from 'uuid';

export class CorrectionEscalationService {
    isMaterialChange(before: any, after: any): boolean {
        // Severity change always material
        if (after.severity && after.severity !== before.severity) return true;
        
        // Category change always material
        if (after.category && after.category !== before.category) return true;
        
        // Geometry material change (simplified check)
        if (after.geometry) {
            if (JSON.stringify(after.geometry) !== JSON.stringify(before.geometry)) return true;
        }

        return false;
    }

    async triggerEscalation(
        finding: FindingOverlay, 
        correction: CorrectionRecord, 
        triggerReason: string,
        actorId: string
    ): Promise<CorrectionEscalation> {
        const escalation: CorrectionEscalation = {
            escalationId: uuidv4(),
            findingId: finding.id,
            correctionId: correction.id,
            triggerReason,
            escalatedAt: new Date().toISOString(),
            escalatedBy: actorId,
            escalationStatus: 'pending_review'
        };

        await auditService.logEvent({
            eventClass: 'correction_escalated',
            type: 'finding.correction_escalated',
            actorId,
            actorRole: 'reviewer',
            findingId: finding.id,
            timestamp: escalation.escalatedAt,
            newState: escalation,
            reason: triggerReason
        });

        return escalation;
    }

    async resolveEscalation(
        escalationId: string, 
        status: 'approved' | 'denied', 
        actorId: string, 
        reason: string
    ): Promise<void> {
        // Logic to update escalation status in a real DB
        await auditService.logEvent({
            eventClass: 'correction_escalation_resolved',
            type: `finding.escalation_${status}`,
            actorId,
            actorRole: 'supervisor',
            timestamp: new Date().toISOString(),
            newState: { status },
            reason
        });
    }
}

export const correctionEscalationService = new CorrectionEscalationService();
