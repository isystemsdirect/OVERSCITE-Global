import * as functions from 'firebase-functions';
import { enforceBaneHttp } from '../bane/enforce';
import * as path from 'path';
import * as fs from 'fs';

function readSafeManifest(manifestPath: string): Record<string, unknown> {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { version: 'unknown', error: 'Manifest missing' };
  }
}

export const scingHealth = functions.https.onRequest(async (req, res) => {
  // Enforce zero-trust bounds even on read-only endpoints identifying lineage.
  const gate = await enforceBaneHttp({ req, res, name: 'scingHealth' });
  if (!gate.ok) return;

  // Retrieve platform and engine manifests dynamically to prove deployment state
  const platformPkg = readSafeManifest(path.join(__dirname, '../../package.json'));
  const scingRegistry = readSafeManifest(path.join(__dirname, '../scing_engine/bane/engine.json'));

  res.status(200).json({
    status: 'active',
    platform: 'OVERSCITE-Global',
    version: platformPkg.version || '0.1.0',
    engines: {
      bane_engine: scingRegistry.version || 'unknown'
    },
    gcp_project: process.env.GCLOUD_PROJECT || process.env.FIREBASE_CONFIG || 'unknown',
    timestamp: new Date().toISOString()
  });
});
