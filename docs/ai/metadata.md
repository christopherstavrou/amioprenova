# Site metadata & structured data

How the site describes itself to search engines and social platforms — what each
piece is, why it's there, what to include, and when to update it.

There are two layers:

1. **Page metadata** — `<title>`, description, canonical, Open Graph, Twitter cards.
   Rendered for *every* page by `src/layouts/Layout.astro`.
2. **Structured data (JSON-LD)** — schema.org objects describing the *meaning* of a
   page (the artist, an event, an album). Rendered as `<script type="application/ld+json">`.

---

## 1. Page metadata (`src/layouts/Layout.astro`)

Every page passes `title` + `description` to the layout, which emits:

| Tag | Why |
|---|---|
| `<title>` / `<meta name="description">` | The search-result headline + snippet. |
| `<link rel="canonical">` | Tells Google the one true URL, avoiding duplicate-content splits. |
| `og:*` (title, description, image, url, type, site_name, locale) | The card shown when a link is shared on Facebook / LinkedIn / etc. |
| `twitter:*` (card, title, description, image) | The card shown on Twitter/X. |

**What to include:** a unique, human title and a 1–2 sentence description per page.
The shared social image is `siteConfig.ogImage` (`/og-default.png`); pass a page-specific
`ogImage` only when a page deserves its own preview (e.g. a release).

**When to update:** whenever a page's purpose or title changes, or when we get a better
default social image.

---

## 2. Structured data / JSON-LD

Machine-readable facts. Humans never see it; search engines use it for rich results
(the artist knowledge panel, event date/venue rows, album listings).

### What we emit today

| Schema | Where | Source | Purpose |
|---|---|---|---|
| `MusicGroup` | Homepage (`/en/`, `/bg/`) | `src/lib/structured-data.ts` → `musicGroupJsonLd()` | Identifies the artist: name, description, genres, official profiles (`sameAs`), and discography (`album`). |
| `Event` | Each show detail page | `src/pages/{en,bg}/shows/[slug].astro` | Date, venue, location, status — eligible for the events rich result. |

The `MusicGroup` block is built from `siteConfig` (name, description, genres, social
URLs) and `src/data/releases.json` (one `MusicAlbum` per release, with cover + Bandcamp
link). Empty/missing fields are omitted automatically.

### What to include (and what not to)

- **Only assert what's true and verifiable.** Search engines penalise mismatches between
  structured data and visible content. Don't list an album we don't show, or claim a
  genre/nationality we can't back up.
- **`sameAs` = official profiles only** (Bandcamp, YouTube, Instagram, TikTok, Facebook,
  Spotify/Apple once verified). This is how Google links the site to her known accounts.
- Good future additions when the data exists: `foundingLocation`/`location`, individual
  `MusicRecording` tracks, a verified `logo`, and `Spotify`/`Apple Music` URLs in `sameAs`.

### When to update

| Trigger | Action |
|---|---|
| New release added to `releases.json` | Nothing — it flows into `album` automatically. |
| New official social/streaming profile | Add the URL to `siteConfig` (it joins `sameAs`). |
| Genres / artist description change | Edit `siteConfig.genres` / `siteConfig.artistDescription`. |
| New page type that represents a *thing* (person, FAQ, video) | Add a matching schema.org type. |

---

## How to test

1. **Validate the markup** — paste the rendered JSON into a validator (use the *Code*
   tab; our dev preview sits behind Cloudflare Access so the *URL* fetcher can't reach it):
   - https://validator.schema.org/
   - https://search.google.com/test/rich-results
2. **Inspect a built page**:
   ```bash
   npm run build
   grep -oP '<script type="application/ld\+json">\K.*?(?=</script>)' dist/en/index.html | python3 -m json.tool
   ```
3. **In the browser** — View Source and search `application/ld+json`, or in DevTools:
   ```js
   JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
   ```
4. **In production** — Google Search Console → *Enhancements* reports which structured
   data Google actually picked up, after the site is live on `amioprenova.com`.

"0 errors" with a few *warnings* (optional fields) is the expected, healthy result.

---

## Explaining this to Ami (plain language)

> Most of this is invisible — it's notes the website hands to Google and to Facebook so
> they describe you correctly. It's something a basic site usually skips.
>
> - **Open Graph / social cards:** when someone shares a link to your site, this controls
>   the picture, title, and blurb that show up. Without it you get a blank or random preview.
> - **Artist structured data:** a small machine-readable "ID card" that tells Google
>   you're Ami Oprenova, a jazz vocalist, with these official pages and these albums. This
>   is what can power the box with your photo and links that appears on the right of a
>   Google search, and helps your *own* accounts show up instead of someone else's.
> - **Event structured data:** lets your concerts appear with date and venue directly in
>   search.
>
> It updates itself as we add releases and shows — nothing for her to maintain. The main
> thing we need *from* her is confirmation that the facts are right (genres, the album
> list, which social accounts are the official ones).
