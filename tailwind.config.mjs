import sitekitTheme from '@christopherstavrou/theme/preset';

/** @type {import('tailwindcss').Config} */
export default {
  // Theme tokens (colors→CSS vars, fonts, shadows, radii, screens, etc.) and the
  // data-theme dark-mode selector come from the shared @christopherstavrou/theme preset.
  // Components should avoid `dark:` — dark mode is driven by CSS-variable
  // overrides in @christopherstavrou/theme/tokens.css.
  presets: [sitekitTheme],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // @christopherstavrou/ui ships Astro source; scan the installed package so
    // utility classes used only inside its components are generated.
    './node_modules/@christopherstavrou/ui/src/**/*.{astro,ts,js}',
  ],
  plugins: [],
};
