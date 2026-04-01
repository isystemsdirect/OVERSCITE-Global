import fs from 'fs';
import path from 'path';

const DATA_DIR = 'tools/chartgen/data';

const layerColors = {
  HUMAN: '#FFFFFF',
  ARC: '#00C2FF',
  SCING: '#7A5CFF',
  SCINGULAR: '#FFD700',
  OVERSCITE: '#00FF9C',
  LARI: '#FF8C00',
  BANE: '#FF2E2E'
};

function getSafeLayer(layer) {
    if (!layer) return 'OTHER';
    return layer.toUpperCase();
}

function generateDot(flow) {
  const nodesJson = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'nodes.json'), 'utf8'));
  const portsJson = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ports.json'), 'utf8'));
  
  const nodesInFlow = new Set();
  const edgesInFlow = [];
  
  for (let i = 0; i < flow.steps.length; i++) {
    const step = flow.steps[i];
    if (step.startsWith('NODE_')) {
      nodesInFlow.add(step);
      if (i > 0) {
          const prev = flow.steps[i-1];
          if (prev.startsWith('PORT_')) {
              const port = portsJson[prev];
              // Link prev node to this node using port
              // Assume flow structure is: NODE_A, PORT_A_TO_B, NODE_B
              const prevNode = flow.steps[i-2];
              edgesInFlow.push({ source: prevNode, target: step, label: prev });
          }
      }
    }
  }

  let dot = `digraph ${flow.id} {\n`;
  dot += `  rankdir=LR;\n`;
  dot += `  node [fontname="Arial", fontsize=10, style="filled"];\n`;
  dot += `  edge [fontname="Arial", fontsize=8];\n`;
  dot += `  labelloc="t";\n`;
  dot += `  label="${flow.id} - ${new Date().toISOString().split('T')[0]}";\n\n`;

  // Group by Layer
  const layerGroups = {};
  nodesInFlow.forEach(id => {
    const node = nodesJson[id] || { id, name: id, layer: 'OTHER' };
    const layer = getSafeLayer(node.layer);
    if (!layerGroups[layer]) layerGroups[layer] = [];
    layerGroups[layer].push(node);
  });

  for (const [layer, lNodes] of Object.entries(layerGroups)) {
    dot += `  subgraph cluster_${layer} {\n`;
    dot += `    label="${layer}";\n`;
    dot += `    style="dotted";\n`;
    dot += `    color="#CCCCCC";\n`;
    for (const node of lNodes) {
      const color = layerColors[layer] || '#EEEEEE';
      const shape = (layer === 'HUMAN' || layer === 'ARC') ? 'doubleoctagon' : 'rect';
      const rounded = (layer !== 'HUMAN' && layer !== 'ARC') ? ', style="filled,rounded"' : ', style="filled"';
      dot += `    "${node.id}" [label="${node.name}\\n(${node.id})", fillcolor="${color}", shape=${shape}${rounded}];\n`;
    }
    dot += `  }\n`;
  }

  for (const edge of edgesInFlow) {
    dot += `  "${edge.source}" -> "${edge.target}" [label="${edge.label}"];\n`;
  }

  dot += `}\n`;
  return dot;
}

async function run() {
  const flowsJson = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'flows.json'), 'utf8'));
  
  for (const flowId of Object.keys(flowsJson)) {
    const dot = generateDot(flowsJson[flowId]);
    fs.writeFileSync(path.join(DATA_DIR, `${flowId}.dot`), dot);
    console.log(`Generated DOT for ${flowId}.`);
  }
}

run().catch(console.error);
