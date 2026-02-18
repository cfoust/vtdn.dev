#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "..", "data");
const reposDir = resolve(__dirname, "..", "repos");
const summariesDir = resolve(__dirname, "..", "summaries");

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
    timeout: { type: "string", default: "600" },
    "dry-run": { type: "boolean", default: false },
    "regenerate-summary": { type: "boolean", default: false },
    "summary-only": { type: "boolean", default: false },
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
  --timeout <seconds>    Timeout per batch invocation (default: 600)
  --dry-run              Print what would be scanned without invoking Claude
  --regenerate-summary   Force regeneration of the codebase summary
  --summary-only         Only generate/regenerate the summary, don't scan
  -h, --help             Show usage

Summaries are cached in summaries/<id>.txt and reused across runs.

Examples:
  node scripts/scan-terminal.mjs --id cy --dry-run
  node scripts/scan-terminal.mjs --id cy --category graphics
  node scripts/scan-terminal.mjs --id cy --feature bel
  node scripts/scan-terminal.mjs --id cy --summary-only
  node scripts/scan-terminal.mjs --id cy --regenerate-summary`);
  process.exit(0);
}

if (!values.id) {
  console.error("Error: --id is required");
  process.exit(1);
}

const terminalId = values.id;
const timeoutMs = Number(values.timeout) * 1000;
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

// Clone or update the repository
function ensureRepo(terminalId, repoUrl) {
  const repoPath = resolve(reposDir, terminalId);

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
    console.log(`Cloning ${repoUrl} into ${repoPath}...`);
    try {
      execFileSync("git", ["clone", repoUrl, repoPath], { stdio: "inherit" });
    } catch (e) {
      console.error(`Error: git clone failed for ${repoUrl}`);
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

// Group features by category file
function groupByCategory(features) {
  const groups = new Map();
  for (const f of features) {
    if (!groups.has(f.file)) {
      groups.set(f.file, []);
    }
    groups.get(f.file).push(f);
  }
  return groups;
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

// Gather or load cached context about the repo's codebase structure
function getRepoContext(repoPath, terminalId, terminalName, forceRegenerate) {
  mkdirSync(summariesDir, { recursive: true });
  const summaryPath = resolve(summariesDir, `${terminalId}.md`);

  if (!forceRegenerate && existsSync(summaryPath)) {
    console.log(`Loading cached summary from summaries/${terminalId}.txt`);
    return readFileSync(summaryPath, "utf-8").trim();
  }

  console.log("Gathering codebase context...");

  const prompt = `You are analyzing the source code of the terminal emulator "${terminalName}".

Identify the key files and code locations relevant to terminal escape sequence and control code handling. Specifically find:
- Where escape sequences are parsed (the parser/state machine)
- Where CSI, OSC, DCS, and other sequence types are dispatched and handled
- Where terminal modes (e.g. DECSET/DECRST) are processed
- Where keyboard input encoding happens
- Where graphics protocols (e.g. Sixel, iTerm2 inline images) are handled, if present
- Where window manipulation sequences are handled, if present

Also run "git tag" and list the available version tags.

Provide a concise map: for each area, give the file path(s) and a brief note about what they contain. Keep the output compact — just file paths and one-line descriptions.`;

  try {
    const raw = execFileSync("claude", ["-p", prompt], {
      cwd: repoPath,
      encoding: "utf-8",
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });
    const summary = raw.trim();
    writeFileSync(summaryPath, summary + "\n");
    console.log(`Summary saved to summaries/${terminalId}.txt`);
    return summary;
  } catch (e) {
    const reason = e.killed ? "timeout" : e.message;
    console.error(`Warning: context gathering failed (${reason}), proceeding without context`);
    return null;
  }
}

// Build the prompt for a batch of features
function buildBatchPrompt(terminalName, batch, repoContext) {
  const featureList = batch
    .map((f) => {
      let line = `- ${f.featureId}: ${f.title} — ${f.description}`;
      if (f.specUrl) line += ` (spec: ${f.specUrl})`;
      return line;
    })
    .join("\n");

  let contextSection = "";
  if (repoContext) {
    contextSection = `
Here is a pre-gathered map of the codebase showing where terminal features are implemented:

${repoContext}

Use this as a starting point — go directly to the relevant files rather than searching broadly.

`;
  }

  return `You are analyzing the source code of the terminal emulator "${terminalName}" to determine whether it supports specific terminal features.
${contextSection}
Features to check:
${featureList}

Look in the relevant source files for evidence that each feature is implemented. Look for:
- Direct handling of the escape sequences or control codes described
- References to feature names or mnemonics
- Parser/handler code that processes these sequences

To determine when support was added, use git log and git tag to find the earliest version that includes the implementation. Cross-reference relevant file history with tags. If the version tags were provided above, reuse them rather than running "git tag" again.

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
const repoPath = ensureRepo(terminalId, terminal.repository);
const forceRegenerate = values["regenerate-summary"] || values["summary-only"];
const repoContext = getRepoContext(repoPath, terminalId, terminal.name, forceRegenerate);

if (values["summary-only"]) {
  if (repoContext) {
    console.log("Summary generated. Done.");
  } else {
    console.error("Failed to generate summary.");
    process.exit(1);
  }
  process.exit(0);
}

const features = collectFeatures(values.category, values.feature);

if (features.length === 0) {
  console.error("No features matched the given filters.");
  if (values.category)
    console.error(`  --category: ${values.category.join(", ")}`);
  if (values.feature)
    console.error(`  --feature: ${values.feature.join(", ")}`);
  process.exit(1);
}

const categoryGroups = groupByCategory(features);
const totalBatches = categoryGroups.size;

console.log(
  `Scanning ${features.length} feature(s) for terminal '${terminalId}' (${terminal.name}) in ${totalBatches} category batch(es)`,
);

if (values["dry-run"]) {
  for (const f of features) {
    console.log(`  [${f.categoryName}] ${f.featureId}: ${f.title}`);
  }
  console.log(`\n${features.length} feature(s) would be scanned in ${totalBatches} batch(es).`);
  process.exit(0);
}

const resultsByFile = new Map();
let scanned = 0;
let batchNum = 0;

for (const [file, batch] of categoryGroups) {
  batchNum++;
  const categoryName = basename(file, ".json");

  console.log(
    `\nBatch ${batchNum}/${totalBatches}: ${categoryName} (${batch.length} features)...`,
  );

  const prompt = buildBatchPrompt(terminal.name, batch, repoContext);
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
      console.error(`  ${categoryName}: no structured output, skipping`);
      continue;
    }
  } catch (e) {
    const reason = e.killed ? "timeout" : e.message;
    console.error(`  ${categoryName}: error (${reason}), skipping`);
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
