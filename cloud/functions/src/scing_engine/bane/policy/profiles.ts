export type BanePolicyProfile = {
  id: string;
  name: string;
  version: string;
  rulesetId: string;
  defaults: {
    defaultVerdict: 'deny';
    strictMode: boolean;
    escalationEnabled: boolean;
    quarantineOnDeny: boolean;
    lockoutOnRepeat: boolean;
    incidentOnCritical: boolean;
    enforceStrictTime: boolean;
    maxDriftMs: number;
  };
};

export const BANE_POLICY_PROFILES: Record<string, BanePolicyProfile> = {
  bane_fog_v1: {
    id: 'bane_fog_v1',
    name: 'BANE Fear-of-God Mode',
    version: '1.0.0',
    rulesetId: 'fog-core',
    defaults: {
      defaultVerdict: 'deny',
      strictMode: true,
      escalationEnabled: true,
      quarantineOnDeny: true,
      lockoutOnRepeat: true,
      incidentOnCritical: true,
      enforceStrictTime: true,
      maxDriftMs: 1,
    },
  },
  arc_level_1: {
    id: 'arc_level_1',
    name: 'ARC Authorized Level 1',
    version: '1.0.0',
    rulesetId: 'arc-standard',
    defaults: {
      defaultVerdict: 'deny',
      strictMode: true,
      escalationEnabled: false,
      quarantineOnDeny: true,
      lockoutOnRepeat: true,
      incidentOnCritical: true,
      enforceStrictTime: true,
      maxDriftMs: 1000,
    },
  },
  overscite_admin: {
    id: 'overscite_admin',
    name: 'OVERSCITE Workspace Admin',
    version: '1.0.0',
    rulesetId: 'overscite-core',
    defaults: {
      defaultVerdict: 'deny',
      strictMode: false,
      escalationEnabled: true,
      quarantineOnDeny: false,
      lockoutOnRepeat: true,
      incidentOnCritical: true,
      enforceStrictTime: false,
      maxDriftMs: 5000,
    },
  },
};
