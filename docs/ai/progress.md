# Project Progress

Session-to-session anchor for AI agents. Read this at the start of every session.

**Last updated**: 2026-06-07 (scraper lock fix released; scrape automation hardened)

---

## ✅ Done

### Scrape automation hardening (2026-06-07)
- **Root-cause fix released** — `events-scraper` 0.1.1 (sitekit#1) now honors
  `_overrides` locks and merges against existing files, ending the data
  clobbering that forced the #147 revert. Bumped the dependency to `^0.1.1`.
- **Rolling scrape branch (#152)** — `scrape-events.yml` resets a single
  `bot/scrape-events` branch on develop each run and reuses the open PR, so
  there are no stale/duplicate scrape PRs.
- **Auto-enrich (#151)** — after opening the rolling PR, the workflow posts an
  `@claude` comment (via `SCRAPE_TOKEN`, which passes claude.yml's
  author_association gate) asking the agent to run the `enrich-events` skill:
  translate EN↔BG, fill curated fields, set `_overrides` locks, normalise
  hosts/venue. Pipeline: scrape → auto-enrich → human review → merge.
- **Cron still paused** — re-enable the weekly schedule only after a manual
  `workflow_dispatch` run confirms locks are preserved and the enrich comment
  fires.

### Release flow & CI hardening (2026-06-01)

Sorted out the `develop`/`main` merge mechanics and tightened CI after the
web-kit merge surfaced gaps.

- **Release flow:** feature PRs squash-merge into `develop`; `develop → main`
  releases use a **merge commit** so the branches stay in sync (no back-merge).
  Enabled merge commits + turned OFF `required_linear_history` on `main` (it
  forbade merge commits); PR-required + enforce_admins + no-force-push/deletions
  unchanged. (#137, #139, #140, #143)
- **Quality gate** (`pr-quality.yml`) now **skips** release PRs (`develop→main`)
  and `bot/*` PRs (the scrape bot has no human Summary). (#139, #141)
- **CodeQL** `pull_request` now covers `develop` (feature PRs target develop, so
  they previously had no PR-time security scan). (#141)
- **Required status checks on `develop`** (enforced for admins): `PR quality
  gate`, `Analyze (javascript-typescript)`, `Cloudflare Pages` — a red check now
  actually blocks a merge. (#141)
- Post-mortem updated with the squash-divergence + CI lessons (#142). Note on
  release PRs: GitHub shows `BLOCKED` while checks run, then `UNSTABLE` (the
  skipped `claude` check) — safe to `gh pr merge --merge` once checks are green.

### Web-kit extraction → @christopherstavrou packages (2026-05-31) — merged via PR #136, epic #125

Extracted the reusable building blocks into the private **sitekit** monorepo,
published privately to **GitHub Packages**, and migrated amioprenova to consume
them as versioned deps. **Merged** (`feature/web-kit → develop`, PR #136) and
released to `main` (PR #137); ~2,700 fewer lines in the site.

- **Packages** (`@christopherstavrou/* @ 0.1.0`): `theme` (CSS-var tokens +
  Tailwind preset), `ui` (Badge/Button/Card/BackLink/PageHeader/SectionHeader/
  SocialIcon/Pagination/SearchInput/GalleryLightbox/SharePopover), `search`
  (`mountFacetedSearch` faceting engine), `events-scraper` (FB scraper CLI).
- **Adoption:** local components deleted; imports point at the packages; tokens
  via `@christopherstavrou/theme` (global.css `@import` + Tailwind preset);
  the 4 search pages call `mountFacetedSearch`; scrape workflow uses the bin.
- **Distribution:** private GitHub Packages; install needs `NODE_AUTH_TOKEN`
  (read:packages PAT) in local + Actions secret + Cloudflare env (Production
  **and** Preview). Submodule removed. Cloudflare preview green.
- **Branch protection:** `main`/`develop` require PRs (enforced for admins);
  scrape workflow opens a PR instead of pushing to develop.
- Docs: "Consuming the sitekit web kit" section in `workflow.md`; sitekit repo
  has its own `AGENTS.md` + `docs/ai/`.

### Rollback to PR #47 baseline (2026-05-29)
- Rolled back both `main` and `develop` to commit `032ec69` (PR #47) via `rollback-prep` branch
- **Reason:** soft-launch gate (`public/_redirects` + `functions/_middleware.ts`) was deleted without authorisation in commit `4ae27bb` (7 May 2026); `/en/` and `/bg/` were publicly accessible on production
- **Discarded:** develop was 16 commits ahead of main with unvalidated overnight batch work (PRs #95–#109)
- **Preserved:** CI quality gate (`pr-quality.yml`), improved `claude.yml` checkout logic, updated workflow docs, PR/issue templates, component quality improvements (GalleryLightbox/SharePopover `.ts` extraction, component docstring cleanup, `package.json` peer-dep overrides)
- **All discarded source work tracked as open issues:** #63, #67, #70, #72, #73, #75, #76, #78, #80, #81, #83, #84, #87, #110, #111
- **Site status:** soft launch active — `/en/*` and `/bg/*` redirect to `/`; sitemap disabled

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

### Overnight batch — all open issues (2026-05-30) — branch `feature/overnight-batch`

Implemented all actionable open issues from the GitHub issue tracker in a single branch. One commit per issue.

- **#121** — Fixed `scrape-events.yml`: checkout + push to `develop` (was `main`), added `git pull --rebase`, upgraded action versions
- **#70** — BG translations complete: all show JSON files have `titleBg`, `descriptionBg`, `bodyBg`
- **#66** — Cancelled badge on shows list page cards (EN + BG)
- **#67** — Shows i18n refactor: all hardcoded labels moved to `ui.ts`; field labels, button text, admission strings, gallery labels, event type labels
- **#63** — `schema.org/Event` JSON-LD injected on show detail pages via `<slot name="head">` in Layout
- **#78** — Shared `Pagination.astro` component — used by all 4 list pages (shows + news, EN + BG)
- **#72** — Shared `ShowsList.astro` component — upcoming shows pages are now thin wrappers
- **#80** — News card redesign: hero on page 1, `aspect-[4/3]` thumbnails, reading time, page size 12, removed "Read more →" and SharePopover
- **#81** — News hero card (first post on page 1 gets full-width hero layout)
- **#83** — `linksPage` config restructured in `site.ts` (sections, headings, labels, socialIcons, emailSignup)
- **#73** — Paginated archive route for past shows (`/en/shows/archive/[...page]`, `/bg/shows/archive/[...page]`)
- **#75** — Dedicated shows search page with upcoming/past grouping, result count
- **#74** — Upcoming shows page: past shows toggle removed, replaced with archive teaser line
- **#76** — Search bar redirects to dedicated search page on shows pages (via `searchAction` prop on ShowsList)
- **#77** — Magnifying glass submit button on SearchInput when in form/redirect mode
- **#79** — News search page + search bar redirect on news list pages
- **#85** — `LinkButton` and `LinkSection` components with glassmorphism styling
- **#84** — `LinksHero` component: avatar, name, tagline, theme toggle, language switcher, scroll indicator
- **#87** — `LinksShowTeaser` component: next 3 upcoming shows on links page
- **#88** — `LinksSocialStrip` (icon-only row) and `LinksEmailSignup` (mailto CTA) components

Skipped (owner input required or infra): #51, #64, #65, #68, #69, #71, #82, #86, #89, #90, #91, #92, #93, #94, #112, #113

### Search / card / detail UX polish (2026-05-30) — commit `74f54df`, merged develop → main

Follow-on UX work after the overnight batch. Single commit (`74f54df`), merged straight to `develop` then `main` (both now level).

- **Typeahead search** restored on list/archive pages (shows + news, EN + BG): debounced dropdown from `/search-index.json`, capped at 4 results, with a "See all results for …" row as the first item when 2+ matches exist (omitted when only one). Arrow-key nav, Enter, Escape, click-outside.
- **`SearchInput` redesign**: pill shape, outline search icon that warms to accent on focus, soft accent focus glow, animated clear (✕) button that fades/scales in when the field has content. Fixed a specificity bug where the global `input[type=text]` padding overrode `pl-10` (icon overlapped text) — `.search-pill` now sets padding with `!important`.
- **`ShowCard` uniformity**: cards look consistent with and without an image. Three cases — (A) image: badge+menu overlay the image on mobile, sit inline with the title on desktop; (B) no image, not cancelled: 3-dot menu inline next to title; (C) no image, cancelled: compact top bar. Cancelled badge and 3-dot trigger share the same frosted, accent-bordered styling.
- **Detail pages** (`[slug].astro`, EN + BG shows + news): standardized vertical spacing (uniform `mb-8`, fixed doubled title gap), cinematic hero crop (`aspect-video sm:aspect-[2/1]`), and an optional **Status row** at the top of the details table showing the cancelled badge. Date/time table layout left as-is.
- **`BackLink.astro`** — single shared component for all back/breadcrumb links. Accent colour + underline-on-hover + leading arrow (arrow lives in the component, not i18n strings). Used at **both top and bottom** of every subpage. Standardized labels in `ui.ts`: "Back to Shows" / "Back to News" / "Back to Home" (+ BG equivalents). 404's filled button intentionally left distinct.
- **Search pages**: split filters into tiers (scope pills row + dropdowns row), capped news tag pills at 10 with a "+N more" toggle, accent-filled active filter states, accent-coloured result count.
- **Filter pills / scope pills**: solid accent-filled active state for clear selection feedback.
- Added test fixture `test-cancelled-no-image-2026.json` so the cancelled-without-image card state has a page to QA.
- **Docs**: added a "Visual verification" section to `workflow.md` (Playwright screenshot loop at 390×844 / 1280×900). `.gitignore` now excludes the harness lock and throwaway `/shot.mjs` / `/screenshot*.mjs` scripts.

### Event status field + search filter redesign (2026-05-30) — commits `5c97309`, `6f6cc41`, merged develop → main

- **Proper status field** aligned to schema.org `EventStatusType`: new `status` enum (`scheduled/cancelled/postponed/rescheduled/moved-online`) on the shows schema; legacy `isCanceled` still maps to cancelled (scraper-safe). `getDisplayStatus()` resolves explicit status → derived `past` → `scheduled`; `schemaEventStatus()` feeds JSON-LD.
- Status badge renders wherever the cancelled badge did (card top-bar + detail status row). **Scheduled** shows in full search + detail, hidden on the main upcoming list. `scheduled`/`past` neutral styling; other statuses accent.
- **Search filter redesign**: scope pills → full **Status** dropdown (all statuses); location split into dependent **Country + City** (country narrows the city list); single-select + **Clear filters** link; mobile **collapsible "Filters" panel** with active-count badge, desktop single inline row. Cards carry `data-status/country/city`.
- Removed orphaned i18n keys + dead `ShowCard` props (`cancelled`/`pastLabel`/`showPastBadge`). Added test fixtures for every status across future/past dates.

### Faceted filters + month filter + filter polish (2026-05-31) — merged develop → main

Follow-on to the filter redesign, addressing review feedback.

- **Full faceting** on shows + news search: every dropdown hides options that would produce zero results given the other active filters, recomputed live (`recomputeFacets()` / `itemMatches(item, exceptFilter)` in each search page). The selected option always stays visible. This subsumes the earlier bespoke country→city dependency.
- **Month filter** added to shows + news (both locales): localized month names, only months present in the data, narrowed by the selected year (and everything else) via faceting. Default "All months".
- **Filter bar polish**: single-line toolbar on desktop (`bg-surface-muted` container, `sm:flex-1 sm:max-w-[12rem]` even widths, `sm:flex-nowrap`, Clear pinned right); custom dropdown chevron via `.filter-select` in `global.css` (fixes native arrow alignment across browsers/themes, mobile + desktop).
- **News filter unified with shows**: tag-pill wall replaced by a **Topics** dropdown alongside Year/Month inside the same collapsible "Filters" panel (mobile show/hide + active-count + Clear).
- **Detail status icon**: x-circle → neutral **flag**.

### Dependency bumps (2026-05-30) — commit `ffefa9b`, merged develop → main
- `astro` 6.1.5 → **6.4.2**, `@astrojs/sitemap` 3.7.2 → **3.7.3**.
- Applied directly (not via the stale Dependabot PRs #123/#124, which branched before the UI batch). Verified `npm run build` clean (0 errors, 0 warnings) against the full current tree before merging. PRs #123/#124 auto-closed; their branches deleted.

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
npm run build   # Expected: ~158 pages, 0 errors
npm run dev     # Expected: http://localhost:4321
```

See `README.md` for full verification checklist and content management guide.
