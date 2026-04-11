---
applyTo: "**/*.astro"
---

# Astro Component Standards — amioprenova

## Frontmatter

- All logic lives in the `---` frontmatter block. No inline scripts in the template unless they are `<script>` tags for client-side behaviour.
- Import types with `import type { … }` to keep the client bundle clean.
- Derive computed values (formatted dates, canonical URLs, etc.) in frontmatter, not inline inside JSX expressions.

## Styles

- Use `<style is:global>` (not scoped `<style>`) whenever a rule:
  - Uses a compound selector: `:root[data-theme="dark"] .my-class`
  - Targets an element rendered outside the component (e.g. `body`, `html`, injected portal nodes)
  - Needs to reach descendant elements that Astro would otherwise scope away
- Use Tailwind utility classes for layout and spacing. Use CSS custom properties (`var(--color-*)`, `var(--transition-*)`) for theme-sensitive values that Tailwind doesn't expose.
- Never hardcode hex/rgba colour values or millisecond durations — always use design tokens from `src/styles/global.css`.

## i18n — two-file pattern

- Pages under `src/pages/en/` and `src/pages/bg/` are sibling files that must stay structurally in sync.
- Never branch on language inside a single page file (`lang === 'en' ? … : …`). If content differs by language, it lives in the relevant Content Collection entry or in each language's page file.
- When creating or editing a page, the matching locale page must also be updated in the same commit/PR.
- **Structural parity extends to conditional UI blocks.** If a feature (e.g. search input) is guarded by `data.length > 0` in one locale, the sibling locale must use the same guard. Different conditionals around the same feature count as a structural divergence.
- **Components that render user-visible text and appear on both EN and BG pages must accept a `labels` prop** with English defaults baked into the component. BG caller pages must pass Bulgarian strings. This applies to `aria-label`, button text, status messages, and any string the component renders or updates at runtime (e.g. via `span.textContent`). Pass labels via `data-*` attributes when the component's JS needs to update text after render.

## Component safety — multi-instance scoping

- Any component that may appear more than once on a page must **not** use hardcoded `id` attributes for JS hooks. Use a wrapper element with a unique class (e.g. `gallery-instance`, `share-popover`) and scope all `querySelector` calls to that root.
- The Astro `<script>` block is deduplicated — it runs once per page. Use `document.querySelectorAll('.my-component').forEach(root => { … })` to initialise each instance independently.
- Assign unique panel IDs dynamically in JS (e.g. `panel-${i}`) for `aria-controls` when multiple instances exist.

## Client-side JavaScript

- Register event listeners **on open / on activate** and remove them **on close / on deactivate**. Never add permanent `document`-level listeners inside a per-instance `forEach` loop — this accumulates O(n) listeners on multi-instance pages.
- Name all handler functions so they can be passed to `removeEventListener`:
  ```js
  function handleKeyDown(e) { … }
  document.addEventListener('keydown', handleKeyDown);   // on open
  document.removeEventListener('keydown', handleKeyDown); // on close
  ```
- Never use `innerHTML` with user-controlled strings. Use `createElement` + `textContent`.
- Use `import.meta.env.DEV` guards around `console.error` / `console.warn` so logs don't reach production.

## Fixed overlays and lightboxes

The following patterns address real bugs seen on Android Chrome (Pixel 6 Pro):

### Portal to `<body>`
```js
if (overlay.parentElement !== document.body) {
  document.body.appendChild(overlay);
}
```
Ensures z-index comparison happens in the root stacking context. Backdrop-filter on a parent creates a new stacking context that traps child z-index values.

### JS-driven card dimensions
```js
function syncSize() {
  card.style.width  = window.innerWidth  + 'px';
  card.style.height = window.innerHeight + 'px';
}
syncSize();
window.addEventListener('resize', syncSize); // register on open
window.removeEventListener('resize', syncSize); // unregister on close
```
`flex: 1` on a child cannot resolve height when no ancestor has a concrete pixel value. CSS `100vh` is unreliable on Android Chrome when the address bar is visible. JS-set pixel values are the reliable fix.

### Scroll lock
```js
// On open:
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';

// On close:
document.documentElement.style.overflow = '';
document.body.style.overflow = '';
```
**Never** use `position: fixed` on `<body>` for scroll locking — on Android Chrome it causes `position: fixed` children to be positioned relative to the offset body rather than the viewport.

### Touch action
```css
/* Overlay: do NOT set touch-action:none — it blocks horizontal scrolling in children */
.overlay { overscroll-behavior: none; }

/* Scrollable strip/carousel inside overlay: */
.scroll-container { touch-action: pan-x; }
```

## Content Collections

- Blog schema is defined in `src/content/config.ts` and imports the Zod schema from `src/lib/gallery-schema.ts` — do not redefine gallery item types inline.
- The `gallery` field uses a `z.discriminatedUnion` on `type`: `'image'` | `'youtube'` | `'vimeo'`.
- Always add `image` and `gallery` as optional fields — never required — so existing content remains valid.

## `getStaticPaths` safety

```ts
export const getStaticPaths = (async ({ paginate }) => {
  const items = getData();
  // Always include a fallback for the empty case:
  if (items.length === 0) {
    return [{ params: { page: undefined }, props: { page: { data: [], currentPage: 1, lastPage: 1, url: { prev: null, next: null } } } }];
  }
  return paginate(items, { pageSize: 6 });
}) satisfies GetStaticPaths;
```

## Accessibility checklist for Astro components

- [ ] `type="button"` on all non-submit `<button>` elements
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-expanded` + `aria-controls` on disclosure triggers (popovers, dropdowns)
- [ ] `role="dialog"` + `aria-modal="true"` + focus trap on modal overlays
- [ ] `loading="lazy"` on below-fold images
- [ ] `alt` text on all `<img>` elements (empty string for decorative images)
