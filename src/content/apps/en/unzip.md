---
name: UNZIP
summary: A ZIP extractor for Sprinter supporting Store, Deflate, and PKZIP Implode.
platform: sprinter
version: "0.10.2"
github: https://github.com/witchcraft2001/sprinter-unzip
---

`UNZIP.EXE` extracts ZIP archives on the Sprinter under DSS. It is a modern continuation of Aleksey Gavrilenko's original 2002 utility, with Deflate and Implode decoders optimized for the Sprinter's SRAM cache.

## Features

- Store, Deflate, and PKZIP Implode extraction;
- paged archive listing on screen or output to a text file;
- selective file and directory masks with `*` and `?`;
- a strip-prefix mode for extracting directory contents without the directory name;
- prompts, automatic overwrite, or skipping existing files;
- DOS 8.3 long-name normalization with `~N` collision handling;
- restoration of file dates and times from the archive;
- CRC-32 verification and bounded handling of damaged input;
- cancellation with `Esc` or `Ctrl+C`.

## Usage

```text
unzip.exe <archive.zip> [<out_dir>] [<mask>]
unzip.exe -l <archive.zip> [<list_file>] [<mask>]
unzip.exe -o|-s <archive.zip> [<out_dir>] [<mask>]
unzip.exe -x <archive.zip> [<out_dir>] <mask>
```

Original utility: Aleksey Gavrilenko; Deflate routine: Michail Kondratyev; current version: Dmitry Mikhalchenkov, Sprinter Team.
