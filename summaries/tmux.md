Perfect! Now I have a comprehensive understanding of tmux's escape sequence handling architecture. Let me compile the findings:

## tmux Source Code Map - Terminal Escape Sequence Handling

**Version tags available:**
0.8 through 3.6a (0.8, 0.9, 1.0-1.9a, 2.0-2.9a, 3.0-3.6a)

---

### Escape Sequence Parser (State Machine)
- **input.c** (3492 lines) - Main parser implementing Paul Williams' DEC ANSI parser state machine
  - Lines 348-753: State transition tables and state definitions
  - Lines 1439+: CSI dispatcher (`input_csi_dispatch`)
  - Lines 2546+: DCS dispatcher (`input_dcs_dispatch`)
  - Lines 2640-2704: OSC dispatcher (switch statement at line 2647)

### CSI Sequences
- **input.c:1439-2147** - CSI dispatch and handlers
  - Line 1439: `input_csi_dispatch` - main CSI dispatcher
  - Lines 1825-1920: DECRST handlers (`input_csi_dispatch_rm_private`)
  - Lines 1948-2025: DECSET handlers (`input_csi_dispatch_sm_private`)
  - Lines 2050-2147: Window manipulation (`input_csi_dispatch_winops`) - CSI t sequences
  - Lines 2307+: SGR color handling (`input_csi_dispatch_sgr`)

### Terminal Modes (DECSET/DECRST)
- **input.c:1849-2025** - Mode set/reset handlers
  - Modes: DECCKM(1), DECCOLM(3), DECOM(6), DECAWM(7), cursor visibility(25), mouse(1000-1006), alt screen(47/1047/1049), bracketed paste(2004), synchronized output(2026)
- **tmux.h:635-661** - Mode flag definitions
- **screen-write.c:877-889** - Mode set/clear functions

### OSC Sequences  
- **input.c:2640-2704** - OSC dispatcher
  - OSC 0/2: Set title (lines 2648-2657)
  - OSC 4: Set color palette (`input_osc_4`, line 2853+)
  - OSC 7: Set working directory (lines 2661-2669)
  - OSC 8: Hyperlinks (`input_osc_8`)
  - OSC 10/11/12: Set fg/bg/cursor color
  - OSC 52: Clipboard operations (`input_osc_52`, line 3166+)
  - OSC 104/110/111/112: Reset colors
  - OSC 133: Shell integration prompts (`input_osc_133`, line 3070+)

### DCS Sequences
- **input.c:2546-2620** - DCS dispatcher
  - Line 2573: Sixel detection (`buf[0] == 'q'`)
  - Line 2586: DECRQSS handling (DCS $ q)
  - Lines 2598+: tmux passthrough sequences

### Graphics Protocols
- **image-sixel.c** (690 lines) - Sixel parser and decoder
- **image.c** (223 lines) - Image management (storage, limits)
- **screen-write.c** - `screen_write_sixelimage` function
- **input.c:2571-2583** - Sixel DCS detection and dispatch
- **input.c:2029-2046** - Sixel capability reporting (CSI ? S)
- **Note:** No iTerm2 inline images or kitty graphics protocol support

### Keyboard Input Encoding
- **input-keys.c** (816 lines) - Translates key codes to escape sequences for application
  - Main entry: Lines 36-48 define key tree structure
- **tty-keys.c** (1789 lines) - Parses incoming key sequences from terminal
  - Lines 50+: Extended key handling
  - Terminfo-based key mapping

### Screen/Terminal Output
- **screen-write.c** (2507 lines) - All screen modification operations
  - Mode management, cursor movement, character writing, scrolling
- **tty.c** - Terminal output, sends sequences to actual terminal
- **tty-features.c** - Terminal capability detection
- **tty-term.c** - Terminfo integration

### Window Manipulation
- **input.c:2050-2147** - CSI t sequences (XTWINOPS)
  - Pixel size queries (14-16), character size queries (18-19)
  - Title stack (22/23: push/pop title)
  - Most manipulation operations ignored (1-13)

### Other Sequence Types
- **input.c:2706-2735** - APC sequences (mainly for title setting)
- **input.c:2737-2780** - Rename sequences (screen's ESC k...ESC \)
