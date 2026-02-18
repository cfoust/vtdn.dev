Perfect! Now I have enough information. Let me compile a concise summary of the codebase structure.

## PuTTY Terminal Escape Sequence Handling - Code Map

**Version Tags:**
Available from 0.45 through 0.83, with most recent being 0.83.

**Escape Sequence Parser & State Machine:**
- `terminal/terminal.c:3712-5754` - `term_out()` function: main parser/state machine
- `terminal/terminal.h:202-217` - Parser state enum: `TOPLEVEL`, `SEEN_ESC`, `SEEN_CSI`, `SEEN_OSC`, `SEEN_OSC_W`, `SEEN_OSC_P`, `OSC_STRING`, `OSC_MAYBE_ST`, `DO_CTRLS`, `VT52_ESC`, `VT52_Y1`, `VT52_Y2`, `VT52_FG`, `VT52_BG`
- `terminal/terminal.c:4087-4330` - ESC sequence dispatch (`SEEN_ESC` case)
- `terminal/terminal.c:4331-5253` - CSI sequence dispatch (`SEEN_CSI` case)
- `terminal/terminal.c:5254-5413` - OSC sequence handling (`SEEN_OSC` case)
- `terminal/terminal.c:5414-5447` - OSC P color setting (`SEEN_OSC_P` case)
- `terminal/terminal.c:5482-5752` - VT52 mode handling

**CSI Sequence Handling:**
- `terminal/terminal.c:4362-5253` - Main CSI dispatch switch using `ANSI(c, term->esc_query)` macro
- `terminal/terminal.h:189-190` - `ANSI(x,y)` and `ANSI_QUE(x)` macros for case matching
- Examples: CUU/CUD/CUF/CUB (4363-4409), ED/EL (4656-4739), SGR (4740-5106), CUP (4431-4452)

**OSC Sequence Handling:**
- `terminal/terminal.c:3192-3248` - `do_osc()` function: processes complete OSC strings
- Handles: Window title (OSC 0/1/2), color queries (OSC 4), wordness (OSC W)
- `terminal/terminal.c:3244-3246` - DCS/APC/SOS/PM recognized but ignored (no implementation)

**Terminal Modes (DECSET/DECRST):**
- `terminal/terminal.c:3056-3186` - `toggle_mode()` function: mode processing
- `terminal/terminal.c:4529-4535` - CSI h (SM: set mode)
- `terminal/terminal.c:4554-4560` - CSI l (RM: reset mode)
- Modes include: DECCKM (1), DECANM (2), DECCOLM (3), DECSCNM (5), DECOM (6), DECAWM (7), DECTCEM (25), alt screen (47/1047/1049), mouse tracking (1000/1002/1003/1006/1015), bracketed paste (2004)

**Keyboard Input Encoding:**
- `terminal/terminal.c:3547-3575` - `term_keyinput_internal()`: processes keyboard input
- `putty.h:2046-2047` - Public API: `term_keyinput()` and `term_keyinputw()` 
- `terminal/terminal.c:7807-7811` - `term_keyinputw()`: wide char entry point
- Keyboard data flows through ldisc (line discipline) layer for encoding

**Window Manipulation Sequences:**
- `terminal/terminal.c:4832-4957` - CSI t handling (DECSLPP and xterm window ops)
- `terminal/terminal.c:3041-3052` - `term_request_resize()`: internal resize requests
- Operations: iconify (1), deiconify (2), move window (3), report sizes (13-20), resize (4/8)
- Controlled by `term->no_remote_resize` config flag

**Graphics Protocols:**
- **No Sixel support** - not implemented
- **No iTerm2 inline images** - not implemented  
- **DCS sequences ignored** - `terminal/terminal.c:3244-3246` notes DCS/APC/SOS/PM are recognized but have no implementation

**Key Data Structures:**
- `terminal/terminal.h:107-460` - `Terminal` struct: main terminal state
- Fields include: parser state (`termstate`), escape args (`esc_args`, `esc_nargs`, `esc_query`), OSC buffer (`osc_string`, `osc_strlen`), cursor position, screen buffers, mode flags
