---
name: UNLHA
summary: A fast LHA/LZH extractor for Sprinter DSS with selective extraction.
platform: sprinter
version: "0.1"
github: https://github.com/witchcraft2001/unlha
---

`UNLHA.EXE` extracts LHA/LZH archives on the Sprinter under DSS. Performance-critical decoder code and tables run from the Sprinter's zero-wait-state SRAM cache.

## Features

- `-lh0-`/`-lz4-`, `-lh1-`, and `-lh5-` methods;
- LHA Level 0 and 1 headers, including paths from extended headers;
- CRC16/ARC verification of extracted data;
- automatic subdirectory creation;
- archive listing on screen or to a file;
- selective extraction with `*` and `?` masks;
- prompts, automatic overwrite, or skipping existing files;
- cancellation with `Esc` or `Ctrl+C`.

## Usage

```text
unlha.exe <archive.lzh> [<out_dir>] [<mask>]
unlha.exe -l <archive.lzh> [<list_file>] [<mask>]
unlha.exe -o|-s <archive.lzh> [<out_dir>] [<mask>]
unlha.exe -x <archive.lzh> [<out_dir>] <mask>
```

Long names are normalized to DOS 8.3. The `-lh4-`, `-lh6-`, `-lh7-`, `-lzs-`, and `-lz5-` methods and Level 2/3 headers are not supported.
