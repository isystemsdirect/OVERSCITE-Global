export type BaneVerdict = 'PERMIT' | 'PERMIT_WITH_CONSTRAINTS' | 'DOWNSCOPE' | 'PAUSE_FOR_VERIFICATION' | 'CONTAIN' | 'REFUSE' | 'REFUSE_AND_LOG' | 'REFUSE_CONTAIN_ESCALATE_TO_IU';

export type BaneSeverity = 'low' | 'medium' | 'high' | 'critical';
export type BaneEnforcementLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type BaneAuthContext = {
  identityId?: string;
  sessionId?: string;
  ipHash?: string;
  capabilities?: string[];
  isAuthenticated?: boolean;
  nonce?: string;
  signature?: string;
  issuedAtEpochMs?: number;
  sessionIntegrity?: {
    nonceOk?: boolean;
    signatureOk?: boolean;
    tokenFresh?: boolean;
  };
};

export type BaneRequestContext = {
  route?: string;
  requiredCapability?: string;
  auth?: BaneAuthContext;
};

export type BaneInput = {
  text: string;
  req?: BaneRequestContext;
};

export type BaneFinding = {
  id: string;
  title: string;
  severity: BaneSeverity;
  verdict: BaneVerdict;
  rationale: string;
  tags?: string[];
  evidence?: string;
};

export type BaneOutput = {
  verdict: BaneVerdict;
  severity: BaneSeverity;
  findings: BaneFinding[];
  redactions?: Array<{ start: number; end: number; label: string }>;
  safeText?: string;
  traceId: string;
  timingMs: number;
  enforcementLevel: BaneEnforcementLevel;
  publicMessage?: string;
  throttle?:
    | { action: 'none' }
    | { action: 'delay'; delayMs: number }
    | { action: 'block'; retryAfterMs: number };
};

export type BaneEngine = {
  id: string;
  role: string;
  mandate: string;
};

export type BaneSDR = {
    authority_basis: string;
    policy_basis: string;
    risk_posture: string;
    constraint_triggers: string[];
    decision_rationale: string;
    outcome_disposition: BaneVerdict;
    timestamped_record: number;
    sd_record_reference: string;
}
