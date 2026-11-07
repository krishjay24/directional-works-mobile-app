const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const paintingsFile = fs.readFileSync(path.join(__dirname, '../src/data/paintings.ts'), 'utf8');
const entries = [...paintingsFile.matchAll(/\{\s*id:\s*(\d+),\s*title:\s*'([^']+)',\s*image:\s*require\('([^']+)'\),\s*width:\s*(\d+),\s*height:\s*(\d+),\s*category:\s*'([^']+)'\s*\}/g)];

if (entries.length !== 13) {
  console.error(`Expected 13 paintings, found ${entries.length}`);
  process.exit(1);
}

const ids = entries.map((e) => Number(e[1]));
if (ids.join(',') !== '1,2,3,4,5,6,7,8,9,10,11,12,13') {
  console.error(`Painting order/IDs changed: ${ids.join(',')}`);
  process.exit(1);
}

const baselinePath = path.join(__dirname, 'artwork-baseline.json');
const current = entries.map((e) => {
  const rel = e[3].replace('../../', '');
  const abs = path.join(__dirname, '..', rel);
  const buf = fs.readFileSync(abs);
  return {
    id: Number(e[1]),
    title: e[2],
    file: rel.replace(/\\/g, '/'),
    category: e[6],
    sha256: crypto.createHash('sha256').update(buf).digest('hex').toUpperCase(),
    bytes: buf.length,
  };
});

if (!fs.existsSync(baselinePath)) {
  fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2));
  console.log('Wrote artwork baseline');
} else {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const errors = [];
  current.forEach((item, i) => {
    const prev = baseline[i];
    if (!prev) {
      errors.push(`Extra painting ${item.id}`);
      return;
    }
    if (prev.id !== item.id) errors.push(`ID mismatch at ${i}`);
    if (prev.title !== item.title) errors.push(`Title changed for ${item.id}`);
    if (prev.file !== item.file) errors.push(`File mapping changed for ${item.id}`);
    if (prev.category !== item.category) errors.push(`Category changed for ${item.id}`);
    if (prev.sha256 !== item.sha256) errors.push(`SHA-256 changed for ${item.file}`);
  });
  if (baseline.length !== current.length) errors.push('Painting count changed');
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
}

console.log(current.map((item) => `${item.id}\t${item.sha256}\t${item.file}\t${item.category}`).join('\n'));
console.log('Artwork intact');
