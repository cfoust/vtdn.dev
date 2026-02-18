Perfect! Now I have a comprehensive understanding of the cy terminal emulator's escape sequence handling. Let me provide a concise map:

## cy Terminal Emulator - Escape Sequence Handling Map

**Version Tags:**
- Latest: v1.11.1
- Full range: v0.1.0 through v1.11.1 (72 releases)

**Core Parser/State Machine:**
- `pkg/emu/state.go:1-100` - Main State struct, uses `github.com/danielgatis/go-vte/vtparser` for parsing state machine
- `pkg/emu/vt_posix.go:30-38` - Parse() method feeds bytes to vtparser, which calls dispatch methods

**Dispatch Methods (in parse.go):**
- `pkg/emu/parse.go:13-43` - Print() - prints printable characters
- `pkg/emu/parse.go:45-65` - Execute() - handles C0 control codes (HT, BS, CR, LF, BEL, etc.)
- `pkg/emu/parse.go:193-354` - CsiDispatch() - CSI sequence handler (cursor movement, ED, EL, SGR, etc.)
- `pkg/emu/parse.go:84-191` - OscDispatch() - OSC sequence handler (title, colors, clipboard, semantic prompts)
- `pkg/emu/parse.go:356-407` - EscDispatch() - ESC sequence handler (IND, NEL, RIS, charset selection)
- `pkg/emu/parse.go:68-82` - Hook/Put/Unhook() - DCS handlers (currently empty stubs)

**CSI Sequences:**
- `pkg/emu/csi.go` - CSI escape struct and argument parsing
- `pkg/emu/parse.go:217-350` - CSI dispatch switch: cursor motion, scrolling, clearing, tab stops, device attributes, cursor styles (DECSCUSR)

**Terminal Modes (DECSET/DECRST):**
- `pkg/emu/state.go:628-739` - setMode() handles both private (?) and standard modes
- `pkg/emu/module.go:32-60` - ModeFlag constants (ModeWrap, ModeAltScreen, mouse modes, focus, bracketed paste, sync update, etc.)

**SGR Attributes:**
- `pkg/emu/state.go:741+` - setAttr() handles SGR (colors, bold, italic, underline, etc.)

**OSC Sequences:**
- `pkg/emu/str.go` - String escape struct for OSC/DCS
- `pkg/emu/parse.go:84-191` - OSC dispatch: titles (0/1/2), directory (7), colors (10/11/4/104), clipboard (52), semantic prompts (133)

**Keyboard Protocol (Kitty):**
- `pkg/emu/kitty.go` - Kitty keyboard protocol implementation
- `pkg/emu/parse.go:334-339` - CSI u handling integrates with Kitty protocol
- `pkg/emu/kitty.go:85-159` - handleKittyProtocol() for query/set/push/pop protocol state

**Color Handling:**
- `pkg/emu/color.go` - Color types and color space handling
- `pkg/emu/str.go:48-110` - OSC color setting and querying
- `pkg/emu/str.go:119-218` - parseColor() for RGB and hex color parsing

**Graphics Protocols:**
- No Sixel support found
- No iTerm2 inline images support found
- No Kitty graphics protocol support found

**Window Manipulation:**
- `pkg/emu/parse.go:347` - CSI t (XTWINOPS) is explicitly ignored with no implementation
