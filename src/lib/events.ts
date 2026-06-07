import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { GalleryItem } from './gallery-schema';
import { eventFeatures } from '../config/site';

export type { GalleryItem };
export type Event = CollectionEntry<'shows'>['data'];

/**
 * The status badge to display for an event, or null for none.
 * Explicit lifecycle status (schema.org EventStatusType, minus the
 * never-badged 'scheduled') takes priority; otherwise 'past' is derived
 * from the date. 'cancelled' display honours the showCanceledBadge flag.
 * The legacy `isCanceled` boolean maps to 'cancelled'.
 */
export type DisplayStatus = 'scheduled' | 'cancelled' | 'postponed' | 'rescheduled' | 'moved-online' | 'past';

/**
 * @param showScheduled  Whether a normal future event resolves to 'scheduled'
 *   (shown in full search and on detail pages) or null (hidden on the main
 *   upcoming list, where a "Scheduled" badge on every card would be noise).
 */
export function getDisplayStatus(
  event: Event,
  { showScheduled = false, now = new Date() }: { showScheduled?: boolean; now?: Date } = {},
): DisplayStatus | null {
  let explicit: DisplayStatus | null = null;
  if (event.status && event.status !== 'scheduled') {
    explicit = event.status;
  } else if (event.isCanceled) {
    explicit = 'cancelled';
  }
  if (explicit === 'cancelled' && !eventFeatures.showCanceledBadge) {
    explicit = null;
  }
  if (explicit) return explicit;
  if (new Date(event.startDate) < now) return 'past';
  return showScheduled ? 'scheduled' : null;
}

/** Map a DisplayStatus to its schema.org EventStatusType URL (for JSON-LD). */
export function schemaEventStatus(event: Event): string {
  const s = event.status && event.status !== 'scheduled'
    ? event.status
    : (event.isCanceled ? 'cancelled' : 'scheduled');
  switch (s) {
    case 'cancelled': return 'https://schema.org/EventCancelled';
    case 'postponed': return 'https://schema.org/EventPostponed';
    case 'rescheduled': return 'https://schema.org/EventRescheduled';
    case 'moved-online': return 'https://schema.org/EventMovedOnline';
    default: return 'https://schema.org/EventScheduled';
  }
}

let allEventsPromise: Promise<readonly Event[]> | undefined;

async function loadAllEvents(): Promise<readonly Event[]> {
  if (!allEventsPromise || import.meta.env.DEV) {
    allEventsPromise = getCollection('shows').then(collection => collection.map(entry => entry.data));
  }
  return allEventsPromise;
}

// Load all events from Content Collection
export async function getAllEvents(): Promise<Event[]> {
  return [...await loadAllEvents()];
}

// Filter to upcoming events (future dates only), sorted ascending
export async function getUpcomingEvents(): Promise<Event[]> {
  const now = new Date();
  const allEvents = await getAllEvents();
  return allEvents
    .filter(event => new Date(event.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// Filter to past events (past dates only), sorted newest first
export async function getPastEvents(): Promise<Event[]> {
  const now = new Date();
  const allEvents = await getAllEvents();
  return allEvents
    .filter(event => new Date(event.startDate) < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

// Get next N upcoming events
export async function getNextEvents(count: number): Promise<Event[]> {
  const upcoming = await getUpcomingEvents();
  return upcoming.slice(0, count);
}

// Get event by slug
export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const allEvents = await getAllEvents();
  return allEvents.find(event => event.slug === slug);
}

// Parse the wall-clock date/time from an ISO string, ignoring the timezone offset.
// Storing as UTC and formatting with timeZone: 'UTC' ensures output is stable
// regardless of the build machine's local timezone (e.g. CI/Cloudflare runs in UTC).
// A timezone suffix (Z or ±HH:MM) is required so this parser and the Date-based
// comparisons in getUpcomingEvents/getPastEvents always agree on event identity.
// Handles both HH:MM and HH:MM:SS time variants.
function parseWallClockDate(dateString: string): Date {
  const match = dateString.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?(?:Z|[+-](\d{2}):(\d{2}))$/
  );

  if (!match) {
    throw new Error(`Invalid event date: ${dateString}`);
  }

  const [, yearString, monthString, dayString, hourString, minuteString, offsetHourString, offsetMinuteString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const hour = Number(hourString);
  const minute = Number(minuteString);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid event date month in "${dateString}": ${monthString}`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid event date day in "${dateString}": ${dayString}`);
  }
  if (hour < 0 || hour > 23) {
    throw new Error(`Invalid event date hour in "${dateString}": ${hourString}`);
  }
  if (minute < 0 || minute > 59) {
    throw new Error(`Invalid event date minute in "${dateString}": ${minuteString}`);
  }
  if (offsetHourString !== undefined && Number(offsetHourString) > 23) {
    throw new Error(`Invalid event date offset hours in "${dateString}": ${offsetHourString}`);
  }
  if (offsetMinuteString !== undefined && Number(offsetMinuteString) > 59) {
    throw new Error(`Invalid event date offset minutes in "${dateString}": ${offsetMinuteString}`);
  }

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  ) {
    throw new Error(`Invalid event date: ${dateString}`);
  }

  return date;
}

// Is `tz` a real IANA zone the runtime can format with? Older events have no
// timezone and fall back to the offset baked into the date string.
function isValidTimeZone(tz: string | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// All event-time formatting renders in the VENUE's local time, never the
// viewer's: a 19:00 Sofia concert reads "19:00" everywhere. When an IANA
// `timezone` is present we format the absolute instant in that zone (DST-safe);
// otherwise we fall back to the wall-clock value parsed from the stored offset.

// Date part only — "Sun 4 Jun 2024" / "нд 4 юни 2024"
// Uses formatToParts so we control the order and strip commas ourselves.
export function formatEventDatePart(dateString: string, locale: string = 'en', timezone?: string): string {
  const useIana = isValidTimeZone(timezone);
  const date = useIana ? new Date(dateString) : parseWallClockDate(dateString);
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: useIana ? timezone : 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  // Explicit order: weekday day month year — works for both EN and BG
  return `${get('weekday')} ${get('day')} ${get('month')} ${get('year')}`.replace(/\s+/g, ' ').trim();
}

// Time only — always 24h, not locale-dependent: "19:00"
export function formatEventTime(dateString: string, timezone?: string): string {
  if (isValidTimeZone(timezone)) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date(dateString));
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
    return `${get('hour')}:${get('minute')}`;
  }
  const date = parseWallClockDate(dateString);
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// Combined date + time for list views: "Sun 4 Jun 2024 · 19:00"
export function formatEventDateTime(dateString: string, locale: string = 'en', timezone?: string): string {
  return `${formatEventDatePart(dateString, locale, timezone)} · ${formatEventTime(dateString, timezone)}`;
}

// Format date for display — kept for search index and other consumers
export function formatEventDate(dateString: string, locale: string = 'en', timezone?: string): string {
  return formatEventDateTime(dateString, locale, timezone);
}

// Format date for compact display — day, short month, year only
export function formatShortDate(dateString: string, locale: string = 'en-US', timezone?: string): string {
  const useIana = isValidTimeZone(timezone);
  const date = useIana ? new Date(dateString) : parseWallClockDate(dateString);
  return date.toLocaleDateString(locale, {
    timeZone: useIana ? timezone : 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Short zone label for display — "GMT+3", "GMT+5:30", or "UTC". With an IANA
// timezone the offset is computed at the event's instant (so it's DST-correct);
// otherwise it's read from the offset suffix in the date string.
export function formatTimezoneLabel(dateString: string, timezone?: string): string {
  if (isValidTimeZone(timezone)) {
    const part = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(new Date(dateString))
      .find(p => p.type === 'timeZoneName')?.value;
    // 'shortOffset' yields e.g. "GMT+2"/"GMT" — normalise bare "GMT" to "UTC".
    if (part) return part === 'GMT' ? 'UTC' : part;
  }
  const match = dateString.match(/([+-])(\d{2}):(\d{2})$/);
  if (!match) return 'UTC';
  const [, sign, hourStr, minStr] = match;
  const hours = Number(hourStr);
  const minutes = Number(minStr);
  if (hours === 0 && minutes === 0) return 'UTC';
  const minPart = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `GMT${sign}${hours}${minPart}`;
}

// ---------------------------------------------------------------------------
// Calendar (.ics) export
// ---------------------------------------------------------------------------
// Builds an RFC 5545 VCALENDAR for a single event. Timestamps are emitted as
// absolute UTC instants (…Z), so the user's calendar app converts them to their
// own local timezone — which is the one place per-viewer conversion is correct.
// The stored startDate carries an offset, so `new Date()` yields the right
// instant regardless of the build machine's timezone.

// Escape per RFC 5545 §3.3.11: backslash, semicolon, comma, and newlines.
function icsEscape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold long content lines to ≤75 octets per RFC 5545 §3.1 (continuation lines
// start with a single space).
function icsFold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    chunks.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) chunks.push(' ' + rest);
  return chunks.join('\r\n');
}

function toICSUtc(dateString: string): string {
  // YYYYMMDDTHHMMSSZ
  return new Date(dateString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Build an .ics document for one event.
 * @param baseUrl  Site origin (no trailing slash) for the UID and event URL.
 */
export function buildEventICS(event: Event, locale: 'en' | 'bg', baseUrl: string): string {
  const summary = locale === 'bg'
    ? (event.titleBg || event.title)
    : (event.titleEn || event.title);
  const desc = locale === 'bg'
    ? (event.descriptionBg || event.description)
    : (event.descriptionEn || event.description);

  const start = toICSUtc(event.startDate);
  // Default to a 2-hour duration when no explicit end is set.
  const end = event.endDate
    ? toICSUtc(event.endDate)
    : toICSUtc(new Date(new Date(event.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString());

  const location = [event.venue, event.city, event.country].filter(Boolean).join(', ');
  const url = `${baseUrl}/${locale}/shows/${event.slug}`;
  const cancelled = event.status === 'cancelled' || event.isCanceled;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//amioprenova//events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.slug}@amioprenova.com`,
    `DTSTAMP:${toICSUtc(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${icsEscape(summary)}`,
    desc ? `DESCRIPTION:${icsEscape(desc)}` : '',
    location ? `LOCATION:${icsEscape(location)}` : '',
    `URL:${icsEscape(event.sourceUrl || url)}`,
    `STATUS:${cancelled ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.map(icsFold).join('\r\n') + '\r\n';
}
