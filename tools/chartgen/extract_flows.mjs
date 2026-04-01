import fs from 'fs';
import path from 'path';

const WIKI_DIR = 'docs/wiki';
const DATA_DIR = 'tools/chartgen/data';

const nodes = new Map();
const ports = new Map();
const flows = new Map();

function parseFile(content) {
  // Extract Nodes
  // Format: - **`NODE_ID`**: Name
  const nodeMatches = content.matchAll(/- \*\*`?(NODE_[A-Z0-9_]+)`?\*\*: (.*)/g);
  for (const match of nodeMatches) {
    const id = match[1];
    const name = match[2].trim();
    // Identify layer from ID: NODE_<LAYER>_<NAME>_001
    const parts = id.split('_');
    const layer = parts[1];
    nodes.set(id, { id, name, layer });
  }

  // Extract Ports
  // Format: - **`PORT_ID`**: Source -> Target
  // Or: - **`PORT_ID`**: Description (needs more robust parsing)
  const portMatches = content.matchAll(/- \*\*`?(PORT_[A-Z0-9_]+)`?\*\*: (.*)/g);
  for (const match of portMatches) {
    const id = match[1];
    const desc = match[2].trim();
    const [source, target] = desc.split('->').map(s => s.trim());
    ports.set(id, { id, source, target, desc });
  }

  // Extract Flows
  // Format: ```flow [FLOW_ID: ID] ... ```
  const flowMatches = content.matchAll(/```flow\s+\[FLOW_ID:\s+(FLOW_[A-Z0-9_]+)\]\n([\s\S]*?)```/g);
  for (const match of flowMatches) {
    const id = match[1];
    const lines = match[2].split('\n').map(l => l.trim()).filter(l => l);
    const steps = lines.map(l => {
        // Match numbers like 1. `ID`
        const stepMatch = l.match(/\d+\.\s+`?([A-Z0-9_]+)`?/);
        return stepMatch ? stepMatch[1] : null;
    }).filter(s => s);
    flows.set(id, { id, steps });
  }
}

async function run() {
  const files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(WIKI_DIR, file), 'utf8');
    parseFile(content);
  }

  console.log(`Extracted ${nodes.size} nodes, ${ports.size} ports, and ${flows.size} flows.`);

  fs.writeFileSync(path.join(DATA_DIR, 'nodes.json'), JSON.stringify(Object.fromEntries(nodes), null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'ports.json'), JSON.stringify(Object.fromEntries(ports), null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'flows.json'), JSON.stringify(Object.fromEntries(flows), null, 2));
}

run().catch(console.error);
