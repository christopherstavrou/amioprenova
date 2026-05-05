---
name: enrich-events
description: Enrich, translate, or create event entries in src/content/shows/. Use when the user asks to fill gaps in show data, translate event copy to Bulgarian, lock human-curated fields against the scraper, or build a brand-new event entry. Also fits "process the shows the scraper just produced" or "translate this event into BG."
---

# Enrich events

This skill is a discoverability wrapper for [`docs/ai/event-enrichment.md`](../../../docs/ai/event-enrichment.md), which is the authoritative agent-agnostic guide. **Read that file before doing any work** — it has the field-by-field rules, the controlled tag vocabulary (EN + BG), the override policy, and the per-event quality checklist.

## When to use this skill

- The user has just run the Facebook scraper and asks to "process" or "enrich" the result.
- The user provides raw information for a new show and asks to add it to the site.
- The user asks to translate an event into Bulgarian.
- The user asks to "lock" specific fields so the scraper can't overwrite them.
- A full-dataset quality pass — usually phrased as "go through every event and fix gaps."

## Quick orientation

Events live as one JSON file per show in [`src/content/shows/`](../../../src/content/shows/), validated by the Zod schema at the top of [`src/content.config.ts`](../../../src/content.config.ts). The TypeScript type for an event is `Event` in [`src/lib/events.ts`](../../../src/lib/events.ts).

Every locale-specific text field has a clear contract — see the field-by-field guide in `docs/ai/event-enrichment.md`. The most common gaps:

- `descriptionBg` (BG short description) — should be set on every event
- `bodyBg` (BG long body) — should be set on every event that has `body`
- `tagsBg` (BG tag mirror) — should match `tags` in count
- `admission.noteBg` — set whenever `admission.note` is set
- `_overrides` map — every manually curated field should be locked

## Gap detection

The fastest way to see what needs work across the whole collection:

```bash
node --input-type=module -e "
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
const dir = './src/content/shows';
for (const f of readdirSync(dir).filter(f => f.endsWith('.json'))) {
  const ev = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const gaps = [];
  if (!ev.description || ev.description.length < 20) gaps.push('description');
  if (!ev.descriptionBg) gaps.push('descriptionBg');
  if (!ev.bodyBg && ev.body) gaps.push('bodyBg');
  if (!ev.country) gaps.push('country');
  if (!ev.city) gaps.push('city');
  if (!ev.tags || ev.tags.length === 0) gaps.push('tags');
  if (!ev.tagsBg || ev.tagsBg.length === 0) gaps.push('tagsBg');
  if (!ev.image || ev.image.includes('picsum')) gaps.push('image');
  if (!ev.eventType) gaps.push('eventType');
  if (!ev.admission) gaps.push('admission');
  if (gaps.length) console.log(\`\${f}  \${ev.title.slice(0, 40)}: \${gaps.join(', ')}\`);
}
"
```

## Workflow

1. Read [`docs/ai/event-enrichment.md`](../../../docs/ai/event-enrichment.md) end-to-end.
2. Run gap detection (above) to scope the work.
3. Process events in batches of ~10. After each batch, run `npm run build` — collection schema errors surface there.
4. For every field you set manually, add a `"locked"` entry in `_overrides` so the scraper can't undo your work.
5. When complete, update `docs/ai/progress.md` with a one-line note.

## Things to never do

- Never change `id`, `slug`, `title`, `startDate`, or `facebookId` once set.
- Never overwrite an existing `image` path (e.g. `/images/events/fb-...`) unless the user explicitly asks. Only set `image` when it is missing or a placeholder.
- Never invent tags — use the controlled vocabulary in `docs/ai/event-enrichment.md`.
- Never skip the `_overrides` lock on a field you just set — the next scraper run will silently undo it.
