/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'media', // Use prefers-color-scheme for automatic theme switching
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      nav: '1180px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Using CSS variables for automatic light/dark mode support
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-inverse': 'var(--color-text-inverse)',
        accent: {
          primary: 'var(--color-accent-primary)',
          'primary-hover': 'var(--color-accent-primary-hover)',
          secondary: 'var(--color-accent-secondary)',
        },
        border: 'var(--color-border)',
        'border-light': 'var(--color-border-light)',
        'border-focus': 'var(--color-border-focus)',
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      maxWidth: {
        'content': '1200px',
        'prose': '65ch',
      },
      transitionDuration: {
        'fast': '150ms',
      },
    },
  },
  plugins: [],
};
