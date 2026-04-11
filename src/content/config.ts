import { defineCollection, z } from 'astro:content';

const galleryItemSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), src: z.string(), alt: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('youtube'), id: z.string(), title: z.string() }),
  z.object({ type: z.literal('vimeo'), id: z.string(), title: z.string() }),
]);

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
