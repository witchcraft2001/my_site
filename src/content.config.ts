import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({
      extend: z.object({
        'site.home.newsTitle': z.string().optional(),
        'site.home.newsMore': z.string().optional(),
        'site.apps.title': z.string().optional(),
        'site.apps.filterAll': z.string().optional(),
        'site.apps.download': z.string().optional(),
        'site.apps.source': z.string().optional(),
        'site.apps.version': z.string().optional(),
        'site.apps.notTranslated': z.string().optional(),
        'site.docs.title': z.string().optional(),
      }),
    }),
  }),
  apps: defineCollection({
    loader: glob({ pattern: '{ru,en}/*.md', base: './src/content/apps' }),
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        summary: z.string(),
        platform: z.enum(['android', 'sprinter']),
        version: z.string().optional(),
        download: z.string().url().optional(),
        github: z.string().url().optional(),
        screenshot: image().optional(),
        order: z.number().default(0),
      }),
  }),
  news: defineCollection({
    loader: glob({ pattern: '{ru,en}/*.md', base: './src/content/news' }),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
    }),
  }),
};
