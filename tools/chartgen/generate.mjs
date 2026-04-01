import { execSync } from 'child_process';
import path from 'path';

const SRC_DIR = 'tools/chartgen';

async function run() {
  console.log('--- STARTING OVERSCITE CHART GENERATION PIPELINE ---');
  
  try {
    console.log('Phase 1: Flow Extraction...');
    execSync(`node "${path.join(SRC_DIR, 'extract_flows.mjs')}"`, { stdio: 'inherit' });
    
    console.log('Phase 2: DOT Transformation...');
    execSync(`node "${path.join(SRC_DIR, 'transform_to_dot.mjs')}"`, { stdio: 'inherit' });
    
    console.log('Phase 3: Visual Rendering...');
    execSync(`node "${path.join(SRC_DIR, 'render_graphs.mjs')}"`, { stdio: 'inherit' });
    
    console.log('--- PIPELINE COMPLETED ---');
  } catch (e) {
    console.error('Pipeline failed:', e.message);
  }
}

run().catch(console.error);
