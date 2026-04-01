import type { BaneFinding } from '../types';
import type { RedactionSpan } from './redaction';

export function redactionsFromFindings(text: string, findings: BaneFinding[]): RedactionSpan[] {
  const spans: RedactionSpan[] = [];

  for (const f of findings) {
    if (f.verdict !== 'DOWNSCOPE') continue;

    const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    let mEmail;
    while ((mEmail = emailRe.exec(text)) !== null) {
      const idx = mEmail.index ?? -1;
      if (idx >= 0) spans.push({ start: idx, end: idx + mEmail[0].length, label: 'PII' });
    }

    const phoneRe = /\b(\+?1[\s-]?)?(\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}\b/g;
    let mPhone;
    while ((mPhone = phoneRe.exec(text)) !== null) {
      const idx = mPhone.index ?? -1;
      if (idx >= 0) spans.push({ start: idx, end: idx + mPhone[0].length, label: 'PII' });
    }
  }

  return spans;
}
