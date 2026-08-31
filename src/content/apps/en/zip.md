---
name: ZIP
summary: A PKZIP-compatible archiver for creating and updating ZIP files on Sprinter.
platform: sprinter
version: "0.1.0"
github: https://github.com/witchcraft2001/sprinter-zip
---

`ZIP.EXE` is a PKZIP-compatible archiver for Sprinter DSS 1.70 and newer. It creates and updates ordinary single-disk ZIP archives and complements the `UNZIP.EXE` extractor.

## Features

- archive creation from files, directories, and wildcard sources, with optional recursion;
- Store (`-0`) and Deflate (`-1`…`-9`), plus automatic selection of the smaller result;
- adding and replacing files without recompressing retained records;
- deletion of archive entries by mask;
- repeatable exclusion masks;
- preservation of CRC-32, DOS date/time, and archive comments;
- transactional updates using temporary and backup files, with interrupted-update recovery;
- cancellation of long operations with `Esc` or `Ctrl+C`.

## Usage

```text
zip.exe [options] <archive[.zip]> <source> [source ...]
zip.exe -d [-q] [-x <mask>]... <archive[.zip]> <archive-mask> ...
```

The utility uses classic ZIP fields. ZIP64, encryption, split archives, and dynamic Huffman blocks are not currently supported; newly compressed records use fixed Huffman blocks.

Author: Dmitry Mikhalchenkov, Sprinter Team.
