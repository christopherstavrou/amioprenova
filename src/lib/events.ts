import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { GalleryItem } from './gallery-schema';

export type { GalleryItem };
export type Event = CollectionEntry<'shows'>['data'];

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

// Date part only — "Sun 4 Jun 2024" / "нд 4 юни 2024 г."
// Uses formatToParts so we control the order and strip commas ourselves.
export function formatEventDatePart(dateString: string, locale: string = 'en'): string {
  const date = parseWallClockDate(dateString);
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
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
export function formatEventTime(dateString: string): string {
  const date = parseWallClockDate(dateString);
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// Combined date + time for list views: "Sun 4 Jun 2024 · 19:00"
export function formatEventDateTime(dateString: string, locale: string = 'en'): string {
  return `${formatEventDatePart(dateString, locale)} · ${formatEventTime(dateString)}`;
}

// Format date for display — kept for search index and other consumers
export function formatEventDate(dateString: string, locale: string = 'en'): string {
  return formatEventDateTime(dateString, locale);
}

// Format date for compact display — day, short month, year only
export function formatShortDate(dateString: string, locale: string = 'en-US'): string {
  const date = parseWallClockDate(dateString);
  return date.toLocaleDateString(locale, { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
}

// Extract UTC offset from ISO date string and format as "GMT+3", "GMT+5:30", or "UTC"
export function formatTimezoneLabel(dateString: string): string {
  const match = dateString.match(/([+-])(\d{2}):(\d{2})$/);
  if (!match) return 'UTC';
  const [, sign, hourStr, minStr] = match;
  const hours = Number(hourStr);
  const minutes = Number(minStr);
  if (hours === 0 && minutes === 0) return 'UTC';
  const minPart = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `GMT${sign}${hours}${minPart}`;
}
