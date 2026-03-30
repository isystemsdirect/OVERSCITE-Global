import { BANE_POLICY_PROFILES } from './profiles';

export type PolicyHints = {
  strictMode: boolean;
  defaultVerdict: 'deny' | 'allow';
  escalationEnabled: boolean;
  quarantineOnDeny: boolean;
  lockoutOnRepeat: boolean;
  incidentOnCritical: boolean;
};

export function policyForProfile(profileId: string, userId?: string): PolicyHints {
  // Resolve profile with fallback to 'bane_fog_v1' (Strictest)
  const id = profileId?.trim() || 'bane_fog_v1';
  const profile = BANE_POLICY_PROFILES[id] ?? BANE_POLICY_PROFILES['bane_fog_v1'];
  
  const d = profile.defaults;

  // Organizational Boundary Checks (Mock implementation for Controlled Test Activation)
  const isArc = userId?.startsWith('arc-') ?? false;

  // Fail-closed logic: If identity doesn't align with profile intent, force strict mode
  const enforcedStrictMode = (id === 'arc_level_1' && !isArc) || d.strictMode;

  return {
    strictMode: enforcedStrictMode,
    defaultVerdict: d.defaultVerdict === 'deny' ? 'deny' : 'allow',
    escalationEnabled: d.escalationEnabled && !enforcedStrictMode,
    quarantineOnDeny: d.quarantineOnDeny,
    lockoutOnRepeat: d.lockoutOnRepeat,
    incidentOnCritical: d.incidentOnCritical,
  };
}

export function isArcUser(userId: string): boolean {
  return userId.startsWith('arc-');
}

export function isOversciteAdmin(userId: string): boolean {
  return userId.startsWith('os-admin-');
}
