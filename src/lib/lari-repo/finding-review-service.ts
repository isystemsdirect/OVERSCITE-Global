// src/lib/lari-repo/finding-review-service.ts
import { FindingOverlay, ReviewStatus } from './types';
import { auditService } from './audit-service';

export class FindingReviewService {
  private overlays: FindingOverlay[] = [];

  constructor() {
    // Mock initial data
  }

  async getOverlaysForFile(fileId: string): Promise<FindingOverlay[]> {
    return this.overlays.filter(o => o.sourceFileId === fileId);
  }

  async updateFindingStatus(
    findingId: string, 
    status: ReviewStatus, 
    reviewerId: string,
    correctionText?: string
  ): Promise<void> {
    const finding = this.overlays.find(o => o.id === findingId);
    if (!finding) throw new Error('Finding not found');

    // Integrity Check: If report was sealed, block mutation
    try {
        const { repoService } = await import('./repo-service');
        const file = await repoService.getFile(finding.sourceFileId);
        if (file?.metadata?.isSealed) {
            throw new Error('SEALED_REPORT_READ_ONLY: Post-seal truth-bearing mutation blocked. Create new version instead.');
        }
    } catch (e: any) {
        if (e.message.includes('SEALED_REPORT_READ_ONLY')) throw e;
        console.error('Integrity check failed', e);
    }

    const priorState = { ...finding.review };

    if (status === 'corrected') {
        const overlay = finding; // The finding itself is the overlay
        if (overlay) {
            const { correctionLineageService } = await import('./correction-lineage-service');
            const { correctionEscalationService } = await import('./correction-escalation-service');
            
            const { correction } = await correctionLineageService.createCorrection(overlay, {}, correctionText || 'Manual correction', reviewerId);
            
            const isMaterial = correctionEscalationService.isMaterialChange(correction.before, correction.after);
            if (isMaterial) {
                await correctionEscalationService.triggerEscalation(overlay, correction, 'MATERIAL_CHANGE_DETECTED', reviewerId);
                finding.review.reportEligibility = 'ineligible'; // Block until resolved
            } else {
                finding.review.reportEligibility = 'eligible';
            }
        }
    } else if (status === 'accepted') {
        finding.review.reportEligibility = 'eligible';
    } else {
        finding.review.reportEligibility = 'ineligible';
    }

    await auditService.logEvent({
      eventClass: 'correction_applied',
      type: 'finding.review',
      actorId: reviewerId,
      actorRole: 'reviewer',
      findingId,
      artifactId: finding.sourceFileId,
      priorState,
      newState: finding.review,
      timestamp: new Date().toISOString()
    });

    // Integrity Check: If report was sealed, invalidate it
    try {
        const { repoService } = await import('./repo-service');
        const { truthSealService } = await import('./truth-seal-service');
        const file = await repoService.getFile(finding.sourceFileId);
        if (file?.metadata?.isSealed) {
            await truthSealService.invalidateSeal(finding.sourceFileId, 'TRUTH_BEARING_MUTATION_POST_SEAL', {
                subject: reviewerId,
                userRole: 'reviewer',
                devicePosture: 'secure'
            });
            // Update metadata to reflect invalidation
            file.metadata.isSealed = false;
            file.metadata.sealStatus = 'invalidated';
        }
    } catch (e) {
        console.error('Integrity invalidation failed', e);
    }
    
    // Terminal return for void promise
    return;
  }
}

export const findingReviewService = new FindingReviewService();
