import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amioprenova.com',
  integrations: [tailwind()],
  output: 'static',
  // Note: Sitemap generation is disabled during the temporary landing page phase.
  // To re-enable: uncomment sitemap import and add sitemap() to integrations array.
});
