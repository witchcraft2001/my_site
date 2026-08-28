---
title: MENU320 — menu bar
description: MENU320 — a menu-bar module with drop-down lists for WIN320 applications. Linked into the application and built entirely on the public WIN320 ABI.
sidebar:
  label: MENU320
  order: 7
---

MENU320 is a menu bar with drop-down lists for applications built on
[WIN320](/en/docs/libs/win320/). A strip of titles along the top edge of the
screen, drop-down lists with shortcuts, separators, toggle marks, disabled
rows and nested submenus.

**It is not a DLL.** The module is linked directly into the application and
is built entirely on the public WIN320 interface: it assembles ordinary
WIN320 windows and controls in the application's memory and calls the library
through the same libman. `WIN320.DLL` needs no changes or rebuilds. This
design is deliberate: the WIN320 image occupies exactly one 16-KB window with
no room left for a menu control, and libman cannot call one DLL from another.

## Quick start

```asm
        include "win320.inc"
        include "menu320.def.inc"
        include "menu320.inc"        ; pulls in common/fontlayout.inc itself

        ; WIN320 is already loaded and initialised by the application
        ld   hl,(dll_handle)
        ld   ix,menu_arena           ; the module's working memory
        ld   bc,menu_arena_end-menu_arena
        call menu_init
        jr   nz,failed

        ld   ix,menu_bar
        call menu_draw_bar           ; draw the title strip
        jr   nz,failed

        ld   ix,menu_bar
        ld   a,0                     ; open the first title
        call menu_run                ; modal menu loop
        ld   a,(menu_command)        ; chosen command; 0 — cancelled
```

Walkthrough: `menu_init` receives the handle of the loaded WIN320 and an
**arena** — a block of application memory in which the module builds WIN320
windows and controls. `menu_draw_bar` paints the title strip, which stays on
screen permanently. `menu_run` opens the menu and runs modally: it services
the mouse, the keyboard and submenus itself, and on return stores the chosen
item's command code in `menu_command` (`0` — the user cancelled). `A` carries
the index of the title to unfold, or `#FF` to activate the bar without
opening a list.

## Describing a menu

A menu is static data — no code has to build it:

```asm
menu_bar:       dw 0,0,320 : db 12,2 : dw bar_refs
bar_refs:       dw txt_file, pop_file       ; title + its drop-down list
                dw txt_view, pop_view

pop_file:       db 3,0 : dw rows_file       ; 3 rows
rows_file:      db 0,           CMD_INFO : dw txt_info, txt_altent
                db MI_SEPARATOR,0        : dw 0,0
                db 0,           CMD_EXIT : dw txt_exit, txt_f10
```

The bar (`menu_bar`) defines the geometry and a list of "title text —
drop-down list" pairs. Every list row carries flags (`MI_SEPARATOR`, disabled
row, toggle mark, submenu), a command code and two texts: the caption and the
shortcut caption at the right edge. The command code is what `menu_run`
returns.

The full example is `examples/menudemo.asm`: four lists with shortcuts,
separators, toggles, a disabled row and a submenu over a regular WIN320
window.

## What the application must provide

- **WIN320 ABI 2.0**, loaded by the application (WIN3 recommended). 1.x
  versions won't do: their window structure has a different size.
- **An installed palette**: right after loading WIN320 call `WIN_STYLE` with
  `WIN_STYLE_PALETTE|WIN_STYLE_CLEAR` — without it everything renders black.
- **Backstore** via `win_set_backstore`: every opened list is a modal WIN320
  window with background saving; a 120×110 list takes almost a whole 16-KB
  page.
- **The arena**: `38 + 38·N` bytes for a bar with `N` titles plus
  `20 + 78·M` bytes for every simultaneously open list of `M` rows.
- After loading a new font (`win_load_font`) call `menu_refresh_font` — the
  module caches the character width table.
- The `libs/common` directory on the assembler include path.

## Build and size

```sh
make -C menu320 demo        # build/MENUDEMO.EXE — demo for hardware/emulator
make -C menu320 test        # host and z80 tests
```

The module is compact: about 4.2 KB of code and 0.6 KB of data (the figure is
checked by an automated test). C and Pascal bindings are not ready yet — for
now the module is used from assembly projects.
