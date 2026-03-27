// policy.ts
import type { DevicePosture, UserRole } from './context';

import type { Context } from './context';
import type { Decision } from './decision';

export interface Policy {
  id: string;
  name: string;
  description: string;
  evaluate: (action: string, resource: string, context: Context) => Promise<Decision>;
}

export interface DomainRule {
  domain: string;
  methods: string[];
}

export interface FilePathRule {
  prefix: string;           // e.g. "reports/"
  operations: Array<'read' | 'write' | 'append'>;
}

export interface SensorRule {
  sensor: 'camera' | 'lidar';
  allowedPostures: DevicePosture[];
}

export interface PolicyBundle {
  id: string;
  version: string;
  roles: UserRole[];
  allowlistedDomains: DomainRule[];
  filePaths: FilePathRule[];
  sensors: SensorRule[];
  demonMode: boolean;
  updatedAt: string;
}
