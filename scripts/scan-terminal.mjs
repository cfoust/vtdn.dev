#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "..", "data");
const reposDir = resolve(__dirname, "..", "repos");

const dataFiles = [
  "control-sequences.json",
  "csi-sequences.json",
  "text-styling.json",
  "osc-sequences.json",
  "dcs-sequences.json",
  "decset-modes.json",
  "keyboard-input.json",
  "graphics.json",
  "window-manipulation.json",
];

const { values } = parseArgs({
  options: {
    id: { type: "string" },
    category: { type: "string", multiple: true },
    feature: { type: "string", multiple: true },
    "batch-size": { type: "string", default: "20" },
    timeout: { type: "string", default: "600" },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", short: "h" },
  },
});

if (values.help) {
  console.log(`Usage: node scripts/scan-terminal.mjs --id <terminal_id> [options]

Scan a terminal's source code to detect feature support using claude -p.

Options:
  --id <id>              Terminal ID from terminals.json (required)
  --category <name>      Filter to specific data file(s), repeatable
                         (e.g. --category csi-sequences --category graphics)
  --feature <id>         Filter to specific feature ID(s), repeatable
                         (e.g. --feature bel --feature sixel)
  --batch-size <n>       Features per Claude invocation (default: 20)
  --timeout <seconds>    Timeout per batch invocation (default: 600)
  --dry-run              Print what would be scanned without invoking Claude
  -h, --help             Show usage

Examples:
  node scripts/scan-terminal.mjs --id cy --dry-run
  node scripts/scan-terminal.mjs --id cy --category graphics --dry-run
  node scripts/scan-terminal.mjs --id cy --feature bel`);
  process.exit(0);
}

if (!values.id) {
  console.error("Error: --id is required");
  process.exit(1);
}

const terminalId = values.id;
const timeoutMs = Number(values.timeout) * 1000;
const batchSize = Number(values["batch-size"]);
const terminals = JSON.parse(
  readFileSync(resolve(dataDir, "terminals.json"), "utf-8"),
);

if (!(terminalId in terminals)) {
  console.error(
    `Error: terminal '${terminalId}' not found in terminals.json`,
  );
  console.error(`Available: ${Object.keys(terminals).join(", ")}`);
  process.exit(1);
}

const terminal = terminals[terminalId];
if (!terminal.repository) {
  console.error(
    `Error: terminal '${terminalId}' has no repository URL in terminals.json`,
  );
  process.exit(1);
}

// Convert repository URL to git@gh: SSH format for GitHub repos
function toSshUrl(url) {
  const gh = url.match(/^https:\/\/github\.com\/(.+?)(?:\.git)?$/);
  if (gh) return `git@gh:${gh[1]}.git`;
  return url;
}

// Clone or update the repository
function ensureRepo(terminalId, repoUrl) {
  const repoPath = resolve(reposDir, terminalId);
  const sshUrl = toSshUrl(repoUrl);

  if (existsSync(repoPath)) {
    console.log(`Updating ${repoPath}...`);
    try {
      execFileSync("git", ["pull", "--ff-only"], {
        cwd: repoPath,
        stdio: "inherit",
      });
    } catch (e) {
      console.error(`Error: git pull failed for ${terminalId}`);
      process.exit(1);
    }
  } else {
    console.log(`Cloning ${sshUrl} into ${repoPath}...`);
    try {
      execFileSync("git", ["clone", sshUrl, repoPath], { stdio: "inherit" });
    } catch (e) {
      console.error(`Error: git clone failed for ${sshUrl}`);
      process.exit(1);
    }
  }

  return repoPath;
}

// Collect features from all data files, applying filters
function collectFeatures(categoryFilters, featureFilters) {
  const features = [];

  for (const file of dataFiles) {
    const categoryName = basename(file, ".json");

    if (
      categoryFilters &&
      categoryFilters.length > 0 &&
      !categoryFilters.includes(categoryName)
    ) {
      if (!featureFilters || featureFilters.length === 0) continue;
    }

    const filePath = resolve(dataDir, file);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));

    for (const [topKey, topValue] of Object.entries(data)) {
      if (typeof topValue !== "object" || topValue === null) continue;

      for (const [featureId, featureValue] of Object.entries(topValue)) {
        if (featureId === "__meta") continue;
        if (!featureValue?.__compat) continue;

        const matchesCategory =
          categoryFilters &&
          categoryFilters.length > 0 &&
          categoryFilters.includes(categoryName);
        const matchesFeature =
          featureFilters &&
          featureFilters.length > 0 &&
          featureFilters.includes(featureId);

        if (categoryFilters?.length > 0 || featureFilters?.length > 0) {
          if (!matchesCategory && !matchesFeature) continue;
        }

        const compat = featureValue.__compat;
        features.push({
          featureId,
          file,
          categoryName,
          title: compat.title,
          description: compat.description,
          specUrl: compat.spec_url,
        });
      }
    }
  }

  return features;
}

// Build a JSON schema with explicit properties for each feature ID in the batch
function buildBatchSchema(batch) {
  const featureSchema = {
    type: "object",
    properties: {
      supported: { type: ["boolean", "null"] },
      partial: { type: "boolean" },
      version: { type: ["string", "null"] },
      notes: { type: ["string", "null"] },
    },
    required: ["supported", "partial", "version", "notes"],
  };

  const properties = {};
  const required = [];
  for (const f of batch) {
    properties[f.featureId] = featureSchema;
    required.push(f.featureId);
  }

  return JSON.stringify({
    type: "object",
    properties,
    required,
  });
}

// Build the prompt for a batch of features
function buildBatchPrompt(terminalName, batch) {
  const featureList = batch
    .map((f) => {
      let line = `- ${f.featureId}: ${f.title} — ${f.description}`;
      if (f.specUrl) line += ` (spec: ${f.specUrl})`;
      return line;
    })
    .join("\n");

  return `You are analyzing the source code of the terminal emulator "${terminalName}" to determine whether it supports specific terminal features.

Features to check:
${featureList}

Search the codebase for evidence that each feature is implemented. Look for:
- Direct handling of the escape sequences or control codes described
- References to feature names or mnemonics
- Parser/handler code that processes these sequences

To determine when support was added, use git log and git tag to find the earliest version that includes the implementation. Run "git tag" to list available tags, then use "git log --all --oneline -- <file>" on relevant files and cross-reference with tags. You only need to do this once and can reuse the tag list across features.

For each feature, determine:
- "supported": true if clearly implemented, false if explicitly ignored/rejected or no evidence, null if uncertain
- "partial": true only if partially implemented (e.g. some sub-features missing)
- "version": the earliest release tag (e.g. "v1.2.0") containing the implementation, or null if unknown. Must be a single semver-style tag string or null — never return a list, description, or boolean
- "notes": brief note only if notable (e.g. "Requires compile flag"), otherwise null`;
}

// Transform Claude's response into a support entry
function toSupportEntry(result) {
  const entry = {};

  if (result.version && typeof result.version === "string") {
    entry.version_added = result.version;
  } else if (result.supported === true) {
    entry.version_added = true;
  } else if (result.supported === false) {
    entry.version_added = false;
  } else {
    entry.version_added = null;
  }

  if (result.partial === true) {
    entry.partial_implementation = true;
  }

  if (result.notes && typeof result.notes === "string") {
    entry.notes = result.notes;
  }

  const today = new Date().toISOString().slice(0, 10);
  entry.last_scanned = today;

  return entry;
}

// Main
const features = collectFeatures(values.category, values.feature);

if (features.length === 0) {
  console.error("No features matched the given filters.");
  if (values.category)
    console.error(`  --category: ${values.category.join(", ")}`);
  if (values.feature)
    console.error(`  --feature: ${values.feature.join(", ")}`);
  process.exit(1);
}

console.log(
  `Scanning ${features.length} feature(s) for terminal '${terminalId}' (${terminal.name}) in batches of ${batchSize}`,
);

if (values["dry-run"]) {
  for (const f of features) {
    console.log(`  [${f.categoryName}] ${f.featureId}: ${f.title}`);
  }
  console.log(`\n${features.length} feature(s) would be scanned.`);
  process.exit(0);
}

const repoPath = ensureRepo(terminalId, terminal.repository);

const resultsByFile = new Map();
let scanned = 0;

for (let i = 0; i < features.length; i += batchSize) {
  const batch = features.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;
  const totalBatches = Math.ceil(features.length / batchSize);

  console.log(
    `\nBatch ${batchNum}/${totalBatches} (${batch.length} features)...`,
  );

  const prompt = buildBatchPrompt(terminal.name, batch);
  const schema = buildBatchSchema(batch);

  let results;
  try {
    const raw = execFileSync(
      "claude",
      ["-p", prompt, "--output-format", "json", "--json-schema", schema],
      {
        cwd: repoPath,
        encoding: "utf-8",
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
      },
    );

    const envelope = JSON.parse(raw);
    results = envelope.structured_output;
    if (!results || typeof results !== "object") {
      console.error(`  Batch ${batchNum}: no structured output, skipping`);
      continue;
    }
  } catch (e) {
    const reason = e.killed ? "timeout" : e.message;
    console.error(`  Batch ${batchNum}: error (${reason}), skipping`);
    continue;
  }

  for (const feature of batch) {
    const result = results[feature.featureId];
    if (!result || typeof result.supported === "undefined") {
      console.error(`  ${feature.featureId} (${feature.title}): missing from response, skipping`);
      continue;
    }

    const entry = toSupportEntry(result);

    if (!resultsByFile.has(feature.file)) {
      resultsByFile.set(feature.file, []);
    }
    resultsByFile
      .get(feature.file)
      .push({ featureId: feature.featureId, entry });

    scanned++;
    console.log(
      `  [${scanned}/${features.length}] ${feature.title}: version_added=${JSON.stringify(entry.version_added)}`,
    );
  }
}

// Write results back to data files
for (const [file, results] of resultsByFile) {
  const filePath = resolve(dataDir, file);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));

  for (const { featureId, entry } of results) {
    for (const topValue of Object.values(data)) {
      if (typeof topValue !== "object" || topValue === null) continue;
      if (topValue[featureId]?.__compat?.support) {
        topValue[featureId].__compat.support[terminalId] = entry;
        break;
      }
    }
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Wrote ${results.length} result(s) to ${file}`);
}

console.log("Done.");
