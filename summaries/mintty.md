Now I'll provide a concise map of mintty's source code structure:

## Mintty Source Code Map

**Version:** 3.8.2 (from appinfo.h:8-9)

**Main parsing state machine** (src/term.h:625-639):
- States: NORMAL, ESCAPE, CSI_ARGS, OSC_START, OSC_NUM, OSC_PALETTE, DCS_START, DCS_PARAM, DCS_INTERMEDIATE, DCS_PASSTHROUGH, DCS_IGNORE, DCS_ESCAPE, plus VT52 and TEK modes

**Escape sequence parsing & dispatch** (src/termout.c):
- `term_write()` (line 6104) — main entry point for terminal output
- `term_do_write()` — state machine implementation with switch on term.state (line 5313)
- `do_esc()` (line 1901) — ESC sequence handler
- `do_csi()` (line 3102) — CSI sequence dispatcher
- `do_osc()` (line 4414) — OSC sequence handler (color/clipboard/hyperlinks/window title)
- `do_dcs()` (line 4018) — DCS sequence handler
- `do_ctrl()` (line 1677) — control character handler
- `do_vt52()` (line 1733) — VT52 mode handler

**Terminal modes** (src/termout.c):
- `do_csi()` line 3102+ — handles DECSET/DECRST (CSI ? Pm h/l)
- Mode processing integrated into CSI dispatcher with 'h' and 'l' final bytes

**Keyboard input encoding** (src/wininput.c):
- Keyboard event handling and encoding to escape sequences
- `child_send()` / `child_sendw()` — send encoded input to child process

**Window manipulation** (src/termout.c):
- `do_winop()` (line 2964) — XTWINOPS implementation (CSI Ps ; Ps ; Ps t)

**Graphics protocols:**
- **Sixel:** src/sixel.c, src/sixel.h — full sixel graphics implementation
- **ReGIS:** src/regis.c, src/regis.h — ReGIS vector graphics
- **Tektronix:** src/tek.c, src/tek.h — Tektronix 4014 graphics mode
- **iTerm2 inline images:** src/winimg.c, src/termout.c (OSC 1337 handling)
- Image display: src/winimg.c, src/winimg.h

**Terminal core:**
- src/term.c — terminal buffer management, scrollback, line handling
- src/term.h — main terminal structure and state definitions
- src/termpriv.h — private terminal declarations
- src/termline.c — line manipulation functions
- src/termclip.c — clipboard/selection handling
- src/termmouse.c — mouse event processing
