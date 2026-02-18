## VTE Terminal Emulator - Code Map

### Version Tags
**No tags found in the repository** - This appears to be a working clone without version tags fetched.

### Escape Sequence Handling Structure

**Parser/State Machine:**
- `src/parser.hh` - Core parser class with state machine definitions
- `src/parser.cc` - Parser implementation
- `src/parser-glue.hh` - Sequence building and encoding helpers

**CSI Sequences:**
- `src/vteseq.cc` - Main dispatcher with 375 Terminal:: handler methods (10,690 lines)
- `src/parser-arg.hh` - CSI argument parsing
- `src/parser-sgr.hh` - SGR (Select Graphic Rendition) parsing
- `src/parser-decsgr.hh` - DEC SGR parsing

**OSC Sequences:**
- `src/vteseq.cc` - OSC() dispatcher method
- `src/parser-osc.hh` - OSC sequence definitions (xterm, iTerm2, konsole, urxvt, VTE-specific)
- `src/osc-colors.cc` / `src/osc-colors.hh` - Color manipulation

**DCS Sequences:**
- `src/vteseq.cc` - DCS handlers integrated with main sequence handlers
- `src/parser-string.hh` - DCS string parsing

**Terminal Modes (DECSET/DECRST):**
- `src/modes.hh` - Mode definitions and accessors for ECMA and private modes
- `src/modes.py` - Mode definition generator
- `src/vteseq.cc` - Mode set/reset handlers

**Keyboard Input:**
- `src/keymap.cc` - Keyboard mapping and encoding (34KB)
- `src/widget.cc` - GTK key event handling (83KB)

**Graphics Protocols:**
- `src/sixel-parser.hh` - Sixel command parser with state machine
- `src/sixel-context.cc` / `.hh` - Sixel rendering
- `src/image.hh` - Generic image data structure
- `src/vteseq.cc` - DECSIXEL handler

**Window Manipulation:**
- `src/vteseq.cc` - Window manipulation handlers (VTE_XTERM_WM_* constants)
- `src/vte.cc` - Window resize signals

**Core Infrastructure:**
- `src/vteinternal.hh` - Terminal class definition (1,888 lines)
- `src/vte.cc` - Main Terminal implementation
- `src/vtegtk.cc` - GTK widget integration
