// verify-registry-sync.js
// Enforces that Platform and Engine versions structurally match the governed release state.

const fs = require('fs');
const path = require('path');

// Read the platform package.json version
const platformPkg = require('../package.json');
const platformVersion = platformPkg.version;

// Read the governed engines manifest paths
const engines = {
  'bane_engine': path.join(__dirname, '../scing/bane/engine.json'),
  'lari_engine': path.join(__dirname, '../scing/lari/engine.json'),
  'c3_engine': path.join(__dirname, '../cloud/functions/engine.json'),
  'mobius_engine': path.join(__dirname, '../mobius/engine.json'),
};

let driftDetected = false;

console.log(`\n================================`);
console.log(`OVERSCITE-Global Governance Lock`);
console.log(`Platform Version: ${platformVersion}`);
console.log(`================================`);

for (const [engineName, manifestPath] of Object.entries(engines)) {
  if (!fs.existsSync(manifestPath)) {
    console.error(`[DRIFT FATAL] Missing manifest for ${engineName} at ${manifestPath}`);
    driftDetected = true;
    continue;
  }

  const engineManifest = require(manifestPath);
  if (engineManifest.version !== platformVersion) {
    console.error(`[DRIFT FATAL] Version mismatch loop detected in ${engineName}.`);
    console.error(`Expected: ${platformVersion} | Found: ${engineManifest.version}`);
    driftDetected = true;
  } else {
    console.log(`[PASS] ${engineName} correctly anchored to ${engineManifest.version}`);
  }
}

// Registry lock verification (crude yaml parse to prevent CI bloat)
const registryPath = path.join(__dirname, '../version-registry.yml');
if (!fs.existsSync(registryPath)) {
  console.error(`[DRIFT FATAL] Missing ${registryPath}`);
  driftDetected = true;
} else {
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  if (!registryContent.includes(`platform_release: "${platformVersion}"`)) {
    console.error(`[DRIFT FATAL] version-registry.yml does not formally declare ${platformVersion} as the compatibility pivot.`);
    driftDetected = true;
  }
}

console.log(`================================\n`);

if (driftDetected) {
  console.error(`Status: BLOCKED. Engine version drift or registry desync detected.`);
  process.exit(1);
} else {
  console.log(`Status: CLEAR. Compatibility registry strictly conforms to Platform release.`);
  process.exit(0);
}
