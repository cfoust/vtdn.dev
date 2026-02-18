Now I have enough information to create a comprehensive map of GNU Screen's escape sequence handling architecture.

## GNU Screen Source Code Architecture Map

### Version Tags
Available tags: v.4.2.0 through v.5.0.1 (latest: v.5.0.1)

### Core Escape Sequence Parser

**src/ansi.c:214-706** - Main parser state machine (`WriteString`)
- State machine with states: LIT, ESC, ASTR, STRESC, CSI, PRIN, PRINESC, PRINCSI, PRIN4
- Dispatches to DoESC, DoCSI, and string handlers based on state

**src/ansi.c:707-836** - ESC sequence handler (`DoESC`)
- Handles single-character ESC sequences (E, D, M, H, Z, 7, 8, c, =, >, n, o, N, O, g)
- Handles ESC with intermediates: # (DECDHL), ( ) * + (charset designation)

**src/ansi.c:837-1199** - CSI sequence handler (`DoCSI`)
- Handles CSI sequences with parameters (H, f, J, K, X, A-G, d, m, g, r, s, t, u, P, L, M, @, h, l, i, n, c, x, p, S, T, ^)
- Intermediates: none, space (' '), ? (private/DEC modes), >

### Control Strings (OSC/DCS/APC/PM)

**src/ansi.c:1203-1208** - String initiation (`StringStart`)
**src/ansi.c:1210-1216** - Character accumulation (`StringChar`)
**src/ansi.c:1222-1362** - String termination and dispatch (`StringEnd`)
- OSC handler: window titles (0,1,2), icon names (11), colors (39,49), command execution (83)
- DCS handler: user-defined keys, status line control
- APC handler: application program commands
- PM handler: privacy messages

### Terminal Modes (DECSET/DECRST)

**src/ansi.c:1025-1030** - Mode setting dispatcher (CSI h/l)
**src/ansi.c:1679-1700** - ANSI mode handler (`ASetMode`)
- Modes: 4 (IRM insert), 20 (LNM linefeed), 34 (cursor visibility)

**src/ansi.c:1070-1191** - DEC private mode handler (CSI ? ... h/l)
- Modes: 1 (DECCKM cursor keys), 2 (DECANM vt52), 3 (DECCOLM 132-col), 5 (DECSCNM reverse video), 6 (DECOM origin), 7 (DECAWM autowrap), 9 (X10 mouse), 25 (DECTCEM cursor), 47/1047/1049 (alternate screen), 1048 (save/restore cursor), 1000/1001/1002/1003 (mouse tracking), 1006 (SGR mouse), 2004 (bracketed paste)

### Window Manipulation

**src/ansi.c:961-996** - CSI t sequences
- 7: refresh window
- 8: resize window
- 11: report iconification state
- 18: report window size
- 21: report window title

### Keyboard Input Encoding

**src/process.c:725-778** - Keyboard input processor (`ProcessInput2`)
- Translates user escape key to action table lookup
- Dispatches to DoProcess and LayProcess

**src/input.c** - User input handling for Screen's command mode
- Not for terminal keyboard encoding, but for Screen's : command prompt

### Graphics Protocols

**No native support found** - grep for "sixel", "inline image", "iterm", "graphics protocol" returned no matches in source code. GNU Screen does not implement graphics protocols.

### SGR/Color Handling

**src/ansi.c:1708-1778** - SGR attribute processor (`SelectRendition`)
- Basic attributes (0-9, 21-28)
- 8-color (30-37, 40-47, 90-97, 100-107)
- 256-color (38;5;n, 48;5;n)
- 24-bit color (38;2;r;g;b, 48;2;r;g;b)

### Data Flow

User input → **process.c:ProcessInput2** → DoProcess → LayProcess → (window commands or terminal data)
Terminal output → **ansi.c:WriteString** (state machine) → DoESC/DoCSI/StringEnd → terminal functions
