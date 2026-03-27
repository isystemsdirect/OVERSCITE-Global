// src/lib/lari-repo/versioning-service.ts
import { ArtifactVersion, ReportVersion } from './types';
import { auditService } from './audit-service';
import { v4 as uuidv4 } from 'uuid';

export class VersioningService {
    async createArtifactVersion(
        artifactId: string, 
        versionNumber: number, 
        priorVersionId: string | undefined, 
        actorId: string, 
        reason: string
    ): Promise<ArtifactVersion> {
        const version: ArtifactVersion = {
            artifactId,
            versionNumber,
            priorVersionId,
            createdAt: new Date().toISOString(),
            createdBy: actorId,
            changeReason: reason
        };

        await auditService.logEvent({
            type: 'artifact.version_created',
            actorId,
            actorRole: 'admin',
            artifactId,
            timestamp: version.createdAt,
            newState: version,
            reason
        });

        return version;
    }

    async createReportVersion(
        reportId: string, 
        versionNumber: number, 
        priorVersionId: string | undefined, 
        actorId: string, 
        includedFindingIds: string[],
        truthMode: 'standard' | 'exception_flagged'
    ): Promise<ReportVersion> {
        const version: ReportVersion = {
            reportId,
            versionNumber,
            priorVersionId,
            generatedAt: new Date().toISOString(),
            generatedBy: actorId,
            includedFindingIds,
            truthMode
        };

        await auditService.logEvent({
            type: 'report.version_created',
            actorId,
            actorRole: 'admin',
            artifactId: reportId,
            timestamp: version.generatedAt,
            newState: version
        });

        return version;
    }
}

export const versioningService = new VersioningService();
