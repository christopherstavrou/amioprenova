# Project Progress

Session-to-session anchor for AI agents. Read this at the start of every session.

**Last updated**: 2026-04-14

---

## ✅ Done

### Infrastructure
- Astro + TypeScript + Tailwind CSS initialized
- Central config (`src/config/site.ts`) for all external URLs
- i18n system (EN + BG) with Content Collections
- Design system: CSS variables, dark mode via `data-theme`, cookie persistence
- **Events Content Collection**: Migrated from a single JSON file to individual JSON files in `src/content/shows/` for scalability and type safety. (2026-04-14)

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
- Sitemap configured (⏸️ disabled pending full public launch)
- Landing page: removed direct language links (Soft Launch ready)
- **Strict Localization**: Refactored show detail and list pages to prevent "bilingual bleeding" by prioritizing locale-specific fields (`titleEn/Bg`, `bodyEn/Bg`) and intelligently falling back to base fields only when safe. (2026-04-14)

### Documentation (2026-03-10)
- Refactored docs: added `standards.md`, rewrote `workflow.md` and `AI.md` (generalized for all AI agents)
- Deleted redundant `commands.md` and `project-summary.md`
- **Updated Event Enrichment Guide**: Reflected the move to Content Collections and new localization logic. (2026-04-14)

### Frontend Redesign (2026-03-25)
- Full visual overhaul: real photos, content, video lightbox
- Favicon replaced with embedded Pacifico font "A" on white background (43KB SVG, down from 327KB)
- Instagram URL and landing page refactored to use `siteConfig`
- Language links removed from landing page

### Repo Housekeeping (2026-03-25)
- `design/` untracked from git (files remain on disk at `design/`) — ~1.3GB removed from future commits
- `.gitignore` updated: `design/`, `.claude/`, `*Zone.Identifier`, build artifacts
- WSL Zone.Identifier metadata files deleted
- **Legacy Cleanup**: Deleted `src/data/events.json` and temporary migration scripts. (2026-04-14)

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
- Hero imagery and About page biography completed; some placeholder/demo content still remains in secondary content areas and should be cleaned up before full launch

### Shows + News enhancements (2026-04-11) — PRs #27, #29–#31
- `GalleryLightbox` component: compact thumbnail grid + full-screen lightbox with carousel (images, YouTube, Vimeo)
- SharePopover: icon-only share button (Web Share API + fallback popover with copy-link, Facebook, Twitter/X)
- Shows detail pages: cover image hero, gallery section, SharePopover in footer
- Shows list pages: card layout with thumbnail, SharePopover per card
- Gallery lightbox mobile fixes: dark scrim, JS `syncSize()` for explicit pixel dimensions, portal-to-body pattern, header suppression, overflow-only scroll lock
- News parity: `image` + `gallery` fields added to blog schema; news list redesigned to card layout; news detail pages have cover image, gallery, and SharePopover matching shows
- Upgraded Astro 4→6, @astrojs/tailwind 5→6 (#31)
- Replaced hardcoded durations and colours with design tokens; extracted `SearchInput` component; documented TypeScript cast rules (#29, #30)

### Image optimisation + accessibility (2026-04-12) — PRs #34–#36
- Moved play-video `aria-label` prefix (`Play` / `Пусни`) into i18n dictionary (`home.playVideo`) — both homepages (#34)
- Moved 6 static images from `public/images/` to `src/assets/images/`; replaced all `<img>` tags with Astro `<Image>` component — total image weight 11.8 MB → 487 KB (−96%) (#35)
- Keyboard navigation audit — mobile menu: added focus trap (Tab/Shift+Tab cycle), focus-on-open (first nav link), Escape-to-close, focus restoration to hamburger; scroll lock now covers both `<html>` and `<body>` (#36)

### Shows action UX polish (2026-04-14) — PR #38 follow-up
- Show detail pages: all actions grouped below the details card and above tags/body, with shorter labels and left-aligned icons
- Show list pages: per-card actions collapsed into a three-dot overflow menu to reduce horizontal crowding
- Mobile cards: overflow trigger overlays the event image; tablet/desktop cards keep the trigger in the content column
- Share controls and action labels stay localized across EN/BG and use the same icon treatment/fallback behavior
- Shows list/detail action styling iterated after preview feedback to behave correctly across mobile, tablet, and desktop layouts

### Event localisation + enrichment infrastructure (2026-04-13) — PR #38 open
- Added localised content fields to `Event` interface: `titleEn/Bg`, `descriptionEn/Bg`, `bodyEn/Bg`, `tagsBg`, `admission.noteBg`
- Added `formatTimezoneLabel()` helper — extracts "GMT+3" / "UTC" from ISO date offset
- EN/BG detail pages resolve locale-specific fields with fallback chain; time row shows timezone (e.g. "19:00 · GMT+3")
- BG list and detail pages use `tagsBg ?? tags`, `descriptionBg`, `titleBg` with fallbacks
- Search index uses locale-specific title, description, and tags for each locale
- `docs/ai/event-enrichment.md` — comprehensive guide for enriching, translating, and creating events (generic, not Facebook-specific)
- **Full Data Enrichment**: All 53 events in the collection have been fully enriched with bilingual content (EN + BG), localized tags, and validated metadata. Placeholder dummy content has been replaced with realistic/historical data. (2026-04-14)

### Facebook Events scraper (2026-04-13) — PR #38 open
- New script `scripts/scrape-facebook-events.mjs` — scrapes all public events from Facebook page using `facebook-event-scraper` npm package
- **Individual File Output**: Refactored scraper to write each event as a separate JSON file in the Content Collection directory. (2026-04-14)
- Playwright-based full URL enumeration scrolls past "Load More"; falls back gracefully if browser deps missing
- Downloads cover images to `public/images/events/fb-{id}.jpg`; extra photos → gallery
- Maps Facebook `EventData` → site `Event` schema: wall-clock ISO dates, slugs, venue/city/country, hosts, endDate, categories→tags, usersResponded, isCanceled
- Handles Facebook's non-IANA timezone format (`UTC+03`) via manual offset arithmetic in `toWallClockISO()`
- Merges with existing events in the collection: Facebook events matched by `facebookId`, manual events (no `facebookId`) preserved unchanged
- CLI flags: `--dry-run`, `--upcoming`, `--past`, `--no-browser`; 1500ms delay between fetches
- Added `facebookId`, `sourceUrl`, `endDate`, `hosts`, `usersResponded`, `isCanceled` to `Event` interface
- `eventFeatures` config in `src/config/site.ts`: globally toggle `showEndTime`, `showHosts`, `showUsersResponded`, `showCanceledBadge`
- Shows detail pages (EN + BG): end time, hosts, attendance count, canceled badge — all gated by feature flags
- Events collection populated with 8 real past events from Facebook (confirmed: 8 is complete — Playwright scroll found no more)
- Follow-up fixes from review/testing: removed unsafe collection casts, fixed workflow paths to `src/content/shows/`, restored `gallery` + `_overrides` schema fields, fixed scraper runtime/loadExistingEvents issue, and stopped invalid fallback event writes
- Audited and corrected additional Sofia/Bulgaria event timestamps where the stored ISO time clearly contradicted the event copy
- Follow-up data cleanup: renamed malformed show slugs/filenames to stable descriptive values and corrected a remaining user-visible typo in event copy
- `src/lib/events.ts` now caches the `shows` collection at module scope so repeated helpers/pages reuse the same loaded dataset during builds
- Copilot review was re-requested repeatedly on 2026-04-14 until no further inline feedback remained on the latest branch head (`dd4cb61`)

### Nav localisation + home card content (2026-04-12) — PRs #32–#33
- Localised mobile nav controls: "Toggle Theme" and "Language" labels now use the i18n dictionary in both EN and BG (#32)
- Fixed mobile theme toggle active state — removed left-border selection style that incorrectly treated it as a nav item (#32)
- Improved focus-visible ring: `focus-visible` (keyboard only) instead of `focus`, combined selector in `global.css` with border-radius preserved for links (#32)
- Homepage shows card: populated with next 3 upcoming events (date, title linked to detail page, venue/city); empty-state fallback retained (#33)
- Homepage video card: added `description` field below title to fill dead whitespace (#33)
- Added `parseWallClockDate()` to `src/lib/events.ts` — robust ISO parser (regex + range validation + post-construction UTC check) ensuring timezone-stable output on CI/Cloudflare (#33)
- Fixed `formatEventDate`: `toLocaleDateString` → `toLocaleString` so time fields are not silently dropped (#33)
- Added `formatShortDate()` helper for compact date display; moved date formatting to Astro frontmatter (#33)

---

## ⏭ Next

### Content
- Write Privacy Policy content when data collection begins
- **Add BG blog posts** (`src/content/blog/bg/` — BG blog/news support exists in code, but no BG posts exist yet)
- Add press assets to `public/press/` (photos, logo, tech rider)
- Replace remaining placeholder/demo content before full launch (e.g. demo news posts, placeholder images/data)

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

1. **Real URLs** — Bandcamp, Spotify, Instagram, Facebook, YouTube, contact email
2. **Press assets** — When will real press photos, logo, and tech rider be available?
3. **Newsletter** — Is Mailchimp the final choice? What is the list signup URL?
4. **Analytics** — Should analytics be added? If so, which tool?
5. **Google Calendar** — Should future event management pull from a calendar?

---

## 🔢 Build Status

```bash
npm run build   # Expected: 142 pages, 0 errors
npm run dev     # Expected: http://localhost:4321
```

See `README.md` for full verification checklist and content management guide.
