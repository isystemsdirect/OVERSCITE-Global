/**
 * @classification SCIMEGA_OPERATOR_CHECKLIST
 * @authority SCIMEGA Training Unit
 * @purpose Defines the operator review checklist for SCIMEGA proposal lifecycle verification.
 * @warning Checklist completion does not confer hardware execution authority.
 */

export interface SCIMEGAChecklistItem {
  id: string;
  category: string;
  label: string;
  description: string;
  isBoundaryItem: boolean;
}

export const SCIMEGA_OPERATOR_CHECKLIST: SCIMEGAChecklistItem[] = [
  { id: 'CHK-001', category: 'Export', label: 'Export Target Reviewed', description: 'Verify the selected export target matches the intended hardware platform.', isBoundaryItem: false },
  { id: 'CHK-002', category: 'Export', label: 'Configuration Diff Reviewed', description: 'Review all configuration changes in the human-readable diff summary.', isBoundaryItem: false },
  { id: 'CHK-003', category: 'Governance', label: 'BANE Verdict Reviewed', description: 'Confirm the BANE deployment gate verdict and review any reasons or restrictions.', isBoundaryItem: false },
  { id: 'CHK-004', category: 'Authorization', label: 'ARC Authorization Verified', description: 'Confirm that ARC identity is present and the signing gate verdict is acceptable.', isBoundaryItem: false },
  { id: 'CHK-005', category: 'Simulation', label: 'Terminal Script Reviewed', description: 'Read the generated terminal simulation script and verify command correctness.', isBoundaryItem: false },
  { id: 'CHK-006', category: 'Simulation', label: 'Safety-Critical Commands Identified', description: 'Identify and understand all commands marked as safety-critical.', isBoundaryItem: false },
  { id: 'CHK-007', category: 'Telemetry', label: 'Telemetry Trust State Reviewed', description: 'Verify the telemetry trust state is acceptable for the operational context.', isBoundaryItem: false },
  { id: 'CHK-008', category: 'Boundary', label: 'NO-FLASH Boundary Acknowledged', description: 'Acknowledge that no firmware flashing or hardware writing is authorized by this system.', isBoundaryItem: true },
  { id: 'CHK-009', category: 'Boundary', label: 'NO-C2 Boundary Acknowledged', description: 'Acknowledge that telemetry is inbound-only and no command-and-control is authorized.', isBoundaryItem: true },
  { id: 'CHK-010', category: 'Boundary', label: 'NO-EXECUTION Boundary Acknowledged', description: 'Acknowledge that terminal scripts are simulation-only and must not be auto-executed.', isBoundaryItem: true }
];
