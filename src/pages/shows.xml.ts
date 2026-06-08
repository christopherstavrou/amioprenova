import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getUpcomingEvents, formatEventDateTime } from '../lib/events';

/** RSS feed for upcoming shows (default/EN locale). */
export async function GET(context: APIContext) {
  const events = await getUpcomingEvents();

  return rss({
    title: 'Ami Oprenova — Upcoming Shows',
    description: 'Upcoming live shows and events for Ami Oprenova.',
    site: context.site ?? 'https://amioprenova.com',
    items: events.map(event => ({
      title: event.titleEn ?? event.title,
      description: `${event.venue}, ${event.city}, ${event.country} — ${formatEventDateTime(event.startDate, 'en', event.timezone)}`,
      // The event date doubles as the item date so readers order by when shows happen.
      pubDate: new Date(event.startDate),
      link: `/en/shows/${event.slug}`,
      categories: event.tags ?? [],
    })),
  });
}
