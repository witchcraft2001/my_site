---
name: MODPLAY
summary: A four-channel ProTracker MOD player with stereo Covox-Blaster output.
platform: sprinter
version: "0.2.2"
github: https://github.com/witchcraft2001/modplay
---

`MODPLAY.EXE` plays four-channel ProTracker and SoundTracker modules on the Sprinter. Stereo sound is produced through the Covox-Blaster (CBL) interface.

## Features

- ProTracker modules with `M.K.`, `M!K!`, `FLT4`, and `4CHN` signatures;
- automatic detection of 15-instrument SoundTracker modules;
- selectable 11, 15, and 22 kHz output rates;
- Amiga PAL periods and ProTracker finetune from −8 to +7;
- common ProTracker effects including arpeggio, portamento, vibrato, tremolo, pattern break, and extended `Exx` effects;
- CPU headroom and buffer-overrun statistics printed after playback.

## Usage

```text
MODPLAY [/?] [-r 11|15|22] FILE.MOD
```

Press `Space` to stop playback. The player requires DSS 1.71 or newer, a Sprinter running in 21 MHz turbo mode, and a Covox-Blaster.

Author: Dmitry Mikhalchenkov, Sprinter Team. Apache 2.0 licensed.
