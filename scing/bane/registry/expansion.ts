import { BaneEngine } from '../types';

export const BANE_AUTH: BaneEngine = {
  id: 'BANE_AUTH',
  role: 'Authority and identity validation',
  mandate: 'Pending formal lock',
};

export const BANE_CONTAIN: BaneEngine = {
  id: 'BANE_CONTAIN',
  role: 'Execution containment and isolation',
  mandate: 'Pending formal lock',
};

export const BANE_TRACE: BaneEngine = {
  id: 'BANE_TRACE',
  role: 'Decision-lineage preservation',
  mandate: 'Pending formal lock',
};

export const BANE_SENTINEL: BaneEngine = {
  id: 'BANE_SENTINEL',
  role: 'Continuous posture and anomaly watch',
  mandate: 'Pending formal lock',
};

export const BANE_ZTI: BaneEngine = {
  id: 'BANE_ZTI',
  role: 'Cross-engine zero-trust arbitration',
  mandate: 'Pending formal lock',
};
