---
name: LHA
summary: An LHA/LZH archiver for Sprinter with -lh5-, -lh1-, and -lh0- methods.
platform: sprinter
version: "0.1.19"
github: https://github.com/witchcraft2001/sprinter-lha
---

`LHA.EXE` is a console archiver for the Sprinter running Estex DSS. It creates standard LHA/LZH archives compatible with LHa, lhasa, 7-Zip, and the Sprinter `UNLHA.EXE` utility.

## Features

- `-lh5-` compression (LZSS with an 8 KB window and static Huffman coding), `-lh1-` (LZHUF), and uncompressed `-lh0-` storage;
- individual files, `*` and `?` masks, and complete directory trees as input;
- relative paths and empty-directory preservation;
- appending to existing archives with name-conflict handling;
- archive content listing;
- CRC-16 and header checksum for every record;
- hot encoder code running from the Sprinter's fast SRAM cache.

## Usage

```text
lha a[opts] archive[.lha] item ...
lha l       archive
```

Add-mode options include `5`, `1`, and `0` for compression selection, `r` for recursion, `x` for relative paths without recursion, and `q` for quiet mode.

Author: Dmitry Mikhalchenkov, Sprinter Team. MIT licensed.
