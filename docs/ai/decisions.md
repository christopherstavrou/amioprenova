# Architectural & Product Decisions

This document records key decisions made during the project's development.

## Technology Choices

### Why Astro?

**Decision**: Use Astro as the static site generator.

**Rationale**:
- Excellent performance (minimal JavaScript)
- Built-in Content Collections for type-safe Markdown
- Easy deployment to static hosts
- Good DX with TypeScript support
- No framework lock-in (can use React/Vue/Svelte components if needed)

**Status**: ✅ Implemented

---

### Why Tailwind CSS + CSS Variables?

**Decision**: Use Tailwind CSS as the utility framework, extended with CSS variables for theming.

**Rationale**:
- Tailwind provides rapid development and consistency
- CSS variables enable automatic light/dark mode without JavaScript
- Variables allow theme switching via `prefers-color-scheme` media query
- Combination provides flexibility and maintainability

**Status**: ✅ Implemented

---

## Content Management Decisions

### No CMS

**Decision**: Do NOT implement a headless CMS. Content is managed through Git, Markdown files, and JSON data files.

**Rationale**:
- Simplicity: No external dependencies or services to maintain
- Cost: Zero ongoing costs (no CMS subscription)
- Version control: All content changes tracked in Git
- Portability: Easy to migrate or backup
- Artist preference: Low-frequency updates, comfortable with Git workflow

**Constraints**:
- Non-technical editors must learn basic Markdown and Git
- Content updates require rebuilding and redeploying the site

**Status**: ✅ Implemented and non-negotiable for V1

---

### Multilingual Strategy: Content-Driven (No Translation Logic)

**Decision**: Each language has its own separate page files. NO inline translation logic, ternaries, or language conditionals in page templates.

**Rationale**:
- **Clarity**: Each page file is readable in its target language
- **Simplicity**: No abstraction overhead, no translation keys
- **Flexibility**: Allows content to differ between languages (not just translations)
- **Maintainability**: Future editors can understand and edit pages directly
- **Performance**: No client-side translation logic

**How it works**:
- English pages: `src/pages/en/*.astro`
- Bulgarian pages: `src/pages/bg/*.astro`
- Small UI strings (nav labels, button text) use a dictionary in `src/i18n/ui.ts`
- Long-form content lives directly in language-specific page files

**Status**: ✅ Implemented

---

### Blog System: No Draft Concept

**Decision**: Markdown files in `src/content/blog/` are automatically published. No draft/published state.

**Rationale**:
- Simplicity: Fewer states to manage
- Git as workflow: Drafts can live in feature branches
- Build-time validation: Astro validates frontmatter at build time
- Artist workflow: Low-frequency posting, content finalized before committing

**Workaround for drafts**:
- Use Git branches for work-in-progress posts
- Only merge to main when ready to publish

**Status**: ✅ Implemented

---

## Design System Decisions

### Automatic Light/Dark Mode (No Manual Toggle)

**Decision**: Theme switching is automatic based on user's OS/browser preference (`prefers-color-scheme`). No manual theme toggle in V1.

**Rationale**:
- Simplicity: No UI for theme selection, no localStorage persistence
- Standards-aligned: Respects user's system-wide preference
- Zero JavaScript: Works purely with CSS media queries
- Accessibility: Users with visual preferences get their preferred theme automatically

**Status**: ✅ Implemented

**Future consideration**: Add manual toggle if user feedback requests it

---

### CSS Variables for Theming

**Decision**: Define all colors, spacing, and design tokens as CSS variables in `:root`, override in `@media (prefers-color-scheme: dark)`.

**Rationale**:
- Single source of truth for design tokens
- Tailwind can reference CSS variables
- Easy to maintain and update colors globally
- No JavaScript required for theme switching

**Implementation**:
- Light mode variables defined in `:root`
- Dark mode variables override in `@media (prefers-color-scheme: dark) { :root { ... } }`
- Tailwind config extends colors to use `var(--color-*)`

**Status**: ✅ Implemented

---

## External Dependencies

### Minimal JavaScript Philosophy

**Decision**: Avoid heavy JavaScript frameworks and libraries. Prefer native browser APIs and CSS.

**Rationale**:
- Performance: Faster page loads, better Core Web Vitals
- Simplicity: Fewer dependencies to maintain
- Longevity: Less likely to break due to dependency updates
- Accessibility: Progressive enhancement ensures site works without JS

**Exceptions**:
- Astro build tooling (dev dependency only)
- Tailwind CSS (dev dependency only)
- Client-side search uses minimal vanilla JS

**Status**: ✅ Implemented

---

## Data Management

### Events as Static Data

**Decision**: Events/shows are stored in `src/data/events.json`. Editing requires rebuilding the site.

**Rationale**:
- V1 simplicity: No API calls, no external dependencies
- Low frequency: Shows are not updated daily
- Git history: Track changes to event data over time

**Future upgrade path**:
- Pull events from Google Calendar API at build time
- Integrate with ticketing platform APIs

**Status**: ✅ Implemented (static data)

---

### Placeholder Strategy

**Decision**: Use `placehold.co` for all placeholder images until real assets are provided.

**Rationale**:
- Visual consistency during development
- Easy to identify which assets need replacement
- No need to commit placeholder images to repository
- Simple replacement process (swap URL)

**Convention**:
- Use site color palette in placeholder URLs: `8B1C3B` (burgundy)
- Descriptive text in placeholder: `?text=Hero+Image`
- Proper aspect ratios: 1920x1080 (16:9), 800x800 (1:1), 640x360 (16:9)

**Status**: ✅ Implemented

---

## SEO & Metadata

### Centralized SEO in Layout Component

**Decision**: All SEO meta tags (OpenGraph, Twitter Card, canonical URLs) generated in `src/layouts/Layout.astro`. Pages only provide title and description props.

**Rationale**:
- DRY principle: Define SEO logic once
- Consistency: All pages get proper meta tags
- Maintainability: Update SEO structure in one place

**Requirements**:
- Every page MUST provide `title` and `description` props
- Titles follow pattern: "Page Name - amioprenova"
- Descriptions are 150-160 characters

**Status**: ✅ Implemented

---

### Sitemap Temporarily Disabled

**Decision**: Sitemap generation is disabled until production base URL is set.

**Rationale**:
- Sitemaps require absolute URLs
- Placeholder URL would generate invalid sitemap
- Can re-enable when `baseUrl` in `src/config/site.ts` is set to production value

**How to re-enable**:
1. Set real `baseUrl` in `src/config/site.ts`
2. Uncomment sitemap integration in `astro.config.mjs`
3. Rebuild site

**Status**: ⏸️ Paused (intentional)

---

## Open Questions

Questions that need answers before proceeding:

1. **Deployment platform**: Cloudflare Pages is planned, but not confirmed. Should we configure GitHub Actions or rely on Cloudflare's Git integration?

2. **Real URLs**: When will the artist provide real external URLs (Bandcamp, social media, email addresses)?

3. **Press assets**: When will high-resolution press photos, logos, and technical rider be available?

4. **Domain name**: What will the production domain be? (Needed for SEO, sitemap, social meta tags)

5. **Google Calendar integration**: Should future event management pull from a Google Calendar? If so, which calendar?

6. **Analytics**: Does the artist want analytics tracking? If so, which tool? (Google Analytics, Plausible, Fathom, none?)

7. **Newsletter platform**: Mailchimp is currently used. Is this the final choice? Placeholder URL needs replacement.

---

## Non-Negotiable Constraints (V1)

These are hard limits that MUST NOT be violated in V1:

1. **Static site only** - No server-side logic, no backend
2. **No CMS** - Content managed through Git and files
3. **No database** - All data in repository or external APIs (future)
4. **No on-site payments** - Links to external platforms only
5. **No contact form backend** - Mailto links only in V1
6. **Content-driven multilingual** - No inline translation logic in pages
7. **Design.md compliance** - All styling must reference DESIGN.md

---

## Decision Log Template

When documenting new decisions, use this template:

```markdown
### [Decision Title]

**Decision**: [One-sentence summary]

**Rationale**:
- [Reason 1]
- [Reason 2]

**Constraints** (if any):
- [Constraint 1]

**Status**: [✅ Implemented | 🟡 In Progress | ⏸️ Paused | ❌ Rejected]

**Date**: YYYY-MM-DD
```
