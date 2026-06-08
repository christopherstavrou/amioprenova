# Performance baseline (#225)

First recorded performance baseline for the site, plus the easy wins applied in the
overnight compliance/fundamentals batch. This is the "prove the fundamentals" half of
the top-1% roadmap (the a11y half is `docs/ai/ui-audit.md` / #186).

## How this was measured

Local `astro preview` build, Playwright + `web-vitals` (page weight = sum of
`content-length` over all responses). **Caveat:** local TTFB/LCP are not representative of
production (no real network / Cloudflare CDN). Use these for **relative page weight, request
count, and layout-shift** signal; run Lighthouse / PageSpeed Insights against the live
`amioprenova.com` for authoritative Core Web Vitals once deployed.

## Baseline (per page, local build — 2026-06-09)

| Page | Requests | Transfer (KB) | FCP (ms) |
|---|---|---|---|
| `/en/` (home) | 13 | 576 | ~230 |
| `/en/shows/` | 12 | 531 | ~155 |
| `/en/news/` | 10 | 252 | ~160 |
| `/en/about` | 13 | 413 | ~185 |
| `/en/press` | 8 | 126 | ~205 |
| `/en/privacy` | 8 | 126 | ~175 |
| `/en/video` | 17 | 217 | ~180 |

FCP is excellent across the board locally. Homepage is the heaviest (hero image + Bandcamp
cover art + fonts). LCP/CLS need a production Lighthouse run to be meaningful.

## Wins applied in this batch

- **Self-hosted fonts** (was a Google Fonts CSS `@import`). Removes a render-blocking
  third-party import chain *and* the per-load request to Google (privacy/GDPR — see the
  privacy policy + decisions). Only the needed subsets load per locale (latin for EN,
  cyrillic added for BG), `font-display: swap`. Files in `public/fonts/`, declared in
  `src/styles/fonts.css`.
- **Self-hosted video thumbnails** (#180) — were hot-linked from `img.youtube.com`; now
  local under `public/video-thumbs/`, removing a third-party origin on the homepage/video pages.
- Below-the-fold images already use `loading="lazy"`; hero is `eager` (correct for LCP).

## Budget / next steps (not yet automated)

- **Target:** Core Web Vitals all green on production (LCP < 2.5s, INP < 200ms, CLS < 0.1),
  Lighthouse perf ≥ 90 on key templates.
- **Suggested budget** once a Lighthouse-CI step is added: homepage ≤ ~650 KB transfer, ≤ 15
  requests; other pages ≤ ~450 KB. The numbers above are the starting point.
- **Further wins when needed:** optimise/serve the Bandcamp cover art locally via Astro's
  `<Image>` (currently remote `<img>` on home/music), `preconnect` to `f4.bcbits.com`, and
  responsive `srcset` for the hero. Deferred — measure on production first.
- CI enforcement (Lighthouse-CI assertion) is **not** added overnight to avoid flakiness;
  tracked as the budget part of #225.
