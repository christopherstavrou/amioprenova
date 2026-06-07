import { getCollection } from 'astro:content';
import { includeTestFixtures, isTestEntry } from './test-fixtures';

/**
 * Blog posts for a locale, with `test-*` fixtures excluded from production
 * builds (see test-fixtures.ts). Use this everywhere instead of calling
 * getCollection('blog', …) directly so the fixture filter stays consistent.
 */
export async function getBlogPosts(locale: 'en' | 'bg') {
  return getCollection(
    'blog',
    ({ id }) => id.startsWith(`${locale}/`) && (includeTestFixtures() || !isTestEntry(id)),
  );
}
