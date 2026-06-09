import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { galleryItemSchema } from './lib/gallery-schema';

const admissionSchema = z.object({
  type: z.enum(['free', 'free-booking', 'paid', 'donation']),
  price: z.string().optional(),
  concessions: z.string().optional(),
  note: z.string().optional(),
  noteBg: z.string().optional(),
});

const eventTypeEnum = z.enum(['concert', 'jam', 'collaboration', 'charity', 'album-launch', 'workshop', 'birthday']);

// Event lifecycle status — aligned to schema.org EventStatusType.
// 'scheduled' is the default/normal state and is never shown as a badge.
// 'past' is NOT stored here — it is derived from the event date at display time.
const eventStatusEnum = z.enum(['scheduled', 'cancelled', 'postponed', 'rescheduled', 'moved-online']);

const overridePolicyEnum = z.enum(['locked', 'fallback']);

// `description` is the canonical clean English summary used for cards' fallback
// and HTML <meta> tags — NOT raw event body text. The Facebook scraper writes the
// first paragraph of the post (truncated to 200 chars) into this field, which is
// full of emoji and Bulgarian copy. Enrichment is meant to replace that with a
// clean ≤200-char English summary and lock it via `_overrides`. This guard fails
// the build if a raw/scraped description slips through unenriched, so it can never
// reach production. See docs/ai/event-enrichment.md → `description`.
const EMOJI_OR_SYMBOL =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE00}-\u{FE0F}\u{FFFC}\u{1F1E6}-\u{1F1FF}]/u;
const cleanSummary = z
  .string()
  .max(200, 'description must be ≤200 chars — a clean summary, not raw body text')
  .refine(
    (s) => !EMOJI_OR_SYMBOL.test(s),
    'description must not contain emoji/symbols — this looks like raw scraped text. Write a clean English summary and lock it in _overrides (see docs/ai/event-enrichment.md).'
  )
  .refine((s) => !/https?:\/\//.test(s), 'description must not contain URLs');

const showsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/shows' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    facebookId: z.string().optional(),
    title: z.string(),
    titleEn: z.string().optional(),
    titleBg: z.string().optional(),
    description: cleanSummary,
    descriptionEn: z.string().optional(),
    descriptionBg: z.string().optional(),
    body: z.string().optional(),
    bodyEn: z.string().optional(),
    bodyBg: z.string().optional(),
    startDate: z.string().regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/,
      'startDate must be ISO 8601 with timezone: YYYY-MM-DDTHH:MM[:SS](Z|±HH:MM)'
    ),
    endDate: z.string().regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2})$/,
      'endDate must be ISO 8601 with timezone: YYYY-MM-DDTHH:MM[:SS](Z|±HH:MM)'
    ).optional(),
    venue: z.string(),
    city: z.string(),
    country: z.string(),
    // IANA timezone of the venue (e.g. "Europe/Sofia"). Optional: older events
    // predate the field and fall back to the offset baked into startDate. When
    // present it enables DST-safe venue-local formatting and a real zone label.
    timezone: z.string().optional(),
    hosts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    tagsBg: z.array(z.string()).optional(),
    image: z.string().optional(),
    gallery: z.array(galleryItemSchema).optional(),
    ticketUrl: z.string().optional(),
    mapUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    usersResponded: z.number().optional(),
    // Preferred: status. isCanceled is the legacy boolean kept for the Facebook
    // scraper (FB only exposes cancellation) — it maps to status 'cancelled'.
    status: eventStatusEnum.optional(),
    isCanceled: z.boolean().optional(),
    admission: admissionSchema.optional(),
    eventType: eventTypeEnum.optional(),
    _overrides: z.record(z.string(), overridePolicyEnum).optional(),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    gallery: z.array(galleryItemSchema).optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
  shows: showsCollection,
};
