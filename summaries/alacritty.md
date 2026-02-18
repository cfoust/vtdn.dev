Perfect! Now I have a clear picture. Let me compile the complete map:

## Alacritty Escape Sequence Handling Map

### Version Tags
No git tags found in the repository (checked multiple times).

### Key Source Code Locations

**VTE Parser (from external crate):**
- `vte` crate version 0.15.0 - External dependency providing the state machine parser
- Parser instance in: `alacritty_terminal/src/event_loop.rs:404` (`ansi::Processor` field in `State` struct)
- Parser invoked at: `alacritty_terminal/src/event_loop.rs:154` (`state.parser.advance()`)

**Escape Sequence Handler (implements vte::Handler trait):**
- `alacritty_terminal/src/term/mod.rs:1059-2272` - Main `Handler` implementation for `Term<T>`
  - All CSI, OSC, DCS, ESC sequences dispatched through trait methods
  - Methods like `input()`, `goto()`, `move_up()`, `insert_blank()`, etc.

**Terminal Mode Handling (DECSET/DECRST):**
- `alacritty_terminal/src/term/mod.rs:2098-2147` - `set_mode()`, `unset_mode()`, `report_mode()` methods
- Mode flags defined at: `alacritty_terminal/src/term/mod.rs:55-87` (`TermMode` bitflags)
- Includes standard modes and Kitty keyboard protocol modes

**Keyboard Input Encoding:**
- `alacritty/src/input/keyboard.rs:295-362` - `build_sequence()` function converts key events to escape sequences
- `alacritty/src/input/keyboard.rs:365-674` - `SequenceBuilder` struct handles Kitty keyboard protocol encoding
- `alacritty/src/input/keyboard.rs:80-102` - Main key input handler deciding whether to build sequences

**Window Manipulation:**
- `alacritty_terminal/src/term/mod.rs:2259-2271` - Window size reporting methods:
  - `text_area_size_pixels()` - Reports window size in pixels (CSI 14 t)
  - `text_area_size_chars()` - Reports window size in characters (CSI 18 t)
- `alacritty_terminal/src/term/mod.rs:2221-2256` - Window title operations:
  - `set_title()`, `push_title()`, `pop_title()`

**Graphics Protocols:**
- None found - No Sixel or iTerm2 inline image support detected in source

**Event Loop & PTY:**
- `alacritty_terminal/src/event_loop.rs` - PTY I/O loop, reads bytes and feeds to parser
- `alacritty_terminal/src/event_loop.rs:104-171` - `pty_read()` method processes input bytes
