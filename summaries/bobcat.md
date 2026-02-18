Based on my analysis, here's the concise map of Bobcat's terminal escape sequence handling:

## Git Version Tags
```
0.9.0, 0.9.1, 0.9.2, 0.9.3, 0.9.4, 0.9.5, 0.9.6, 0.9.7, 0.9.8, 0.9.9
```

## Key Code Locations

**Important Note:** Bobcat is built on top of the **TerminalCtrl** widget library (https://github.com/ismail-yilmaz/Terminal), which is a separate U++ framework component. The actual escape sequence parsing, CSI/OSC/DCS handling, and terminal modes are implemented in TerminalCtrl, not in Bobcat itself.

### Bobcat-specific files:

**Bobcat/Terminal.h** - Terminal class definition, inherits from `TerminalCtrl`
**Bobcat/Terminal.cpp** - Main terminal implementation:
- Lines 41-55: Event handler setup (WhenOutput, WhenTitle, WhenLink, WhenSetSize, window manipulation callbacks, etc.)
- Line 63-67: PostParse() hook called after TerminalCtrl parses data
- Line 188: Write() method sends parsed PTY output to TerminalCtrl for parsing
- Lines 351-355: Keyboard encoding configuration (MetaEscapesKeys, PCStyleFunctionKeys, KeyNavigation)
- Line 351: InlineImages() enables graphics protocol support (Sixel, iTerm2)
- Lines 643-652: Inline image handling (CopyImage, OpenImage methods)
- Lines 42-48: Window manipulation sequence handlers via WhenWindowMinimize, WhenWindowMaximize, WhenWindowFullScreen, WhenWindowGeometryChange callbacks

**Bobcat/Profile.cpp** - Terminal profile/emulation settings:
- Line 68: Answerback message configuration
- Lines 222-235: Keyboard emulation modes (VT/PC function key styles, erase character, tracking overrides)
- Lines 192-196: Character set configuration (UTF-8, ISO-8859 variants)

### External dependency (not in this repo):
**TerminalCtrl library** - Contains the actual parser state machine, CSI/OSC/DCS handlers, DECSET/DECRST modes, SGR implementation, etc. This is where all the heavy lifting happens for escape sequence processing.
