#!/usr/bin/env node
/**
 * Build wp-cli i18n make-json --use-map JSON from webpack source map.
 * Maps every source .jsx/.js → bundle .js file.
 *
 * Usage: node build-i18n-map.mjs <sourcemap-path> <bundle-name> > map.json
 */
import fs from 'fs';

const [, , mapPath, bundleName] = process.argv;
if (!mapPath || !bundleName) {
  console.error('Usage: node build-i18n-map.mjs <sourcemap-path> <bundle-name>');
  process.exit(1);
}

let sm;
try {
  sm = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
} catch (e) {
  console.error(`Failed to read/parse sourcemap at ${mapPath}: ${e.message}`);
  process.exit(1);
}
if (!sm || typeof sm !== 'object' || !Array.isArray(sm.sources)) {
  console.error(`Invalid sourcemap at ${mapPath}: missing "sources" array`);
  process.exit(1);
}

const out = {};
for (const src of sm.sources) {
  // strip webpack URI prefix
  const cleaned = src.replace(/^webpack:\/\/[^/]+\/\.\//, '').replace(/^webpack:\/\/[^/]+\//, '');
  // skip node_modules + non-source
  if (cleaned.startsWith('node_modules') || cleaned.startsWith('webpack/')) continue;
  if (!/^views\/assets\/src\//.test(cleaned)) continue;
  out[cleaned] = bundleName;
}

console.log(JSON.stringify(out, null, 2));
