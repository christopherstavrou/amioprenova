import { defineCollection, z } from 'astro:content';
import { galleryItemSchema } from '../lib/gallery-schema';

const blogCollection = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  pages: pagesCollection,
};
