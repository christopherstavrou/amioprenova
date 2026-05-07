# Tech Debt

Running log of known issues, missing pieces, and deferred refactors. Add an entry when you spot something during a PR but the fix is out of scope. Remove the entry in the same commit that fixes the issue.

What belongs here: pre-existing duplication, not-yet-i18n strings, missing tests, dead code paths, stale references, deferred refactors.

What does **not** belong here: items blocked on owner input — real URLs, affiliate links, real photos, etc. Those stay as `// TODO:` comments next to the empty value (see [`src/config/site.ts`](../../src/config/site.ts)). The umbrella is tracked in [`progress.md`](./progress.md) "Open Questions".

## How to use

**Add an entry** when you spot a gap during a PR but the fix would expand scope:

```
- area: <one of: i18n | a11y | content | refactor | types | build | tests>
  where: <file:line or path glob>
  what: <single-sentence description of the gap>
  suggested fix: <one sentence — optional>
```

Append under the correct area heading below. No date field — git blame supplies it.

**Remove an entry** in the same commit that fixes the issue. Mention the removal in the PR description so reviewers can verify.

**Stale items** (older than ~6 months by git blame, still unaddressed): get a brief audit pass when `progress.md` is next updated — promote to immediate work, refine the description, or delete if no longer relevant.

---

## i18n

## content

- area: content
  where: `src/data/cake-and-jazz.json` lines 5, 12, 19, 26
  what: four `placehold.co` URLs are still in place where real video thumbnails and gallery photos belong.
  suggested fix: replace with real assets when the artist supplies them; until then leave the placeholders so the page renders.

## refactor

- area: refactor
  where: `scripts/scrape-facebook-events.mjs`
  what: 700-line monolithic scraper — field mapping, rate-limit logic, image download, and `_overrides` merge all live in one file.
  suggested fix: split into focused modules (fetcher, mapper, image-handler, merge) when the scraping behaviour needs a significant rework; no urgency while the script is stable.

