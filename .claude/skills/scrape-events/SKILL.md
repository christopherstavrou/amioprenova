---
name: scrape-events
description: Run the Facebook events scraper to refresh src/content/shows/ from the public Facebook page. Use when the user asks to scrape, sync, refresh, or pull the latest events from Facebook, or when a new show has appeared on the Facebook page that should be on the site.
---

# Scrape Facebook events

This skill is a wrapper around [`scripts/scrape-facebook-events.mjs`](../../../scripts/scrape-facebook-events.mjs), which pulls events from `https://www.facebook.com/amioprenovamusic/events`, maps them to the site's event schema, downloads cover images, and writes one JSON file per event into [`src/content/shows/`](../../../src/content/shows/).

The scheduled GitHub Action at [`.github/workflows/scrape-events.yml`](../../../.github/workflows/scrape-events.yml) runs this automatically every Monday at 08:00 UTC, so manual runs are usually only needed when:

- A new show has just appeared on Facebook and the artist wants it live before the next scheduled run.
- The user is testing scraper changes locally.
- The user wants to pull *only* upcoming events to refresh attendance counts without touching past ones.

## Commands

```bash
# Full sync — upcoming + past
node scripts/scrape-facebook-events.mjs

# Inspect output without writing files
node scripts/scrape-facebook-events.mjs --dry-run

# Upcoming events only (faster; no risk of touching historical entries)
node scripts/scrape-facebook-events.mjs --upcoming

# Past events only
node scripts/scrape-facebook-events.mjs --past

# Skip Playwright enumeration (faster but may miss older paginated events)
node scripts/scrape-facebook-events.mjs --no-browser
```

## How field protection works

The scraper respects the `_overrides` map on each event. Per-field policies:

- `"locked"` — never overwritten, regardless of the scraped value.
- `"fallback"` — overwritten only if the scraped value is non-empty.
- *(absent)* — scraper owns the field; latest scraped value wins.

Fields `admission`, `eventType`, and `_overrides` itself are never written by the scraper — they are human-managed only. See [`docs/ai/decisions.md`](../../../docs/ai/decisions.md) §"_overrides Field for Human-Curated Fields" for the rationale.

## After scraping

1. `npm run build` — confirms the collection schema still validates.
2. `git status -- src/content/shows/ public/images/events/` — see what changed.
3. If new shows appeared with gaps (no `descriptionBg`, no `bodyBg`, no `tagsBg`), invoke the enrich-events skill.
4. Commit the result with `chore(events): sync Facebook events`.

## Cookies

If the scraper hits rate limits or empty results, Facebook may be requiring authentication. Drop a Cookie-Editor JSON export at `scripts/facebook-cookies.json` (gitignored — never commit). The scraper auto-detects it.

## Things to never do

- Never commit `scripts/facebook-cookies.json` — it's a credential and is gitignored. Confirm before staging anything from `scripts/`.
- Never run the scraper against a Facebook page other than the artist's own without explicit instruction.
- Never tweak `admission`, `eventType`, or `_overrides` from scraper output — those are owned by human edits via the enrich-events workflow.
