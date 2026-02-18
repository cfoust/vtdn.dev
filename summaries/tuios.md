Perfect! Now I have enough information. Let me compile the concise map:

## Tuios Terminal Emulator - Escape Sequence Handling Map

**Version tags available:**
v0.0.1 through v0.0.26, v0.1.0, v0.2.0-v0.2.2, v0.3.0-v0.3.4, v0.4.0-v0.4.4, v0.5.0-v0.5.1, v0.6.0 (latest)

**Key Files:**

### Parser/State Machine
- `internal/vt/emulator.go:105-118` - Parser setup using charmbracelet/x/ansi, dispatches to handlers
- `internal/vt/handlers.go` - Handler registration and dispatch system for all sequence types

### CSI Sequences
- `internal/vt/csi.go` - CSI dispatch entry point (handleCsi)
- `internal/vt/handlers.go:446+` - registerDefaultCsiHandlers, registers all CSI handlers (@, A-Z, etc.)
- `internal/vt/csi_cursor.go` - Cursor movement CSI sequences
- `internal/vt/csi_mode.go` - DECSET/DECRST mode handling (handleMode, setMode)
- `internal/vt/csi_screen.go` - Screen manipulation CSI sequences
- `internal/vt/csi_sgr.go` - SGR (Select Graphic Rendition) sequences
- `internal/vt/csi_t_test.go` - Tests for CSI 't' (XTWINOPS window manipulation)

### OSC Sequences
- `internal/vt/osc.go` - OSC dispatch and handlers (title, colors, hyperlinks, CWD)
- `internal/vt/handlers.go:292-331` - registerDefaultOscHandlers (OSC 0/1/2, 7, 8, 10-12, 110-112)

### DCS Sequences
- `internal/vt/dcs.go` - DCS dispatch entry point (handleDcs, handleApc, handleSos, handlePm)
- `internal/vt/handlers.go:104-115` - handleDcs dispatcher

### ESC Sequences
- `internal/vt/esc.go` - ESC sequence dispatch (handleEsc)
- `internal/vt/handlers.go:333-444` - registerDefaultEscHandlers (DECSC, DECRC, RIS, etc.)

### Terminal Modes
- `internal/vt/mode.go` - Mode management (likely definitions)
- `internal/vt/csi_mode.go:9-35` - handleMode for DECSET/DECRST, setAltScreenMode

### Keyboard Input Encoding
- `internal/vt/key.go` - SendKey method, handles keyboard event encoding to escape sequences
- `internal/vt/key.go:32` - TODO comment indicates Kitty, CSI u, and XTerm modifyOtherKeys not yet supported

### Graphics Protocols
**Sixel:**
- `internal/vt/sixel_parser.go` - Sixel command parsing
- `internal/vt/sixel_state.go` - Sixel graphics state management
- `internal/vt/emulator.go:141-143` - Sixel state initialization

**Kitty Graphics:**
- `internal/vt/kitty_handlers.go` - Kitty graphics protocol command handlers
- `internal/vt/kitty_parser.go` - Kitty graphics command parsing
- `internal/vt/kitty_state.go` - Kitty graphics state management
- `internal/vt/kitty_types.go` - Kitty graphics data structures
- `internal/vt/kitty_shm_unix.go` / `kitty_shm_windows.go` - Shared memory support
- `internal/vt/emulator.go:137-139` - Kitty state initialization

### Window Manipulation
- `internal/vt/csi.go:16-23` - Debug logging for CSI 't' (XTWINOPS)
- `internal/vt/emulator.go:78-80` - cellWidth/cellHeight for size reporting
- Handlers likely in registerDefaultCsiHandlers for 't' final byte

### Control Characters
- `internal/vt/cc.go` - Control character definitions (likely)
- `internal/vt/handlers.go:209-290` - registerDefaultCcHandlers (NUL, BEL, BS, HT, LF, CR, etc.)
