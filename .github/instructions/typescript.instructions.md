---
applyTo: "**/*.ts"
---

# TypeScript Standards — amioprenova

## Type safety

- No `any`. Use `unknown` and narrow with type guards, or define a specific interface/type.
- Enable strict null checks — never assume a value is non-null without a guard or `!` assertion with a comment explaining why it is safe.
- Use `import type { … }` for type-only imports — this keeps the imported module out of the compiled output entirely and prevents bundling Zod or other heavy libraries into pages that only need the type.

## Naming conventions

- `PascalCase` for types, interfaces, classes, and Zod schemas (`galleryItemSchema`, `Event`, `GalleryItem`).
- `camelCase` for variables, functions, and module-level constants (`getUpcomingEvents`, `formatEventDate`).
- `UPPER_SNAKE_CASE` is reserved for true compile-time constants, not runtime values.

## Zod schemas — single source of truth

Zod schemas define both the runtime validation shape and the TypeScript type. Never write a parallel TS interface for a shape already described by a Zod schema.

```ts
// ✅ Correct — one definition, type derived automatically
export const galleryItemSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('image'), src: z.string(), alt: z.string(), caption: z.string().optional() }),
  z.object({ type: z.literal('youtube'), id: z.string(), title: z.string() }),
  z.object({ type: z.literal('vimeo'), id: z.string(), title: z.string() }),
]);
export type GalleryItem = z.infer<typeof galleryItemSchema>;

// ❌ Wrong — duplicate definition creates drift risk
export interface GalleryImage { type: 'image'; src: string; alt: string; caption?: string; }
export interface GalleryYouTube { type: 'youtube'; id: string; title: string; }
export type GalleryItem = GalleryImage | GalleryYouTube; // gets out of sync with Zod
```

## Schema module separation

Keep Zod schemas in dedicated modules, separate from runtime data-helper files.

```
src/lib/
  gallery-schema.ts   ← Zod schema + z.infer type (imports zod)
  events.ts           ← Data helpers (imports type only from gallery-schema.ts)
src/content/
  config.ts           ← Astro collection schema (imports Zod schema from gallery-schema.ts)
```

**Why:** `events.ts` is imported by route pages. If it imports `zod` at the top level, Zod is bundled into every page that uses event helpers. A type-only import (`import type { GalleryItem } from './gallery-schema'`) has zero runtime cost.

## Data helpers in `src/lib/events.ts`

- Functions must return typed arrays/objects — no `any[]` return types.
- Filter/sort at the helper level (`getUpcomingEvents`, `getPastEvents`) so pages never contain raw date comparisons.
- Export the inferred type alongside the schema from the schema module so callers can do `import type { GalleryItem } from '../lib/events'` (which re-exports it).

## Content Collections (`src/content/config.ts`)

- Define each collection with `defineCollection` + a typed Zod schema.
- All new optional fields must use `.optional()` — never a breaking change to existing content.
- Import shared schemas from `src/lib/gallery-schema.ts`; do not redefine them inline.

## Modern TypeScript patterns

- Prefer `const` over `let`. Never use `var`.
- Use optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks.
- Use `satisfies` for type-checking without widening:
  ```ts
  export const getStaticPaths = (async ({ paginate }) => { … }) satisfies GetStaticPaths;
  ```
- Prefer discriminated unions over boolean flags for state that has multiple exclusive values.

## Error handling

- Wrap `JSON.parse` in try/catch; return a safe default on failure.
- `fetch` calls should catch network errors and degrade gracefully (log in DEV only via `import.meta.env.DEV`).
- Do not add try/catch around internal function calls that cannot throw.
