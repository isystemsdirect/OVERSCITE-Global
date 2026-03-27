// src/lib/lari-repo/truth-seal-service.ts
import { ReportVersion, ReportTruthSeal, FindingOverlay } from './types';
import { auditService } from './audit-service';
import { BaneChannel } from '../bane/baneChannel';
import { PolicyEngine } from '../bane/policyEngine';
import { DefaultAdapters } from '../bane/adapters';
import { Context } from '../bane/context';
import { Audit } from '../bane/audit';
import { v4 as uuidv4 } from 'uuid';

export class TruthSealService {
    private bane: BaneChannel;

    constructor() {
        const engine = new PolicyEngine(async () => ({
            id: 'truth-seal-bundle',
            version: '1.0.0',
            roles: ['director', 'admin'] as any,
            allowlistedDomains: [],
            filePaths: [],
            sensors: [],
            demonMode: false,
            updatedAt: new Date().toISOString()
        }));
        
        const auditInstance = new Audit(async (record) => {
            // Internal BANE audit logging
        });
        
        this.bane = new BaneChannel(engine, DefaultAdapters, auditInstance);
    }

    async sealReport(
        reportVersion: ReportVersion, 
        findings: FindingOverlay[], 
        context: Context
    ): Promise<ReportTruthSeal> {
        // Evaluate via BANE truth-seal-policy
        const result = await this.bane.invoke<any>('report.seal', reportVersion.reportId, {
            ...context,
            attributes: {
                reportId: reportVersion.reportId,
                versionNumber: reportVersion.versionNumber,
                findingsCount: findings.length,
                truthMode: reportVersion.truthMode
            }
        });

        if (result.decision.type === 'DENY') {
            await auditService.logEvent({
                eventClass: 'truth_gate_denied',
                type: 'report.seal_denied',
                actorId: context.subject,
                actorRole: context.userRole,
                reportId: reportVersion.reportId,
                timestamp: new Date().toISOString(),
                reason: result.decision.reasonCode
            });
            throw new Error(`Truth sealing denied: ${result.decision.reasonCode}`);
        }

        const seal: ReportTruthSeal = {
            sealId: uuidv4(),
            reportId: reportVersion.reportId,
            reportVersionNumber: reportVersion.versionNumber,
            sealedAt: new Date().toISOString(),
            sealedBy: context.subject,
            sealedByRole: context.userRole,
            includedFindingIds: reportVersion.includedFindingIds,
            truthMode: reportVersion.truthMode === 'exception_flagged' ? 'exception' : 'standard',
            sourceVersionId: reportVersion.reportId + '-' + reportVersion.versionNumber, // Symbolic
            auditEventId: uuidv4(),
            sealStatus: 'active'
        };

        // Notify Verification Service (register for mock lookup)
        try {
            const { sealVerificationService } = await import('./seal-verification-service');
            sealVerificationService.registerSeal(seal);
        } catch (e) {
            console.error('Failed to register seal with verification service', e);
        }

        await auditService.logEvent({
            eventClass: 'truth_sealed',
            type: 'report.sealed',
            actorId: context.subject,
            actorRole: context.userRole,
            reportId: reportVersion.reportId,
            timestamp: seal.sealedAt,
            newState: seal,
            correlationId: seal.sealId
        });

        return seal;
    }

    async invalidateSeal(reportId: string, reason: string, context: Context): Promise<void> {
        await auditService.logEvent({
            eventClass: 'truth_seal_invalidated',
            type: 'report.seal_invalidated',
            actorId: context.subject,
            actorRole: context.userRole,
            reportId,
            timestamp: new Date().toISOString(),
            reason
        });
        // In real system: update DB record
    }
}

export const truthSealService = new TruthSealService();
