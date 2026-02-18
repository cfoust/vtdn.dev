Perfect! Now let me compile the comprehensive map:

## xterm Source Code Map

### Parser / State Machine
- **VTPrsTbl.c** (10,214 lines) - Generated VT parser state table; dispatch logic for all escape sequences
- **VTparse.h** - Parser state definitions and CASE_ macros
- **VTparse.def** - Definition file listing all parser states/cases (237 CASE_ symbols)

### Main Escape Sequence Processing
- **charproc.c** (15,166 lines) - Main character/escape sequence processor; big switch statement handling all CASE_ values (CSI, OSC, DCS, window ops, modes, etc.)

### CSI Sequences
- **charproc.c:4809** - CASE_DECSET (CSI ? h)
- **charproc.c:4826** - CASE_DECRST (CSI ? l)
- **charproc.c** - All other CSI handlers (cursor movement, SGR, editing, etc.)

### OSC Sequences (Operating System Commands)
- **misc.c:3987** - `do_osc()` function - handles all OSC sequences (title setting, color queries, etc.)

### DCS Sequences (Device Control Strings)
- **misc.c:4867** - `do_dcs()` function - handles DCS sequences (Sixel, ReGIS entry points, etc.)

### Terminal Modes (DECSET/DECRST)
- **charproc.c:7488** - `dpmodes()` function - processes DEC private modes (application keypad, origin mode, DECAWM, etc.)

### Keyboard Input Encoding
- **input.c** (2,334 lines) - Keyboard input handling, key translation, modifier encoding

### Graphics Protocols
- **graphics_sixel.c** (27,459 bytes) - Sixel graphics protocol implementation
- **graphics_sixel.h** - Sixel headers
- **graphics_regis.c** (224,637 bytes) - ReGIS graphics protocol implementation
- **graphics_regis.h** - ReGIS headers
- **graphics.c** (51,331 bytes) - Common graphics infrastructure

### Window Manipulation
- **charproc.c:6212** - CASE_XTERM_WINOPS - entry point for window operations
- **charproc.c** - `window_ops()` function handles CSI t sequences

### Supporting Files
- **misc.c** (8,415 lines) - Miscellaneous utility functions (OSC/DCS handlers, mode save/restore)
- **util.c** (153,763 bytes) - Screen manipulation utilities
- **screen.c** (91,116 bytes) - Screen buffer operations

### Version Tags
```
xterm-406, xterm-406a through xterm-406g, xterm-407
```
