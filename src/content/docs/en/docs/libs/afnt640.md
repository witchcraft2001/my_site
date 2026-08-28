---
title: AFNT640 — text output at 640×256
description: AFNT640.DLL — fast proportional text output through the Sprinter hardware accelerator in the 640×256, 16-colour mode.
sidebar:
  label: AFNT640
  order: 5
---

`AFNT640.DLL` is a fast text output library for the 640×256, 16-colour mode.
Inside is Anton Enin's classic packed font and a renderer built on the
Sprinter hardware accelerator; the historical ANTONFNT entry points are
preserved, so old code keeps working. For the 320×256 mode there is a twin
library, [AFNT320](/en/docs/libs/afnt320/), with the same interface.

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
        include "afnt640.inc"

        ld   hl,dll_name        ; "AFNT640.DLL",0
        ld   a,3                ; DLL — into window WIN3
        call LIBMAN.l_load
        jp   c,load_error
        ld   (handle),hl

        ; palette + screen clear
        ld   hl,(handle)
        ld   a,0
        ld   b,2                ; fnstyle
        call LIBMAN.l_call

        ; print a string
        ld   hl,(handle)
        ld   de,text            ; ASCIIZ string
        ld   ix,16              ; x in pixels (0..639)
        ld   iy,12              ; y in pixels
        ld   a,#1F              ; background 1 (blue), text 15 (white)
        ld   b,3                ; aprint
        call LIBMAN.l_call

text:   db  "Hello, Sprinter!",0
```

The colour attribute in `A` works like in text mode: high nibble is the
background, low nibble the character colour (both `0..15`). The font is
proportional and coordinates are given in pixels.

## Selecting a buffer: BUF0/BUF1 and FRONT/BACK

The screen has two buffers, and function 5 chooses the output target:

- `BUF0` / `BUF1` — a specific physical buffer;
- `FRONT` / `BACK` — "visible now" and "hidden now": the library reads the
  `RGMOD` register once per call and resolves the physical buffer itself.

FRONT/BACK is the natural choice with double buffering: printing always goes
into the hidden buffer, so text never flickers. Without an explicit target
the behaviour stays backward-compatible: `aprint` prints into BUF0. To get
the palette installed in both buffers, call `set_target(BUF0)` + `fnstyle`,
then `set_target(BUF1)` + `fnstyle`.

An invalid selector returns `A=#10` (`AFNT640_ERR_ARGUMENT`) without changing
the previous target.

## The video memory window

While drawing, the library temporarily maps a video memory page into a CPU
window — WIN1 by default. If the DLL itself was loaded into WIN1, printing
returns an error until function 4 selects a different window. A request that
would cover the window holding the DLL or the current stack is rejected,
keeping the previous setting. After every call the library restores the
mapped page and the interrupt state.

## How it works inside

`font.bin` is Anton Enin's original format: a table of character widths, a
table of offsets and variable-width column-major glyph rasters. Text is drawn
by the accelerator using the formula
`background XOR (mask AND (colour XOR background))` — on a black background
the background pass is skipped entirely. Screen clearing is 320 vertical
hardware fills, one per byte column. When the string and video memory sit in
different CPU windows, the video page is mapped once for the whole string —
noticeably faster than per character.
