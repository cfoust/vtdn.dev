#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const DOCS_DIR = path.join(ROOT, 'docs');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const categoryFilter = args.includes('--category')
  ? args[args.indexOf('--category') + 1]
  : null;

// Maps data file basenames to docs directory names
const DATA_TO_DIR = {
  'c0-controls': 'c0-c1',
  'escape-sequences': 'c0-c1',
  'csi-sequences': 'csi',
  'text-styling': 'sgr',
  'osc-sequences': 'osc',
  'dcs-sequences': 'dcs',
  'decset-modes': 'decset',
  'keyboard-input': 'keyboard',
  'graphics': 'graphics',
  'window-manipulation': 'window',
};

// Maps data file basenames to their top-level JSON key
const DATA_TO_KEY = {
  'c0-controls': 'c0_controls',
  'escape-sequences': 'escape_sequences',
  'csi-sequences': 'csi_sequences',
  'text-styling': 'text_styling',
  'osc-sequences': 'osc_sequences',
  'dcs-sequences': 'dcs_sequences',
  'decset-modes': 'decset_modes',
  'keyboard-input': 'keyboard_input',
  'graphics': 'graphics',
  'window-manipulation': 'window_manipulation',
};

function featureIdToSlug(featureId) {
  return featureId.replace(/_/g, '-');
}

function generateMdx(featureId, compat, dataFileBasename) {
  const slug = featureIdToSlug(featureId);
  const dirName = DATA_TO_DIR[dataFileBasename];
  const docPath = `/docs/${dirName}/${slug}`;

  const lines = [
    '---',
    `title: "${compat.title}"`,
    `sidebar_label: "${compat.title}"`,
    `description: "${(compat.description || '').replace(/"/g, '\\"')}"`,
    `feature_id: "${featureId}"`,
    `data_file: "${dataFileBasename}"`,
    '---',
    '',
    '<StatusBadges status={{ standard_track: true }} />',
    '',
    `${compat.description || 'Documentation coming soon.'}`,
    '',
    '## Syntax',
    '',
    '```',
    `TODO: Add syntax for ${compat.title}`,
    '```',
    '',
    '## Description',
    '',
    'Documentation coming soon.',
    '',
    '## Specifications',
    '',
    '<SpecificationsTable />',
    '',
    '## Terminal support',
    '',
    '<FeatureCompatTable />',
    '',
  ];

  return {content: lines.join('\n'), docPath, slug};
}

let totalGenerated = 0;
let totalUpdated = 0;

for (const [dataFileBasename, dirName] of Object.entries(DATA_TO_DIR)) {
  if (categoryFilter && categoryFilter !== dirName && categoryFilter !== dataFileBasename) {
    continue;
  }

  const dataFilePath = path.join(DATA_DIR, `${dataFileBasename}.json`);
  const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  const topKey = DATA_TO_KEY[dataFileBasename];
  const category = data[topKey];

  if (!category) {
    console.warn(`Warning: No top-level key "${topKey}" in ${dataFileBasename}.json`);
    continue;
  }

  const outDir = path.join(DOCS_DIR, dirName);

  let position = 1;
  let dataModified = false;

  for (const [featureId, feature] of Object.entries(category)) {
    if (featureId === '__meta') continue;

    const compat = feature.__compat;
    if (!compat) continue;

    const {content, docPath, slug} = generateMdx(featureId, compat, dataFileBasename);
    const filePath = path.join(outDir, `${slug}.mdx`);

    if (dryRun) {
      console.log(`[dry-run] Would create: ${path.relative(ROOT, filePath)}`);
      console.log(`          doc_path: ${docPath}`);
    } else {
      // Only write if file doesn't already exist
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Created: ${path.relative(ROOT, filePath)}`);
        totalGenerated++;
      } else {
        console.log(`Skipped (exists): ${path.relative(ROOT, filePath)}`);
      }
    }

    // Update doc_path in data JSON
    if (compat.doc_path !== docPath) {
      compat.doc_path = docPath;
      dataModified = true;
      totalUpdated++;
    }

    position++;
  }

  if (dataModified && !dryRun) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`Updated doc_path entries in ${dataFileBasename}.json`);
  }
}

console.log(`\nDone! Generated ${totalGenerated} pages, updated ${totalUpdated} doc_path entries.`);
