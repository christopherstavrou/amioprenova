/**
 * Facebook Events Scraper
 *
 * Pulls all upcoming and past events from the public Facebook page,
 * maps them to the site's Event schema, downloads cover images and
 * gallery photos, and writes src/data/events.json.
 *
 * Usage:
 *   node scripts/scrape-facebook-events.mjs
 *
 * Options:
 *   --dry-run    Print mapped events to stdout without writing any files
 *   --upcoming   Scrape upcoming events only
 *   --past       Scrape past events only
 *   --no-browser Skip Playwright enumeration; use facebook-event-scraper list only
 *                (faster but may miss older paginated events)
 */

import { scrapeFbEvent, scrapeFbEventList, EventType } from 'facebook-event-scraper';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const COOKIES_FILE = resolve(dirname(fileURLToPath(import.meta.url)), 'facebook-cookies.json');

// Load and convert Cookie-Editor JSON export → Playwright cookie format
function loadCookies() {
  if (!existsSync(COOKIES_FILE)) return null;
  try {
    const raw = JSON.parse(readFileSync(COOKIES_FILE, 'utf8'));
    const sameSiteMap = { lax: 'Lax', strict: 'Strict', no_restriction: 'None' };
    return raw.map((c) => ({
      name: c.name,
      value: c.value,
      domain: c.domain,
      path: c.path ?? '/',
      secure: c.secure ?? false,
      httpOnly: c.httpOnly ?? false,
      sameSite: sameSiteMap[c.sameSite] ?? 'Lax',
      expires: c.expirationDate ? Math.floor(c.expirationDate) : undefined,
    }));
  } catch (err) {
    console.warn(`  [warn] Failed to load cookies file: ${err.message}`);
    return null;
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EVENTS_JSON = resolve(ROOT, 'src/data/events.json');
const IMAGES_DIR = resolve(ROOT, 'public/images/events');
const PAGE_URL = 'https://www.facebook.com/amioprenovamusic/events';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const UPCOMING_ONLY = args.includes('--upcoming');
const PAST_ONLY = args.includes('--past');
const NO_BROWSER = args.includes('--no-browser');

// Delay between individual event fetches to avoid rate limiting
const FETCH_DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Field-level override resolution
// ---------------------------------------------------------------------------
// Checks event._overrides[fieldName] before deciding whether to use the
// scraped value or keep the existing one.
//   'locked'   — human-verified, never overwrite
//   'fallback' — human-set best-effort; prefer scraped if non-empty
//   (absent)   — scraper owns this field, always use latest scraped value
function resolveField(fieldName, existingEvent, scrapedValue) {
  const policy = existingEvent?._overrides?.[fieldName];
  if (policy === 'locked')   return existingEvent[fieldName];
  if (policy === 'fallback') return scrapedValue || existingEvent[fieldName];
  return scrapedValue;
}

// ---------------------------------------------------------------------------
// Playwright — enumerate ALL event URLs from the page by scrolling to load
// everything Facebook defers behind "See more / Load more" clicks.
// Falls back gracefully if the browser is unavailable.
// ---------------------------------------------------------------------------
async function collectAllEventUrlsViaBrowser(pageUrl, type) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.warn('  [warn] playwright not available — skipping browser enumeration');
    return null;
  }

  const targetUrl = type === EventType.Past
    ? `${pageUrl}?type=past`
    : pageUrl;

  console.log(`  Launching browser → ${targetUrl}`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.warn(`  [warn] browser failed to launch: ${err.message}`);
    console.warn('  [hint] On WSL/Ubuntu run: sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2');
    return null;
  }

  const cookies = loadCookies();
  if (cookies) {
    console.log(`  Loaded ${cookies.length} cookies — browsing as authenticated user`);
  } else {
    console.log('  No cookies file found — browsing as guest (older events may be hidden)');
  }

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  });

  if (cookies) {
    await context.addCookies(cookies);
  }

  const page = await context.newPage();

  // Block images, fonts, and stylesheets — we only need JS/HTML/XHR
  await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,woff,woff2,ttf}', (r) => r.abort());
  await page.route('**/*.css', (r) => r.abort());

  try {
    await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });
    await sleep(4000); // let React hydrate and initial events render
  } catch (err) {
    console.warn(`  [warn] browser navigation failed: ${err.message}`);
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    return null;
  }

  // Count events before we start so we can track progress
  const countLinks = () => page.evaluate(() =>
    new Set(
      Array.from(document.querySelectorAll('a[href*="/events/"]'))
        .map((a) => a.href.match(/(https:\/\/www\.facebook\.com\/events\/\d+)/)?.[1])
        .filter(Boolean)
    ).size
  );

  // Alternate between:
  //   1. Clicking any visible "See more" / "Load more" style button
  //   2. Scrolling to the bottom to trigger infinite-scroll
  // Stop when neither action produces new event links for 3 consecutive rounds.
  let prevCount = 0;
  let stableRounds = 0;
  const MAX_STABLE = 4;

  // Text patterns Facebook uses for the load-more button (various locales)
  const LOAD_MORE_RE = /see more|load more|show more|виж още|покажи още/i;

  while (stableRounds < MAX_STABLE) {
    // Try clicking a load-more button
    let clicked = false;
    try {
      // Find all role=button elements whose text matches our patterns
      const buttons = await page.$$('[role="button"]');
      for (const btn of buttons) {
        const text = await btn.innerText().catch(() => '');
        if (LOAD_MORE_RE.test(text)) {
          await btn.scrollIntoViewIfNeeded();
          await btn.click();
          await sleep(2500);
          clicked = true;
          break;
        }
      }
    } catch { /* ignore */ }

    // Also scroll to bottom to trigger infinite-scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(2500);

    const currentCount = await countLinks();
    console.log(`    … ${currentCount} event links found so far`);

    if (currentCount > prevCount) {
      stableRounds = 0;
      prevCount = currentCount;
    } else if (!clicked) {
      stableRounds++;
    }
    // If we clicked but count didn't grow, give it one more round before giving up
  }

  // Extract all event URLs
  const urls = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/events/"]'));
    return anchors
      .map((a) => a.href)
      .filter((h) => /facebook\.com\/events\/\d+/.test(h))
      .map((h) => {
        const match = h.match(/(https:\/\/www\.facebook\.com\/events\/\d+)/);
        return match ? match[1] + '/' : null;
      })
      .filter(Boolean);
  });

  await context.close().catch(() => {});
  await browser.close().catch(() => {});

  const unique = [...new Set(urls)];
  console.log(`  Browser found ${unique.length} event URLs on page`);
  return unique;
}

// ---------------------------------------------------------------------------
// Date formatting — preserves wall-clock time in the event's local timezone
// so parseWallClockDate() in events.ts displays the correct local time.
//
// Facebook's scraper returns timezone as either an IANA name ("Europe/Sofia")
// or a UTC offset string ("UTC+03", "UTC-05:30"). Intl.DateTimeFormat only
// accepts IANA names, so we handle both cases here.
// ---------------------------------------------------------------------------
function toWallClockISO(timestamp, timezone) {
  const tz = timezone || 'UTC';

  // Try to parse as "UTC+HH", "UTC+HH:MM", "UTC-HH" etc.
  const utcOffsetMatch = tz.match(/^UTC([+-])(\d{1,2})(?::(\d{2}))?$/);

  if (utcOffsetMatch) {
    // Manual calculation — apply the offset to the Unix timestamp
    const sign = utcOffsetMatch[1] === '+' ? 1 : -1;
    const offsetHours = parseInt(utcOffsetMatch[2], 10);
    const offsetMins = parseInt(utcOffsetMatch[3] ?? '0', 10);
    const offsetSeconds = sign * (offsetHours * 3600 + offsetMins * 60);

    const localTs = timestamp + offsetSeconds;
    const d = new Date(localTs * 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getUTCFullYear();
    const month = pad(d.getUTCMonth() + 1);
    const day = pad(d.getUTCDate());
    const hour = pad(d.getUTCHours());
    const minute = pad(d.getUTCMinutes());
    const second = pad(d.getUTCSeconds());
    const offsetStr = `${utcOffsetMatch[1]}${pad(offsetHours)}:${pad(offsetMins)}`;

    return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetStr}`;
  }

  // IANA timezone — use Intl.DateTimeFormat
  const date = new Date(timestamp * 1000);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '00';
  const hour = get('hour') === '24' ? '00' : get('hour');
  const tzName = get('timeZoneName');
  const offsetMatch = tzName.match(/GMT([+-])(\d{1,2}):(\d{2})/);
  const offset = offsetMatch
    ? `${offsetMatch[1]}${offsetMatch[2].padStart(2, '0')}:${offsetMatch[3]}`
    : '+00:00';

  return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}:${get('second')}${offset}`;
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function makeSlug(name, startTimestamp) {
  const year = new Date(startTimestamp * 1000).getFullYear();
  return `${slugify(name)}-${year}`;
}

// ---------------------------------------------------------------------------
// Image download
// ---------------------------------------------------------------------------
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (existsSync(destPath)) {
      return resolve(destPath);
    }
    const protocol = url.startsWith('https') ? https : http;
    const file = createWriteStream(destPath);
    protocol.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        return reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve(destPath)));
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

// ---------------------------------------------------------------------------
// Location helpers
// ---------------------------------------------------------------------------

// Map ISO country codes and common suffixes → short display names
const COUNTRY_DISPLAY = {
  GB: 'UK', UK: 'UK',
  BG: 'Bulgaria',
  IT: 'Italy',
  US: 'USA', FR: 'France', DE: 'Germany',
  NL: 'Netherlands', ES: 'Spain', PT: 'Portugal',
  AT: 'Austria', CH: 'Switzerland', BE: 'Belgium',
  SE: 'Sweden', NO: 'Norway', DK: 'Denmark', FI: 'Finland',
  PL: 'Poland', RO: 'Romania', HU: 'Hungary', GR: 'Greece',
  RS: 'Serbia', HR: 'Croatia',
};

// Suffix patterns in city.name that indicate the country
const COUNTRY_FROM_SUFFIX = [
  [/United Kingdom/i,   'UK'],
  [/United States/i,    'USA'],
  [/Italy|Italia/i,     'Italy'],
  [/Bulgaria|България/i,'Bulgaria'],
  [/France|Francia/i,   'France'],
  [/Germany|Deutschland/i,'Germany'],
];

function extractCity(location) {
  if (!location) return '';
  const raw = location.city?.name ?? '';
  // Skip: very long strings are country/region Wikipedia descriptions
  if (raw.length > 60) return '';
  // Skip: looks like a street address (contains digits + street keywords)
  if (/\d/.test(raw) && /улица|street|str\.|ave|blvd|road|rd\.|sq\./i.test(raw)) return '';
  // "London, United Kingdom" → "London"
  return raw.includes(', ') ? raw.split(', ')[0].trim() : raw.trim();
}

function extractCountry(location) {
  if (!location) return '';
  // Use API code if provided
  const code = location.countryCode;
  if (code) return COUNTRY_DISPLAY[code.toUpperCase()] ?? code;
  // Infer from the raw city.name suffix before we stripped the country part
  const raw = location.city?.name ?? '';
  for (const [pattern, display] of COUNTRY_FROM_SUFFIX) {
    if (pattern.test(raw)) return display;
  }
  // Infer from address field
  const addr = location.address ?? '';
  for (const [pattern, display] of COUNTRY_FROM_SUFFIX) {
    if (pattern.test(addr)) return display;
  }
  return '';
}

// Tags to filter out — Facebook sometimes assigns these to music events
const TAG_BLOCKLIST = new Set(['Shopping']);

// ---------------------------------------------------------------------------
// Map Facebook EventData → site Event schema
// ---------------------------------------------------------------------------
function mapEvent(fbEvent, existingEvent) {
  const slug = existingEvent?.slug ?? makeSlug(fbEvent.name, fbEvent.startTimestamp);

  const startDate = toWallClockISO(fbEvent.startTimestamp, fbEvent.timezone);
  const endDate = fbEvent.endTimestamp
    ? toWallClockISO(fbEvent.endTimestamp, fbEvent.timezone)
    : undefined;

  // Location fields — cleaned
  const venue = resolveField('venue', existingEvent, fbEvent.location?.name ?? '');
  const city = resolveField('city', existingEvent, extractCity(fbEvent.location));
  const country = resolveField('country', existingEvent, extractCountry(fbEvent.location));

  // Map URL for venue coordinates if available
  let mapUrl = resolveField('mapUrl', existingEvent, '');
  if (!mapUrl && fbEvent.location?.coordinates) {
    const { latitude, longitude } = fbEvent.location.coordinates;
    mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  } else if (!mapUrl && venue && city) {
    mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${venue}, ${city}`)}`;
  }

  // Cover image — fbEvent.photo is the primary cover photo
  const coverImageFilename = `fb-${fbEvent.id}.jpg`;
  const coverImagePath = `/images/events/${coverImageFilename}`;
  const coverImageUrl = fbEvent.photo?.imageUri ?? fbEvent.photo?.url ?? null;

  // Additional gallery photos — fbEvent.photos contains extra cover photo variants;
  // skip the first one if it duplicates the cover (same id as fbEvent.photo)
  const extraPhotos = (fbEvent.photos ?? []).filter(
    (p) => p.id !== fbEvent.photo?.id
  );
  const galleryImageEntries = extraPhotos.map((p) => ({
    filename: `fb-${fbEvent.id}-photo-${p.id}.jpg`,
    url: p.imageUri ?? p.url ?? null,
  })).filter((e) => e.url);

  // Build gallery — preserve manual entries, then append any new FB photos
  const existingGallery = existingEvent?.gallery ?? [];
  const existingGalleryFilenames = new Set(
    existingGallery.map((g) => g.src?.split('/').pop())
  );
  const newGalleryEntries = galleryImageEntries
    .filter((e) => !existingGalleryFilenames.has(e.filename))
    .map((e) => ({ type: 'image', src: `/images/events/${e.filename}`, alt: fbEvent.name }));
  const gallery = [...existingGallery, ...newGalleryEntries];

  // Description
  const fullDescription = fbEvent.description ?? '';
  const firstParagraph = fullDescription.split('\n').find((l) => l.trim().length > 0) ?? fullDescription;
  const description = resolveField('description', existingEvent, firstParagraph.slice(0, 200).trim());
  const body = resolveField('body', existingEvent, fullDescription.trim());

  // Hosts — names only (URLs available in fbEvent.hosts[].url if needed later)
  const hosts = fbEvent.hosts?.map((h) => h.name).filter(Boolean) ?? [];

  // Categories → tags
  const tags = resolveField('tags', existingEvent, fbEvent.categories?.map((c) => c.label).filter((t) => !TAG_BLOCKLIST.has(t)) ?? []);

  return {
    mapped: {
      id: existingEvent?.id ?? fbEvent.id,
      slug,
      facebookId: fbEvent.id,
      title: fbEvent.name.trim(),
      description,
      body: body || undefined,
      startDate,
      endDate,
      venue,
      city,
      country,
      hosts: hosts.length > 0 ? hosts : undefined,
      tags,
      image: coverImageUrl ? coverImagePath : (existingEvent?.image ?? ''),
      gallery,
      ticketUrl: fbEvent.ticketUrl ?? existingEvent?.ticketUrl ?? '',
      mapUrl,
      sourceUrl: fbEvent.url,
      usersResponded: fbEvent.usersResponded > 0 ? fbEvent.usersResponded : undefined,
      isCanceled: fbEvent.isCanceled || undefined,
      admission: existingEvent?.admission || undefined,
      eventType: existingEvent?.eventType || undefined,
      _overrides: existingEvent?._overrides || undefined,
    },
    coverImageUrl,
    coverImageFilename,
    galleryImageEntries,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Facebook Events Scraper');
  console.log(`Page: ${PAGE_URL}`);
  if (DRY_RUN) console.log('Mode: DRY RUN — no files will be written\n');

  // Load existing events to preserve manually entered data
  let existingEvents = [];
  if (existsSync(EVENTS_JSON)) {
    existingEvents = JSON.parse(readFileSync(EVENTS_JSON, 'utf8'));
    console.log(`Loaded ${existingEvents.length} existing events from events.json`);
  }

  const existingByFbId = Object.fromEntries(
    existingEvents.filter((e) => e.facebookId).map((e) => [e.facebookId, e])
  );
  const manualEvents = existingEvents.filter((e) => !e.facebookId);
  if (manualEvents.length > 0) {
    console.log(`Preserving ${manualEvents.length} manually entered events (no facebookId)`);
  }

  // ---------------------------------------------------------------------------
  // Collect event URLs
  // ---------------------------------------------------------------------------
  const seenIds = new Set();
  const allShortEvents = [];

  // Phase 1: lightweight list scrape (fast, gets recent events)
  if (!PAST_ONLY) {
    console.log('\nFetching upcoming events list...');
    try {
      const upcoming = await scrapeFbEventList(PAGE_URL, EventType.Upcoming);
      console.log(`  Found ${upcoming.length} upcoming events`);
      for (const e of upcoming) {
        if (!seenIds.has(e.id)) { seenIds.add(e.id); allShortEvents.push(e); }
      }
    } catch (err) {
      console.error('  Failed to fetch upcoming events:', err.message);
    }
  }
  if (!UPCOMING_ONLY) {
    console.log('Fetching past events list (fast path)...');
    try {
      const past = await scrapeFbEventList(PAGE_URL, EventType.Past);
      console.log(`  Found ${past.length} past events`);
      for (const e of past) {
        if (!seenIds.has(e.id)) { seenIds.add(e.id); allShortEvents.push(e); }
      }
    } catch (err) {
      console.error('  Failed to fetch past events list:', err.message);
    }
  }

  // Phase 2: browser-based full enumeration for past events (finds paginated events)
  if (!UPCOMING_ONLY && !NO_BROWSER) {
    console.log('\nFetching ALL past event URLs via browser (slow but complete)...');
    const browserUrls = await collectAllEventUrlsViaBrowser(PAGE_URL, EventType.Past);
    if (browserUrls && browserUrls.length > 0) {
      // Convert browser URLs into minimal short-event objects for events we haven't seen yet
      let newCount = 0;
      for (const url of browserUrls) {
        const idMatch = url.match(/\/events\/(\d+)/);
        if (!idMatch) continue;
        const id = idMatch[1];
        if (!seenIds.has(id)) {
          seenIds.add(id);
          allShortEvents.push({ id, name: `Event ${id}`, url, date: '', isCanceled: false, isPast: true });
          newCount++;
        }
      }
      if (newCount > 0) {
        console.log(`  Found ${newCount} additional events via browser enumeration`);
      } else {
        console.log('  No new events found beyond the fast-path list');
      }
    }
  }

  if (allShortEvents.length === 0) {
    console.error('\nNo events found — check the page URL and try again.');
    process.exit(1);
  }

  console.log(`\nTotal unique events to scrape: ${allShortEvents.length}`);

  // ---------------------------------------------------------------------------
  // Fetch full details for each event
  // ---------------------------------------------------------------------------
  if (!DRY_RUN) {
    mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const scrapedEvents = [];
  for (let i = 0; i < allShortEvents.length; i++) {
    const short = allShortEvents[i];
    console.log(`\n[${i + 1}/${allShortEvents.length}] ${short.name}`);
    console.log(`  URL: ${short.url}`);

    try {
      const full = await scrapeFbEvent(short.url);
      const existing = existingByFbId[full.id];
      const { mapped, coverImageUrl, coverImageFilename, galleryImageEntries } = mapEvent(full, existing);

      console.log(`  Date: ${mapped.startDate}${mapped.endDate ? ' → ' + mapped.endDate : ''}`);
      console.log(`  Venue: ${mapped.venue}, ${mapped.city}`);
      if (mapped.hosts?.length) console.log(`  Hosts: ${mapped.hosts.join(', ')}`);
      if (mapped.tags?.length) console.log(`  Tags: ${mapped.tags.join(', ')}`);

      if (!DRY_RUN) {
        // Download cover image
        if (coverImageUrl) {
          const destPath = resolve(IMAGES_DIR, coverImageFilename);
          try {
            const wasNew = !existsSync(destPath);
            await downloadImage(coverImageUrl, destPath);
            console.log(`  Cover: ${wasNew ? 'downloaded' : 'exists'} → /images/events/${coverImageFilename}`);
          } catch (imgErr) {
            console.warn(`  Cover: failed to download (${imgErr.message}) — skipping`);
            mapped.image = existing?.image ?? '';
          }
        }

        // Download gallery images
        if (galleryImageEntries.length > 0) {
          console.log(`  Gallery: ${galleryImageEntries.length} additional photo(s)`);
          for (const entry of galleryImageEntries) {
            const destPath = resolve(IMAGES_DIR, entry.filename);
            try {
              const wasNew = !existsSync(destPath);
              await downloadImage(entry.url, destPath);
              if (wasNew) console.log(`    + ${entry.filename}`);
            } catch (imgErr) {
              console.warn(`    ! failed to download ${entry.filename}: ${imgErr.message}`);
              // Remove failed gallery entry from mapped.gallery
              mapped.gallery = mapped.gallery.filter(
                (g) => !g.src?.endsWith(entry.filename)
              );
            }
          }
        }
      }

      scrapedEvents.push(mapped);
    } catch (err) {
      console.error(`  Failed to scrape full event: ${err.message}`);
      // Keep minimal stub so we don't lose the event entirely
      scrapedEvents.push({
        id: short.id,
        facebookId: short.id,
        slug: makeSlug(short.name, Date.now() / 1000),
        title: short.name,
        description: '',
        startDate: short.date,
        venue: '',
        city: '',
        country: '',
        tags: [],
        image: '',
        gallery: [],
        ticketUrl: '',
        mapUrl: '',
        sourceUrl: short.url,
      });
    }

    if (i < allShortEvents.length - 1) {
      await sleep(FETCH_DELAY_MS);
    }
  }

  // Preserve existing FB events that weren't re-scraped this run (e.g. --no-browser partial run)
  const scrapedFbIds = new Set(scrapedEvents.map((e) => e.facebookId).filter(Boolean));
  const carryOverEvents = existingEvents.filter(
    (e) => e.facebookId && !scrapedFbIds.has(e.facebookId)
  );
  if (carryOverEvents.length > 0) {
    console.log(`Carrying over ${carryOverEvents.length} previously scraped events (not re-fetched this run)`);
  }

  // Merge: scraped events + carry-overs + manual events, sorted by startDate descending
  const merged = [
    ...scrapedEvents,
    ...carryOverEvents,
    ...manualEvents,
  ].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  if (DRY_RUN) {
    console.log('\n--- DRY RUN OUTPUT ---');
    console.log(JSON.stringify(merged, null, 2));
    return;
  }

  writeFileSync(EVENTS_JSON, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\n✓ Written ${merged.length} events to ${EVENTS_JSON}`);
  console.log(`  (${scrapedEvents.length} from Facebook, ${manualEvents.length} manual)`);
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
