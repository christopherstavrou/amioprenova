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

- Never use `lang === 'en' ? … : …` ternaries (or equivalent) inside page files. Each language has its own page at `src/pages/en/` and `src/pages/bg/`.
- EN and BG locale pages must be structurally identical. When reviewing a changed `en/` page, flag any divergence in the matching `bg/` page even if it is not in the diff.
- Content lives in `src/content/blog/en/` and `src/content/blog/bg/`.

## Security

- Never interpolate user-controlled data (search results, titles, dates from external sources) into `innerHTML`. Build DOM nodes with `document.createElement` + `textContent`.
- No hardcoded secrets, API keys, or credentials anywhere in source files.

## Accessibility

- Every `<button>` that is not a form submit must have `type="button"`.
- Disclosure widgets (dropdowns, popovers) must have `aria-expanded` on the trigger and `aria-controls` pointing to the panel ID. Keep `aria-expanded` in sync on open/close.
- Modal dialogs: `role="dialog"` + `aria-modal="true"`, visible close button, Tab/Shift+Tab focus trap (Escape closes), focus-restore on close.
- Icon-only buttons must have `aria-label`.

## Astro components

- Use `<style is:global>` for rules with compound selectors (e.g. `:root[data-theme="dark"] .class`) or that target children rendered outside the component's own shadow.
- Components that can appear multiple times on a page must scope all DOM queries to an instance root element — never `document.getElementById` with hardcoded IDs. Prefer class-based selectors inside a wrapper element.
- Keyboard event listeners must be registered on open and unregistered on close. Do not attach permanent `document`-level listeners inside per-instance setup loops.
- Horizontally scrollable containers inside a fixed overlay need `touch-action: pan-x`, not `touch-action: none`.

## Fixed overlays / lightboxes

- Move the overlay element to `document.body` on open (portal) to avoid ancestor stacking-context interference.
- Set overlay card dimensions from `window.innerWidth / window.innerHeight` in JS — CSS percentage-height chains are unreliable on Android Chrome.
- Scroll lock: set `overflow: hidden` on both `<html>` and `<body>`. Never set `position: fixed` on `<body>` — it repositions fixed children relative to the offset body on Android Chrome.

## Schemas and types

- Zod schemas are the single source of truth. Derive TypeScript types with `z.infer<typeof schema>` — do not write a separate TS interface that duplicates a Zod schema.
- Keep Zod schemas in dedicated modules separate from runtime data-helper files to avoid bundling the Zod runtime into pages that only need the inferred type. Use `import type { X }` for type-only imports.

## Static generation

- Every `getStaticPaths` that calls `paginate()` must include an empty-list fallback so the route still builds when the data source returns zero items.

## Code review focus

- When a bug pattern appears in a changed file, check whether the same pattern exists in sibling locale files (`en/` ↔ `bg/`) not included in the diff and flag them explicitly.
- Prefer concrete, actionable comments with a one-line fix example over general observations.
