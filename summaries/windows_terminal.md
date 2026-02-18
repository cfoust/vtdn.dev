Based on my exploration of the Windows Terminal codebase, here's the concise map of escape sequence handling:

## Git Version Tags
This repository doesn't have traditional version tags. Windows Terminal uses release branches and the version is tracked in package manifests (currently shows 1.0.0.0 placeholder in Package.appxmanifest).

## Escape Sequence Handling Map

**State Machine / Parser:**
- `src/terminal/parser/stateMachine.hpp` - Core VT state machine, handles all sequence types (CSI, OSC, DCS, ESC, etc.)
- `src/terminal/parser/stateMachine.cpp` - Implementation of state transitions and parsing logic
- `src/terminal/parser/IStateMachineEngine.hpp` - Interface for state machine engines

**CSI Sequence Dispatch:**
- `src/terminal/parser/OutputStateMachineEngine.cpp:406` - `ActionCsiDispatch()` - Routes CSI sequences to dispatcher methods
- `src/terminal/adapter/adaptDispatch.cpp` - Implements CSI handler methods (CUU, CUD, SGR, etc.)
- `src/terminal/adapter/adaptDispatch.hpp` - AdaptDispatch class declaration

**OSC Sequence Dispatch:**
- `src/terminal/parser/OutputStateMachineEngine.cpp:757` - `ActionOscDispatch()` - Routes OSC sequences (window title, colors, etc.)
- `src/terminal/adapter/adaptDispatch.cpp` - OSC implementation methods

**DCS Sequence Dispatch:**
- `src/terminal/parser/OutputStateMachineEngine.cpp:703` - `ActionDcsDispatch()` - Routes DCS sequences
- Returns string handlers for SIXEL, DECDLD, macros, etc.

**Terminal Modes (DECSET/DECRST):**
- `src/terminal/adapter/adaptDispatch.cpp:95-96` - `SetMode()` / `ResetMode()` methods
- `src/terminal/parser/OutputStateMachineEngine.cpp:489-502` - CSI dispatch for DECSET/DECRST

**Keyboard Input Encoding:**
- `src/terminal/input/terminalInput.hpp` - TerminalInput class with mode flags
- `src/terminal/input/terminalInput.cpp` - `HandleKey()` - Encodes keyboard input to VT sequences
- Includes Win32 input mode, Kitty keyboard protocol support

**Graphics Protocols:**
- `src/terminal/adapter/SixelParser.hpp` - Sixel image format parser
- `src/terminal/adapter/SixelParser.cpp` - Sixel implementation
- `src/terminal/adapter/adaptDispatchGraphics.cpp` - Graphics-related dispatch methods
- Referenced in DCS dispatch for Sixel (DCS q)

**Window Manipulation:**
- `src/terminal/adapter/adaptDispatch.cpp:3427` - `WindowManipulation()` - Handles DTTERM window ops
- `src/terminal/adapter/ITermDispatch.hpp` - Interface defines WindowManipulation method

**Dispatch Interface:**
- `src/terminal/adapter/ITermDispatch.hpp` - Base interface defining all VT callbacks
- `src/terminal/adapter/termDispatch.hpp` - TermDispatch base implementation
