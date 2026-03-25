# Project Progress

Session-to-session anchor for AI agents. Read this at the start of every session.

**Last updated**: 2026-03-25

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
- `CLAUDE.md` created using `@`-import syntax — Claude gets full `docs/ai/` context automatically
- `GEMINI.md` slimmed to a stub — eliminates drift risk when Gemini edits its own file
- Fixed broken reference: `github-integration.md` → `github-integration-claude.md`

---

## ⏭ Next

### Immediate — Content and Assets
- Replace hero / about portrait images (still placeholder)
- Write real About page biography (`src/content/pages/en/about.md` — currently lorem ipsum)
- Write Privacy Policy content (`src/pages/en/privacy.astro`, `src/pages/bg/privacy.astro`)
- Add BG blog posts (`src/content/blog/bg/` — directory not yet created; EN posts exist)
- Add press assets to `public/press/` (photos, logo, tech rider)

### Deploy
- Set production domain in `src/config/site.ts` → `baseUrl`
- Re-enable sitemap in `astro.config.mjs`
- Link repo to Cloudflare Pages (branch: `main` → production, `develop` + `test` → previews)

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
npm run build   # Expected: 44 pages, 0 errors
npm run dev     # Expected: http://localhost:4321
```

See `README.md` for full verification checklist and content management guide.
