import { siteConfig } from '../config/site';

/**
 * schema.org MusicGroup JSON-LD for the artist, emitted on the homepage.
 * `sameAs` is built from the configured social/streaming profiles (empty ones
 * skipped). Returned pre-stringified and `</`-escaped for safe `set:html`.
 */
export function musicGroupJsonLd(): string {
  const sameAs = [
    siteConfig.bandcampUrl,
    siteConfig.spotifyUrl,
    siteConfig.youtubeUrl,
    siteConfig.instagramUrl,
    siteConfig.tiktokUrl,
    siteConfig.facebookUrl,
  ].filter(Boolean);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'Ami Oprenova',
    url: siteConfig.baseUrl,
    image: `${siteConfig.baseUrl}${siteConfig.ogImage}`,
    ...(siteConfig.genres?.length ? { genre: siteConfig.genres } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return JSON.stringify(data).replace(/<\//g, '<\\/');
}
