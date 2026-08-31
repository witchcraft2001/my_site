---
name: UNLHA
summary: Быстрый распаковщик LHA/LZH для Sprinter DSS с выборочной распаковкой.
platform: sprinter
version: "0.1"
github: https://github.com/witchcraft2001/unlha
---

`UNLHA.EXE` распаковывает архивы LHA/LZH на Sprinter под управлением DSS. Критические части декодера и его таблицы работают из SRAM-кэша Sprinter без состояний ожидания.

## Возможности

- методы `-lh0-`/`-lz4-`, `-lh1-` и `-lh5-`;
- заголовки LHA Level 0 и 1, включая пути из extended headers;
- проверка распакованных данных по CRC16/ARC;
- автоматическое создание подкаталогов;
- просмотр архива на экране или вывод списка в файл;
- выборочная распаковка по маскам `*` и `?`;
- запрос, автоматическая перезапись или пропуск существующих файлов;
- остановка по `Esc` или `Ctrl+C`.

## Запуск

```text
unlha.exe <archive.lzh> [<out_dir>] [<mask>]
unlha.exe -l <archive.lzh> [<list_file>] [<mask>]
unlha.exe -o|-s <archive.lzh> [<out_dir>] [<mask>]
unlha.exe -x <archive.lzh> [<out_dir>] <mask>
```

Длинные имена преобразуются в формат DOS 8.3. Методы `-lh4-`, `-lh6-`, `-lh7-`, `-lzs-`, `-lz5-` и заголовки Level 2/3 не поддерживаются.
