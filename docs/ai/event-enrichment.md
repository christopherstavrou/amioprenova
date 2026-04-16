# Event Enrichment Guide

A generic, reusable guide for AI agents enriching or creating event entries in `src/content/shows/`. Applicable to any event — scraped from Facebook, entered manually, or created from scratch.

## Purpose & When to Run

- After every Facebook scraper batch to fill gaps the scraper cannot determine
- When Ami provides details about a specific show (new booking, historical gig, flyer, venue email)
- When creating a brand-new event entry from scratch
- On demand for any single event when new information becomes available
- As a full-dataset quality pass at any time

## Prerequisites

- Web search access (to look up venues, confirm city/country, check ticket URLs)
- Read/write access to `src/content/shows/`
- Run `npm run build` after changes to verify (expected: 0 errors, 142 pages)

## Modes of Operation

Determine which mode applies from user instructions:

1. **Enrich existing** — one or more events are already in `src/content/shows/`; fill gaps and improve quality
2. **Create new** — given raw information (title, date, venue, description, flyer, URL); build a complete entry as a new JSON file in `src/content/shows/`
3. **Full pass** — enrich all events; process in batches of ~10 and run `npm run build` after each batch

### Creating a new event

- Generate `slug` from title + year: lowercase, spaces → hyphens, strip punctuation (e.g. `jazz-at-homs-2025`)
- Generate `id`: use the Facebook event ID if available, otherwise a timestamp string (e.g. `"1744567890123"`)
- Create a new file `src/content/shows/[slug].json`
- Lock every field you set with `_overrides`

## Gap Identification

Run before touching any event to see what needs work:

```bash
node -e "const fs=require('fs'); const path=require('path'); const dir='./src/content/shows'; const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json')); files.forEach(f=>{ const ev=JSON.parse(fs.readFileSync(path.join(dir,f))); const gaps=[]; if(!ev.description||ev.description.length<20)gaps.push('description'); if(!ev.descriptionEn)gaps.push('descriptionEn'); if(!ev.descriptionBg)gaps.push('descriptionBg'); if(!ev.bodyBg&&ev.body)gaps.push('bodyBg'); if(!ev.country)gaps.push('country'); if(!ev.city)gaps.push('city'); if(!ev.tags||ev.tags.length===0)gaps.push('tags'); if(!ev.tagsBg||ev.tagsBg.length===0)gaps.push('tagsBg'); if(!ev.image||ev.image.includes('picsum'))gaps.push('image'); if(!ev.eventType)gaps.push('eventType'); if(!ev.admission)gaps.push('admission'); if(gaps.length)console.log('file='+f+' '+ev.title.slice(0,40)+': '+gaps.join(', ')); });"
```

## Field-by-Field Guide

### Identity fields — never change

| Field | Rule |
|-------|------|
| `title` | Never change — used in slug, URLs, and as fallback for both locales |
| `slug` | Never change |
| `id` / `facebookId` | Never change |
| `startDate` / `endDate` | Never change |
| `image` | **NEVER change an existing image path** (e.g. `/images/events/fb-...`) unless explicitly told by the user. Only set this field if it is currently empty or using a `picsum.photos` / `placehold.co` placeholder. |

### Localised content

All text content visible to users must be available in both English and Bulgarian. The site resolves locale-specific fields with a fallback chain:

- EN pages use: `titleEn || (titleBg ? '' : title) || title`
- BG pages use: `titleBg || (titleEn ? '' : title) || title`
- Body logic: `bodyEn || (bodyBg ? '' : body) || ''`

| Field | Rule |
|-------|------|
| `titleEn` | Write an English title if `title` is in Bulgarian. Omit if `title` is already English. Lock. |
| `titleBg` | Write a Bulgarian title if `title` is in English. Omit if `title` is already Bulgarian. Lock. |
| `description` | Canonical English fallback for both locales and for HTML meta tags. If empty or <30 chars: write a clean 1–2 sentence English summary from title + venue + body. No emoji. Max 200 chars. Lock. |
| `descriptionEn` | English short description for EN pages and meta. Set if `description` is in Bulgarian or a better English phrasing exists. Max 200 chars, no emoji. Lock. |
| `descriptionBg` | Bulgarian short description for BG pages and meta. Always set — translate `descriptionEn ?? description`. Max 200 chars, no emoji. Lock. |
| `body` | Scraped body text — canonical fallback for both locales. Only fix structural issues (broken encoding, stray URLs). |
| `bodyEn` | English body text. Set if `body` is in Bulgarian. Omit if `body` is already English. Lock. |
| `bodyBg` | Bulgarian body text. Set for every event that has a `body`. Translate `bodyEn ?? body`. Lock. |

### Structured fields

| Field | Rule |
|-------|------|
| `venue` | Fix obvious scraper mistakes (street address stored as venue name). Lock. |
| `city` | Infer from venue name (known venues), address in body, or web search. Lock. |
| `country` | Same as city. Use display names: "UK" not "United Kingdom", "USA" not "United States". Lock. |
| `hosts` | Leave as scraped. Remove duplicates of artist name/page and venue name. |
| `tags` | See Tag Taxonomy below. Lowercase English. Include venue slug, city, country. 3–8 tags. Lock. |
| `tagsBg` | Bulgarian equivalents of `tags`. City/country use BG names (e.g. `sofia` → `София`). Venue slugs identical to EN. Lock. |
| `image` | If missing or `picsum.photos`: find via web search of venue/event, or generate using an image model. Store at `/images/events/[slug].jpg`. Lock. |
| `ticketUrl` | Scan body text for URLs. Verify live. If found, set and lock. If body says "free", set `admission.type` instead. |
| `mapUrl` | If missing: construct `https://maps.google.com/?q=[venue+city]` from venue and city. |
| `admission` | If not set: scan body for price patterns (`\d+\s*лв`, `£\d`, `€\d`, `free`, `вход свободен`, `дарение`). Fill `type` + `price` + `note`. Lock. |
| `admission.note` | English booking or exception note (e.g. "Reservations via Eventbrite"). |
| `admission.noteBg` | Bulgarian translation of `admission.note`. Set whenever `admission.note` is set. Lock. |
| `eventType` | If not set: infer from title/body keywords (see EventType values below). Lock. |

**Valid `eventType` values:** `concert`, `jam`, `collaboration`, `charity`, `album-launch`, `workshop`, `birthday`

**Valid `admission.type` values:** `free`, `free-booking`, `paid`, `donation`

## Tag Taxonomy

Tags must use the controlled vocabulary below — do not invent new terms. Always include location tags (venue slug + city + country) when known.

### Controlled vocabulary (English)

**Genre:** `jazz`, `swing`, `gypsy-swing`, `bossa-nova`, `blues`, `vocal-jazz`, `folk`, `classical`

**Event format:** `concert`, `jam-session`, `workshop`, `masterclass`, `album-launch`, `livestream`

**Mood/style:** `intimate`, `festive`, `birthday`, `christmas`, `charity`, `outdoor`

**Collaboration:** `duo`, `trio`, `quartet`, `quintet`, `ensemble`, `guest-vocalist`

**Location (always include if known):**
- City (lowercase): `sofia`, `london`, `plovdiv`, `varna`, `birmingham`, `aberdeen`
- Country (lowercase): `bulgaria`, `uk`, `italy`
- Venue slug (lowercase, spaces→hyphens, strip apostrophes): `homs`, `bar-national`, `toulouse-lautrec`, `ronnie-scotts`, `le-quecumbar`

**Venue type:** `bar`, `club`, `church`, `theatre`, `cafe`, `mall`, `festival`

### Bulgarian equivalents (`tagsBg`)

| EN | BG |
|----|----|
| jazz | джаз |
| swing | суинг |
| gypsy-swing | циганско суинг |
| bossa-nova | боса нова |
| blues | блус |
| vocal-jazz | вокален джаз |
| concert | концерт |
| jam-session | джем сесия |
| workshop | майсторски клас |
| masterclass | майсторски клас |
| album-launch | представяне на албум |
| livestream | онлайн излъчване |
| outdoor | на открито |
| intimate | камерен |
| festive | празничен |
| birthday | рождено тържество |
| christmas | коледен |
| charity | благотворетилен |
| duo | дует |
| trio | трио |
| quartet | квартет |
| quintet | квинтет |
| guest-vocalist | гост вокалист |
| sofia | София |
| plovdiv | Пловдив |
| varna | Варна |
| london | Лондон |
| birmingham | Бирмингам |
| aberdeen | Абърдийн |
| bulgaria | България |
| uk | Великобритания |
| italy | Италия |
| bar | бар |
| club | клуб |
| church | църква |
| theatre | театър |
| cafe | кафе |
| festival | фестивал |

**Venue slug tags** (`homs`, `bar-national`, etc.) are identifiers, not display text — use the same value in both `tags` and `tagsBg`.

## Override Policy

`_overrides` protects manually curated fields from being overwritten by the scraper.

```json
"_overrides": {
  "city": "locked",
  "country": "locked",
  "tags": "locked"
}
```

| Policy | Meaning |
|--------|---------|
| `"locked"` | Never overwrite, regardless of scraped value |
| `"fallback"` | Use scraped value if non-empty; keep manual value as fallback |
| absent | Scraper owns the field |

Rules:
- Every field you set manually → add to `_overrides` as `"locked"`
- High-confidence inference (city from known venue, country from city) → `"locked"`
- Lower-confidence inference (ticket URL from body text that may be expired) → `"fallback"`

## Quality Checklist (per event)

- [ ] `description` is 20–200 chars, no emoji, no URLs (EN fallback for meta tags)
- [ ] `descriptionEn` set if `description` is in Bulgarian
- [ ] `descriptionBg` set — Bulgarian short description for BG pages
- [ ] `bodyBg` set for every event that has body text
- [ ] `bodyEn` set if `body` is in Bulgarian
- [ ] `titleEn` set if `title` is in Bulgarian; `titleBg` set if `title` is in English
- [ ] `city` and `country` populated
- [ ] `tags` uses controlled vocabulary, lowercase, includes venue slug + city + country
- [ ] `tagsBg` set and matches `tags` count
- [ ] `admission.noteBg` set whenever `admission.note` is set
- [ ] `image` is a real local path or verified external URL (not `picsum.photos`)
- [ ] `admission` set where determinable from body
- [ ] `eventType` set
- [ ] `_overrides` locks every manually curated field
