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

const overridePolicyEnum = z.enum(['locked', 'fallback']);

const showsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/shows' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    facebookId: z.string().optional(),
    title: z.string(),
    titleEn: z.string().optional(),
    titleBg: z.string().optional(),
    description: z.string(),
    descriptionEn: z.string().optional(),
    descriptionBg: z.string().optional(),
    body: z.string().optional(),
    bodyEn: z.string().optional(),
    bodyBg: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    venue: z.string(),
    city: z.string(),
    country: z.string(),
    hosts: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    tagsBg: z.array(z.string()).optional(),
    image: z.string().optional(),
    gallery: z.array(galleryItemSchema).optional(),
    ticketUrl: z.string().optional(),
    mapUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    usersResponded: z.number().optional(),
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
