export const DEFAULT_LOCALE = 'ru';

export const LOCALES = {
  ru: { label: 'Русский', lang: 'ru', prefix: '' },
  en: { label: 'English', lang: 'en', prefix: 'en' },
} as const;

export type Locale = keyof typeof LOCALES;

/** Prefix a root-relative path with the locale (ru = no prefix, en = /en/...). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+/, '');
  if (locale === DEFAULT_LOCALE) return `/${clean}`;
  return `/${LOCALES[locale].prefix}/${clean}`;
}
