import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amioprenova.com',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  server: {
    host: true, // listen on all interfaces — enables LAN + Tailscale access
  },
  vite: {
    server: {
      allowedHosts: ['desktop-43evha2.taile2204d.ts.net'],
    },
  },
});
