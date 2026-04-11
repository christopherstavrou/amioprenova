import eventsData from '../data/events.json';
import { z } from 'zod';

// Single source of truth for gallery item schema and type.
// Imported by src/content/config.ts to avoid duplication.
export const galleryItemSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), src: z.string(), alt: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('youtube'), id: z.string(), title: z.string() }),
  z.object({ type: z.literal('vimeo'), id: z.string(), title: z.string() }),
]);

export type GalleryItem = z.infer<typeof galleryItemSchema>;

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
  return eventsData as Event[];
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

// Format date for display
export function formatEventDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString(locale, options);
}
