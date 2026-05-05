# Implementation Standards

How code is written and structured in this repository. Three tiers — read each accordingly:

- **§1 Hard standards** — non-negotiable. Violating these breaks builds, accessibility, security, or i18n parity. CI and reviewers will block the work.
- **§2 Conventions** — soft consistency rules. Default to following them; deviate when the work is better for it and say so in the PR.
- **§3 Patterns and rationale** — accumulated lessons (Astro idioms, browser quirks, Zod boundaries). Treat as guidance, not law. If a pattern feels wrong for a specific case, use judgement.

**Read alongside:** [`docs/ai/workflow.md`](./workflow.md) (process), [`docs/ai/decisions.md`](./decisions.md) (architectural rationale), [`docs/brand.md`](../brand.md) (visual identity), [`docs/component-library.md`](../component-library.md) (UI inventory).

---

## 1. Hard standards

These are objective, enforceable, and must hold on every PR.

### Build and types

- `npm run build` passes with zero errors.
- No `any`. Use `unknown` and narrow, or define a specific type.
- No `as X` casts unless the cast is provably safe with an inline comment explaining why. If you reach for a cast, the upstream type is probably wrong — fix that instead.

### Design tokens

- No hardcoded hex or rgba values in `.astro` / `.ts` files. Use Tailwind utility classes that resolve to design tokens, or `var(--color-*)` directly.
- No hardcoded transition durations. Use `var(--transition-fast)` (150ms), `var(--transition-base)` (250ms), or `var(--transition-slow)` (500ms), or the matching Tailwind `duration-fast` / `duration-base` / `duration-slow` utilities.
- Tokens are defined in [`src/styles/global.css`](../../src/styles/global.css). To change a value site-wide, change it there.
- Dark mode is `data-theme="dark"` on `<html>`. **Do not** write `dark:` Tailwind variants in components or pages.

### i18n parity

- EN and BG pages are sibling files. Never branch on language with `lang === 'en' ? … : …` inside a single page file.
- EN and BG page structure must match — same conditional guards, same component props, same sections. If you change the structure of one, change the other in the same commit.
- New UI strings shared between locales go in [`src/i18n/ui.ts`](../../src/i18n/ui.ts) under `en` and `bg`.
- Components used on both EN and BG pages accept a `labels` prop with English defaults; BG callers pass Bulgarian strings. JS that updates text at runtime reads from `data-*` attributes — not hardcoded strings in the script.

### Accessibility

- Every `<button>` that is not a form submit has `type="button"`.
- Disclosure widgets (popovers, dropdowns, mobile menu) have `aria-expanded` on the trigger and `aria-controls` pointing to the panel ID. Keep `aria-expanded` in sync on open/close.
- Modal dialogs and full-screen overlays: `role="dialog"`, `aria-modal="true"`, focus trap (Tab/Shift+Tab cycle), Escape to close, focus restored on close.
- Icon-only buttons have an `aria-label`. The label string comes from `src/i18n/ui.ts` if it differs by locale, never a hardcoded English string in JSX.
- Images have `alt` text — descriptive for content images, empty (`alt=""`) for purely decorative ones.

### Security

- Never use `innerHTML` with user-controlled or fetched data. Build DOM with `document.createElement` + `textContent`.
- No hardcoded secrets, API keys, or credentials in source files.
- Scraper credentials (e.g. `scripts/facebook-cookies.json`) are gitignored. Confirm before committing anything from `scripts/`.

### Component library

- Use the existing components in [`docs/component-library.md`](../component-library.md). If a piece of markup resembles something in the library, use the library entry. If the library has a gap, extend it — don't inline a one-off.
- This applies especially to icons, share controls, badges, buttons, and headers — surfaces with brand presence.

### Static generation

- Every `getStaticPaths` that calls `paginate()` includes an empty-list fallback so the route still builds when the data source returns zero items.

### Schemas

- Zod schemas are the source of truth. Derive types with `z.infer<typeof schema>` — never duplicate a Zod schema as a separate TS interface.
- Keep Zod schemas in dedicated modules (e.g. [`src/lib/gallery-schema.ts`](../../src/lib/gallery-schema.ts)) so the runtime isn't bundled into pages that only need the type. Use `import type { … }` for type-only imports.
- New optional fields on existing collection schemas use `.optional()` — never a breaking change to existing content.

---

## 2. Conventions

Defaults to follow when nothing else applies. Deviate when there's a reason; mention it in the PR if the deviation is large.

### File organisation

- Components in `src/components/` (PascalCase filenames).
- Pages in `src/pages/{en,bg}/` (kebab-case filenames).
- Utilities in `src/lib/` (camelCase filenames).
- Long-form content in `src/content/{blog,pages,shows}/`.
- All external URLs in [`src/config/site.ts`](../../src/config/site.ts) — never hardcode a URL in a page or component.

### Imports

Order in this sequence with a blank line between groups:

1. Astro / framework builtins
2. Layouts
3. Components
4. Library utilities
5. Data files (JSON)
6. Config and i18n

Use relative paths. Use `import type { … }` for type-only imports.

### Component shape

Every component:

- Defines `export interface Props`.
- Accepts a `class?: string` forwarding prop.
- Computes class strings in the frontmatter using lookup objects, not inline ternaries in the template.
- Carries a one-line docstring in the frontmatter explaining its purpose. Prop docs go in the docstring, not in the table here.

### Naming

| Thing | Convention | Example |
|---|---|---|
| Component file | PascalCase | `SectionHeader.astro` |
| Page file | kebab-case | `about.astro` |
| Utility file | camelCase | `events.ts` |
| CSS custom property | `--kebab-case` | `--color-text-primary` |
| Tailwind token | kebab-case | `text-text-primary` |

Name components after what they *are*, not what they do. `SectionHeader`, not `RenderSectionTitle`.

### Date formatting

- Use `toLocaleString` (not `toLocaleDateString`) when time is included — `toLocaleDateString` silently drops time fields.
- Locale strings: `en-US` and `bg-BG` (match existing usage in the codebase).
- Build runs in UTC on CI. Use `timeZone: 'UTC'` in formatter options for stable SSG output.
- Helpers in [`src/lib/events.ts`](../../src/lib/events.ts) handle the wall-clock parsing — prefer them over re-rolling.

### Comments

- Comment on the *why* when it is non-obvious — a hidden constraint, a workaround for a specific bug, behaviour that would surprise a reader.
- Don't comment on the *what* — well-named identifiers do that.
- Don't reference the current task or PR ("added for issue #123") — that lives in commit messages and PR descriptions.

### Dependencies

- New npm packages require explicit user approval. Confirm a native browser API or existing utility cannot do the job first.
- Prefer dev-only packages (build tooling) over runtime packages.

---

## 3. Patterns and rationale

Astro idioms, browser quirks, and accumulated lessons. Apply judgement — these are not absolute.

### Astro components

- Logic lives in the `---` frontmatter block. `<script>` tags are for client-side behaviour only.
- Derive computed values (formatted dates, canonical URLs) in frontmatter, not inline in JSX.
- Use `<style is:global>` for rules with compound selectors (e.g. `:root[data-theme="dark"] .my-class`) or that target elements rendered outside the component.

### Multi-instance components

A component that can appear more than once on a page must scope all DOM queries to an instance root — never `document.getElementById` with hardcoded IDs.

```js
document.querySelectorAll('.my-component').forEach(root => {
  // Scope queries to root, not document.
});
```

Astro's `<script>` block is deduplicated and runs once per page. Assign unique panel IDs dynamically (e.g. `panel-${i}`) for `aria-controls` when multiple instances exist.

### Client-side JavaScript

- Register listeners on open / on activate; remove them on close / on deactivate. Named handler functions only — anonymous functions can't be removed.
- Use `import.meta.env.DEV` guards around `console.error` / `console.warn` so logs don't reach production.
- Check `response.ok` before `response.json()`. Catch fetch errors and degrade gracefully.

### Fixed overlays / lightboxes

These patterns address real bugs seen on Android Chrome (Pixel 6 Pro). They are not theoretical.

- **Portal to `<body>`.** A `backdrop-filter` ancestor creates a new stacking context that traps child z-index values. Move the overlay to `document.body` on open.
- **JS-driven card dimensions.** CSS percentage-height chains break on Android Chrome when the address bar is visible; `100vh` is unreliable. Set `width` / `height` from `window.innerWidth` / `innerHeight` in JS on open and on resize.
- **Scroll lock.** `overflow: hidden` on `<html>` and `<body>`. **Never** `position: fixed` on `<body>` — it shifts fixed children to the offset body rather than the viewport on Android Chrome.
- **Touch action.** Don't set `touch-action: none` on the overlay — it blocks horizontal scrolling in children. Use `overscroll-behavior: none` instead, and `touch-action: pan-x` on horizontally scrollable children.

### Content Collections

Collection schemas live in [`src/content.config.ts`](../../src/content.config.ts). Shared schemas (e.g. gallery items) live in dedicated modules under `src/lib/` so their Zod runtime isn't bundled into pages that only need the type.

### `getStaticPaths` empty fallback

```ts
export const getStaticPaths = (async ({ paginate }) => {
  const items = await getData();
  if (items.length === 0) {
    return [{
      params: { page: undefined },
      props: { page: { data: [], currentPage: 1, lastPage: 1, url: { prev: null, next: null } } },
    }];
  }
  return paginate(items, { pageSize: 6 });
}) satisfies GetStaticPaths;
```

### Avoiding over-abstraction

- Keep code inline until it's repeated. Three similar lines is better than a premature abstraction.
- Don't add props for hypothetical future callers.
- Don't extract a "helper" / "util" / "common" function for a single use.

If a pattern within the current PR is repeated 2+ times, extract it before raising. If the duplication is pre-existing, note it in `progress.md` under tech debt — don't refactor as scope creep.

### Scope discipline

- One logical change per commit; one feature or fix per PR.
- Don't refactor adjacent code while fixing a bug.
- If a task touches more than five files, consider splitting it.

These are conventions, not laws — there are good reasons to break each of them sometimes. The goal is a reviewable diff, not a rule count.
