// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://mikhalchenkov.dev',
  integrations: [
    starlight({
      title: 'D.Mikhalchenkov',
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Русский', lang: 'ru' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mikhaltchenkov' },
      ],
      sidebar: [
        { label: 'Главная', translations: { en: 'Home' }, link: '/' },
        { label: 'Приложения', translations: { en: 'Apps' }, link: '/apps/' },
        {
          label: 'Документация',
          translations: { en: 'Documentation' },
          items: [
            {
              label: 'Sprinter: программирование',
              translations: { en: 'Sprinter programming' },
              items: [{ autogenerate: { directory: 'docs/sprinter-manual' } }],
            },
            {
              label: 'Библиотеки',
              translations: { en: 'Libraries' },
              collapsed: true,
              items: [{ autogenerate: { directory: 'docs/libs' } }],
            },
          ],
        },
        'cv',
      ],
    }),
  ],
});
