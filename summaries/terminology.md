## Key Files Map

**Escape Sequence Parsing:**
- `src/bin/termptyesc.c` — Main parser/state machine (5225 lines), handles all escape sequence types
- `src/bin/termpty.c` — Entry point with `termpty_handle_buf()` feeding unicode to parser

**CSI/OSC/DCS Dispatch:**
- `src/bin/termptyesc.c:3407` — `_handle_esc_csi()` dispatcher (large switch for A-Z, a-z commands)
- `src/bin/termptyesc.c:4451` — `_handle_esc_osc()` for titles, colors, hyperlinks, clipboard
- `src/bin/termptyesc.c:4700` — `_handle_esc_dcs()` for termcap/terminfo queries
- `src/bin/termptyesc.c:4655` — `_handle_esc_terminology()` for custom extensions (ESC })

**Terminal Modes:**
- `src/bin/termptyesc.c:283` — `_handle_esc_csi_reset_mode()` handles CSI ? h/l (DECSET/DECRST)

**Keyboard Input:**
- `src/bin/keyin.c` — Main keyboard handler with modifiers and key translation
- `src/bin/tty_keys.h` — Generated lookup table for key sequences

**Graphics Protocols:**
- `src/bin/termptygfx.c` — Character set translation (VT100 line drawing)
- `src/bin/termptyesc.c:2864` — Sixel/ReGIS stub (minimal implementation)
- No iTerm2 inline image support found

**Window Manipulation:**
- `src/bin/termptyesc.c:3295` — `_handle_window_manipulation()` for CSI t sequences

**Version Tags:**
- Range: v0.1.0 through v1.14.0 (latest)
- 40+ tagged versions available
