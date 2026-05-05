# Component Library

This is the canonical UI inventory for amioprenova. Every reusable surface element on the site is in this list. The standard is simple:

> **Before writing inline markup that resembles something on this list, use the existing component. If the library has a gap, the right move is to extend it — not to inline a one-off.**

This applies to icons, share controls, share targets, lists, headers, badges — anything that has a brand presence. The point is not to police line counts; it is to keep the site visually consistent and to keep changes localised. A colour or radius adjustment to "the badge style" should mean editing one file, not seven.

Each component file carries its own documentation in its frontmatter. This page is the index — what exists, when to reach for it, and where to look when something is missing.

---

## Layout primitives

| Component | Use when… |
|---|---|
| [`Card`](../src/components/Card.astro) | Wrapping a release, video, blog post, show, or any boxed content with shadow + radius. Padding variants `sm` / `md` / `lg`. |
| [`PageHeader`](../src/components/PageHeader.astro) | Top of every page. Provides the page title and optional intro. |
| [`SectionHeader`](../src/components/SectionHeader.astro) | Sectioning inside a page. Smaller than `PageHeader`. |

## Controls

| Component | Use when… |
|---|---|
| [`Button`](../src/components/Button.astro) | Any primary, secondary, or ghost button, or a CTA link styled as a button. Renders as `<a>` if `href` is given, otherwise `<button>`. |
| [`SearchInput`](../src/components/SearchInput.astro) | Client-side search inputs on list pages (shows, news). |

## Identity & metadata

| Component | Use when… |
|---|---|
| [`Logo`](../src/components/Logo.astro) | The "Ami Oprenova" wordmark. Do not inline the script font anywhere else. |
| [`Badge`](../src/components/Badge.astro) | Small inline labels — tags, categories, metadata pills. Variants `default` / `accent` / `muted`. |

## Media & sharing

| Component | Use when… |
|---|---|
| [`GalleryLightbox`](../src/components/GalleryLightbox.astro) | Any image / video gallery with a thumbnail grid + full-screen lightbox. Multi-instance safe. |
| [`SharePopover`](../src/components/SharePopover.astro) | Share button on shows, news, and any future shareable detail page. Uses Web Share API with a fallback popover (copy link, Facebook, Twitter/X). |
| [`ShowActionsMenu`](../src/components/ShowActionsMenu.astro) | Three-dot overflow menu for show cards on list pages. |

---

## Adding a component

A new component earns its place when:

1. The same markup or behaviour appears (or is about to appear) in two or more places, **or**
2. The element is a brand surface that should be consistent site-wide — even if it is currently only used once. Icons, share controls, and CTAs are examples of this category.

Keep components small. Five props is a soft ceiling; more usually means the component is doing two jobs. Use a `class?: string` forwarding prop on every component so callers can adjust spacing without prop sprawl.

Document the component in two places:

- A short docstring in its own frontmatter — purpose, prop contract, anything subtle.
- A row in the appropriate table above — name, link, "use when…" sentence.

When a component is removed, remove its row here in the same commit.

---

## Anti-patterns

- **Inline SVG icons.** Use a shared icon component. If the icon you need is missing, add it to the icon component, don't paste a `<path>` into a page.
- **Re-implementing existing markup.** If the page needs something that looks like a `Card` with a different border, extend `Card` — don't write a parallel `<div>` with `bg-surface rounded-md shadow-md` inline.
- **One-off variants on a component.** A `compact` variant added because one caller needs it usually means the caller should use a smaller padding token, not that the component needs a new variant.
