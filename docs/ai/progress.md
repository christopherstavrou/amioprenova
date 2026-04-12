# Project Progress

Session-to-session anchor for AI agents. Read this at the start of every session.

**Last updated**: 2026-04-12

---

## ✅ Done

### Infrastructure
- Astro + TypeScript + Tailwind CSS initialized
- Central config (`src/config/site.ts`) for all external URLs
- i18n system (EN + BG) with Content Collections
- Design system: CSS variables, dark mode via `data-theme`, cookie persistence

### Components
- `Button.astro` (primary, secondary, ghost variants)
- `Card.astro` (padding variants, hover state)
- `PageHeader.astro`, `SectionHeader.astro`, `Badge.astro`
- `Logo.astro`

### Pages (all EN + BG, all with design system)
Home · About · Music · Video · Shows · Blog/News · Press · Contact · Links · Cake & Jazz · Privacy

### Features
- Sticky glass header with theme toggle and language switcher
- Blog: Markdown posts, pagination (6/page), client-side search
- SEO: OpenGraph, Twitter Card, canonical URLs, robots.txt
- Sitemap configured (⏸️ disabled pending production domain)
- Landing page: removed direct language links (Soft Launch ready)

### Documentation (2026-03-10)
- Refactored docs: added `standards.md`, rewrote `workflow.md` and `AI.md` (generalized for all AI agents)
- Deleted redundant `commands.md` and `project-summary.md`

### Frontend Redesign (2026-03-25)
- Full visual overhaul: real photos, content, video lightbox
- Favicon replaced with embedded Pacifico font "A" on white background (43KB SVG, down from 327KB)
- Instagram URL and landing page refactored to use `siteConfig`
- Language links removed from landing page

### Repo Housekeeping (2026-03-25)
- `design/` untracked from git (files remain on disk at `design/`) — ~1.3GB removed from future commits
- `.gitignore` updated: `design/`, `.claude/`, `*Zone.Identifier`, build artifacts
- WSL Zone.Identifier metadata files deleted

### Agent-Agnostic Docs (2026-03-25)
- `AI.md` renamed to `AGENTS.md` (open standard, read natively by all major agents)
- `CLAUDE.md` and `GEMINI.md` reduced to identical stubs pointing to `AGENTS.md`
- Fixed broken reference: `github-integration-claude.md` → `github-integration.md`

### Soft Launch (2026-03-26)
- `public/_redirects` added — Cloudflare Pages redirects all `/en/*` and `/bg/*` to splash (`/`)
- Splash page (`src/pages/index.astro`) is the only publicly visible page
- Dev server unaffected — all inner pages still accessible at `localhost:4321`

### Deploy (2026-03-26)
- Production domain confirmed: `https://amioprenova.com` (set in `src/config/site.ts` and `astro.config.mjs`)
- Cloudflare Pages connected to repo with GitHub Actions
- Hero/about images and About page biography completed

### Shows + News enhancements (2026-04-11) — PRs #27, #29–#31
- `GalleryLightbox` component: compact thumbnail grid + full-screen lightbox with carousel (images, YouTube, Vimeo)
- SharePopover: icon-only share button (Web Share API + fallback popover with copy-link, Facebook, Twitter/X)
- Shows detail pages: cover image hero, gallery section, SharePopover in footer
- Shows list pages: card layout with thumbnail, SharePopover per card
- Gallery lightbox mobile fixes: dark scrim, JS `syncSize()` for explicit pixel dimensions, portal-to-body pattern, header suppression, overflow-only scroll lock
- News parity: `image` + `gallery` fields added to blog schema; news list redesigned to card layout; news detail pages have cover image, gallery, and SharePopover matching shows
- Upgraded Astro 4→6, @astrojs/tailwind 5→6 (#31)
- Replaced hardcoded durations and colours with design tokens; extracted `SearchInput` component; documented TypeScript cast rules (#29, #30)

### Nav localisation + home card content (2026-04-12) — PRs #32–#33
- Localised mobile nav controls: "Toggle Theme" and "Language" labels now use the i18n dictionary in both EN and BG (#32)
- Fixed mobile theme toggle active state — removed left-border selection style that incorrectly treated it as a nav item (#32)
- Improved focus-visible ring: `focus-visible` (keyboard only) instead of `focus`, combined selector in `global.css` with border-radius preserved for links (#32)
- Homepage shows card: populated with next 3 upcoming events from `events.json` (date, title linked to detail page, venue/city); empty-state fallback retained (#33)
- Homepage video card: added `description` field below title to fill dead whitespace (#33)
- Added `parseWallClockDate()` to `src/lib/events.ts` — robust ISO parser (regex + range validation + post-construction UTC check) ensuring timezone-stable output on CI/Cloudflare (#33)
- Fixed `formatEventDate`: `toLocaleDateString` → `toLocaleString` so time fields are not silently dropped (#33)
- Added `formatShortDate()` helper for compact date display; moved date formatting to Astro frontmatter (#33)

---

## ⏭ Next

### Content
- Write Privacy Policy content when data collection begins
- Add BG blog posts (`src/content/blog/bg/` — directory not yet created; EN posts exist)
- Add press assets to `public/press/` (photos, logo, tech rider)

### Full Launch
- Fix outstanding bugs and improvements
- Remove `public/_redirects` to expose full site
- Re-enable sitemap in `astro.config.mjs`

### V2 Enhancements
- Newsletter: integrate Mailchimp (replace placeholder form)
- Contact: evaluate form backend (Formspree, Netlify Forms)
- Analytics: add privacy-friendly tracking (Plausible or Fathom)
- Images: convert to WebP, add responsive sizes

---

## ❓ Open Questions

Awaiting answers from the artist/owner before these can progress:

1. **Domain** — What is the production domain? (needed for SEO, sitemap, OG tags)
2. **Real URLs** — Bandcamp, Spotify, Instagram, Facebook, YouTube, contact email
3. **Press assets** — When will real press photos, logo, and tech rider be available?
4. **Newsletter** — Is Mailchimp the final choice? What is the list signup URL?
5. **Analytics** — Should analytics be added? If so, which tool?
6. **Google Calendar** — Should future event management pull from a calendar?

---

## 🔢 Build Status

```bash
npm run build   # Expected: 56 pages, 0 errors
npm run dev     # Expected: http://localhost:4321
```

See `README.md` for full verification checklist and content management guide.
