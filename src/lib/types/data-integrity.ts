export enum DataConfidence {
  VERIFIED_LIVE = 'VERIFIED_LIVE',
  CACHED = 'CACHED',
  DELAYED_OR_WARNING = 'DELAYED_OR_WARNING',
}

export interface IntegrityStampedData<T> {
  payload: T;
  sourceId: string;
  timestamp: number;
  confidence: DataConfidence;
  verificationHash: string; 
}
export enum DataConfidence {
  VERIFIED_LIVE = 'VERIFIED_LIVE',
  CACHED = 'CACHED',
  DELAYED_OR_WARNING = 'DELAYED_OR_WARNING',
}

export interface IntegrityStampedData<T> {
  payload: T;
  sourceId: string;
  timestamp: number;
  confidence: DataConfidence;
  verificationHash: string; 
}
