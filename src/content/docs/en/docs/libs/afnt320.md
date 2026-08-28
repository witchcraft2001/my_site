---
title: AFNT320 — text output at 320×256
description: AFNT320.DLL — fast proportional text output through the Sprinter hardware accelerator in mode #81 (320×256, 256 colours).
sidebar:
  label: AFNT320
  order: 4
---

`AFNT320.DLL` is a small library for fast text output in mode `#81` (320×256,
256 colours). The font is embedded right in the DLL and is drawn by the
Sprinter hardware accelerator, so a string appears on screen much faster than
with CPU per-pixel rendering. It is the 320×256 counterpart of
[AFNT640](/en/docs/libs/afnt640/): the two share the same interface.

The shared DLL loading rules are in the
[libraries overview](/en/docs/libs/overview/).

## Functions

| # | Registers | What it does |
|---:|---|---|
| 0 | — | initialise (called by libman on load) |
| 1 | — | release (called by libman on unload) |
| 2 | `A` | `fnstyle`: set the EGA palette and clear the selected screen |
| 3 | `DE`, `IX`, `IY`, `A` | `aprint`: print the ASCIIZ string at `DE` at point (`IX`,`IY`); `A` = background·16 + text colour |
| 4 | `E` | select the CPU window (`0..3`) used to map video memory |
| 5 | `E` | select the target buffer: `0`=BUF0, `1`=BUF1, `2`=FRONT, `3`=BACK |

## Example

```asm
        include "afnt320.inc"

        ld   hl,dll_name        ; "AFNT320.DLL",0
        ld   a,3                ; DLL — into window WIN3
        call LIBMAN.l_load
        jp   c,load_error
        ld   (handle),hl

        ; palette + screen clear
        ld   hl,(handle)
        ld   a,0                ; clear colour
        ld   b,2                ; fnstyle
        call LIBMAN.l_call

        ; print a string
        ld   hl,(handle)
        ld   de,text            ; ASCIIZ string
        ld   ix,8               ; x in pixels
        ld   iy,12              ; y in pixels
        ld   a,#1F              ; background 1 (blue), text 15 (white)
        ld   b,3                ; aprint
        call LIBMAN.l_call

text:   db  "Hello, Sprinter!",0
```

Walkthrough: function 2 loads the standard EGA palette and clears the
screen — calling it once after loading is enough. Function 3 prints a string;
the colour attribute in `A` works like in text mode: high nibble is the
background, low nibble the character colour. The font is proportional, so
there is no character grid — coordinates are given in pixels.

## Selecting a buffer: BUF0/BUF1 and FRONT/BACK

In mode `#81` Sprinter has two screen buffers. Function 5 chooses where to
print:

- `BUF0` / `BUF1` — a specific physical buffer;
- `FRONT` / `BACK` — "visible now" and "hidden now": the library reads the
  `RGMOD` register once per call and resolves the physical buffer itself.

The FRONT/BACK mode is convenient with double buffering: print into BACK,
then flip the buffers — text never flickers on the visible screen. Without an
explicit target the library behaves like older versions: it prints into BUF0.
To get the palette installed in both buffers, call `set_target(BUF0)` +
`fnstyle`, then `set_target(BUF1)` + `fnstyle`.

An invalid selector returns `A=#10` (`AFNT320_ERR_ARGUMENT`) without changing
the previous target.

## The video memory window

To draw, the library temporarily maps a video memory page into one of the CPU
windows — WIN1 by default. If your program occupies WIN1 itself (or the DLL
was loaded there), select another window with function 4. A request that
would cover the window holding the DLL or the current stack is rejected with
an error, keeping the previous setting. After every call the library restores
the mapped page and the interrupt state.

## How it works inside

The font is stored in the DLL in an "accelerator" format: at build time a
tool repacks the ordinary raster font into column-major masks that the
Sprinter accelerator transfers to video memory as whole vertical columns.
Empty columns are filled with a single operation; occupied ones are combined
from text- and background-colour masks, and on a black background the extra
pass is skipped entirely. Screen clearing also runs on the accelerator: 320
vertical fills instead of a loop over 80,000 pixels. That is where the speed
comes from.
