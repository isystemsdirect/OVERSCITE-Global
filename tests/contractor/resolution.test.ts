import { resolveRequirements } from '../../src/lib/contractor/resolutionService';
import type { RoleClass, JurisdictionProfile, ProjectScopeProfile } from '../../src/lib/contractor/types';

describe('Contractor Resolution Service', () => {
  const defaultJurisdiction: JurisdictionProfile = {
    state: 'CA',
    local_overlay_required: false,
    controlling_authority: 'CSLB',
    rule_version_date: '2026-01-01'
  };

  const defaultScope: ProjectScopeProfile = {
    project_type: 'residential',
    trade_scope: ['general'],
    estimated_value: 5000,
    permit_required: true,
    specialty_flags: []
  };

  test('California: identifies CSLB requirement for jobs >= $500', () => {
    const res = resolveRequirements('prime_contractor', { ...defaultJurisdiction, state: 'CA' }, { ...defaultScope, estimated_value: 1000 });
    expect(res.mandatory_licenses).toContain('CSLB State License');
  });

  test('California: no license required for jobs < $500', () => {
    const res = resolveRequirements('prime_contractor', { ...defaultJurisdiction, state: 'CA' }, { ...defaultScope, estimated_value: 400 });
    expect(res.mandatory_licenses).not.toContain('CSLB State License');
  });

  test('Florida: identifies DBPR requirement', () => {
    const res = resolveRequirements('subcontractor', { ...defaultJurisdiction, state: 'FL' }, defaultScope);
    expect(res.mandatory_licenses).toContain('DBPR State Registration/Certification');
  });

  test('Florida: identifies local competency if overlay required', () => {
    const res = resolveRequirements('subcontractor', { ...defaultJurisdiction, state: 'FL', local_overlay_required: true }, defaultScope);
    expect(res.mandatory_licenses).toContain('Local Competency Card');
  });

  test('NYC: identifies DCA Home Improvement license', () => {
    const res = resolveRequirements('prime_contractor', { ...defaultJurisdiction, state: 'NY', city: 'NYC' }, defaultScope);
    expect(res.mandatory_licenses).toContain('NYC DCA Home Improvement Contractor License');
  });

  test('Specialty Trades: identify trade-specific requirement', () => {
    const res = resolveRequirements('prime_contractor', { ...defaultJurisdiction, state: 'CA' }, { ...defaultScope, trade_scope: ['electrical'] });
    expect(res.mandatory_licenses).toContain('Trade-Specific Professional License');
  });
});
