## Source Code Map

### 1. Escape Sequence Parsing (Parser/State Machine)
- `src/common/parser/EscapeSequenceParser.ts` - VT500-compatible state machine and transition table
- `src/common/parser/Constants.ts` - Parser states and action enums
- `src/common/parser/Params.ts` - Parameter parsing and storage
- `src/common/parser/OscParser.ts` - OSC sequence parser
- `src/common/parser/DcsParser.ts` - DCS sequence parser
- `src/common/parser/ApcParser.ts` - APC sequence parser

### 2. CSI, OSC, DCS Sequence Dispatching and Handling
- `src/common/InputHandler.ts` - Central dispatcher registering and executing all CSI, OSC, DCS, ESC handlers
- `src/common/services/OscLinkService.ts` - OSC 8 hyperlink handling
- `src/common/data/EscapeSequences.ts` - C0 and C1 control code definitions

### 3. Terminal Modes (DECSET/DECRST)
- `src/common/InputHandler.ts:1816-2327` - `setMode()`, `resetMode()`, `setModePrivate()`, `resetModePrivate()` methods
- `src/common/services/CoreService.ts` - DEC private mode state storage
- `src/common/WindowsMode.ts` - Windows-specific mode handling
- `src/common/input/Win32InputMode.ts` - Win32 input mode implementation

### 4. Keyboard Input Encoding
- `src/common/input/Keyboard.ts` - Standard keyboard event evaluation and encoding
- `src/common/input/KittyKeyboard.ts` - Kitty keyboard protocol with progressive enhancement flags
- `src/browser/services/KeyboardService.ts` - Browser-level keyboard service integration

### 5. Graphics Protocols
**Sixel:**
- `addons/addon-image/src/SixelHandler.ts` - DCS handler for SIXEL graphics decoding
- `addons/addon-image/src/SixelImageStorage.ts` - Sixel image storage

**iTerm2 Inline Images:**
- `addons/addon-image/src/IIPHandler.ts` - OSC 1337 handler for iTerm2 inline image protocol
- `addons/addon-image/src/IIPImageStorage.ts` - iTerm2 image storage

**Kitty Graphics:**
- `addons/addon-image/src/kitty/KittyGraphicsHandler.ts` - APC handler for Kitty graphics protocol
- `addons/addon-image/src/kitty/KittyImageStorage.ts` - Kitty image storage

### 6. Window Manipulation Sequences
- `src/common/InputHandler.ts:2952-2999` - `windowOptions()` method handles CSI Ps t sequences (window size reporting, title push/pop)

## Version Tags
Latest versions: 4.17.0 through 6.0.0 (most recent 20 tags shown above). Full history available via `git tag`.
