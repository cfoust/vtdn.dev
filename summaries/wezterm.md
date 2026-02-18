Based on my exploration of the WezTerm codebase, here's a concise map of the key files for escape sequence handling:

## WezTerm Escape Sequence Architecture

**No version tags** - WezTerm uses date-based releases (format: YYYYMMDD-HHMMSS-hash) from continuous builds off the `main` branch.

### Core Parser (State Machine)
- `wezterm-escape-parser/src/parser/mod.rs` - Main VT parser state machine using vtparse
- `vtparse/` (external dependency) - Low-level VT100/ANSI state machine

### Sequence Type Definitions
- `wezterm-escape-parser/src/csi.rs` - CSI sequence types enum and parsing
- `wezterm-escape-parser/src/osc.rs` - OSC (Operating System Command) types
- `wezterm-escape-parser/src/esc.rs` - ESC sequence types
- `wezterm-escape-parser/src/lib.rs` - Action enum dispatching all sequence types
- `wezterm-escape-parser/src/apc.rs` - APC sequences (Kitty graphics)

### Sequence Handlers (Dispatch)
- `term/src/terminalstate/performer.rs` - Main dispatch: `perform()` routes Action to handlers
  - Line 252: `perform()` - main entry point
  - Line 491: `csi_dispatch()` - CSI handling
  - Line 585: `esc_dispatch()` - ESC handling
  - Line 276: `osc_dispatch()` - OSC handling
  - Line 290: `device_control()` - DCS handling

### Terminal Modes (DECSET/DECRST)
- `term/src/terminalstate/mod.rs` - Mode state and `perform_csi_mode()` implementation
  - Uses `DecPrivateMode` and `TerminalMode` from csi.rs

### Keyboard Input Encoding
- `term/src/terminalstate/keyboard.rs` - Keyboard encoding (Xterm, CSI-u, Kitty protocols)
- `term/src/input.rs` - Input handling infrastructure

### Graphics Protocols
- `wezterm-escape-parser/src/parser/sixel.rs` - Sixel parser
- `term/src/terminalstate/sixel.rs` - Sixel rendering
- `term/src/terminalstate/iterm.rs` - iTerm2 inline images
- `term/src/terminalstate/kitty.rs` - Kitty graphics protocol
- `term/src/terminalstate/image.rs` - Common image handling

### Window Manipulation
- `term/src/terminalstate/performer.rs:509` - `perform_csi_window()` for CSI window sequences
- Defined in `wezterm-escape-parser/src/csi.rs` as `Window` enum
