import { getCollection } from 'astro:content';
import { getAllEvents, formatEventDate } from '../lib/events';

export async function GET() {
  const allPosts = await getCollection('blog');

  const postEntries = allPosts.map(post => {
    const lang = post.id.startsWith('en/') ? 'en' : 'bg';
    const slug = post.id.replace(/^(en|bg)\//, '');
    const url = `/${lang}/news/${slug}`;

    return {
      type: 'post' as const,
      title: post.data.title,
      description: post.data.description,
      date: new Date(post.data.pubDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      tags: post.data.tags || [],
      url,
      lang,
    };
  });

  const allEvents = await getAllEvents();
  const langs = ['en', 'bg'] as const;

  const eventEntries = langs.flatMap(lang =>
    allEvents.map(event => ({
      type: 'event' as const,
      title: lang === 'bg' ? (event.titleBg ?? event.title) : (event.titleEn ?? event.title),
      description: lang === 'bg' ? (event.descriptionBg ?? event.description) : (event.descriptionEn ?? event.description),
      date: formatEventDate(event.startDate, lang),
      tags: lang === 'bg' ? (event.tagsBg ?? event.tags ?? []) : (event.tags ?? []),
      url: `/${lang}/shows/${event.slug}`,
      lang,
    }))
  );

  const searchIndex = [...postEntries, ...eventEntries];

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
