Based on my exploration of the Kitty codebase, here's the concise map of key files for terminal escape sequence handling:

## Version Tags
**Note:** This repository uses only a `nightly` tag (no versioned releases with v0.x.x format).

## Escape Sequence Handling Map

### Parser/State Machine
- **kitty/vt-parser.c** - Main VT parser state machine with UTF-8 decoder and escape sequence dispatcher
- **kitty/vt-parser.h** - Parser state handle and public API
- **kitty/control-codes.h** - Definitions for all control codes (NUL, BEL, ESC_*, CSI codes, etc.)

### CSI Sequences
- **kitty/vt-parser.c:1111** - `dispatch_csi()` function handles all CSI sequences (cursor movement, ED, EL, SGR, etc.)
- **kitty/screen.c** - Implements CSI handlers (screen_cursor_*, screen_erase_*, screen_insert_*, etc.)

### OSC Sequences
- **kitty/vt-parser.c:477** - `dispatch_osc()` function handles OSC codes (titles, colors, clipboard, notifications, etc.)
- **kitty/screen.c** - OSC handlers (set_title, set_color_table_color, clipboard_control, etc.)

### DCS Sequences
- **kitty/vt-parser.c:676** - `dispatch_dcs()` handles DCS sequences including XTGETTCAP and Kitty-specific protocols
- **kitty/vt-parser.c:641** - `parse_kitty_dcs()` parses Kitty-specific DCS (remote control, overlay, kitten results, etc.)
- **kitty/screen.c:3198** - `screen_handle_kitty_dcs()` dispatches Kitty DCS to Python callbacks

### APC Sequences
- **kitty/vt-parser.c:1401** - APC mode handling (limited support, mostly reports unrecognized codes)

### Terminal Modes (DECSET/DECRST)
- **kitty/vt-parser.c:1074** - `handle_mode()` processes mode setting/resetting
- **kitty/screen.h:18** - `ScreenModes` struct defines supported modes (LNM, IRM, DECTCEM, DECSCNM, etc.)
- **kitty/screen.c** - `screen_set_mode()`, `screen_reset_mode()`, `screen_save_mode()`, `screen_restore_mode()`
- **kitty/modes.h** - Mode definitions

### Keyboard Input Encoding
- **kitty/key_encoding.c** - Key encoding logic
- **kitty/key_encoding.py** - Python interface for key encoding
- **kitty/keys.c** - Key handling and dispatch
- **kitty/keys.py** - Key definitions and utilities
- **kitty/screen.c:1308** - `screen_report_key_encoding_flags()`, `screen_set_key_encoding_flags()`

### Graphics Protocols
- **kitty/graphics.c** - Kitty graphics protocol implementation (image transmission, caching, display)
- **kitty/graphics.h** - Graphics API definitions
- **kitty/screen.c** - `screen_draw_graphic()` integration point
- **kitty_tests/graphics.py** - Graphics protocol tests
- **Note:** No Sixel or iTerm2 inline image support found in current codebase

### Window Manipulation
- **kitty/vt-parser.c:1294** - CSI t sequence handler for `screen_manipulate_title_stack()` (limited window ops)
- **kitty/screen.c** - Title stack manipulation only (push/pop window titles)
- **Note:** Minimal window manipulation support compared to xterm XTWINOPS
