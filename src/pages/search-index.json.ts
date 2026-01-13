import { getCollection } from 'astro:content';

export async function GET() {
  const allPosts = await getCollection('blog');

  const searchIndex = allPosts.map(post => {
    const lang = post.slug.startsWith('en/') ? 'en' : 'bg';
    const slug = post.slug.replace(/^(en|bg)\//, '');
    const url = `/${lang}/news/${slug}`;

    return {
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

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
