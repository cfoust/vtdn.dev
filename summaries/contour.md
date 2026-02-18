Let me create a summary now with all the information I've gathered:

## Contour Terminal Emulator - Source Code Map

**Available version tags:**
v0.1.0 through v0.6.2.8008 (latest: v0.6.2.8008)

### Key Files for Escape Sequence Handling

**Parser / State Machine:**
- `src/vtparser/Parser.h` - VT parser state machine definition (states: Ground, Escape, CSI_Entry, CSI_Param, DCS_Entry, OSC_String, etc.)
- `src/vtparser/Parser.cpp` - Parser implementation
- `src/vtparser/Parser-impl.h` - Parser implementation details
- `src/vtparser/ParserEvents.h` - Parser event interface

**Sequence Building & Dispatch:**
- `src/vtbackend/SequenceBuilder.h` - Translates parser events into high-level Sequence objects; implements dispatchCSI, dispatchOSC, dispatchESC, hook/put/unhook for DCS
- `src/vtbackend/Sequence.h` - CSI parameter handling and sequence representation
- `src/vtbackend/Sequence.cpp` - Sequence implementation
- `src/vtbackend/Functions.h` - VT function definitions (C0, ESC, CSI, OSC, DCS categories) with documentation

**Sequence Processing:**
- `src/vtbackend/Screen.cpp` (lines 3399-4288) - Main sequence handler; processSequence() at line 3399, apply() dispatch at line 3507
- `src/vtbackend/Screen.h` - Screen API and VT command implementations
- `src/vtbackend/Terminal.cpp` - Terminal state management
- `src/vtbackend/Terminal.h` - Terminal modes management (lines 88-150: Modes class)

**Terminal Modes (DECSET/DECRST):**
- `src/vtbackend/Screen.cpp:3761` - DECRM (reset DEC mode) handler
- `src/vtbackend/Screen.cpp:3832` - DECSM (set DEC mode) handler
- `src/vtbackend/Terminal.h:92-150` - Modes class (set/get/save/restore ANSI and DEC modes)

**Keyboard Input Encoding:**
- `src/vtbackend/InputGenerator.h` - Keyboard encoding (modifiers, keys, mouse protocols)
- `src/vtbackend/InputGenerator.cpp` - Input generation implementation
- `src/vtbackend/InputHandler.h` - Generic input handler interface

**Graphics Protocols:**
- `src/vtbackend/SixelParser.h` - Sixel parser
- `src/vtbackend/SixelParser.cpp` - Sixel implementation
- `src/vtbackend/Image.h` - Image handling (no iTerm2 inline images found in codebase)
- `src/vtbackend/Image.cpp` - Image implementation

**Window Manipulation:**
- Handled in `src/vtbackend/Screen.cpp` via CSI sequences (window resize requests at line 3812+)
- Terminal window operations in `src/vtbackend/Terminal.cpp`
