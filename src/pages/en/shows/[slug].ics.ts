import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllEvents, buildEventICS, type Event } from '../../../lib/events';
import { siteConfig } from '../../../config/site';

// One static .ics per event, served alongside the EN detail page
// (/en/shows/<slug>.ics). Timestamps are absolute UTC, so the user's calendar
// app converts to their local timezone on import.
export const getStaticPaths = (async () => {
  const events = await getAllEvents();
  return events.map(event => ({ params: { slug: event.slug }, props: { event } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  // Safe cast: `event` is injected by getStaticPaths above during prerender.
  const { event } = props as { event: Event };
  return new Response(buildEventICS(event, 'en', siteConfig.baseUrl), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
    },
  });
};
