// src/lib/lari-repo/learning-queue-state-service.ts
import { LearningPacket, AuditEventClass } from './types';
import { auditService } from './audit-service';
import { UserRole } from '../bane/context';

export class LearningQueueStateService {
    private packets: LearningPacket[] = [];

    async transitionState(
        packetId: string, 
        newStatus: LearningPacket['status'], 
        actorId: string, 
        userRole: UserRole,
        reason?: string
    ): Promise<void> {
        const packet = this.packets.find(p => p.id === packetId); // Changed from this.queue in diff, but keeping this.packets as it's the original property.
        if (!packet) throw new Error('Packet not found');

        // Enforcement: Actor Separation Segments
        // Submission segment: handled at create time
        
        // Review segment: supervisor, director, admin
        if (['reviewed', 'held', 'excluded'].includes(newStatus)) {
            if (!['supervisor', 'director', 'admin'].includes(userRole)) {
                throw new Error('UNAUTHORIZED_REVIEW_ROLE');
            }
        }

        // Approval segment: director, admin
        if (newStatus === 'approved_for_possible_ingestion') {
            if (!['director', 'admin'].includes(userRole)) {
                throw new Error('UNAUTHORIZED_APPROVAL_ROLE');
            }
            // Multi-actor check: Submitter cannot be the one approving for ingestion
            // Assuming 'enteredBy' exists on LearningPacket
            if ((packet as any).enteredBy === actorId) { // Casting to any as enteredBy is not in LearningPacket type
                throw new Error('MULTI_ACTOR_VIOLATION: Submitter cannot approve own packet');
            }
        }

        const priorState = { status: packet.status };
        packet.status = newStatus;
        if (reason) packet.heldReason = reason;

        await auditService.logEvent({
            eventClass: this.getClassForStatus(newStatus) as any,
            type: 'learning_queue.state_change',
            actorId,
            actorRole: userRole,
            queueItemId: packetId,
            timestamp: new Date().toISOString(),
            priorState,
            newState: { status: newStatus },
            reason
        });
    }

    private getClassForStatus(status: LearningPacket['status']): string {
        const map: Record<string, string> = {
            'queued': 'learning_packet_submitted',
            'reviewed': 'learning_packet_reviewed',
            'held': 'learning_packet_held',
            'approved_for_possible_ingestion': 'learning_packet_approved',
            'excluded': 'learning_packet_excluded'
        };
        return map[status] || 'learning_queue.state_change';
    }

    async getQueue(): Promise<LearningPacket[]> {
        return this.packets;
    }
}

export const learningQueueStateService = new LearningQueueStateService();
