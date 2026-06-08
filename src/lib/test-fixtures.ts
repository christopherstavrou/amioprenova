/**
 * Test/edge-case content fixtures (files named `test-*`) exist to exercise UI
 * states during audits — long titles, many tags, every status, empty states,
 * pagination overflow. They must NOT render in production.
 *
 * Inclusion is opt-in and off by default everywhere (dev, CI, production):
 *   INCLUDE_TEST_FIXTURES=1 npm run build   # include them (UI audit)
 *   npm run build                           # clean — fixtures excluded
 */
export function includeTestFixtures(): boolean {
  return process.env.INCLUDE_TEST_FIXTURES === '1';
}

/**
 * True if a content id/slug denotes a test fixture. Handles locale-prefixed
 * blog ids (`en/test-foo`) as well as bare show slugs (`test-foo`).
 */
export function isTestEntry(idOrSlug: string): boolean {
  const name = idOrSlug.slice(idOrSlug.lastIndexOf('/') + 1);
  return name.startsWith('test-');
}
