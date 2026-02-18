Now I have enough information to provide a comprehensive map. Let me create the summary:

## mlterm Source Code Map - Escape Sequence Handling

### Available Version Tags
Latest stable versions: `3.9.4`, `rel-3_9_1`, `rel-3_9_0`
(Historical releases go back to `rel-0_2_1`)

### Core Parser Architecture

**Main parser/state machine:**
- `vtemu/vt_parser.c` (8847 lines) - Main escape sequence parser and dispatcher
  - `parse_vt100_escape_sequence()` vtemu/vt_parser.c:4689 - Core state machine for ESC sequences
  - `parse_vt100_sequence()` vtemu/vt_parser.c:6874 - Main parsing loop
  - `vt_parse_vt100_sequence()` vtemu/vt_parser.c:7466 - Public entry point

**Parser header:**
- `vtemu/vt_parser.h` - Parser structures, terminal modes, event listeners

### Sequence Type Handlers

**CSI sequences (ESC [ ...):**
- Handled inline in `parse_vt100_escape_sequence()` starting at vtemu/vt_parser.c:4801
- Dispatch at vtemu/vt_parser.c:4808+ (10+ parameter handling, character processing)
- Examples: cursor movement, screen editing, SGR attributes

**OSC sequences (ESC ] ...):**
- Handled at vtemu/vt_parser.c:6014 ("ESC ]" comment)
- Window title changes (OSC 0, 1, 2)
- Color changes (OSC 4, 5, 10)
- iTerm2 inline images (OSC 1337) - vtemu/vt_parser.c:2789 (ifdef SUPPORT_ITERM2_OSC1337)

**DCS sequences (ESC P ...):**
- Handled at vtemu/vt_parser.c:6209 ("ESC P" DCS)
- Sixel graphics: vtemu/vt_parser.c:6241+ (DCS ... q)
- ReGIS graphics: vtemu/vt_parser.c:6245+ (DCS ... p)
- DECDLD (soft fonts): vtemu/vt_parser.c:6269+ (DCS ... {)

### Terminal Modes

**Mode processing (DECSET/DECRST):**
- Mode definitions: vtemu/vt_parser.c:169-221 (enum vtmode_t)
- vtemu/vt_edit.c - Additional mode handling

### Keyboard Input

**Keyboard encoding:**
- `vt_parser_write_modified_key()` vtemu/vt_parser.c - Modified key sequences
- `vt_parser_write_special_key()` vtemu/vt_parser.h:401 - Special key handling
- Application keypad mode: vtemu/vt_parser.c:4741-4747 (DECKPAM/DECKPNM)

### Graphics Protocols

**Sixel:**
- DCS sixel handler: vtemu/vt_parser.c:6241
- `vt_parser->sixel_scrolling` - Sixel scrolling mode
- `vt_parser->sixel_palette` - Color palette storage

**iTerm2 inline images:**
- OSC 1337 handler: vtemu/vt_parser.c:2789 (SUPPORT_ITERM2_OSC1337)

### Window Manipulation

**Window operations:**
- `resize()` vtemu/vt_parser.c:1398 - Window resize handler
- `xterm_listener->resize()` callbacks - vtemu/vt_parser.c:1368, 1399
- Window title: vtemu/vt_parser.c:6074+ (OSC 0/1/2)
- Icon name handling

### Supporting Files

**Character encoding:**
- `vtemu/vt_char_encoding.c` - Character set handling
- `vtemu/vt_str_parser.c/h` - String parsing utilities

**Screen operations:**
- `vtemu/vt_screen.c/h` - Screen buffer management
- `vtemu/vt_edit.c` - Editing operations

**DRCS (soft fonts):**
- `vtemu/vt_drcs.c/h` - DRCS font handling

**Virtual terminal library:**
- `libvterm/vterm.c` - VTerm compatibility layer
