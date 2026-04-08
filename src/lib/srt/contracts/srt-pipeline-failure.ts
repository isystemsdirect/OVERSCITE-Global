/**
 * SRT Pipeline Failure Classes
 */

export type PipelineFailureClass = 'retryable' | 'quarantine_worthy' | 'terminal';

export interface SrtPipelineFailure {
  queueId: string;
  sourceMediaId?: string;
  failureClass: PipelineFailureClass;
  errorCode: string;
  errorMessage: string;
  timestamp: string;
  failedState: string; // The state active when failed
  stackTrace?: string;
}
