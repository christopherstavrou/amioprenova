import sitekitTheme from '@sitekit/theme/preset';

/** @type {import('tailwindcss').Config} */
export default {
  // Theme tokens (colors→CSS vars, fonts, shadows, radii, screens, etc.) and the
  // data-theme dark-mode selector come from the shared @sitekit/theme preset.
  // Components should avoid `dark:` — dark mode is driven by CSS-variable
  // overrides in @sitekit/theme/tokens.css.
  presets: [sitekitTheme],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [],
};
