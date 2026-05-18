#!/usr/bin/env node
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsPath = path.join(__dirname, '../test-results/results.json');
const featuresMapPath = path.join(__dirname, '../features-map/features-map.yml');
const summaryOut = path.join(__dirname, '../test-results/summary.md');

function normalizeId(id) {
  const match = id.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return id;
  return `${match[1].toUpperCase()}${match[2].padStart(4, '0')}`;
}

function extractTestId(title) {
  let m = title.match(/^([A-Z]+\d+)\s*:/i);
  if (!m) m = title.match(/([A-Z]+\d+)/);
  return m ? normalizeId(m[1]) : '';
}

function walkSuites(suites, out = []) {
  for (const s of suites) {
    if (s.specs) {
      for (const spec of s.specs) {
        const id = extractTestId(spec.title);
        const ok = spec.tests?.every((t) => t.results?.every((r) => r.status === 'passed'));
        out.push({ id, title: spec.title, ok: Boolean(ok) });
      }
    }
    if (s.suites) walkSuites(s.suites, out);
  }
  return out;
}

async function main() {
  if (!existsSync(resultsPath)) {
    console.error(`No results at ${resultsPath}`);
    process.exit(1);
  }
  const raw = JSON.parse(await fs.readFile(resultsPath, 'utf8'));
  const featuresRaw = yaml.load(await fs.readFile(featuresMapPath, 'utf8'));
  const features = featuresRaw?.features ?? [];
  const specs = walkSuites(raw.suites ?? []);

  const rows = features.map((f) => {
    const match = specs.find((s) => s.id === normalizeId(f.id));
    const status = match ? (match.ok ? '✅' : '❌') : '⏭️';
    return `| ${f.id} | ${f.name} | ${status} |`;
  });

  const md = [
    '# E2E Test Summary',
    '',
    `Total features: ${features.length}`,
    `Ran: ${specs.length}`,
    '',
    '| ID | Feature | Status |',
    '|----|---------|--------|',
    ...rows,
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(summaryOut), { recursive: true });
  await fs.writeFile(summaryOut, md, 'utf8');
  console.log(`Wrote ${summaryOut}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
