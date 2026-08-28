---
title: Sprinter Libraries
description: An overview of Z80 libraries for Sprinter — graphics, text output, windowed UI — and the shared rules for loading and calling them via libman.
sidebar:
  label: Overview
  order: 1
---

A set of Z80 assembly libraries for the Sprinter computer. They cover the most
labour-intensive parts of application programming — graphics, text output and
user interface — so an application does not have to program the video
controller, VRAM pages and palette directly.

| Library | Video mode | Purpose |
|---|---|---|
| [GFX320](/en/docs/libs/gfx320/) | `#81` — 320×256, 256 colours | 2D graphics: primitives, tiles, palette, double buffering, fade |
| [GFX640](/en/docs/libs/gfx640/) | `#82` — 640×256, 16 colours | the same for the high-resolution mode |
| [AFNT320](/en/docs/libs/afnt320/) | `#81` — 320×256, 256 colours | fast text output via the hardware accelerator |
| [AFNT640](/en/docs/libs/afnt640/) | 640×256, 16 colours | fast text output via the hardware accelerator |
| [WIN320](/en/docs/libs/win320/) | `#81` — 320×256, 256 colours | windowed UI: panels, buttons, edit fields, lists |
| [MENU320](/en/docs/libs/menu320/) | `#81` (on top of WIN320) | menu bar with drop-down lists |

All libraries except MENU320 ship as a **DLL** — a single ready-to-use file
(`GFX320.DLL`, `WIN320.DLL`, …) placed next to the program. MENU320 is the
exception: it is a module linked directly into the application that works on
top of WIN320.

## How Sprinter DLLs work

DLLs are loaded by the **libman** library manager. It is a small module
included in the application; it finds the DLL file (starting with the EXE's
directory), unpacks it, places it in memory and dispatches function calls by
number.

Understanding Sprinter's memory layout helps here: the Z80 address space
(64 KB) is split into four 16-KB **windows** — WIN0 (`#0000`), WIN1
(`#4000`), WIN2 (`#8000`) and WIN3 (`#C000`). Any page of physical memory,
including video memory, can be mapped into any window. A DLL lives entirely
in one window; the recommended layout is the library in WIN3 with the
application's code, data and stack in WIN0–WIN2.

## Calling functions

Loading and calling look the same for every library:

```asm
        ld   hl,dll_name       ; "GFX320.DLL",0 — ASCIIZ file name
        ld   a,3               ; window for the DLL (WIN3)
        call LIBMAN.l_load
        jp   c,load_error      ; CF=1 — load failed (reason in l_reason)
        ld   (handle),hl       ; HL — handle of the loaded library

        ld   hl,(handle)
        ld   b,GFX_CLEAR       ; function number — a constant from the .inc file
        ld   a,0               ; function arguments: A, DE, IX, IY
        ld   e,GFX_TARGET_FRONT
        call LIBMAN.l_call
        jp   c,dispatch_error  ; CF=1 — libman dispatcher error
        or   a
        jp   nz,gfx_error      ; A≠0 — library error code
```

What happens here:

- `l_load` takes the file name in `HL` and the window number in `A`, and
  returns a **handle** — used later to call the library and to unload it
  (`l_free`);
- `l_call` takes the handle in `HL` and the function number in `B`; only the
  registers `A`, `DE`, `IX`, `IY` reach the function itself (`HL` and `BC`
  belong to the dispatcher). Larger structures are passed by pointer, usually
  in `DE`;
- the result arrives on two levels: the `CF` flag signals a libman dispatcher
  error (e.g. a bad handle), while register `A` is the function's own status:
  `0` — success, otherwise an error code (`#10..#17` for GFX, `#20..#28` for
  WIN320).

You don't need to memorise function numbers and error codes — every library
ships with a constants include file for sjasmplus (`gfx320.inc`,
`win320.inc`, …), and GFX and WIN320 additionally provide ready-made bindings
for C (SDCC) and Turbo Pascal.

## Shared rules

- **The application selects the video mode.** The libraries never switch the
  mode themselves: call DSS `SETVMOD` with the required mode number before
  drawing.
- **Do not print through the DSS console while a graphics mode is active.**
  The text screen and the character generator live in the same video memory,
  so ordinary text output corrupts the picture. Wait for a key silently
  (DSS `#30`) and print after returning to text mode.
- **The libraries are not reentrant.** Never call them from an interrupt
  handler; an ISR usually just sets a flag, and drawing happens in the main
  loop.
- After every operation the libraries restore the mapped memory pages and the
  interrupt state — the application never has to clean up after them.
