import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const DATA_DIR = 'tools/chartgen/data';
const OUTPUT_SVG = 'docs/wiki/charts/svg';
const OUTPUT_PDF = 'docs/wiki/charts/pdf';

function render(file) {
  const name = path.basename(file, '.dot');
  
  try {
    const dotPath = 'dot'; // Assumed in system PATH
    
    // Check if dot exists
    execSync(`${dotPath} -V`, { stdio: 'ignore' });
    
    console.log(`Rendering ${name} to SVG and PDF...`);
    execSync(`${dotPath} -Tsvg "${file}" -o "${path.join(OUTPUT_SVG, name + '.svg')}"`);
    execSync(`${dotPath} -Tpdf "${file}" -o "${path.join(OUTPUT_PDF, name + '.pdf')}"`);
    
    return true;
  } catch (e) {
    console.error(`Error rendering ${name}: Graphviz 'dot' not found in PATH or failed execution.`);
    return false;
  }
}

async function run() {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.dot'));
  
  if (files.length === 0) {
    console.log('No .dot files found to render.');
    return;
  }

  let successCount = 0;
  for (const file of files) {
    if (render(path.join(DATA_DIR, file))) {
      successCount++;
    }
  }

  console.log(`Successfully rendered ${successCount}/${files.length} charts.`);
}

run().catch(console.error);
