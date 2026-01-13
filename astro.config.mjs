import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // TODO: Replace with production URL
  integrations: [tailwind()],
  output: 'static',
  // Note: Sitemap generation temporarily disabled due to build errors.
  // To enable: uncomment sitemap import and add sitemap() to integrations array.
  // Ensure site URL is updated to production URL before enabling.
});
