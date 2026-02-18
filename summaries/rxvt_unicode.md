Perfect! Now let me create a concise summary document with the key findings:

## rxvt-unicode source code map - escape sequence handling

**Git version tags**: 85 tags total, ranging from `rxvt-unicode-1.2` to `rxvt-unicode-9.30`

### Core escape sequence parsing & dispatch

**src/command.C** - Main command processing and escape sequence handling
- `cmd_parse()` (2246) - Main parsing loop, dispatches to sequence handlers
- `next_char()` (2375) - Character reading from input buffer
- `cmd_getc()` (2421) - Get next character for sequence parsing
- `process_nonprinting()` (2532) - Handles control characters
- `process_escape_seq()` (2648) - Main escape sequence dispatcher (ESC handler)
- `process_escape_vt52()` (2588) - VT52 mode escape sequences

### CSI sequence handling

**src/command.C**
- `process_csi_seq()` (2812) - CSI (ESC [) sequence parser and dispatcher
- CSI enum (2782-2791) - Defines all CSI command codes (CSI_ICH, CSI_CUU, etc.)
- Individual CSI handlers inline in `process_csi_seq()` switch statement (2918-3138)

### Terminal modes (DECSET/DECRST)

**src/command.C**
- `process_terminal_mode()` (3722) - Handles mode setting/resetting (CSI ? h/l)
- `privcases()` (3692) - Sets/queries individual private mode bits
- Mode definitions table `argtopriv[]` (3731-3782) - Maps mode numbers to PrivMode bits
  - Includes: DECCKM (1), DECANM (2), DECCOLM (3), DECAWM (7), DECTCEM (25), mouse modes (1000-1006), bracketed paste (2004), etc.

### OSC sequences

**src/command.C**
- `process_osc_seq()` (3315) - OSC (ESC ]) Operating System Command parser
- `process_xterm_seq()` (3468) - Handles specific OSC operations (XTerm_title, XTerm_Color, etc.)
- `process_color_seq()` (3440) - Color query/set operations
- `map_rgb24_color()` (3355) - RGB color mapping

### DCS sequences

**src/command.C**
- `process_dcs_seq()` (3296) - DCS (ESC P) Device Control String handler (currently stub - not implemented)

### Window manipulation

**src/command.C**
- `process_window_ops()` (3144) - Window operation sequences (CSI t commands)
  - Handles: iconify/deiconify, move, resize, raise/lower, refresh

### SGR (graphics rendition)

**src/command.C**
- `process_sgr_mode()` (3950) - SGR attribute setting (colors, bold, underline, etc.)
- `set_cursor_style()` (4117) - DECSCUSR cursor style

### Screen operations

**src/screen.C** - All screen buffer manipulation
- Functions prefixed with `scr_` handle actual terminal operations:
  - `scr_add_lines()` (796) - Add text to screen
  - `scr_gotorc()` (1196) - Cursor positioning
  - `scr_index()` (1245) - Scroll up/down
  - `scr_erase_line()` (1271) - Erase line operations
  - `scr_erase_screen()` (1335) - Erase screen operations
  - `scr_scroll_region()` (1604) - Set scroll region (DECSTBM)
  - `scr_charset_set()` (1811) - Character set selection
  - Many more (50+ functions)

### Keyboard input encoding

**src/command.C**
- `key_press()` (410) - Main keyboard event handler
- `tt_write_user_input()` (4160) - Write user input to terminal
- `tt_write()` (4172) - Write data to terminal

**src/keyboard.C** - Keysym resource system for custom key bindings
- User-defined key mapping system

### Graphics protocols

**No graphics protocol support found** - No Sixel, iTerm2 inline images, or other graphics protocols detected in the codebase.
