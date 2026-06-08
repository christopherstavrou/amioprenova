import { siteConfig } from '../config/site';
import releases from '../data/releases.json';

/**
 * schema.org MusicGroup JSON-LD for the artist, emitted on the homepage.
 *
 * What this is: machine-readable metadata that tells search engines who the
 * artist is, how to reach her official profiles (`sameAs`), and what she has
 * released (`album`). It powers richer search results / knowledge panels.
 * See docs/ai/metadata.md for what to include and when to update.
 *
 * `sameAs` and `album` are built from siteConfig + releases.json (empty entries
 * skipped). Returned pre-stringified and `</`-escaped for safe `set:html`.
 */
export function musicGroupJsonLd(): string {
  const artist = { '@type': 'MusicGroup', name: siteConfig.artistName };

  const sameAs = [
    siteConfig.bandcampUrl,
    siteConfig.spotifyUrl,
    siteConfig.youtubeUrl,
    siteConfig.instagramUrl,
    siteConfig.tiktokUrl,
    siteConfig.facebookUrl,
  ].filter(Boolean);

  // One MusicAlbum per release, linking back to where it can be heard.
  const album = releases.map(r => ({
    '@type': 'MusicAlbum',
    name: r.title,
    datePublished: String(r.year),
    byArtist: artist,
    ...(r.coverImage ? { image: r.coverImage } : {}),
    ...(r.bandcampUrl ? { url: r.bandcampUrl } : {}),
  }));

  const data = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: siteConfig.artistName,
    url: siteConfig.baseUrl,
    image: `${siteConfig.baseUrl}${siteConfig.ogImage}`,
    ...(siteConfig.artistDescription ? { description: siteConfig.artistDescription } : {}),
    ...(siteConfig.genres?.length ? { genre: siteConfig.genres } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(album.length ? { album } : {}),
  };

  return JSON.stringify(data).replace(/<\//g, '<\\/');
}
