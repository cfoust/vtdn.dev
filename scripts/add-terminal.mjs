#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, "..", "data");

const { values } = parseArgs({
  options: {
    id: { type: "string" },
    name: { type: "string" },
    website: { type: "string" },
    repository: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

if (values.help || !values.id || !values.name || !values.website || !values.repository) {
  console.log(`Usage: node add-terminal.mjs --id <id> --name <name> --website <url> --repository <url>

Add a new terminal emulator to the compatibility matrix.
All support entries will be initialized as unknown (null).

Example:
  node add-terminal.mjs --id rio --name Rio --website https://raphamorim.io/rio/ --repository https://github.com/nicholasio/rio`);
  process.exit(values.help ? 0 : 1);
}

const { id, name, website, repository } = values;

const terminalsPath = resolve(dataDir, "terminals.json");
const terminals = JSON.parse(readFileSync(terminalsPath, "utf-8"));

if (id in terminals) {
  console.error(`Error: terminal '${id}' already exists in terminals.json`);
  process.exit(1);
}

terminals[id] = { name, website, repository };
writeFileSync(terminalsPath, JSON.stringify(terminals, null, 2) + "\n");
console.log(`Added '${id}' to terminals.json`);

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

function addTerminalSupport(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (key === "__compat" && value.support) {
      value.support[id] = { version_added: null };
    } else if (typeof value === "object" && value !== null) {
      addTerminalSupport(value);
    }
  }
}

for (const file of dataFiles) {
  const filePath = resolve(dataDir, file);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));
  addTerminalSupport(data);
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`Updated ${file}`);
}

console.log("Done. All support entries initialized as unknown (?).");
