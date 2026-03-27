export interface SystemComponent {
  name: string;
  status: 'healthy' | 'degraded' | 'unavailable' | 'maintenance';
  latency_ms?: number;
  last_check_at: string;
}

export interface SystemHealth {
  overall_status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  components: SystemComponent[];
}

export async function getSystemHealth(): Promise<SystemHealth> {
  // Simulate system health check
  return {
    overall_status: 'operational',
    components: [
      {
        name: 'Authentication (Auth-Layer)',
        status: 'healthy',
        latency_ms: 45,
        last_check_at: new Date().toISOString(),
      },
      {
        name: 'Firestore Database (D-STORE)',
        status: 'healthy',
        latency_ms: 110,
        last_check_at: new Date().toISOString(),
      },
      {
        name: 'Cloud Storage (Vault)',
        status: 'healthy',
        latency_ms: 230,
        last_check_at: new Date().toISOString(),
      },
      {
        name: 'Cloud Functions (WIRM)',
        status: 'degraded',
        latency_ms: 1450,
        last_check_at: new Date().toISOString(),
      }
    ]
  };
}
