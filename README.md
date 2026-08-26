# mikhalchenkov.dev

Личный сайт: каталог программ (Android / Sprinter), документация проектов, новости и CV.
Собран на [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), хостится на GitHub Pages.

Два языка: русский — в корне (`/apps/`, `/docs/...`), английский — под `/en/` (`/en/apps/`, `/en/docs/...`).
Если для страницы нет перевода, Starlight автоматически показывает версию по умолчанию (русскую) с плашкой "не переведено".

## Разработка

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # сборка в dist/ (в т.ч. поиск Pagefind)
npm run preview   # локальный просмотр собранного сайта
```

## Структура контента

- `src/content/apps/{ru,en}/<id>.md` — карточки приложений. Файл на приложение на локаль,
  связка по одинаковому имени файла. Поля: `name`, `summary`, `platform` (`android`|`sprinter`),
  `version`, `download`, `github`, `screenshot`, `order`.
- `src/content/news/{ru,en}/YYYY-MM-DD-slug.md` — новости главной страницы. Поля: `title`, `date`.
- `src/content/docs/**` (ru) и `src/content/docs/en/**` (en) — документация и CV, обычные страницы Starlight.
  Структура каталогов и sidebar — в `astro.config.mjs`.
- `src/content/i18n/{ru,en}.json` — свои UI-строки (расширяют встроенный словарь Starlight).

### Добавить приложение

Создать `src/content/apps/ru/<id>.md` и (по готовности перевода) `src/content/apps/en/<id>.md` с одинаковым `<id>`.

### Добавить новость

Создать `src/content/news/ru/<YYYY-MM-DD-slug>.md` и `src/content/news/en/<YYYY-MM-DD-slug>.md`.

### Добавить страницу документации

Создать `.md`-файл в `src/content/docs/...` (ru) и такой же путь в `src/content/docs/en/...` (en).
Новые разделы — прописать в `sidebar` в `astro.config.mjs`.

## Деплой

GitHub Actions (`.github/workflows/deploy.yml`) собирает и публикует сайт на GitHub Pages при пуше в `main`.
В настройках репозитория: Settings → Pages → Source = "GitHub Actions".

## Домен

Сайт публикуется на собственном домене `mikhalchenkov.dev` через механизм GitHub Pages CNAME:

- `public/CNAME` содержит `mikhalchenkov.dev` (копируется в корень `dist/` при сборке).
- `site` в `astro.config.mjs` указывает на `https://mikhalchenkov.dev`.

DNS-записи у регистратора домена:

| Тип   | Хост  | Значение |
|-------|-------|----------|
| A     | @     | 185.199.108.153 |
| A     | @     | 185.199.109.153 |
| A     | @     | 185.199.110.153 |
| A     | @     | 185.199.111.153 |
| CNAME | www   | mikhaltchenkov.github.io |

После первого успешного деплоя: Settings → Pages → Custom domain = `mikhalchenkov.dev`, дождаться проверки DNS,
затем включить "Enforce HTTPS". Адрес `mikhaltchenkov.github.io` продолжит работать как редирект на `mikhalchenkov.dev`.
