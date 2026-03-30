import type { BaneFinding, BaneSeverity, BaneVerdict } from '../types';

const sRank: Record<BaneSeverity, number> = { low: 1, medium: 2, high: 3, critical: 4 };
const vRank: Record<BaneVerdict, number> = {
  PERMIT: 1,
  PERMIT_WITH_CONSTRAINTS: 2,
  DOWNSCOPE: 3,
  PAUSE_FOR_VERIFICATION: 4,
  CONTAIN: 5,
  REFUSE: 6,
  REFUSE_AND_LOG: 7,
  REFUSE_CONTAIN_ESCALATE_TO_IU: 8,
};

export function sortFindings(findings: BaneFinding[]): BaneFinding[] {
  return [...findings].sort((a, b) => {
    const sd = sRank[b.severity] - sRank[a.severity];
    if (sd !== 0) return sd;
    const vd = vRank[b.verdict] - vRank[a.verdict];
    if (vd !== 0) return vd;
    return a.id.localeCompare(b.id);
  });
}
