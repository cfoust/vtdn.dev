Perfect! Now I have a clear picture. Let me provide a concise summary:

## Zellij Terminal Escape Sequence Handler Map

**Version tags:** Latest is v0.43.1 (v0.1.0-alpha through v0.43.1 available)

### Core Parsing & Dispatch
- **`zellij-server/src/panes/grid.rs`** (4003 lines) - Main VTE parser implementation
  - Uses `vte` crate, implements `Perform` trait (line 2560)
  - `csi_dispatch()` at line 2851 - handles CSI sequences (cursor movement, SGR, modes, etc.)
  - `osc_dispatch()` at line 2655 - handles OSC sequences (title, colors, hyperlinks)
  - `esc_dispatch()` at line 3455 - handles ESC sequences
  - `put()` at line 2630 - processes raw bytes
  - `dcs_hook()` - handles DCS sequences (Sixel entry point)

### Terminal Modes (DECSET/DECRST)
- **`zellij-server/src/panes/grid.rs`** lines 3026-3128
  - `c == 'h'` at 3026 - DECSET handler (mode sets)
  - `c == 'l'` at 2931 - DECRST handler (mode resets)
  - Modes: cursor visibility (25), bracketed paste (2004), alternate buffer (1049), cursor keys (1), autowrap (7), mouse tracking (1000/1002/1003/1004/1005/1006), sixel scrolling (80), insert mode (4), newline mode (20), render locking (2026)

### Keyboard Input Encoding
- **`zellij-client/src/keyboard_parser.rs`** - Kitty keyboard protocol parser
- **`zellij-server/src/panes/grid.rs`** lines 3254-3290 - Kitty protocol negotiation (`CSI > u`, `CSI < u`, `CSI = u`)
- **`zellij-server/src/panes/terminal_pane.rs`** lines 40-86 - ANSI encoding constants and encoding logic

### Graphics Protocols
- **`zellij-server/src/panes/sixel.rs`** - Sixel image handling (parser, grid, image store)
  - Uses `sixel-image` and `sixel-tokenizer` crates
  - `SixelGrid` struct handles image rendering and positioning
- **No iTerm2 inline images support detected**

### Window Manipulation
- **No XTWINOPS/window manipulation sequences found** (CSI 14t/16t queries are sent but not handled for manipulation)

### Terminal Query Responses
- **`zellij-client/src/stdin_ansi_parser.rs`** - Parses terminal emulator responses (pixel dimensions, colors, sync mode)
  - Queries sent: `CSI 14t` (text area), `CSI 16t` (cell size), `OSC 10/11` (colors), `CSI ? 2026 $p` (sync mode)
