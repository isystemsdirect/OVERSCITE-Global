const fs = require('fs');
const path = require('path');

const TRUTH_STATES = ["live", "partial", "mock", "candidate", "accepted", "blocked", "archived"];
const PROHIBITED_STATES = ["active", "enabled", "running", "operational"];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('scripts')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

let violations = 0;
const files = walk('src');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Look for inline truth state strings: e.g. status="live" or status: 'live' or status === 'live'
  // But we want to allow the canonical truth-states.ts file itself
  if (file.replace(/\\/g, '/').endsWith('truth-states.ts')) return;
  if (file.replace(/\\/g, '/').endsWith('guidance-registry.ts')) return; // Allowed definitions

  TRUTH_STATES.forEach(state => {
    const regex = new RegExp(`(['"\`])${state}\\1`, 'g');
    if (regex.test(content)) {
      console.error(`[VIOLATION] Inline TruthState string detected: "${state}" in ${file}`);
      violations++;
    }
  });

  PROHIBITED_STATES.forEach(pstate => {
    // Specifically look for pseudo-states being used as states conceptually
    // Actually the rule says "Exception: Allowed only as descriptive text, never as state labels". 
    // We can just warn if we see them strictly bound in quotes like status="active"
    const regexLabel = new RegExp(`(?:status|state)\\s*[=:]\\s*(['"\`])${pstate}\\1`, 'gi');
    if (regexLabel.test(content)) {
      console.error(`[VIOLATION] Prohibited pseudo-state label detected: "${pstate}" in ${file}`);
      violations++;
    }
  });
});

if (violations > 0) {
  console.error(`\\nEnforcement Failed: ${violations} semantic violations found. Canon Lock engaged.`);
  process.exit(1);
} else {
  console.log('✅ Canon Lock Verified: Zero inline truth-state or pseudo-state violations.');
  process.exit(0);
}
