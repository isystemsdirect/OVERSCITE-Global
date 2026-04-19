// context.ts
export type UserRole = 'INSPECTOR' | 'ADMIN' | 'AUDITOR' | 'SYSTEM' | 'reviewer' | 'director' | 'supervisor';

export type DevicePosture = 'HEALTHY' | 'DEGRADED' | 'ROOTED' | 'UNKNOWN' | 'secure';

export interface Context {
  subject: string;          // e.g. "scing-orchestrator", "lari-vision"
  userRole: UserRole;
  inspectionId?: string;
  devicePosture: DevicePosture;
  clientId?: string;        // tenant / customer
  attributes?: Record<string, any>;
  traceId?: string;         // for correlation
}
