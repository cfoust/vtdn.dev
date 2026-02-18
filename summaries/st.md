Based on my analysis of the st terminal emulator source code, here's a concise map of the key files and code locations:

## Version Tags
Available tags: 0.1 through 0.9.3 (latest)

## Source Code Map

**Main terminal logic (`st.c`):**
- `twrite()` (2541) - Entry point for processing input data
- `tputc()` (2391) - Main character processing, dispatches to parser
- `tcontrolcode()` (2205) - Handles C0/C1 control codes (BEL, ESC, LF, CR, etc.)
- `eschandle()` (2306) - Escape sequence dispatcher (handles ESC followed by single char)
- `csiparse()` (1134) - CSI parameter parser
- `csihandle()` (1609) - CSI sequence handler (cursor movement, SGR, DECSET/DECRST, scrolling, etc.)
- `strhandle()` (1888) - OSC/DCS/APC string sequence handler
- `strparse()` (2002) - Parses string escape sequences into arguments
- `tsetmode()` (1479) - Terminal mode setting (DECSET/DECRST implementation)
- `tsetattr()` (1355) - SGR attribute processing (colors, styles)
- `tdefcolor()` (1305) - Color parsing for SGR sequences

**Keyboard input (`x.c`):**
- `kpress()` (1842) - Keyboard event handler
- `kmap()` (1805) - Maps keysyms to escape sequences based on terminal modes

**Graphics protocols:**
- None found - st does not implement Sixel, iTerm2, or Kitty graphics protocols

**Window manipulation:**
- `strhandle()` (1888) - OSC 0/1/2 (title setting), OSC 10/11/12 (color queries), OSC 52 (clipboard), OSC 110/111/112 (color reset)
- No XTWINOPS (CSI 22/23 t) support detected

**State machine structure:**
- `term.esc` bitfield tracks parser state (ESC_START, ESC_CSI, ESC_STR, ESC_UTF8, etc.)
- State flow: twrite → tputc → (tcontrolcode | eschandle | csiparse/csihandle | strhandle)
