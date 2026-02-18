Perfect! Now I have a comprehensive understanding of the codebase structure. Let me provide the concise map:

## Ghostty Terminal Escape Sequence Handling - Code Map

### Core Parser & State Machine
- `src/terminal/Parser.zig` - VT-series state machine implementing Paul Williams' parser (vt100.net spec)
- `src/terminal/parse_table.zig` - State transition table for the parser

### Sequence Dispatch & Handlers
- `src/terminal/stream.zig:779` - `csiDispatch()` - CSI sequence dispatcher and handlers
- `src/terminal/stream.zig:1936` - `oscDispatch()` - OSC sequence dispatcher and handlers
- `src/terminal/stream.zig:731` - `escDispatch()` - ESC sequence dispatcher

### Sequence Type Definitions
- `src/terminal/csi.zig` - CSI command types (EraseDisplay, EraseLine, TabClear, XTWINOPS, etc.)
- `src/terminal/osc.zig` - OSC command types and parser (window title, clipboard, hyperlinks, colors, etc.)
- `src/terminal/dcs.zig` - DCS command handler (hook/put/unhook)
- `src/terminal/apc.zig` - APC command handler (Kitty graphics via APC)
- `src/terminal/ansi.zig` - ANSI-related types and constants

### Terminal Modes (DECSET/DECRST)
- `src/terminal/modes.zig` - Mode definitions and state management (ModeState, ModePacked, Mode enum)
- `src/terminal/modes.zig:189` - List of all supported ANSI and DEC modes

### Keyboard Input Encoding
- `src/terminal/kitty/key.zig` - Kitty keyboard protocol support (flag stack, push/pop)
- `src/terminal/c/key_encode.zig` - Key encoding implementation
- `src/terminal/formatter.zig` - Terminal output formatting including key sequences

### Graphics Protocols
- `src/terminal/kitty/graphics.zig` - Kitty graphics protocol main module
- `src/terminal/kitty/graphics_command.zig` - Graphics command parsing
- `src/terminal/kitty/graphics_exec.zig` - Graphics command execution
- `src/terminal/kitty/graphics_render.zig` - Graphics rendering
- `src/terminal/kitty/graphics_image.zig` - Image handling
- `src/terminal/apc.zig:36` - Kitty graphics via APC sequences (APC G)
- **Note:** No Sixel or iTerm2 inline image support found

### Window Manipulation
- `src/terminal/csi.zig:39` - XTWINOPS types (SizeReportStyle, TitlePushPop)
- `src/terminal/stream.zig` - Window manipulation handlers integrated in CSI/OSC dispatch

### Core Terminal Structure
- `src/terminal/Terminal.zig` - Main terminal emulation structure (grid, scrollback, state)
- `src/terminal/sgr.zig` - SGR (Select Graphic Rendition) attribute handling

## Version Tags
```
tip
v1.0.0
v1.0.1
v1.1.0
v1.1.1
v1.1.2
v1.2.0
```
