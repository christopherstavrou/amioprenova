import eventsData from '../data/events.json';
import type { GalleryItem } from './gallery-schema';

export type { GalleryItem };

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  body?: string;
  startDate: string;
  venue: string;
  city: string;
  country: string;
  tags?: string[];
  image?: string;
  gallery?: GalleryItem[];
  ticketUrl: string;
  mapUrl: string;
}

// Load all events
export function getAllEvents(): Event[] {
  return eventsData as Event[]; // safe: JSON structure is maintained by hand to match the Event interface above
}

// Filter to upcoming events (future dates only), sorted ascending
export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return getAllEvents()
    .filter(event => new Date(event.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// Filter to past events (past dates only), sorted newest first
export function getPastEvents(): Event[] {
  const now = new Date();
  return getAllEvents()
    .filter(event => new Date(event.startDate) < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

// Get next N upcoming events
export function getNextEvents(count: number): Event[] {
  return getUpcomingEvents().slice(0, count);
}

// Get event by slug
export function getEventBySlug(slug: string): Event | undefined {
  return getAllEvents().find(event => event.slug === slug);
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

// Format date for display — full format with weekday and time
export function formatEventDate(dateString: string, locale: string = 'en'): string {
  const date = parseWallClockDate(dateString);
  return date.toLocaleString(locale, {
    timeZone: 'UTC',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date for compact display — day, short month, year only
export function formatShortDate(dateString: string, locale: string = 'en-US'): string {
  const date = parseWallClockDate(dateString);
  return date.toLocaleDateString(locale, { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
}
