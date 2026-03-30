import type { BaneFinding, BaneSeverity, BaneVerdict } from '../types';

const severityRank: Record<BaneSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const verdictRank: Record<BaneVerdict, number> = {
  PERMIT: 1,
  PERMIT_WITH_CONSTRAINTS: 2,
  DOWNSCOPE: 3,
  PAUSE_FOR_VERIFICATION: 4,
  CONTAIN: 5,
  REFUSE: 6,
  REFUSE_AND_LOG: 7,
  REFUSE_CONTAIN_ESCALATE_TO_IU: 8,
};

export function aggregate(findings: BaneFinding[]): { verdict: BaneVerdict; severity: BaneSeverity } {
  if (!findings.length) return { verdict: 'PERMIT', severity: 'low' };

  let maxSeverity: BaneSeverity = 'low';
  let maxVerdict: BaneVerdict = 'PERMIT';

  for (const f of findings) {
    if (severityRank[f.severity] > severityRank[maxSeverity]) maxSeverity = f.severity;
    if (verdictRank[f.verdict] > verdictRank[maxVerdict]) maxVerdict = f.verdict;
  }

  return { verdict: maxVerdict, severity: maxSeverity };
}
