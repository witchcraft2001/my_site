import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from './i18n';

type LocalizedEntry<C extends 'apps' | 'news'> = {
  slug: string;
  entry: CollectionEntry<C>;
  isFallback: boolean;
};

/**
 * For a paired-by-basename collection (apps, news) stored as {locale}/{slug}.md,
 * return one entry per slug for the requested locale, falling back to the
 * default locale (with isFallback: true) when a translation is missing.
 */
export async function localizedEntries<C extends 'apps' | 'news'>(
  collection: C,
  locale: Locale,
): Promise<LocalizedEntry<C>[]> {
  const all = await getCollection(collection);
  const bySlug = new Map<string, Map<string, CollectionEntry<C>>>();

  for (const entry of all) {
    const [entryLocale, ...rest] = entry.id.split('/');
    const slug = rest.join('/');
    if (!bySlug.has(slug)) bySlug.set(slug, new Map());
    bySlug.get(slug)!.set(entryLocale, entry);
  }

  const result: LocalizedEntry<C>[] = [];
  for (const [slug, byLocale] of bySlug) {
    const localized = byLocale.get(locale);
    const fallback = byLocale.get(DEFAULT_LOCALE);
    const entry = localized ?? fallback;
    if (!entry) continue;
    result.push({ slug, entry, isFallback: !localized });
  }
  return result;
}
