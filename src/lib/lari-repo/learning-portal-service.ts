// src/lib/lari-repo/learning-portal-service.ts
import { LearningPacket } from './types';
import { auditService } from './audit-service';

export class LearningPortalService {
  private queue: LearningPacket[] = [];

  async dispatchToLearningQueue(packet: Omit<LearningPacket, 'id' | 'timestamp' | 'status'>): Promise<void> {
    const newPacket: LearningPacket = {
      ...packet,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'queued'
    };
    this.queue.push(newPacket);

    await auditService.logEvent({
      type: 'learning_queue_dispatched',
      actorId: 'system', // or current user
      actorRole: 'system',
      findingId: packet.findingId,
      timestamp: newPacket.timestamp,
      newState: newPacket
    });
  }

  async getQueue(): Promise<LearningPacket[]> {
    return this.queue;
  }
}

export const learningPortalService = new LearningPortalService();
