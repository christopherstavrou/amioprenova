# CLAUDE.md - AI Assistant Entrypoint

**For detailed context, see [`docs/ai/`](./docs/ai/)** - start with `progress.md` for current state.

---

## Project Overview

**amioprenova** is a static website for jazz vocalist **Ami Oprenova** (note: spelled with one "p" in Oprenova). Built with Astro, it serves as the artist's official online presence for fans, promoters, and press.

**Type**: Static site only
**Stack**: Astro, Tailwind CSS, TypeScript
**Languages**: English (/en) + Bulgarian (/bg)

### Visual Reference & Branding

**CRITICAL**: The artist's name is **Ami Oprenova** with one "p" in Oprenova, NOT "Ami Opprenova". This is the correct spelling and must be used consistently throughout:
- Code comments and documentation
- Configuration files (`src/config/site.ts`)
- All page content (EN and BG)
- Meta tags and SEO data
- Data files (events, releases, videos)

The design implementation is based on a provided reference image that shows the intended visual aesthetic in both light and dark modes on desktop and mobile. All styling decisions should align with this visual reference, documented in detail in `DESIGN.md`.

---

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Development server (http://localhost:4321)
npm run build    # Production build (must succeed before committing)
npm run preview  # Preview production build
```

---

## Mandatory Rules

### Branch Workflow (Cloudflare Pages Deployment)
1. **NEVER commit directly to `main`** (production/live site)
2. **NEVER create PRs to `main` or `test`** - PRs go to `develop` only
3. **Always branch from `develop`** using `claude/<feature-name>` pattern
4. **Open PRs to `develop` frequently** - small PRs are better
5. **Build must succeed** before committing: `npm run build` → 0 errors

**Branch model**:
- `main` = Production (live site) - owner only
- `develop` = Development staging - Claude PRs merge here
- `test` = QA staging - owner merges develop here before production
- `claude/*` = Feature branches - temporary, deleted after merge

### Documentation First
- **Start every session**: Read `docs/ai/progress.md`
- **End every session**: Update `docs/ai/progress.md`
- **Detailed workflow**: See `docs/ai/workflow.md`

### Styling & Design
- **Primary reference**: `DESIGN.md` for all visual design decisions
- **Design system**: CSS variables in `src/styles/global.css`
- **Theme switching**: Default to system preference (`prefers-color-scheme`), manual override via theme toggle with cookie persistence
- **Components**: Use reusable components in `src/components/`
- **NO hardcoded colors**: Use theme classes (bg-accent-primary, text-text-primary, etc.)
- **Header**: Sticky glass morphism effect with backdrop blur
- **Mobile navigation**: Hamburger menu with slide/fade animation
- **Logo**: SVG wordmark "Ami Oprenova" in script/signature font

### Cookie-Based Persistence
User preferences are stored in browser cookies for server-side access:
- **`site_theme`**: User's theme preference (`"light"` or `"dark"`)
  - First visit: Uses system preference via `prefers-color-scheme`
  - After manual toggle: Cookie overrides system preference
  - Max-Age: 365 days
- **`site_lang`**: User's language preference (`"en"` or `"bg"`)
  - First visit: Defaults to English
  - After selection: Cookie stores preference
  - Max-Age: 365 days

**Implementation**: Simple JavaScript cookie helpers in client-side scripts. On page load, check cookies and apply stored preferences. Theme applied via `data-theme` attribute on `<html>` element.

---

## Content Management

### Multilingual (i18n) - CRITICAL
- **NEVER use inline translation logic** in page templates (no ternaries, no conditionals)
- **Each language has its own page file**: `/en/*.astro` and `/bg/*.astro`
- **Content lives in page files**, not in JSON translation files
- **Small UI strings only** (nav labels, buttons) may use `src/i18n/ui.ts`

### Data Files
- **Events**: `src/data/events.json` (manual edit + rebuild)
- **Releases**: `src/data/releases.json` (music albums)
- **Videos**: `src/data/videos.json` (YouTube links)
- **Blog**: Markdown in `src/content/blog/{en,bg}/` (auto-published when file exists)
- **About**: Markdown in `src/content/pages/{en,bg}/about.md`

---

## Architecture Constraints (Non-Negotiable)

- ❌ No CMS - content managed through Git
- ❌ No backend - fully static site
- ❌ No database - all data in repository
- ❌ No on-site e-commerce - external links only
- ❌ No contact form backend - mailto links only (V1)
- ❌ No inline translation logic - separate page files per language
- ✅ Static build-time generation only
- ✅ Design system compliance required

---

## Repository Structure

```
src/
├── components/        # Reusable UI (Button, Card, PageHeader, etc.)
├── layouts/           # Page layouts with SEO
├── pages/{en,bg}/     # Route pages (Home, About, Music, etc.)
├── content/           # Content Collections (blog, pages)
├── data/              # JSON data files (events, releases, videos)
├── config/site.ts     # Central configuration (URLs, metadata)
├── i18n/ui.ts         # Small UI translation strings only
└── styles/global.css  # CSS variables + design system
```

---

## Essential Documentation

| File | Purpose |
|------|---------|
| [`docs/ai/progress.md`](./docs/ai/progress.md) | ✅ Done / 🟡 In Progress / ⏭ Next (session anchor) |
| [`docs/ai/workflow.md`](./docs/ai/workflow.md) | Mandatory Claude workflow & branch rules |
| [`docs/ai/decisions.md`](./docs/ai/decisions.md) | Architectural decisions & constraints |
| [`docs/ai/project-summary.md`](./docs/ai/project-summary.md) | Tech stack, repo map, what's built |
| [`docs/ai/commands.md`](./docs/ai/commands.md) | Canonical commands & expected outcomes |
| [`DESIGN.md`](./DESIGN.md) | Visual design system (colors, typography, components) |
| [`README.md`](./README.md) | User-facing documentation |

---

## Testing Light/Dark Mode

**Chrome DevTools method:**
1. Open site: `http://localhost:4321/en`
2. Press `F12` (DevTools)
3. Open "Rendering" tab (More tools > Rendering)
4. Toggle `prefers-color-scheme` between `light` and `dark`
5. Verify colors, backgrounds, and text adapt correctly

---

## Current Focus

**See `docs/ai/progress.md` for up-to-date status.**

Last known state:
- Design system foundation implemented ✅
- Home, About, Music, Video pages refactored ✅
- Shows page partially refactored 🟡
- Remaining pages need design system rollout ⏭

---

## Questions or Issues?

1. Check `docs/ai/workflow.md` for process questions
2. Check `docs/ai/decisions.md` for "why we did this"
3. Check `docs/ai/commands.md` for command reference
4. If truly stuck, document the blocker and ask explicitly
