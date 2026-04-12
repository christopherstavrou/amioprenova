/**
 * Facebook Events Scraper
 *
 * Pulls all upcoming and past events from the public Facebook page,
 * maps them to the site's Event schema, downloads cover images, and
 * writes src/data/events.json.
 *
 * Usage:
 *   node scripts/scrape-facebook-events.mjs
 *
 * Options:
 *   --dry-run   Print mapped events to stdout without writing any files
 *   --upcoming  Scrape upcoming events only
 *   --past      Scrape past events only
 */

import { scrapeFbEvent, scrapeFbEventList, EventType } from 'facebook-event-scraper';
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EVENTS_JSON = resolve(ROOT, 'src/data/events.json');
const IMAGES_DIR = resolve(ROOT, 'public/images/events');
const PAGE_URL = 'https://www.facebook.com/amioprenovamusic/events';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const UPCOMING_ONLY = args.includes('--upcoming');
const PAST_ONLY = args.includes('--past');

// Delay between individual event fetches to avoid rate limiting
const FETCH_DELAY_MS = 1500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      console.log(`  [skip] image already exists: ${destPath}`);
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
// Map Facebook EventData → site Event schema
// ---------------------------------------------------------------------------
function mapEvent(fbEvent, existingEvent) {
  const slug = existingEvent?.slug ?? makeSlug(fbEvent.name, fbEvent.startTimestamp);

  // Build ISO date string preserving wall-clock time in the event's local timezone
  // so parseWallClockDate() in events.ts displays the correct local time on the site.
  const startDate = toWallClockISO(fbEvent.startTimestamp, fbEvent.timezone);

  // Location fields
  const venue = fbEvent.location?.name ?? '';
  const city = fbEvent.location?.city?.name ?? fbEvent.location?.description ?? '';
  const country = fbEvent.location?.countryCode ?? '';

  // Map URL for venue coordinates if available
  let mapUrl = existingEvent?.mapUrl ?? '';
  if (!mapUrl && fbEvent.location?.coordinates) {
    const { latitude, longitude } = fbEvent.location.coordinates;
    mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  } else if (!mapUrl && venue && city) {
    mapUrl = `https://maps.google.com/?q=${encodeURIComponent(`${venue}, ${city}`)}`;
  }

  // Image path — will be filled in after download
  const imageFilename = `fb-${fbEvent.id}.jpg`;
  const imagePath = `/images/events/${imageFilename}`;
  const imageUrl = fbEvent.photo?.imageUri ?? fbEvent.photo?.url ?? null;

  // Split description into short (first paragraph) and full body
  const fullDescription = fbEvent.description ?? '';
  const firstParagraph = fullDescription.split('\n').find((l) => l.trim().length > 0) ?? fullDescription;
  const description = existingEvent?.description ?? firstParagraph.slice(0, 200).trim();
  const body = existingEvent?.body ?? fullDescription.trim();

  return {
    mapped: {
      id: existingEvent?.id ?? fbEvent.id,
      slug,
      facebookId: fbEvent.id,
      title: fbEvent.name,
      description,
      body: body || undefined,
      startDate,
      venue,
      city,
      country,
      tags: existingEvent?.tags ?? [],
      image: imageUrl ? imagePath : (existingEvent?.image ?? ''),
      gallery: existingEvent?.gallery ?? [],
      ticketUrl: fbEvent.ticketUrl ?? existingEvent?.ticketUrl ?? '',
      mapUrl,
      sourceUrl: fbEvent.url,
    },
    imageUrl,
    imageFilename,
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

  // Fetch event list(s)
  const eventLists = [];
  if (!PAST_ONLY) {
    console.log('\nFetching upcoming events list...');
    try {
      const upcoming = await scrapeFbEventList(PAGE_URL, EventType.Upcoming);
      console.log(`  Found ${upcoming.length} upcoming events`);
      eventLists.push(...upcoming);
    } catch (err) {
      console.error('  Failed to fetch upcoming events:', err.message);
    }
  }
  if (!UPCOMING_ONLY) {
    console.log('Fetching past events list...');
    try {
      const past = await scrapeFbEventList(PAGE_URL, EventType.Past);
      console.log(`  Found ${past.length} past events`);
      eventLists.push(...past);
    } catch (err) {
      console.error('  Failed to fetch past events:', err.message);
    }
  }

  if (eventLists.length === 0) {
    console.error('\nNo events found — check the page URL and try again.');
    process.exit(1);
  }

  // Deduplicate by id
  const uniqueEvents = [...new Map(eventLists.map((e) => [e.id, e])).values()];
  console.log(`\nTotal unique events: ${uniqueEvents.length}`);

  // Fetch full details for each event
  if (!DRY_RUN) {
    mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const scrapedEvents = [];
  for (let i = 0; i < uniqueEvents.length; i++) {
    const short = uniqueEvents[i];
    console.log(`\n[${i + 1}/${uniqueEvents.length}] ${short.name}`);
    console.log(`  URL: ${short.url}`);

    try {
      const full = await scrapeFbEvent(short.url);
      const existing = existingByFbId[full.id];
      const { mapped, imageUrl, imageFilename } = mapEvent(full, existing);

      console.log(`  Date: ${mapped.startDate}`);
      console.log(`  Venue: ${mapped.venue}, ${mapped.city}`);

      if (imageUrl && !DRY_RUN) {
        const destPath = resolve(IMAGES_DIR, imageFilename);
        try {
          await downloadImage(imageUrl, destPath);
          console.log(`  Image: downloaded → /images/events/${imageFilename}`);
        } catch (imgErr) {
          console.warn(`  Image: failed to download (${imgErr.message}) — skipping`);
          mapped.image = existing?.image ?? '';
        }
      }

      scrapedEvents.push(mapped);
    } catch (err) {
      console.error(`  Failed to scrape full event: ${err.message}`);
      // Keep the short data at minimum
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

    if (i < uniqueEvents.length - 1) {
      await sleep(FETCH_DELAY_MS);
    }
  }

  // Merge: scraped events + manual events, sorted by startDate descending
  const merged = [
    ...scrapedEvents,
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
