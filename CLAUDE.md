# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

vtdn.dev is a terminal emulator standards compatibility reference site — think "caniuse.com" but for terminal escape sequences. It tracks feature support across ~22 terminal emulators and multiplexers.

## Commands

```bash
npm start          # Dev server with hot reload
npm run build      # Production build (static site)
npm run typecheck  # TypeScript type checking (tsc)
npm run clear      # Clear Docusaurus cache (useful when builds break after data changes)
```

### Terminal scanning scripts

```bash
# Add a new terminal to the matrix (initializes all features as unknown)
node scripts/add-terminal.mjs --id <id> --name <name> --website <url> --repository <url>

# Scan a terminal's source code for feature support using Claude CLI
node scripts/scan-terminal.mjs --id <terminal_id> [--category <name>] [--feature <id>] [--dry-run]
```

## Architecture

**Data layer (`data/`)**: Compatibility data in a format inspired by MDN's browser-compat-data. Each JSON file covers a feature category (CSI sequences, OSC sequences, graphics, etc.). `terminals.json` defines the tracked terminals with metadata and group assignments.

Each feature entry follows this structure:
```json
{
  "feature_id": {
    "__compat": {
      "title": "...",
      "description": "...",
      "spec_url": "...",
      "doc_path": "/docs/...",
      "support": {
        "terminal_id": { "version_added": true|false|null|"v1.0.0" }
      }
    }
  }
}
```

Categories within each data file are grouped under a top-level key (e.g., `csi_sequences`) with a `__meta.category` field for display names.

**Homepage (`src/pages/index.tsx`)**: Renders the `CompatibilityMatrix` component as the landing page.

**CompatibilityMatrix (`src/components/CompatibilityMatrix/`)**: Imports all data JSON files directly. Renders a large table with terminals as columns and features as rows. Terminal columns are grouped by `group` field from `terminals.json` (Terminal Emulators vs Multiplexers). Support values map to: checkmark (true/string), X (false), ~ (partial), ? (null/unknown).

**Docs (`docs/`)**: MDX pages covering terminal standards in detail. Organized into three sidebar categories: Control Sequences, Modern Protocols, Reference. Each feature's `doc_path` in the compat data links into these docs.

**Scripts (`scripts/`)**: `scan-terminal.mjs` clones a terminal's repo into `repos/` and uses Claude CLI with structured output to batch-analyze source code for feature support. Results are written back into the data JSON files. `add-terminal.mjs` registers a new terminal and initializes all support entries as null.

## Key Conventions

- Terminal ordering in the matrix follows the key order in `terminals.json` — add new terminals at the appropriate position
- The `repos/` directory contains cloned terminal source repos used by the scanning script; it is not checked in
- `version_added` can be: `true` (supported, version unknown), `false` (not supported), `null` (unknown/not yet scanned), or a version string like `"v1.0.0"`
- `partial_implementation: true` with `notes` indicates incomplete support
- `last_scanned` date is set automatically by the scanning script
