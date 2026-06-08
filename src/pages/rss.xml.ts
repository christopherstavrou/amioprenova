import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '../lib/blog';

/** RSS feed for news posts (default/EN locale). */
export async function GET(context: APIContext) {
  const posts = await getBlogPosts('en');
  const sorted = posts.sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );

  return rss({
    title: 'Ami Oprenova — News',
    description: 'Latest news and updates from jazz vocalist Ami Oprenova.',
    site: context.site ?? 'https://amioprenova.com',
    items: sorted.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDate),
      link: `/en/news/${post.id.replace(/^en\//, '')}`,
      categories: post.data.tags ?? [],
    })),
  });
}
