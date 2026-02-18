Perfect! Now let me compile this information into a concise map.

## iTerm2 Escape Sequence Architecture Map

### Parser/State Machine Core
- **sources/VT100Parser.h/m** - Main parser entry point, manages stream data and delegates to specialized parsers
- **sources/VT100StateMachine.h/m** - Low-level state machine for parsing escape sequences
- **sources/VT100Token.h/m** - Token definitions for all sequence types (CSI, OSC, DCS, etc.)

### Sequence-Specific Parsers
- **sources/VT100CSIParser.h/m** - CSI (Control Sequence Introducer) parser and dispatcher
- **sources/VT100XtermParser.h/m** - OSC (Operating System Command) and APC sequence parser
- **sources/VT100DCSParser.h/m** - DCS (Device Control String) parser
- **sources/VT100AnsiParser.h/m** - ANSI escape sequence parser
- **sources/VT100ControlParser.h/m** - Basic control character parser
- **sources/VT100StringParser.h/m** - String sequence parser
- **sources/VT100OtherParser.h/m** - Other sequence types
- **sources/VT100ConductorParser.swift** - SSH integration parser (OSC 134/135)

### Execution Layer
- **sources/VT100Terminal.h/m** - Main terminal state and executor, calls delegate methods
- **sources/VT100ScreenMutableState+TerminalDelegate.h/m** - Implements VT100TerminalDelegate, handles execution of parsed sequences

### Terminal Modes (DECSET/DECRST)
- **sources/VT100Terminal.m** - Contains mode handling (search for `DECSET`/`DECRST`)
- **sources/VT100Token.h** - Mode token types defined (VT100CSI_DECSET, VT100CSI_DECRST)

### Keyboard Input Encoding
- **sources/VT100Output.h/m** - Generates escape sequences for keyboard input (arrow keys, function keys, etc.)
- **sources/iTermKeyMapper.h** - Base key mapping interface
- **sources/iTermModernKeyMapper.swift** - Modern keyboard protocol implementation
- **sources/iTermStandardKeyMapper.h/m** - Standard key mapping
- **sources/iTermTermkeyKeyMapper.h/m** - Termkey-based key mapping
- **sources/iTermModifyOtherKeysMapper.h/m** - modifyOtherKeys protocol

### Graphics Protocols
- **sources/VT100SixelParser.h/m** - Sixel graphics parser
- **sources/VT100InlineImageHelper.h/m** - iTerm2 inline image protocol
- **iTerm2SandboxedWorker/iTermImage+Sixel.h/m** - Sixel image processing

### Window Manipulation
- **sources/VT100Terminal.m** - Window manipulation sequence handlers (search for `XTERMCC_WINDOWSIZE`, `XTWINOPS`)
- **sources/VT100Token.h** - Window manipulation tokens (XTERMCC_WINDOWSIZE, XTERMCC_ICONIFY, etc.)

### Version Tags
Only two nightly tags are present:
- **v20260218-nightly** (HEAD, latest)
- **v20260216-nightly**
