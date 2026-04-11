# Copilot Instructions — amioprenova

Astro 4 · TypeScript · Tailwind CSS v3 · Content Collections · i18n (EN + BG).

**Docs:** `AGENTS.md` (hard rules) → `docs/ai/workflow.md` (PR process) → `docs/ai/standards.md` (patterns) → `docs/ai/github-integration.md` (Copilot setup).
Deep per-file rules: `.github/instructions/astro.instructions.md` · `.github/instructions/typescript.instructions.md`.

---

## Design system

- Never hardcode hex/rgba colour values. Use Tailwind utility classes or CSS custom properties defined in `src/styles/global.css` (`var(--color-text-primary)`, `var(--color-accent-primary)`, etc.).
- Never hardcode transition durations. Use `var(--transition-fast)` (150 ms) or `var(--transition-base)` (250 ms).
- Dark mode is `data-theme="dark"` on `<html>` — not Tailwind's `dark:` prefix.

## i18n

- Never use `lang === 'en' ? … : …` ternaries inside page files. Each language has its own page at `src/pages/en/` and `src/pages/bg/`.
- EN and BG pages must be structurally identical — including conditional guards (e.g. search hidden when list is empty). Flag divergence in the `bg/` sibling when reviewing an `en/` page.
- Components on both EN + BG pages need a `labels` prop (English defaults). BG callers pass Bulgarian strings; JS-updated text reads from `data-*` attributes.
- Content lives in `src/content/blog/en/` and `src/content/blog/bg/`.

## Security

- Never interpolate user-controlled data (search results, titles, dates from external sources) into `innerHTML`. Build DOM nodes with `document.createElement` + `textContent`.
- No hardcoded secrets, API keys, or credentials anywhere in source files.

## Accessibility

- Every `<button>` that is not a form submit must have `type="button"`.
- Disclosure widgets must have `aria-expanded` on the trigger and `aria-controls` pointing to the panel ID. Keep `aria-expanded` in sync on open/close.
- Modal dialogs: `role="dialog"` + `aria-modal="true"`, visible close button, Tab/Shift+Tab focus trap, Escape closes, focus-restore on close.
- Icon-only buttons must have `aria-label`.

## Astro components

- Use `<style is:global>` for rules with compound selectors (e.g. `:root[data-theme="dark"] .class`) or that target children rendered outside the component's own shadow.
- Multi-instance components must scope all DOM queries to an instance root — never `document.getElementById` with hardcoded IDs. Use class-based selectors inside a wrapper.
- Keyboard listeners must be registered on open and removed on close. Never attach permanent `document`-level listeners in per-instance loops.
- Horizontally scrollable containers inside a fixed overlay need `touch-action: pan-x`, not `touch-action: none`.

## Fixed overlays / lightboxes

- Portal the overlay to `document.body` on open to avoid ancestor stacking-context interference.
- Set card dimensions in JS from `window.innerWidth/innerHeight` — CSS percentage-height chains break on Android Chrome.
- Scroll lock: `overflow:hidden` on `<html>` + `<body>`. Never `position:fixed` on `<body>` — shifts fixed children on Android Chrome.

## Schemas and types

- Zod schemas are the single source of truth. Derive types with `z.infer<typeof schema>` — never duplicate a Zod schema as a separate TS interface.
- Keep Zod schemas in dedicated modules (not runtime helpers) to avoid bundling Zod into pages that only need the inferred type. Use `import type { X }` for type-only imports.

## Static generation

- Every `getStaticPaths` that calls `paginate()` must include an empty-list fallback so the route still builds when the data source returns zero items.

## Code review focus

- When a bug pattern appears in a changed file, check whether the same pattern exists in sibling locale files (`en/` ↔ `bg/`) not included in the diff and flag them explicitly.
- Prefer concrete, actionable comments with a one-line fix example over general observations.
