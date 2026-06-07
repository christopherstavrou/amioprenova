# UI/UX Audit — 2026-06-08

Systematic page-by-page audit done by seeding edge-case **test fixtures**
(`test-*` content, excluded from production — see `src/lib/test-fixtures.ts`) and
screenshotting every page across **EN/BG**, **light/dark**, and
**mobile/tablet/desktop**, exercising real interactions (filters, mobile menu,
pagination, locale fallback).

**Headline:** the site is **visually robust** — long titles wrap without overflow,
many tags/hosts wrap cleanly, empty galleries and missing images are handled, dark
mode is solid, and faceted search works. Most findings are **code-level i18n/a11y
details** and **content gaps** (owner-dependent), not layout breakage.

Legend — **Sev:** H/M/L · **Type:** `bug` / `improvement` / `ami` (owner decision/content).

---

## Cross-cutting findings

| # | Sev | Type | Finding | Where |
|---|-----|------|---------|-------|
| C1 | M | bug | **Country/city not localized on BG pages** — BG event cards & detail show e.g. `Ruse, Bulgaria` instead of `Русе, България`. `country`/`city` are stored as English strings and rendered as-is on `/bg`. Affects every event. Needs a country (and ideally city) display map keyed by locale. | `ShowCard.astro`, `src/pages/*/shows/[slug].astro` location line; data in `src/content/shows/*` |
| C2 | M | bug | **Mobile menu stays open on viewport resize** mobile→desktop (stale state, no `matchMedia` reset). | `src/layouts/Layout.astro` menu script |
| C3 | L→M | bug | **EN news detail gallery heading hardcoded** `<h2>Gallery</h2>` (BG is translated). Use existing `t.shows.detail.gallery`. | `src/pages/en/news/[slug].astro:~79` |
| C4 | L | improvement | **Theme/language toggles lack ARIA** (`role="switch"`/`aria-pressed`); language switch reloads with no announcement. Overlaps #186. | `src/layouts/Layout.astro` |
| C5 | L | bug | **Inline video has no embed-failure fallback** — a bad/blocked embed shows a blank black box. | `src/scripts/inline-video.ts` |
| C6 | L | improvement | **ShowActionsMenu panel** is `right-0 top-full` — verify it doesn't clip off-screen near the right edge on very narrow viewports (not reproduced in static audit; needs interaction check). | `src/components/ShowActionsMenu.astro` |
| C7 | L | improvement | **Dark-mode filter `<select>` chevron** uses hardcoded `stroke=%23999999`. Looked acceptable in the audit but isn't theme-aware — switch to `currentColor`/token. | `src/styles/global.css` (select bg) |
| C8 | — | (tracked) | **YouTube thumbnails + embeds load from `youtube.com`** on render (confirmed on Video/home/cake-jazz) — pre-consent tracking. Already tracked as **#180**. | video pages, `inline-video.ts` |

---

## Per-page notes

- **Home** (`/en`, `/bg`): solid light & dark. Content (release, featured video,
  socials, newsletter) is placeholder/inert — see A-items. Newsletter posts to an
  empty `mailchimpSignupUrl` (config gap → #182/#183). Tablet (1024px) correctly
  shows the hamburger (nav cutover at 1180px works).
- **Shows list / archive**: clean; pagination (`Page 1 of 4`), archive teaser, cards
  all good. "SCHEDULED" badge shows on **every upcoming detail page** (see A-item /
  L-improvement — possibly noise; decide whether to suppress).
- **Shows search**: faceted filters work (Type facet now populated); filtering +
  Clear button correct. *(Empty-results state not captured — verify separately.)*
- **Shows detail** (all edge cases): long title wraps (mobile too), 10+ hosts wrap in
  the detail table without overflow, 16 tags wrap across rows, minimal event renders
  with no broken image, empty gallery correctly hides the section, BG locale fallback
  works (English title kept, all chrome translated) — **except C1** (country/city).
- **News list** (`/en`): hero + rows good, long-title hero wraps, no-image row fine,
  reading-time shown. **BG news (`/bg/news`) has no real posts** → A-item.
- **News detail**: fine; **C3** gallery heading.
- **About / Music / Video / Cake & Jazz / Contact**: render well; content is
  placeholder (bios, releases, videos) → A-items. Video grid loads YouTube thumbs (C8).
- **Press**: layout fine; **bio, Genre, RIYL, and downloadable assets (photos, logo,
  rider) are placeholders** → A-item.
- **Privacy**: literally "Privacy page placeholder" → **#179**. No footer with a
  privacy link → **#184**.
- **Root `/`** and **404**: fine.

---

## For Ami (content & decisions)

These are not bugs — they need the owner's content or a call. Feed into the #189 drip.

- **A1 — BG news is empty.** No real Bulgarian posts exist; the BG audience sees an
  empty News section in production. Decide: translate posts, write BG-original posts,
  or hide News on the BG site until there's content.
- **A2 — Press kit is placeholder.** Real short/long bio, Genre tags, "Recommended If
  You Like" artists, and real downloadable assets (press photos, logo, technical
  rider) all needed. (Maps to #189 #2 bio / #4 details.)
- **A3 — Homepage & section content is placeholder** — featured release, featured
  video, social links, About copy, imagery. (Maps to #189 #1 photos, #3 music, #5
  page-by-page.)
- **A4 — "SCHEDULED" status badge** appears on every upcoming event detail page —
  confirm whether that's wanted or should be suppressed (it's arguably noise).
- **A5 — Privacy policy wording** (the real content) — #179 will draft; Ami approves.

---

## Candidate issues (Phase D — pending review)

Owner-independent → propose for the **"Release-ready foundation"** milestone:
C1 (BG country/city i18n), C2 (mobile-menu resize), C3 (EN gallery heading), C4/C5/C7
(a11y + dark chevron — could fold into #186), C6 (verify menu clipping).
Already tracked: C8 → #180; privacy/footer → #179/#184; config gaps → #182/#183.

Owner-dependent → fold into the #189 Ami sequence: A1–A5.
