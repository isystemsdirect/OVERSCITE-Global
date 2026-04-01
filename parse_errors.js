const fs = require('fs');
try {
  const txt = fs.readFileSync('ts_final_verify.log', 'utf16le');
  const lines = txt.split('\n');
  const map = {};
  lines.forEach(l => {
    if (l.includes('error TS')) {
      const match = l.match(/^(.+?)\(\d+,\d+\):/);
      if (match) {
        const file = match[1];
        if (!map[file]) map[file] = [];
        map[file].push(l.trim());
      }
    }
  });
  fs.writeFileSync('errors_grouped_utf8.json', JSON.stringify(map, null, 2), 'utf8');
} catch(e) {
  console.log('Error parsing logs', e);
}
