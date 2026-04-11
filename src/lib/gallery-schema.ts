import { z } from 'zod';

/**
 * Single source of truth for the gallery item schema and derived type.
 * Imported by src/content/config.ts (Zod schema) and src/lib/events.ts (TS type only).
 * Kept in its own module so the Zod runtime is not bundled into pages
 * that only need the event data helpers from events.ts.
 */
export const galleryItemSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), src: z.string(), alt: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('youtube'), id: z.string(), title: z.string() }),
  z.object({ type: z.literal('vimeo'), id: z.string(), title: z.string() }),
]);

export type GalleryItem = z.infer<typeof galleryItemSchema>;
