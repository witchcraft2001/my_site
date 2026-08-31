---
name: MODPLAY
summary: Четырёхканальный проигрыватель ProTracker MOD со стереовыходом через Covox-Blaster.
platform: sprinter
version: "0.2.2"
github: https://github.com/witchcraft2001/modplay
---

`MODPLAY.EXE` воспроизводит четырёхканальные модули ProTracker и SoundTracker на Sprinter. Стереозвук выводится через интерфейс Covox-Blaster (CBL).

## Возможности

- модули ProTracker с сигнатурами `M.K.`, `M!K!`, `FLT4`, `4CHN`;
- автоматическое распознавание 15-инструментных модулей SoundTracker;
- частоты вывода 11, 15 и 22 кГц;
- Amiga PAL periods и finetune ProTracker от −8 до +7;
- основные эффекты ProTracker, включая arpeggio, portamento, vibrato, tremolo, pattern break и расширенные эффекты `Exx`;
- статистика запаса процессорного времени и пропущенных сроков буфера после остановки.

## Запуск

```text
MODPLAY [/?] [-r 11|15|22] FILE.MOD
```

Для выхода во время воспроизведения нажмите `Space`. Требуются DSS 1.71 или новее, Sprinter в turbo-режиме 21 МГц и Covox-Blaster.

Автор: Дмитрий Михальченков, Sprinter Team. Лицензия Apache 2.0.
