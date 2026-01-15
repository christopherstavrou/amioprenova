# CLAUDE.md - AI Assistant Entrypoint

**For detailed context, see [`docs/ai/`](./docs/ai/)** - start with `progress.md` for current state.

---

## Project Overview

**amioprenova** is a static website for jazz vocalist Ami Opprenova. Built with Astro, it serves as the artist's official online presence for fans, promoters, and press.

**Type**: Static site only
**Stack**: Astro, Tailwind CSS, TypeScript
**Languages**: English (/en) + Bulgarian (/bg)

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

### Branch Workflow
1. **NEVER commit directly to `main`**
2. **Always branch from `develop`** using `claude/<feature-name>` pattern
3. **Open PRs frequently** - small PRs are better
4. **Build must succeed** before committing: `npm run build` → 0 errors

### Documentation First
- **Start every session**: Read `docs/ai/progress.md`
- **End every session**: Update `docs/ai/progress.md`
- **Detailed workflow**: See `docs/ai/workflow.md`

### Styling & Design
- **Primary reference**: `DESIGN.md` for all visual design decisions
- **Design system**: CSS variables in `src/styles/global.css`
- **Theme switching**: Automatic via `prefers-color-scheme` (no manual toggle)
- **Components**: Use reusable components in `src/components/`
- **NO hardcoded colors**: Use theme classes (bg-accent-primary, text-text-primary, etc.)

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
