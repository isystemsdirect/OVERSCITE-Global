/**
 * BANE-Watcher — Windows Defender Adapter (Mock)
 * UTCB-G V1.0.00 — BANE-Watcher Phase 1 Signal Foundation
 */

export interface DefenderSignal {
  id: string;
  source: 'windows_defender';
  event_id: number;
  threat_name?: string;
  severity_level: 'Low' | 'Moderate' | 'High' | 'Severe';
  timestamp: string;
  device_id: string;
  action_taken?: string;
  raw_payload?: string;
}

export const windowsDefenderAdapter = {
  /**
   * Simulates polling or receiving a signal from the local Defender agent.
   */
  async fetchMockSignal(): Promise<DefenderSignal> {
    const threats = [
      { name: 'Trojan:Win32/Wacapew.C!ml', severity: 'Severe' as const, id: 1117 },
      { name: 'Adware:Win32/OpenCandy', severity: 'Moderate' as const, id: 1116 },
      { name: 'PUA:Win32/FileRepMetagen', severity: 'Low' as const, id: 1116 },
      { name: 'Exploit:Win32/ShellCode.A', severity: 'Severe' as const, id: 1119 }
    ];
    
    const threat = threats[Math.floor(Math.random() * threats.length)];
    
    return {
      id: `def-${Date.now()}`,
      source: 'windows_defender',
      event_id: threat.id,
      threat_name: threat.name,
      severity_level: threat.severity,
      timestamp: new Date().toISOString(),
      device_id: 'DEV-WIN-PRO-01',
      action_taken: 'Detected',
      raw_payload: JSON.stringify({
        engine_version: '1.1.24020.4',
        signature_version: '1.405.621.0',
        platform: 'Windows 11'
      })
    };
  }
};
