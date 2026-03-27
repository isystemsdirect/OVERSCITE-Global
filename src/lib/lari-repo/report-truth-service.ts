// src/lib/lari-repo/report-truth-service.ts
import { FindingOverlay, ReportVersion } from './types';
import { auditService } from './audit-service';
import { BaneChannel } from '../bane/baneChannel';
import { PolicyEngine } from '../bane/policyEngine';
import { DefaultAdapters } from '../bane/adapters';
import { Context } from '../bane/context';

import { Audit } from '../bane/audit';

export class ReportTruthService {
    private bane: BaneChannel;

    constructor() {
        // In a real app, these would be injected or globally managed
        const engine = new PolicyEngine(async () => ({
            id: 'report-truth-bundle',
            version: '1.0.0',
            roles: ['reviewer', 'director'] as any,
            allowlistedDomains: [],
            filePaths: [],
            sensors: [],
            demonMode: false,
            updatedAt: new Date().toISOString()
        }));
        // BaneChannel requires Audit instance
        const auditInstance = new Audit(async (record) => {
            // No-op for now
        });
        this.bane = new BaneChannel(engine, DefaultAdapters, auditInstance);
    }

    async getReportEligibleFindings(findings: FindingOverlay[], _context: Context): Promise<FindingOverlay[]> {
        return findings.filter(f => {
            if (f.review.status === 'accepted' || f.review.status === 'corrected') {
                return true;
            }
            return false;
        });
    }

    async finalizeReport(reportId: string, findings: FindingOverlay[], context: Context): Promise<ReportVersion> {
        const pendingCount = findings.filter(f => f.review.status === 'pending').length;
        
        const result = await this.bane.invoke<any>('report.finalize', reportId, {
            ...context,
            attributes: { pendingFindingsCount: pendingCount }
        });

        if (result.decision.type === 'DENY') {
            throw new Error(`Report finalization denied: ${result.decision.reasonCode}`);
        }

        const eligibleFindingIds = findings
            .filter(f => f.review.status === 'accepted' || f.review.status === 'corrected')
            .map(f => f.id);

        const version: ReportVersion = {
            reportId,
            versionNumber: 1, // Logic for incrementing would be in versioning-service
            generatedAt: new Date().toISOString(),
            generatedBy: context.subject,
            includedFindingIds: eligibleFindingIds,
            truthMode: 'standard'
        };

        await auditService.logEvent({
            type: 'report.finalize',
            actorId: context.subject,
            actorRole: context.userRole,
            artifactId: reportId,
            timestamp: version.generatedAt,
            newState: version
        });

        return version;
    }
}

export const reportTruthService = new ReportTruthService();
