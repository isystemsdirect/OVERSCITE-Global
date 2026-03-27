// src/lib/lari-repo/correction-lineage-service.ts
import { FindingOverlay, CorrectionRecord, FinalTruthRecord } from './types';
import { auditService } from './audit-service';
import { v4 as uuidv4 } from 'uuid';

export class CorrectionLineageService {
    async createCorrection(
        original: FindingOverlay, 
        correctedData: Partial<FindingOverlay>, 
        reason: string, 
        reviewerId: string
    ): Promise<{ correction: CorrectionRecord; truth: FinalTruthRecord }> {
        if (!reason || reason.length < 5) {
            throw new Error('Correction reason is mandatory and must be descriptive.');
        }

        const correction: CorrectionRecord = {
            id: uuidv4(),
            findingId: original.id,
            derivedFromProposalId: original.audit.proposalId || 'engine-proposal-1',
            before: {
                title: original.title,
                description: original.description,
                severity: original.severity,
                geometry: original.geometry
            },
            after: {
                title: correctedData.title,
                description: correctedData.description,
                severity: correctedData.severity,
                geometry: correctedData.geometry
            },
            reason,
            reviewerId,
            timestamp: new Date().toISOString()
        };

        const truth: FinalTruthRecord = {
            truthId: uuidv4(),
            findingId: original.id,
            sourceType: 'corrected',
            activeReportEligibility: true,
            approvedBy: reviewerId,
            approvedAt: correction.timestamp
        };

        await auditService.logEvent({
            type: 'finding.correct',
            actorId: reviewerId,
            actorRole: 'reviewer', // Ideally from context
            findingId: original.id,
            timestamp: correction.timestamp,
            priorState: original.review,
            newState: { status: 'corrected', lineageId: correction.id },
            reason
        });

        return { correction, truth };
    }

    getDelta(correction: CorrectionRecord) {
        const deltas: string[] = [];
        if (correction.after.title && correction.after.title !== correction.before.title) {
            deltas.push(`Title: "${correction.before.title}" -> "${correction.after.title}"`);
        }
        if (correction.after.description && correction.after.description !== correction.before.description) {
            deltas.push(`Description changed`);
        }
        if (correction.after.severity && correction.after.severity !== correction.before.severity) {
            deltas.push(`Severity: ${correction.before.severity} -> ${correction.after.severity}`);
        }
        return deltas;
    }
}

export const correctionLineageService = new CorrectionLineageService();
