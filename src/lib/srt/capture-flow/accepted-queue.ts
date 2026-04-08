/**
 * SRT Accepted Photo Processing Queue (UX Dispatcher)
 *
 * Implements the non-blocking post-accept queue required by UTCB-004.
 * This is ONLY a local UX dispatcher. Sovereign state transitions
 * live in the Cloud/Edge Functions Spine.
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

export type QueueItemState =
  | 'pending_submission'
  | 'accepted_pending_queue'
  | 'accepted_unanalyzed'
  | 'accepted_analysis_requested'
  | 'analysis_in_progress'
  | 'analysis_complete'
  | 'failed';

export interface AcceptedQueueItem {
  readonly queueId: string;
  readonly localUri: string;
  readonly sourceType: 'jpeg' | 'png' | 'raw' | 'heic';
  readonly acceptedAt: string;
  state: QueueItemState;
  sourceRecordId?: string;
  errorMessage?: string;
}

export type QueueStateChangeListener = (items: ReadonlyArray<AcceptedQueueItem>) => void;

class AcceptedQueueManager {
  private queue: AcceptedQueueItem[] = [];
  private isProcessing: boolean = false;
  private listeners: Set<QueueStateChangeListener> = new Set();

  /**
   * Pushes a batch of accepted local URIs into the non-blocking queue.
   */
  public enqueueBatch(localUris: string[], sourceType: 'jpeg' | 'png' | 'raw' | 'heic' = 'jpeg'): void {
    const timestamp = new Date().toISOString();
    localUris.forEach((uri) => {
      this.queue.push({
        queueId: `q-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        localUri: uri,
        sourceType,
        acceptedAt: timestamp,
        state: 'pending_submission',
      });
    });

    this.notifyListeners();
    this.startProcessing(); // Triggers async loop if not already running
  }

  public subscribe(listener: QueueStateChangeListener): () => void {
    this.listeners.add(listener);
    listener([...this.queue]);
    return () => this.listeners.delete(listener);
  }

  public getQueueState(): ReadonlyArray<AcceptedQueueItem> {
    return this.queue;
  }

  private notifyListeners(): void {
    const frozenCopy = [...this.queue];
    this.listeners.forEach((l) => l(frozenCopy));
  }

  /**
   * Core non-blocking sequential UI dispatcher loop.
   */
  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (true) {
        const nextItem = this.queue.find((item) => item.state === 'pending_submission');
        if (!nextItem) break; // Queue drained

        await this.submitToBackend(nextItem);
      }
    } finally {
      this.isProcessing = false;
      this.notifyListeners(); 
    }
  }

  private async submitToBackend(item: AcceptedQueueItem): Promise<void> {
    try {
      // 1. Submit to Edge Spine
      const functions = getFunctions();
      const acceptBatch = httpsCallable(functions, 'srt-acceptMediaBatch');
      
      const payload = {
        captureSessionId: `sess-${Date.now()}`,
        acceptedCandidateIds: [item.queueId],
        actorId: 'mock-actor',
        subsystem: 'overscite'
      };

      await acceptBatch(payload);

      // Default Resting State under CB-005 Doctrine
      item.state = 'accepted_unanalyzed';
      this.notifyListeners();

    } catch (e: any) {
      console.error(`[QUEUE_ERROR] Failed to submit to edge ${item.queueId}:`, e);
      item.state = 'failed';
      item.errorMessage = e?.message || 'Unknown network error';
      this.notifyListeners();
    }
  }

  /**
   * Explicit action to burn compute and analyze the resting media.
   */
  public async requestAnalysisForItems(queueIds: string[]): Promise<void> {
    const functions = getFunctions();
    const requestAnalysis = httpsCallable(functions, 'srt-requestSrtMediaAnalysis');

    for (const qid of queueIds) {
      const item = this.queue.find(q => q.queueId === qid);
      if (item && item.state === 'accepted_unanalyzed') {
        item.state = 'accepted_analysis_requested';
        this.notifyListeners();

        try {
          // Send explicit request to the edge router
          await requestAnalysis({
            acceptedMediaId: qid,
            sourceMediaId: `src-${qid}`, // Resolved via firestore normally
            subsystem: 'overscite',
            actorId: 'mock-actor'
          });
          // State polling would normally hydrate analysis progression here.
        } catch (e: any) {
            console.error(`[QUEUE_ERROR] Analysis request failed for ${qid}`, e);
            item.state = 'failed';
            item.errorMessage = e?.message || 'Unknown analysis error';
            this.notifyListeners();
        }
      }
    }
  }
}

export const srtAcceptedQueue = new AcceptedQueueManager();
