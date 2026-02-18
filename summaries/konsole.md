Perfect! Now I have a good understanding of the codebase structure. Let me provide a concise map:

## Konsole Source Code Map

**No version tags found** (git tag returned empty)

### Escape Sequence Parser/State Machine:
- **src/Vt102Emulation.h** (lines 161-180): State machine enum (`ParserStates`: Ground, Escape, CsiEntry, CsiParam, DcsEntry, OscString, etc.)
- **src/Vt102Emulation.cpp** (lines 322-4040): Main parser implementation
  - `receiveChars()`: Entry point for incoming data
  - `switchState()`: State machine transitions
  - `initTokenizer()`, `resetTokenizer()`: Parser initialization

### CSI Sequence Handling:
- **src/Vt102Emulation.cpp:545**: `csi_dispatch()` - Dispatches CSI sequences
- **src/Vt102Emulation.cpp:1899**: `processToken()` - Main CSI handler (4040 lines total)
  - Handles cursor movement, text editing, modes, colors, etc.

### OSC Sequence Handling:
- **src/Vt102Emulation.h** (lines 188-204): OSC command enum (colors, clipboard, notifications, images, etc.)
- **src/Vt102Emulation.cpp:646**: `osc_end()` - Processes OSC sequences
- **src/Vt102Emulation.cpp:219-221**: `osc_start()`, `osc_put()` - OSC data collection

### DCS Sequence Handling:
- **src/Vt102Emulation.cpp:670**: `hook()` - DCS entry
- **src/Vt102Emulation.cpp:662**: `put()` - DCS data handling
- **Vt102Emulation.h:222-224**: `unhook()` - DCS termination

### Terminal Modes (DECSET/DECRST):
- **src/Vt102Emulation.h** (lines 32-50): Mode constants (MODE_AppCuKeys, MODE_Mouse*, MODE_BracketedPaste, etc.)
- **src/Vt102Emulation.cpp**: `setMode()`, `resetMode()` - Mode management
- **src/Screen.h** (lines 26-34): Screen modes (MODE_Origin, MODE_Wrap, MODE_Insert, etc.)
- **src/Screen.cpp**: Screen mode implementations

### Keyboard Input Encoding:
- **src/Vt102Emulation.cpp:2574**: `sendKeyEvent()` - Main keyboard handler
- **src/keyboardtranslator/KeyboardTranslator.h/cpp**: Key binding translation
- **src/keyboardtranslator/KeyboardTranslatorManager.cpp**: Key binding management
- **src/Vt102Emulation.h** (lines 244-254): Win32 input mode support

### Graphics Protocols:
- **Sixel**: src/Vt102Emulation.h (lines 342-362), Vt102Emulation.cpp `processSixel()`, `SixelModeEnable/Disable()`
- **iTerm2 inline images**: src/Vt102Emulation.h line 201 (OSC 1337)
- **Kitty graphics**: src/Vt102Emulation.h (lines 364-367), `_graphicsImages` cache
- **src/Screen.h** (lines 41-49, 683-709): `TerminalGraphicsPlacement_t`, `addPlacement()`, `getGraphicsPlacement()`

### Window Manipulation:
- Handled in `processToken()` via CSI sequences
- **src/Vt102Emulation.cpp**: Window resize/report functions (`reportPixelSize()`, `reportCellSize()`, `reportSize()`)
