Perfect! Now let me compile the information:

## Foot Terminal Emulator - Source Code Map

**Version:** 1.25.0 (from meson.build:2)
**Note:** This repository has no git tags; current commit is c291194

### Escape Sequence Handling

**Parser/State Machine:**
- `vt.c` - Main VT parser implementing the DEC ANSI state machine (vt100.net/emu/dec_ansi_parser); defines states (GROUND, ESCAPE, CSI_ENTRY, OSC_STRING, DCS_ENTRY, etc.) and dispatches to handlers
- `vt.h` - Parser interface; `vt_from_slave()` entry point and parameter access functions

**CSI Sequences:**
- `csi.c` - CSI dispatch and handling; SGR (text attributes), cursor movement, erasing, scrolling, DECSET/DECRST mode handlers
- `csi.h` - CSI dispatch interface; `csi_dispatch()` function
- `csi.c:599` - `decset()` function for DECSET (CSI ? Ps h)
- `csi.c:605` - `decrst()` function for DECRST (CSI ? Ps l)
- `csi.c:1206-1230` - SM/RM (Set/Reset Mode) handler for non-private modes
- `csi.c:1258-1299` - Window manipulation (CSI Ps t) - mostly unimplemented, reports dummy values

**OSC Sequences:**
- `osc.c` - OSC dispatch and handling
- `osc.h` - OSC interface; `osc_dispatch()` and `osc_ensure_size()` functions

**DCS Sequences:**
- `dcs.c` - DCS handling; includes iTerm2 inline image protocol and Sixel parsing hooks
- `dcs.h` - DCS interface; `dcs_hook()`, `dcs_put()`, `dcs_unhook()` functions

**Terminal Modes:**
- `csi.c:599` - `decset()` - DECSET handler
- `csi.c:605` - `decrst()` - DECRST handler  
- `csi.c:1536-1562` - XTQMODKEYS (CSI > Ps m) - query keyboard modifier modes

### Keyboard Input

- `input.c` - Keyboard input encoding; handles legacy protocol and Kitty keyboard protocol
- `input.c:1218` - `kitty_kbd_protocol()` - Kitty keyboard protocol encoder
- `keymap.h` - Legacy key mapping definitions
- `kitty-keymap.h` - Kitty protocol key mapping

### Graphics Protocols

**Sixel:**
- `sixel.c` - Sixel image decoder and renderer
- `sixel.h` - Sixel interface; init/unhook, rendering, geometry/color queries
- `csi.c:1493-1529` - Sixel control sequences (CSI ? Ps S) for geometry and color configuration

**iTerm2 Inline Images:**
- `dcs.c` - DCS passthrough handler includes iTerm2 inline image support
- `osc.c` - OSC 1337 handler for iTerm2 protocol

### Supporting Files

- `terminal.h` - Core terminal structure definitions (cell, attributes, cursor, grid)
- `terminal.c` - Terminal instance management and PTY communication
- `grid.c/h` - Screen buffer (grid) management
- `wayland.c` - Wayland compositor integration and window management
