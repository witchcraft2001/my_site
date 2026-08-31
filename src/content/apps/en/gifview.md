---
name: GIFVIEW
summary: A static and animated GIF viewer for Sprinter DSS.
platform: sprinter
version: "0.1"
github: https://github.com/witchcraft2001/sprinter_gifview
---

`GIFVIEW.EXE` displays static and animated GIF files on the Sprinter's 320×256 screen. It includes an LZW decoder and supports interlacing, transparency, local color tables, and animation disposal methods.

## Features

- GIF animation playback using the delays stored in the file;
- single-pass playback that stops after the last frame;
- GIF information output without entering graphics mode;
- unscaled, centered display;
- a fast mode that ignores frame delays for decoder profiling.

## Usage

```text
GIFVIEW.EXE [options] <filename.gif> [options]
```

Options: `-center` centers the image without scaling, `-i` prints file information, `-once` plays the animation once, and `-fast` ignores frame delays.

Author: Dmitry Mikhalchenkov, Sprinter Team.
