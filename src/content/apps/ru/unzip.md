---
name: UNZIP
summary: Распаковщик ZIP для Sprinter с поддержкой Store, Deflate и PKZIP Implode.
platform: sprinter
version: "0.10.2"
github: https://github.com/witchcraft2001/sprinter-unzip
---

`UNZIP.EXE` распаковывает ZIP-архивы на Sprinter под управлением DSS. Это современная доработка оригинальной утилиты Алексея Гавриленко 2002 года; декодеры Deflate и Implode оптимизированы для SRAM-кэша Sprinter.

## Возможности

- распаковка методов Store, Deflate и PKZIP Implode;
- просмотр архива на экране с постраничным выводом или запись списка в файл;
- выбор файлов и каталогов по маскам `*` и `?`;
- режим удаления префикса каталога из извлекаемых имён;
- запрос, автоматическая перезапись или пропуск существующих файлов;
- преобразование длинных имён в DOS 8.3 с разрешением коллизий `~N`;
- восстановление даты и времени файлов из архива;
- контроль CRC-32 и безопасная обработка повреждённых данных;
- остановка по `Esc` или `Ctrl+C`.

## Запуск

```text
unzip.exe <archive.zip> [<out_dir>] [<mask>]
unzip.exe -l <archive.zip> [<list_file>] [<mask>]
unzip.exe -o|-s <archive.zip> [<out_dir>] [<mask>]
unzip.exe -x <archive.zip> [<out_dir>] <mask>
```

Оригинальная программа: Алексей Гавриленко; процедура Deflate: Михаил Кондратьев; текущая версия: Дмитрий Михальченков, Sprinter Team.
