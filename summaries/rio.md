Perfect! Now I have enough information to provide a comprehensive map. Let me create the output:

## Version Tags

Available versions from v0.0.3 through v0.2.37, plus a "nightly" tag. Latest stable is v0.2.37.

## Key Files for Escape Sequence Handling

**Parser/State Machine:**
- `copa/src/lib.rs` - VTE state machine parser implementing Paul Williams' ANSI parser. Handles CSI, OSC, DCS, ESC, APC, PM, SOS sequences. Defines `Perform` trait for dispatch callbacks.
- `rio-backend/src/batched_parser.rs` - Wrapper around Copa parser with batch UTF-8 processing optimizations

**Sequence Dispatch:**
- `rio-backend/src/performer/handler.rs` - Main handler implementing Copa's `Perform` trait. Contains `csi_dispatch`, `osc_dispatch`, `hook` (for DCS), and `esc_dispatch` methods. Routes sequences to handler methods (lines 1-100+ show handler trait definitions)

**Terminal Modes (DECSET/DECRST):**
- `rio-backend/src/ansi/mode.rs` - Mode enumerations: `NamedMode` (public modes like Insert=4, LineFeedNewLine=20), `NamedPrivateMode` (DEC private modes: CursorKeys=1, ColumnMode=3, Origin=6, LineWrap=7, ShowCursor=25, mouse modes 1000-1007, BracketedPaste=2004, SyncUpdate=2026, etc.)
- `rio-backend/src/crosswords/mod.rs:1390` - `set_mode` and `unset_mode` implementations
- `rio-backend/src/crosswords/mod.rs:1446` - `set_private_mode` and `unset_private_mode` implementations
- `rio-backend/src/performer/handler.rs:1035,1048` - Mode setting dispatch from CSI sequences (SM/RM for public, DECSET/DECRST for private)

**Keyboard Input Encoding:**
- `frontends/rioterm/src/bindings/kitty_keyboard.rs` - Kitty keyboard protocol implementation with `build_key_sequence` function. Handles CSI u sequences, modifier encoding, event types, alternate keys
- `rio-backend/src/ansi/mod.rs` - `KeyboardModes` bitflags defining protocol modes (DISAMBIGUATE_ESC_CODES, REPORT_EVENT_TYPES, REPORT_ALTERNATE_KEYS, REPORT_ALL_KEYS_AS_ESC, REPORT_ASSOCIATED_TEXT)

**Graphics Protocols:**
- `rio-backend/src/ansi/sixel.rs` - Sixel graphics parser, handles DCS sequences for Sixel images (up to 1024 colors, 4096x4096 dimensions)
- `rio-backend/src/ansi/iterm2_image_protocol.rs` - iTerm2 inline images via OSC 1337, base64-encoded with width/height resize parameters

**Window Manipulation:**
- `rio-backend/src/performer/handler.rs` - Window ops in CSI and OSC handlers (title setting, directory changes, cursor manipulation)
- `frontends/rioterm/src/router/window.rs` - Window-level operations routing
